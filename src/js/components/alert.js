// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Cierra los mensajes con botón data-alert-close
// Al cerrar, el foco va a data-alert-focus o al main para no perderse

export function initAlerts(root = document) {
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-alert-close]');
    if (!button) return;
    const alert = button.closest('.alert');
    const target = document.querySelector(alert.dataset.alertFocus ?? 'main');
    alert.remove();
    if (target) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });
}
