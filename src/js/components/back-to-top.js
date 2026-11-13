// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Muestra el botón de volver arriba al bajar más de una pantalla
// Al pulsarlo sube y pone el foco arriba, sin animación con movimiento reducido

import { prefersReducedMotion } from '../utils/motion.js';

export function initBackToTop(button = document.querySelector('.back-to-top:not(.back-to-top--static)')) {
  if (!button) return;
  const update = () => button.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.75);
  window.addEventListener('scroll', update, { passive: true });
  update();

  button.addEventListener('click', (event) => {
    const target = document.querySelector(button.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    const reduced = prefersReducedMotion();
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    // Deja la dirección en el destino, como haría un enlace normal
    const hash = button.getAttribute('href');
    if (location.hash !== hash) history.pushState(null, '', hash);
  });
}
