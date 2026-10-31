// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Cierra los mensajes con botón data-alert-close
// Al cerrar, el foco va a data-alert-focus o al main para no perderse

import { prefersReducedMotion } from '../utils/motion.js';

export function initAlerts(root = document) {
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-alert-close]');
    if (!button) return;
    const alert = button.closest('.alert');
    const target = document.querySelector(alert.dataset.alertFocus ?? 'main');
    let closed = false;
    const done = () => {
      if (closed) return;
      closed = true;
      alert.remove();
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus();
      }
    };
    // Se desvanece antes de quitarlo, salvo con movimiento reducido
    if (prefersReducedMotion()) return done();
    alert.classList.add('is-closing');
    alert.addEventListener('transitionend', done, { once: true });
    setTimeout(done, 400);
  });
}
