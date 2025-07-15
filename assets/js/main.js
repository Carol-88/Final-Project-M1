document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const header = document.querySelector(".main-header");

  const overlay = document.createElement("div");
  overlay.className = "overlay";

  let lastScrollY = window.scrollY;

  const toggleMenu = () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", !isExpanded);
    mainNav.classList.toggle("active");

    if (!isExpanded) {
      document.body.appendChild(overlay);
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      overlay.classList.remove("active");
      overlay.addEventListener("transitionend", function handler() {
        if (!overlay.classList.contains("active")) {
          overlay.remove();
          document.body.style.overflow = "";

          overlay.removeEventListener("transitionend", handler);
        }
      });
    }
  };

  menuToggle.addEventListener("click", toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 425) {
        toggleMenu();
      }
    });
  });

  overlay.addEventListener("click", toggleMenu);

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
      header.style.transform = "translateY(0)";
    } else if (currentScrollY > lastScrollY && currentScrollY > 72) {
      header.style.transform = "translateY(-100%)";
    } else if (currentScrollY < lastScrollY) {
      header.style.transform = "translateY(0)";
    }
    lastScrollY = currentScrollY;
  });

  window.animateOnScroll = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null, // 'null' significa que el viewport es el área de detección.
      rootMargin: "0px", // No hay margen extra alrededor del viewport.
      threshold: 0.1, // El callback se ejecutará cuando el 10% del elemento sea visible.
    }
  );

  document
    .querySelectorAll(".fade-in, .slide-up, .slide-left, .slide-right")
    .forEach((element) => {
      animateOnScroll.observe(element);
    });

  document.querySelectorAll(".nav-link").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();
        if (targetId === "#") return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = header.offsetHeight;
          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.scrollY -
            headerHeight -
            20;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = currentYear;
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 425 && mainNav.classList.contains("active")) {
      toggleMenu();
    }
  });
});

const contactForm = document.querySelector(".contact-form");
contactForm.addEventListener("submit", checkForm);

function getMainProjectsGrid() {
  const allGrids = document.querySelectorAll("#projects-grid");
  if (allGrids.length > 1) {
    for (const grid of allGrids) {
      if (grid.closest(".projects-section")) return grid;
    }
    return allGrids[allGrids.length - 1];
  }
  return allGrids[0];
}

const projectsGrid = getMainProjectsGrid();
if (projectsGrid) {
  const API_URL = "/projects.json";

  async function fetchAndDisplayProjects() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const projects = await response.json();

      const sortedProjects = projects
        .slice()
        .sort((a, b) => Number(b.uuid) - Number(a.uuid));
      const latestProjects = sortedProjects.slice(0, 3);

      latestProjects.forEach((project, index) => {
        const projectCard = document.createElement("article");
        projectCard.classList.add("project-card", "fade-in", "slide-up");
        projectCard.style.transitionDelay = `${index * 0.1}s`;
        if (window.animateOnScroll) {
          window.animateOnScroll.observe(projectCard);
        }
        projectCard.innerHTML = `
          <div class="project-image-container">
            <img src="${project.image}" alt="${project.name}" loading="lazy" />
          </div>
          <div class="project-card-content">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <a href="${getProjectDetailLink(
              project.uuid
            )}" class="button button--primary">Ver Detalles</a>
          </div>
        `;
        projectsGrid.appendChild(projectCard);
      });
    } catch (error) {
      console.error("Error al cargar los proyectos:", error);
      projectsGrid.innerHTML =
        "<p>Lo siento, no se pudieron cargar los proyectos. Inténtalo de nuevo más tarde.</p>";
    }
  }

  function getProjectDetailLink(uuid) {
    if (window.location.pathname.includes("/projects/")) {
      return `detail.html?id=${uuid}`;
    } else {
      return `projects/detail.html?id=${uuid}`;
    }
  }

  if (!window.location.pathname.includes("detail.html")) {
    fetchAndDisplayProjects();
  }
}

function checkForm(e) {
  e.preventDefault();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  let isValid = true;

  document.getElementById("name-error").textContent = "";
  document.getElementById("email-error").textContent = "";
  document.getElementById("subject-error").textContent = "";
  document.getElementById("message-error").textContent = "";

  if (nameInput.value.trim() === "") {
    isValid = false;
    document.getElementById("name-error").textContent =
      "El campo Nombre es obligatorio.";
    nameInput.classList.add("error");
  } else if (nameInput.value.trim().toLowerCase() === "ironhack") {
    isValid = false;
    document.getElementById("name-error").textContent =
      "No puedes ser Ironhack, porque yo soy Ironhack.";
    nameInput.classList.add("error");
  } else {
    nameInput.classList.remove("error");
  }

  if (emailInput.value.trim() === "") {
    isValid = false;
    document.getElementById("email-error").textContent =
      "El campo Correo Electrónico es obligatorio.";
    emailInput.classList.add("error");
  } else if (!/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
    isValid = false;
    document.getElementById("email-error").textContent =
      "El formato del correo electrónico no es válido.";
    emailInput.classList.add("error");
  } else {
    emailInput.classList.remove("error");
  }

  if (subjectInput.value.trim() === "") {
    isValid = false;
    document.getElementById("subject-error").textContent =
      "El campo Asunto es obligatorio.";
    subjectInput.classList.add("error");
  } else {
    subjectInput.classList.remove("error");
  }

  if (messageInput.value.trim() === "") {
    isValid = false;
    document.getElementById("message-error").textContent =
      "El campo Mensaje es obligatorio.";
    messageInput.classList.add("error");
  } else {
    messageInput.classList.remove("error");
  }

  if (!isValid) {
    return;
  } else {
    alert("¡Formulario enviado con éxito!");
    // this.submit();
  }
}
