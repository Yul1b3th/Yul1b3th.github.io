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
