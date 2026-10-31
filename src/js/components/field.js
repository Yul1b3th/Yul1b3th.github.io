// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Botón con un ojo para mostrar u ocultar la contraseña
// Solo cambia lo que se ve en pantalla, la contraseña sigue igual al enviar

export function initPasswordToggles(root = document) {
  root.querySelectorAll('.field__password').forEach((wrapper) => {
    const input = wrapper.querySelector('input');
    const toggle = wrapper.querySelector('.field__password-toggle');
    const use = toggle?.querySelector('use');
    if (!input || !toggle) return;

    const sprite = use?.getAttribute('href')?.split('#')[0] ?? '';
    const set = (show) => {
      input.type = show ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', String(show));
      toggle.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
      use?.setAttribute('href', `${sprite}#${show ? 'visibility_off' : 'visibility'}`);
    };

    toggle.setAttribute('aria-controls', input.id);
    set(false);
    toggle.addEventListener('click', () => {
      set(input.type === 'password');
      input.focus();
    });

    // Antes de enviar se vuelve a ocultar para que el navegador no la guarde como texto
    input.form?.addEventListener('submit', () => set(false));
  });
}

// Botón de borrar dentro del campo, oculto mientras está vacío
export function initClearButtons(root = document) {
  root.querySelectorAll('.field__clearable').forEach((wrapper) => {
    const input = wrapper.querySelector('input');
    const clear = wrapper.querySelector('.field__clear');
    if (!input || !clear) return;

    const sync = () => {
      clear.hidden = input.value === '';
    };
    clear.setAttribute('aria-controls', input.id);
    clear.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    });
    input.addEventListener('input', sync);
    sync();
  });
}

// Contador de caracteres con el máximo de maxlength o de data-max
// Anuncia el aviso al llegar al límite sin repetir cada tecla
export function initCounters(root = document) {
  root.querySelectorAll('[data-field-counter]').forEach((counter) => {
    const input = document.getElementById(counter.dataset.fieldCounter);
    if (!input) return;
    const max = Number(input.getAttribute('maxlength') ?? input.dataset.max ?? 0);
    const update = () => {
      const length = input.value.length;
      counter.textContent = max ? `${length} / ${max}` : String(length);
      counter.classList.toggle('is-over', max > 0 && length >= max);
    };
    input.addEventListener('input', update);
    update();
  });
}
