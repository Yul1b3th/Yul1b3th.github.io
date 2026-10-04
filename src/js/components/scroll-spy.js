export function initScrollSpy() {
      const $sections = document.querySelectorAll('section[data-scroll-spy]');
    const callback = (entries) => {
      entries.forEach((entry) => {
        let id = entry.target.getAttribute('id');
        let link = document.querySelector(`a[data-scroll-spy][href='#${id}']`);
        if (entry.isIntersecting) {
          link.classList.add('navbar__link--active');
          // Actualiza la URL con el ID de la sección actual
          history.pushState(null, null, '#' + id);
        } else {
          link.classList.remove('navbar__link--active');
        };
      });
    };
    const options = {
      rootMargin: '-50% 0px -50% 0px',
    };
    const observer = new IntersectionObserver(callback, options);
    $sections.forEach((el) => observer.observe(el));

    const logo = document.querySelector('.navbar__brand');
    logo.addEventListener('click', function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Limpia el fragmento de la URL cuando se hace clic en el logo
      history.pushState(null, null, ' ');
    });
}