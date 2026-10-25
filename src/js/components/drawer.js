// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Abre y cierra paneles sobre dialog nativo en 500 ms, como el menú del CV
// Mantiene el foco dentro, lo devuelve al botón y actualiza aria-expanded

const FOCUSABLE = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

// Cierra con la animación de salida, sin ella con movimiento reducido
export function closeDrawer(drawer) {
  if (!drawer.open || drawer.classList.contains('is-closing')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    drawer.close();
    return;
  }
  drawer.classList.add('is-closing');
  drawer.addEventListener('animationend', () => {
    drawer.classList.remove('is-closing');
    drawer.close();
  }, { once: true });
}

export function initDrawers(root = document) {
  root.querySelectorAll('[data-drawer-open]').forEach((button) => {
    const drawer = document.getElementById(button.dataset.drawerOpen);
    if (!drawer) return;
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      drawer.showModal();
      button.setAttribute('aria-expanded', 'true');
      drawer.addEventListener('close', () => {
        button.setAttribute('aria-expanded', 'false');
        button.focus();
      }, { once: true });
    });
  });

  root.querySelectorAll('dialog.drawer').forEach((drawer) => {
    drawer.addEventListener('click', (event) => {
      // Un clic en el fondo, en la X o en un enlace del menú cierra el panel
      if (event.target === drawer || event.target.closest('[data-drawer-close], .navbar__link')) closeDrawer(drawer);
    });

    // Escape también cierra con la animación
    drawer.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeDrawer(drawer);
    });

    drawer.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const items = [...drawer.querySelectorAll(FOCUSABLE)].filter((item) => item.offsetParent !== null);
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
