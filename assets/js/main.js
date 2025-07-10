document.addEventListener("DOMContentLoaded", function () {
  // 'DOMContentLoaded' significa que el código dentro de esta función
  // se ejecutará solo cuando todo el HTML se haya cargado y esté listo,
  // para asegurarnos de que los elementos que intentamos seleccionar existan.

  // --- 1. Referencias a elementos del DOM ---
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  // Devuelve una lista.
  const header = document.querySelector(".main-header");

  // El fondo oscuro que aparece cuando el menú móvil está abierto,
  // para indicar que el resto de la página está inactivo.
  const overlay = document.createElement("div");
  overlay.className = "overlay";

  let lastScrollY = window.scrollY;
  // La última posición vertical de scroll del usuario.
  // 'window.scrollY' = forma moderna de obtener cuánto se ha desplazado la página hacia abajo.
  // Saber si el usuario está subiendo o bajando.

  // --- 2. Función para manejar el estado del menú (abrir/cerrar) ---
  const toggleMenu = () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    // Si aria-expanded es true, el menú está abierto.
    // Si es 'false' (o no existe), está cerrado.
    // Cambia el valor de 'aria-expanded': si era true, lo pone a false; si era false, a true.
    menuToggle.setAttribute("aria-expanded", !isExpanded);
    mainNav.classList.toggle("active");

    if (!isExpanded) {
      document.body.appendChild(overlay);
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      // Impide que la página principal se pueda desplazar mientras el menú móvil está abierto.
    } else {
      overlay.classList.remove("active");
      overlay.addEventListener("transitionend", function handler() {
        // Añade un "escuchador" de eventos que espera a que la transición CSS del overlay termine.
        if (!overlay.classList.contains("active")) {
          // Si el overlay ya no tiene la clase 'active' (es decir, ya se ha ocultado):
          overlay.remove();
          document.body.style.overflow = "";
          // Restaura el scroll en el cuerpo de la página.
          overlay.removeEventListener("transitionend", handler);
        }
      });
    }
  };

  // --- 3. Abre/Cierra menú al hacer clic en el botón de hamburguesa ---
  menuToggle.addEventListener("click", toggleMenu);
  // Cuando se hace clic en el botón de hamburguesa, ejecuta la función 'toggleMenu'.

  // --- 4. Cierra el menú al hacer clic en un enlace de navegación (solo en móviles) ---
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 425) {
        toggleMenu();
      }
    });
  });

  // --- 5. Cierra el menú al hacer clic en el overlay ---
  overlay.addEventListener("click", toggleMenu);

  // --- 6. Efecto de ocultar/mostrar header al hacer scroll ---
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    // La posición actual de scroll.

    if (currentScrollY <= 0) {
      // Si el usuario está en la parte superior de la página (o ha subido del todo):
      // Asegura que el header esté visible.
      header.style.transform = "translateY(0)";
    } else if (currentScrollY > lastScrollY && currentScrollY > 72) {
      // Si el usuario está bajando
      // Y ya ha bajado más allá de la altura del header
      // Oculta el header moviéndolo hacia arriba fuera de la pantalla.
      header.style.transform = "translateY(-100%)";
    } else if (currentScrollY < lastScrollY) {
      // Si el usuario está subiendo (currentScrollY es menor que lastScrollY):
      header.style.transform = "translateY(0)";
      // Muestra el header.
    }
    lastScrollY = currentScrollY;
    // Actualiza la última posición de scroll para la siguiente vez que el usuario se desplace.
  });

  // --- 7. Animación de elementos al hacer scroll (Intersection Observer es más moderno y eficiente) ---
  window.animateOnScroll = new IntersectionObserver(
    (entries, observer) => {
      // Crea un nuevo "Observador de Intersección".
      // 'entries' es una lista de elementos que están siendo observados y que han cambiado su estado de intersección.
      // 'observer' es el propio observador.
      entries.forEach((entry) => {
        // Para cada elemento que ha cambiado su estado:
        if (entry.isIntersecting) {
          // Si el elemento ha entrado en el área visible (viewport):
          entry.target.classList.add("visible");
          //  Una vez que el elemento se ha animado, dejamos de observarlo.
          observer.unobserve(entry.target);
        }
      });
    },
    {
      // Opciones del Intersection Observer:
      root: null, // 'null' significa que el viewport es el área de detección.
      rootMargin: "0px", // No hay margen extra alrededor del viewport.
      threshold: 0.1, // El callback se ejecutará cuando el 10% del elemento sea visible.
    }
  );

  // Observa todos los elementos que deberían animarse
  document
    .querySelectorAll(".fade-in, .slide-up, .slide-left, .slide-right")
    .forEach((element) => {
      // Selecciona todos los elementos que tienen alguna de estas clases de animación.
      animateOnScroll.observe(element);
      // Empieza a observar cada uno de esos elementos con el Intersection Observer.
    });

  // --- 8. Smooth scroll para enlaces internos ---
  document.querySelectorAll(".nav-link").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      // Solo prevenir comportamiento por defecto si es un enlace interno (sección)
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
      } // Si no es un enlace interno, dejar que navegue normalmente
    });
  });

  // --- 9. Actualizar año en el footer ---
  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = currentYear;
  }

  // --- 10. Listener para redimensionamiento (para manejar el menú y overlay al cambiar de tamaño) ---
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 425 && mainNav.classList.contains("active")) {
      // Si el ancho de la ventana es 425px o más (estamos en desktop o tablet)
      // Y el menú móvil está actualmente "activo" (abierto):
      toggleMenu();
    }
  });
});

// --- VALIDACIÓN DEL FORMULARIO DE CONTACTO ---
const contactForm = document.querySelector(".contact-form");
contactForm.addEventListener("submit", checkForm);


// --- CARGAR LOS 3 PRIMEROS PROYECTOS EN INDEX.HTML ---
function getMainProjectsGrid() {
  // Busca todos los grids con id 'projects-grid'
  const allGrids = document.querySelectorAll('#projects-grid');
  // Si hay más de uno (como en detail.html), elige el que esté dentro de .projects-section
  if (allGrids.length > 1) {
    for (const grid of allGrids) {
      if (grid.closest('.projects-section')) return grid;
    }
    // Si no, usa el último
    return allGrids[allGrids.length - 1];
  }
  // Si solo hay uno, lo devuelve
  return allGrids[0];
}

const projectsGrid = getMainProjectsGrid();
if (projectsGrid) {
  const API_URL = "https://raw.githubusercontent.com/ironhack-jc/mid-term-api/main/projects";

  async function fetchAndDisplayProjects() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const projects = await response.json();

      // Obtener solo los 3 primeros proyectos (la API los devuelve en orden descendente,
      // así que los primeros 3 son los últimos añadidos).
      // Ordenar por uuid descendente (más reciente primero)
      const sortedProjects = projects.slice().sort((a, b) => Number(b.uuid) - Number(a.uuid));
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
            <a href="${getProjectDetailLink(project.uuid)}" class="button button--primary">Ver Detalles</a>
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

  // Función utilitaria para generar el enlace correcto según la página
  function getProjectDetailLink(uuid) {
    // Si la URL contiene '/projects/', estamos en detail.html
    if (window.location.pathname.includes('/projects/')) {
      return `detail.html?id=${uuid}`;
    } else {
      return `projects/detail.html?id=${uuid}`;
    }
  }

  // Solo ejecuta en index.html, no en detail.html
  if (!window.location.pathname.includes('detail.html')) {
    fetchAndDisplayProjects(); // Llama a la función para cargar los proyectos al inicio
  }
}


function checkForm(e) {
  e.preventDefault();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  let isValid = true;

  // Limpiar mensajes de error previos
  document.getElementById("name-error").textContent = "";
  document.getElementById("email-error").textContent = "";
  document.getElementById("subject-error").textContent = "";
  document.getElementById("message-error").textContent = "";

  // Validación: Campo Nombre vacío
  if (nameInput.value.trim() === "") {
    isValid = false;
    document.getElementById("name-error").textContent = "El campo Nombre es obligatorio.";
    nameInput.classList.add("error");
  } else if (nameInput.value.trim().toLowerCase() === "ironhack") {
    isValid = false;
    document.getElementById("name-error").textContent = "No puedes ser Ironhack, porque yo soy Ironhack.";
    nameInput.classList.add("error");
  } else {
    nameInput.classList.remove("error");
  }

  // Validación: Email vacío o formato incorrecto
  if (emailInput.value.trim() === "") {
    isValid = false;
    document.getElementById("email-error").textContent = "El campo Correo Electrónico es obligatorio.";
    emailInput.classList.add("error");
  } else if (!/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
    isValid = false;
    document.getElementById("email-error").textContent = "El formato del correo electrónico no es válido.";
    emailInput.classList.add("error");
  } else {
    emailInput.classList.remove("error");
  }

  // Validación: Asunto vacío
  if (subjectInput.value.trim() === "") {
    isValid = false;
    document.getElementById("subject-error").textContent = "El campo Asunto es obligatorio.";
    subjectInput.classList.add("error");
  } else {
    subjectInput.classList.remove("error");
  }

  // Validación: Mensaje vacío
  if (messageInput.value.trim() === "") {
    isValid = false;
    document.getElementById("message-error").textContent = "El campo Mensaje es obligatorio.";
    messageInput.classList.add("error");
  } else {
    messageInput.classList.remove("error");
  }

  if (!isValid) {
    // No alert, solo mostrar errores debajo de cada campo
    return;
  } else {
    // Opcional: mostrar mensaje de éxito debajo del formulario o limpiar campos
    alert("¡Formulario enviado con éxito!");
    // this.submit(); 
  }
}