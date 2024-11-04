export function navigationMenu() {
  const body = document.querySelector('body');
  const nav = document.querySelector('.navbar-collapse');
  const navToggle = document.querySelector('.navbar-toggler');
  const navLinks = document.querySelectorAll('.nav-link');
  const interactiveElements = nav.querySelectorAll('.navbar-collapse a');

  // Función para alternar la visibilidad del menú
  const toggleMenu = () => {
    const isVisible = nav.getAttribute("data-visible") === "true";
    const newVisibility = !isVisible;

    if (newVisibility) {
      body.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
    }

    nav.setAttribute("data-visible", newVisibility);
    navToggle.setAttribute("aria-expanded", newVisibility);

    // Establecer el tabindex de los elementos interactivos
    const tabindexValue = newVisibility ? '0' : '-1';
    interactiveElements.forEach(el => el.setAttribute('tabindex', tabindexValue));
  }

  // Función para manejar el click en un enlace del menú
  const handleLinkClick = (event) => {
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    if (window.innerWidth < 992) { // Solo alternar el menú en dispositivos móviles
      toggleMenu();
    }
  }

  // Añade los event listeners
  navToggle.addEventListener('click', toggleMenu);
  navLinks.forEach(link => link.addEventListener('click', handleLinkClick));

  // Inicialmente, deshabilita los enlaces del menú
  interactiveElements.forEach(link => link.setAttribute('tabindex', '-1'));
}