// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Abre y cierra modales sobre dialog nativo, Escape lo gestiona el navegador
// Mantiene el foco dentro y lo devuelve al botón que abrió el modal

const FOCUSABLE = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

export function openModal(dialog, opener = document.activeElement) {
  dialog.showModal();
  dialog.addEventListener('close', () => opener?.focus?.(), { once: true });
}

export function initModals(root = document) {
  root.querySelectorAll('[data-modal-open]').forEach((button) => {
    button.addEventListener('click', () => openModal(document.getElementById(button.dataset.modalOpen), button));
  });

  root.querySelectorAll('dialog.modal').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      // Un clic en el fondo cae sobre el propio dialog
      if (event.target === dialog || event.target.closest('[data-modal-close]')) dialog.close();
    });

    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const items = [...dialog.querySelectorAll(FOCUSABLE)];
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  });
}
