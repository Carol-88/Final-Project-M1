# Portfolio Web – Carolina Romero

Este es mi primer proyecto web completo en JavaScript puro, desarrollado como parte de la certificación **(IFCD0210) DESARROLLO DE APLICACIONES CON TECNOLOGÍAS WEB**. Es un portafolio profesional totalmente responsive, que muestra mis proyectos recientes, detalles de cada uno y permite contactar conmigo a través de un formulario validado.

---

## 🚀 **Demo en Vivo**

- [Enlace a Netlify](https://finalprojectm1.netlify.app/) 

---

## 🛠️ **Tecnologías Utilizadas**

- **HTML5** (estructura de páginas)
- **CSS3** (diseño, responsive, animaciones)
- **JavaScript (Vanilla)** (DOM, fetch API, validaciones, animaciones)
- **Git & GitHub** (control de versiones)
- **Netlify** (despliegue)

---

## 📁 **Estructura del Proyecto**

```
PROYECTOM1/
│
├── assets/
│   ├── css/
│   │   ├── style.css         # Estilos globales
│   │   └── detail.css        # Estilos específicos para la página de detalle
│   ├── js/
│   │   ├── main.js           # Lógica general, home, navegación, animaciones
│   │   └── project-detail.js # Lógica de la página de detalle
│   └── images/               # Imágenes y favicon
│
├── index.html                # Página principal
├── contact.html              # Página de contacto
├── projects/
│   └── detail.html           # Página de detalle de proyecto
└── README.md                 # Este archivo
```

---

## ✨ **Características Principales**

- **Carga dinámica de proyectos:**
  - Los 3 proyectos más recientes se obtienen desde la API pública y se muestran en la home y sección "Mis Proyectos".
  - Cada card permite navegar al detalle del proyecto usando parámetros en la URL (`id=uuid`).
- **Página de detalle dinámica:**
  - Muestra toda la información del proyecto seleccionado y permite navegar a otros proyectos sin recargar la página.
- **Animaciones modernas:**
  - Aparición suave de cards y secciones usando IntersectionObserver.
- **Menú responsive y accesible:**
  - Menú colapsable en móvil, navegación fluida entre páginas.
- **Formulario de contacto validado:**
  - Todos los campos requeridos, validación adicional en JS (nombre prohibido "ironhack", email válido, etc).
- **Footer con enlaces a redes sociales**
- **Diseño adaptable a cualquier dispositivo**

---

## 📦 **Instalación y Ejecución Local**

1. Clona este repositorio:
   ```bash
   git clone https://github.com/Carol-88/Final-Project-M1.git
   ```
2. Abre la carpeta en tu editor favorito.
3. Abre `index.html` en tu navegador.
4. Para probar la funcionalidad completa, sirve el proyecto con una extensión como Live Server o similar.

---

## 🌐 **Despliegue en Netlify**

- Haz push a tu rama principal en GitHub.
- Conecta tu repo a Netlify y selecciona la carpeta raíz.
- Netlify detecta el sitio estático y lo publica automáticamente.

---

## 📝 **Especificaciones Técnicas**

- Separación clara de HTML, CSS y JS.
- Código modular y reutilizable (DRY, KISS).
- Navegación entre páginas usando parámetros y rutas relativas.
- Animaciones y responsive asegurados.
- Validación de formularios en JS.
- Sin archivos ni código duplicado.

---

## 💡 **Bonus y Mejoras**

- Menú responsive animado.
- Animaciones de aparición en cards y secciones.
- Footer dinámico con año actual.

---

## 📬 **Contacto**

- [GitHub](https://github.com/Carol-88)
- [LinkedIn](https://www.linkedin.com/in/carolina-romero-c/)

---

## 📄 **Licencia**

Proyecto educativo para Ironhack. Uso personal y académico.
