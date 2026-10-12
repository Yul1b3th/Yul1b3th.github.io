// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Pestañas con el patrón de WAI-ARIA, activación automática al mover el foco
// Flechas izquierda y derecha, Inicio y Fin recorren las pestañas

export function initTabs(root = document) {
  root.querySelectorAll('.tabs').forEach((tabs) => {
    const list = tabs.querySelector('[role="tablist"]');
    const tabList = [...list.querySelectorAll('[role="tab"]')];

    const select = (tab, focus = true) => {
      tabList.forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
      });
      if (focus) tab.focus();
    };

    select(tabList.find((tab) => tab.getAttribute('aria-selected') === 'true') ?? tabList[0], false);

    list.addEventListener('click', (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab) select(tab);
    });

    list.addEventListener('keydown', (event) => {
      const index = tabList.indexOf(document.activeElement);
      if (index < 0) return;
      const last = tabList.length - 1;
      const next = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(tabList[next]);
    });
  });
}
