export function navigationMenu() {
  const body = document.querySelector('body');
  const nav = document.querySelector('.navbar-collapse');
  const navToggle = document.querySelector('.navbar-toggler');
  const navLinks = document.querySelectorAll('.nav-link');
  const socialLinks = document.querySelectorAll('.social-list a');
  const navbarBrand = document.querySelector('.navbar-brand'); // Nuevo

  // Función para alternar la visibilidad del menú
  function toggleMenu() {
    const isVisible = nav.getAttribute("data-visible") === "true";
    nav.setAttribute("data-visible", !isVisible);
    navToggle.setAttribute("aria-expanded", !isVisible);
    body.classList.toggle('overflow-hidden');
    
    // Cambiar el tabindex de los enlaces del menú según la visibilidad
    navLinks.forEach(link => {
      link.setAttribute('tabindex', isVisible ? '-1' : '0');
    });
    // Cambiar el tabindex de los enlaces sociales según la visibilidad
    socialLinks.forEach(link => {
      link.setAttribute('tabindex', isVisible ? '-1' : '0');
    });
    // Cambiar el tabindex del enlace de la marca del navbar según la visibilidad
    navbarBrand.setAttribute('tabindex', isVisible ? '-1' : '0'); // Nuevo
  }

  // Función para manejar el click en un enlace del menú
  function handleLinkClick(event) {
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    toggleMenu();
  }

  // Añade los event listeners
  navToggle.addEventListener('click', toggleMenu);
  navLinks.forEach(link => link.addEventListener('click', handleLinkClick));

  // Inicialmente, deshabilita los enlaces del menú
  navLinks.forEach(link => link.setAttribute('tabindex', '-1'));
  socialLinks.forEach(link => link.setAttribute('tabindex', '-1'));
  navbarBrand.setAttribute('tabindex', '-1'); // Nuevo
}
