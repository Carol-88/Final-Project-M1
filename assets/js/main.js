document.addEventListener("DOMContentLoaded", function () {
  // 'DOMContentLoaded' significa que el código dentro de esta función
  // se ejecutará solo cuando todo el HTML se haya cargado y esté listo,
  // para asegurarnos de que los elementos que intentamos seleccionar existan.

  // --- 1. Referencias a elementos del DOM ---
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  // Selecciona TODOS los enlaces de navegación. Devuelve una lista.
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
    menuToggle.setAttribute("aria-expanded", !isExpanded);
    // Cambia el valor de 'aria-expanded': si era true, lo pone a false; si era false, a true.
    mainNav.classList.toggle("active");

    if (!isExpanded) {
      document.body.appendChild(overlay);
      // Añade el 'overlay' (el div oscuro) al cuerpo del documento.
      overlay.classList.add("active");
      // Le añade la clase 'active' al overlay.
      document.body.style.overflow = "hidden";
      // Impide que la página principal se pueda desplazar mientras el menú móvil está abierto.
    } else {
      // Si el menú SÍ estaba expandido (es decir, lo vamos a cerrar ahora):
      overlay.classList.remove("active");
      // Quita la clase 'active' del overlay.
      overlay.addEventListener("transitionend", function handler() {
        // Añade un "escuchador" de eventos que espera a que la transición CSS del overlay termine.
        if (!overlay.classList.contains("active")) {
          // Si el overlay ya no tiene la clase 'active' (es decir, ya se ha ocultado):
          overlay.remove();
          // Elimina el elemento 'overlay' del HTML.
          document.body.style.overflow = "";
          // Restaura el scroll en el cuerpo de la página.
          overlay.removeEventListener("transitionend", handler);
          // Importante: Elimina este "escuchador" para que no se ejecute múltiples veces innecesariamente.
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
      // Cuando se hace clic en un enlace:
      if (window.innerWidth < 425) {
        // Comprueba si el ancho de la ventana es menor a 768px (móvil).
        toggleMenu(); // Si es así, ejecuta la función 'toggleMenu' para cerrar el menú.
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
      header.style.transform = "translateY(0)";
      // Asegura que el header esté visible.
    } else if (currentScrollY > lastScrollY && currentScrollY > 72) {
      // Si el usuario está bajando
      // Y ya ha bajado más allá de la altura del header
      header.style.transform = "translateY(-100%)";
      // Oculta el header moviéndolo hacia arriba fuera de la pantalla.
    } else if (currentScrollY < lastScrollY) {
      // Si el usuario está subiendo (currentScrollY es menor que lastScrollY):
      header.style.transform = "translateY(0)";
      // Muestra el header.
    }
    lastScrollY = currentScrollY;
    // Actualiza la última posición de scroll para la siguiente vez que el usuario se desplace.
  });

  // --- 7. Animación de elementos al hacer scroll (Intersection Observer es más moderno y eficiente) ---
  const animateOnScroll = new IntersectionObserver(
    (entries, observer) => {
      // Crea un nuevo "Observador de Intersección".
      // 'entries' es una lista de elementos que están siendo observados y que han cambiado su estado de intersección.
      // 'observer' es el propio observador.
      entries.forEach((entry) => {
        // Para cada elemento que ha cambiado su estado:
        if (entry.isIntersecting) {
          // Si el elemento ha entrado en el área visible (viewport):
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
          //  Una vez que el elemento se ha animado, dejamos de observarlo.
        }
      });
    },
    {
      // Opciones del Intersection Observer:
      root: null, // 'null' significa que el viewport es el área de detección.
      rootMargin: "0px", // No hay margen extra alrededor del viewport.
      threshold: 0.1, // El callback se ejecutará cuando el 10% del elemento sea visible.
      // Ajustar este valor para que la animación se dispare antes o después.
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
      e.preventDefault();
      // Evita el comportamiento por defecto del navegador (que saltaría directamente a la sección)
      // para hacerlo de forma suave.

      const targetId = this.getAttribute("href");
      if (targetId === "#") return; // Si el href es solo '#', no hace nada (enlace vacío).

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = header.offsetHeight;
        // Obtiene la altura actual del header (para que no tape la sección al hacer scroll).
        // '.offsetHeight' devuelve la altura del elemento incluyendo padding y borde.
        const targetPosition =
          targetElement.getBoundingClientRect().top + // distancia del elemento al top del viewport.
          window.scrollY - // la convierte en una posición absoluta desde el inicio de la página
          headerHeight - // ajusta esa posición para que el header fijo no tape el inicio de la sección,
          20; // margen para que no quede justo al borde

        window.scrollTo({
          top: targetPosition, // La posición vertical a la que queremos ir
          behavior: "smooth", // desplazamiento suave
        });
      }
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

// --- NUEVA FUNCIONALIDAD: VALIDACIÓN DEL FORMULARIO DE CONTACTO ---
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  // Asegúrate de que el formulario exista en la página actual
  contactForm.addEventListener("submit", function (e) {
    // Evita que el formulario se envíe de forma predeterminada
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    let isValid = true;
    let errorMessage = "";

    // Validación: Campo Nombre vacío
    if (nameInput.value.trim() === "") {
      isValid = false;
      errorMessage += "El campo Nombre es obligatorio.\n";
      nameInput.classList.add("error"); // Opcional: añadir clase para estilos de error CSS
    } else {
      nameInput.classList.remove("error");
    }

    // Validación: Nombre "ironhack"
    if (nameInput.value.toLowerCase().trim() === "ironhack") {
      isValid = false;
      errorMessage += "No puedes ser Ironhack, porque yo soy Ironhack.\n";
      nameInput.classList.add("error");
    }

    // Validación: Email vacío o formato incorrecto (adicional al 'type="email"')
    if (emailInput.value.trim() === "") {
      isValid = false;
      errorMessage += "El campo Correo Electrónico es obligatorio.\n";
      emailInput.classList.add("error");
    } else if (
      !emailInput.value.includes("@") ||
      !emailInput.value.includes(".")
    ) {
      isValid = false;
      errorMessage += "El formato del correo electrónico no es válido.\n";
      emailInput.classList.add("error");
    } else {
      emailInput.classList.remove("error");
    }

    // Validación: Mensaje vacío
    if (messageInput.value.trim() === "") {
      isValid = false;
      errorMessage += "El campo Mensaje es obligatorio.\n";
      messageInput.classList.add("error");
    } else {
      messageInput.classList.remove("error");
    }

    if (!isValid) {
      alert("Por favor, corrige los siguientes errores:\n" + errorMessage);
    } else {
      // Si todo es válido, puedes enviar el formulario.
      // En un proyecto real, aquí harías una petición AJAX o permitirías el envío normal.
      // Para este ejercicio, con un alert basta y luego se podría enviar.
      alert("¡Formulario enviado con éxito!");
      this.submit(); // Esto envía el formulario si todo es correcto
    }
  });
}

// --- NUEVA FUNCIONALIDAD: CARGAR LOS 3 PRIMEROS PROYECTOS EN INDEX.HTML ---
const projectsGrid = document.getElementById("projects-grid");
if (projectsGrid) {
  // Asegúrate de que este grid exista (solo en index.html)
  const API_URL = "https://fcd-project-api.onrender.com/projects";

  async function fetchAndDisplayProjects() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const projects = await response.json();

      // Obtener solo los 3 primeros proyectos (la API los devuelve en orden descendente,
      // así que los primeros 3 son los últimos añadidos, como se pide).
      const latestProjects = projects.slice(0, 3);

      projectsGrid.innerHTML = ""; // Limpia el mensaje de "Cargando..."

      latestProjects.forEach((project, index) => {
        const projectCard = document.createElement("article");
        projectCard.classList.add("project-card", "fade-in", "slide-up");
        // Añadimos un pequeño retraso para un efecto escalonado bonito
        projectCard.style.transitionDelay = `${index * 0.1}s`;

        projectCard.innerHTML = `
                        <div class="project-image-container">
                            <img src="${project.image}" alt="${project.name}" loading="lazy" />
                        </div>
                        <div class="project-card-content">
                            <h3>${project.name}</h3>
                            <p>${project.description}</p>
                            <a href="projects/detail.html?id=${project.uuid}" class="button button--outline">Ver Detalles</a>
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

  fetchAndDisplayProjects(); // Llama a la función para cargar los proyectos al inicio
}
