// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Oculta la barra superior al bajar y la muestra de nuevo arriba del todo
// Escucha la ventana salvo que data-scroll-root indique otro contenedor

export function initTopbars(root = document) {
  root.querySelectorAll('[data-header-stack]').forEach((stack) => {
    const selector = stack.dataset.scrollRoot;
    const scroller = selector ? document.querySelector(selector) : window;
    if (!scroller) return;

    const offset = () => (scroller === window ? window.scrollY : scroller.scrollTop);
    const update = () => stack.classList.toggle('is-condensed', offset() > 8);

    scroller.addEventListener('scroll', update, { passive: true });
    update();
  });
}
