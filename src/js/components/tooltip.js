// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Escape o un clic ocultan la ayuda abierta sin mover el foco (WCAG 1.4.13)
// Vuelve a mostrarse al salir y volver a entrar

export function initTooltips(root = document) {
  root.querySelectorAll('.tooltip').forEach((tooltip) => {
    const reset = () => tooltip.classList.remove('is-dismissed');
    tooltip.addEventListener('mouseleave', reset);
    tooltip.addEventListener('focusout', reset);
    tooltip.addEventListener('pointerdown', () => tooltip.classList.add('is-dismissed'));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    document
      .querySelectorAll('.tooltip:is(:hover, :has(:focus-visible))')
      .forEach((tooltip) => tooltip.classList.add('is-dismissed'));
  });
}
