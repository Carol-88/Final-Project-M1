document.addEventListener("DOMContentLoaded", function () {
  // Solo ejecutamos esto si estamos en una página de detalle de proyecto
  // y si tenemos los elementos donde mostrar la información
  const projectDetailSection = document.getElementById("project-detail");
  if (!projectDetailSection) return; // Salir si no estamos en la página correcta

  const projectName = document.getElementById("project-name");
  const projectImage = document.getElementById("project-image");
  const projectDescription = document.getElementById("project-description");
  const projectContent = document.getElementById("project-content");
  const completedDate = document.getElementById("completed-date");
  const otherProjectsGrid = document.getElementById("other-projects-grid");
  const loadingOtherProjects = document.getElementById(
    "loading-other-projects"
  ); // Para el mensaje de carga

  const API_URL = "https://fcd-project-api.onrender.com/projects";

  // Función para obtener el parámetro 'id' de la URL
  function getProjectIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.has('id') ? Number(params.get('id')) : null;
  }

  // Función para cargar el proyecto según el parámetro 'id'
  async function loadProjectById() {
    const projectId = getProjectIdFromUrl();
    if (!projectId) {
      alert('No se ha especificado el id del proyecto en la URL.');
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
      const specificProject = projects.find((p) => p.uuid === projectId);
      if (specificProject) {
        projectName.textContent = specificProject.name;
        projectImage.src = specificProject.image;
        projectImage.alt = specificProject.name;
        projectImage.style.display = "block";
        projectDescription.textContent = specificProject.description;
        projectContent.innerHTML = specificProject.content;
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
        alert('El proyecto solicitado no existe en la API.');
        projectName.textContent = "Proyecto no encontrado.";
      }
    } catch (error) {
      console.error("Error al cargar el proyecto:", error);
      projectName.textContent = "Error al cargar el proyecto.";
    }
  }

  // Función para cargar otros 3 proyectos aleatorios
  async function loadOtherRandomProjects() {
    if (!otherProjectsGrid) return; 
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const projects = await response.json();

      // Filtrar proyectos para excluir el actual (uuid 1)
      const availableProjects = projects.filter((p) => p.uuid !== 1);

      if (availableProjects.length === 0) {
        otherProjectsGrid.innerHTML =
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

      otherProjectsGrid.innerHTML = ""; // Limpia el mensaje de "Cargando..."

      randomProjects.forEach((project, index) => {
        const projectCard = document.createElement("article");
        projectCard.classList.add("project-card", "fade-in", "slide-up");
        projectCard.style.transitionDelay = `${index * 0.1}s`;

        projectCard.innerHTML = `
                    <div class="project-image-container">
                        <img src="${project.image}" alt="${project.name}" loading="lazy" />
                    </div>
                    <div class="project-card-content">
                        <h3>${project.name}</h3>
                        <p>${project.description}</p>
                        <a href="${project.uuid}.html" class="button button--outline">Ver Detalles</a>
                    </div>
                `;
        otherProjectsGrid.appendChild(projectCard);
      });
    } catch (error) {
      console.error("Error al cargar otros proyectos:", error);
      otherProjectsGrid.innerHTML =
        "<p>Lo siento, no se pudieron cargar otros proyectos.</p>";
    } finally {
      if (loadingOtherProjects) loadingOtherProjects.remove(); // Asegurarse de quitar el mensaje de carga
    }
  }

  // Llama a las funciones al cargar la página
  window.addEventListener("load", () => {
    loadProjectById();
    loadOtherRandomProjects();
  });
});
