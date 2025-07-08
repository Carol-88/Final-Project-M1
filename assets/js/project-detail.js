document.addEventListener("DOMContentLoaded", function () {
  // Solo ejecutamos esto si estamos en una página de detalle de proyecto
  // y si tenemos los elementos donde mostrar la información
  const projectDetailSection = document.getElementById("project-detail");
  if (!projectDetailSection) return; // Salir si no estamos en la página correcta

  const projectName = document.getElementById("project-name");
  const projectImage = document.getElementById("project-image");
  const projectDescription = document.getElementById("project-description");
  const completedDate = document.getElementById("completed-date");
  // Selecciona SOLO el grid de la sección 'Mis Proyectos' en detail.html
  const projectsGrid = document.querySelector('.projects-section #projects-grid');

  const API_URL =
    "https://raw.githubusercontent.com/ironhack-jc/mid-term-api/main/projects";

  // Función para obtener el parámetro 'id' de la URL
  function getProjectIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.has("id") ? params.get("id") : null;
  }

  // Función para cargar el proyecto según el parámetro 'id'
  async function loadProjectById() {
    const projectId = getProjectIdFromUrl();
    if (!projectId) {
      alert("No se ha especificado el id del proyecto en la URL.");
      projectName.textContent = "Proyecto no encontrado.";
      return;
    }
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const projects = await response.json();
      // Buscar el proyecto con el id recibido por query param
      const specificProject = projects.find(
        (p) => String(p.uuid) === String(projectId)
      );
      if (specificProject) {
        projectName.textContent = specificProject.name;
        projectImage.src = specificProject.image;
        projectImage.alt = specificProject.name;
        projectImage.style.display = "block";
        projectDescription.textContent = specificProject.description;
        document.getElementById("project-body").innerHTML =
          specificProject.content;
        if (specificProject.completed_on) {
          const date = new Date(specificProject.completed_on);
          const options = { year: "numeric", month: "long", day: "numeric" };
          completedDate.textContent = date.toLocaleDateString("es-ES", options);
        } else {
          completedDate.textContent = "Fecha no disponible";
        }
        document
          .querySelectorAll(
            "#project-detail .fade-in, #project-detail .slide-up, #project-detail .slide-left, #project-detail .slide-right"
          )
          .forEach((element) => {
            element.classList.add("visible");
          });
      } else {
        alert("El proyecto solicitado no existe en la API.");
        projectName.textContent = "Proyecto no encontrado.";
      }
    } catch (error) {
      console.error("Error al cargar el proyecto:", error);
      projectName.textContent = "Error al cargar el proyecto.";
    }
  }

  // Función para cargar otros 3 proyectos aleatorios
  async function loadOtherRandomProjects() {
    if (!projectsGrid) return;
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const projects = await response.json();

      // Filtrar proyectos para excluir el actual (uuid 1)
      const availableProjects = projects.filter(
        (p) => String(p.uuid) !== String(getProjectIdFromUrl())
      );

      if (availableProjects.length === 0) {
        projectsGrid.innerHTML =
          "<p>No hay otros proyectos disponibles.</p>";
        return;
      }

      const randomProjects = [];
      const numProjectsToSelect = Math.min(3, availableProjects.length); // Max 3, o menos si no hay suficientes

      // Seleccionar proyectos aleatorios sin repetir
      const selectedIndices = new Set();
      while (randomProjects.length < numProjectsToSelect) {
        const randomIndex = Math.floor(
          Math.random() * availableProjects.length
        );
        if (!selectedIndices.has(randomIndex)) {
          randomProjects.push(availableProjects[randomIndex]);
          selectedIndices.add(randomIndex);
        }
      }

      // BONUS: Si el proyecto no existe en la API, alertar al usuario.
      // Para el "random", si la API devuelve menos de 3, simplemente mostramos menos.
      // Para la parte de "si el proyecto no existe", la he puesto en loadSpecificProject.

      projectsGrid.innerHTML = ""; // Limpia el mensaje de "Cargando..."

      randomProjects.forEach((project, index) => {
        const projectCard = document.createElement("article");
        projectCard.classList.add("project-card", "fade-in", "slide-up", "visible"); // Agrega 'visible' para forzar visibilidad
        projectCard.style.transitionDelay = `${index * 0.1}s`;

        projectCard.innerHTML = `
                    <div class="project-image-container">
                        <img src="${project.image}" alt="${project.name}" loading="lazy" />
                    </div>
                    <div class="project-card-content">
                        <h3>${project.name}</h3>
                        <p>${project.description}</p>
                        <a href="detail.html?id=${project.uuid}" class="button button--primary">Ver Detalles</a>
                    </div>
                `;
        projectsGrid.appendChild(projectCard);
      });
    } catch (error) {
      console.error("Error al cargar otros proyectos:", error);
      projectsGrid.innerHTML =
        "<p>Lo siento, no se pudieron cargar otros proyectos.</p>";
    } 

    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById("current-year");
    if (yearElement) {
      yearElement.textContent = currentYear;
    }
  }

  // Llama a las funciones al cargar la página
  window.addEventListener("load", () => {
    loadProjectById();
    loadOtherRandomProjects();
  });
});
