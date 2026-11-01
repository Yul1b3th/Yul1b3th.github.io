// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Desplegable accesible con patrón de menú y opciones excluyentes
// Teclado: flechas, Inicio, Fin, Escape y Tab

export function initDropdown(root, { onChange, onToggle } = {}) {
  const button = root.querySelector('.dropdown__button');
  const menu = root.querySelector('.dropdown__menu');
  const options = [...menu.querySelectorAll('[role="menuitemradio"]')];
  // Casillas independientes, como Reducir movimiento, que no cierran el menú
  const checks = [...menu.querySelectorAll('[role="menuitemcheckbox"]')];
  const items = [...options, ...checks];

  const checkedOption = () => options.find((o) => o.getAttribute('aria-checked') === 'true') ?? options[0];

  // Copia el icono y el texto corto de la opción elegida al botón
  const paint = (option) => {
    const icon = button.querySelector('[data-dropdown-icon] use');
    const optionIcon = option.querySelector('.dropdown__option-icon use');
    if (icon && optionIcon) icon.setAttribute('href', optionIcon.getAttribute('href'));
    const text = button.querySelector('[data-dropdown-text]');
    if (text) text.textContent = option.dataset.short ?? option.textContent.trim();
    const label = menu.getAttribute('aria-label') ?? root.dataset.label ?? '';
    button.setAttribute('aria-label', `${label}: ${option.textContent.trim()}`);
  };

  const setValue = (value, { silent = false } = {}) => {
    const option = options.find((o) => o.dataset.value === value);
    if (!option) return;
    options.forEach((o) => o.setAttribute('aria-checked', String(o === option)));
    paint(option);
    if (!silent) onChange?.(value, option);
  };

  const open = (target) => {
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    (target ?? checkedOption()).focus();
  };

  const close = ({ returnFocus = true } = {}) => {
    if (menu.hidden) return;
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (returnFocus) button.focus();
  };

  button.addEventListener('click', () => (menu.hidden ? open() : close()));

  button.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      open();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      open(items.at(-1));
    }
  });

  menu.addEventListener('keydown', (event) => {
    const index = items.indexOf(document.activeElement);
    const moves = {
      ArrowDown: items[(index + 1) % items.length],
      ArrowUp: items[(index - 1 + items.length) % items.length],
      Home: items[0],
      End: items.at(-1),
    };
    if (moves[event.key]) {
      event.preventDefault();
      moves[event.key].focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'Tab') {
      close({ returnFocus: false });
    }
  });

  options.forEach((option) =>
    option.addEventListener('click', () => {
      setValue(option.dataset.value);
      close();
    }),
  );

  const setChecked = (value, checked, { silent = false } = {}) => {
    const check = checks.find((c) => c.dataset.value === value);
    if (!check) return;
    check.setAttribute('aria-checked', String(checked));
    if (!silent) onToggle?.(value, checked);
  };

  checks.forEach((check) =>
    check.addEventListener('click', () => setChecked(check.dataset.value, check.getAttribute('aria-checked') !== 'true')),
  );

  // Cierra al pulsar fuera del desplegable
  document.addEventListener('pointerdown', (event) => {
    if (!root.contains(event.target)) close({ returnFocus: false });
  });

  // Al cambiar de idioma se vuelve a leer el texto de la opción elegida
  document.addEventListener('languagechange', () => paint(checkedOption()));

  paint(checkedOption());
  return { setValue, setChecked };
}
