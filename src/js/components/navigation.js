// Menú móvil con bloqueo del scroll de la página mientras está abierto
// Se cierra con Escape, al elegir un enlace o al pasar a escritorio

const desktop = window.matchMedia('(min-width: 1200px)');

export function initNavigation() {
  const nav = document.querySelector('.navbar__collapse');
  const navToggle = document.querySelector('.navbar__toggler');
  const navLinks = document.querySelectorAll('.navbar__link');
  const scrollRoots = [document.documentElement, document.body];
  // Lo que queda tapado por el menú no se puede enfocar mientras está abierto
  const covered = document.querySelectorAll('.navbar__container > .navbar__brand, .skip-link, main, footer, .scroll-top-btn');

  const isOpen = () => nav.getAttribute('data-visible') === 'true';

  const setOpen = (open, { returnFocus = false } = {}) => {
    nav.setAttribute('data-visible', String(open));
    navToggle.setAttribute('aria-expanded', String(open));
    scrollRoots.forEach((el) => el.classList.toggle('overflow-hidden', open));
    covered.forEach((el) => (el.inert = open));
    if (open) nav.querySelector('a')?.focus();
    if (returnFocus) navToggle.focus();
  };

  navToggle.addEventListener('click', () => setOpen(!isOpen()));

  navLinks.forEach((link) =>
    link.addEventListener('click', (event) => {
      navLinks.forEach((l) => l.classList.remove('navbar__link--active'));
      event.currentTarget.classList.add('navbar__link--active');
      if (!desktop.matches) setOpen(false);
    }),
  );

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) setOpen(false, { returnFocus: true });
  });

  desktop.addEventListener('change', (event) => {
    if (event.matches && isOpen()) setOpen(false);
  });
}
