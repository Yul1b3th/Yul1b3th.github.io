// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Copia los enlaces de la barra al panel y marca la sección visible en la landing
// La sección actual se calcula con IntersectionObserver y aria-current="true"

export function initNavbars(root = document) {
  root.querySelectorAll('.navbar').forEach((navbar) => {
    const list = navbar.querySelector('.navbar__list');
    const toggle = navbar.querySelector('.navbar__toggle');
    const drawer = toggle && document.getElementById(toggle.dataset.drawerOpen);
    const target = drawer?.querySelector('[data-navbar-links]');
    if (list && target && !target.children.length) target.append(list.cloneNode(true));

    // El panel se cierra si la pantalla crece hasta mostrar la barra completa
    const size = [...navbar.classList].find((c) => c.startsWith('navbar--expand-'))?.split('-').pop();
    const width = size && getComputedStyle(document.documentElement).getPropertyValue(`--breakpoint-${size}`).trim();
    if (drawer && width) {
      window.matchMedia(`(min-width: ${width})`).addEventListener('change', (event) => {
        if (event.matches && drawer.open) drawer.close();
      });
    }

    // Sombra más marcada a partir de 50 px de scroll
    const onScroll = () => navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!navbar.hasAttribute('data-navbar-spy')) return;
    const links = [...document.querySelectorAll('.navbar__link[href^="#"]')];
    const sections = [...new Set(links.map((link) => link.getAttribute('href')))]
      .map((hash) => document.querySelector(hash))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const hash = `#${entry.target.id}`;
          links.forEach((link) => {
            if (link.getAttribute('href') === hash) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
  });
}
