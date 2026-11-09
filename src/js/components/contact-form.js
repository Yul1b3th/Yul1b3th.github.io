// Mensajes de error al enviar, en el idioma de la página y sin placeholder
// El ejemplo del correo solo aparece si está mal escrito
const ERRORS = {
  name: { valueMissing: 'contact-error-name-required', patternMismatch: 'contact-error-name-pattern' },
  email: { valueMissing: 'contact-error-email-required', typeMismatch: 'contact-error-email-invalid' },
  comments: { valueMissing: 'contact-error-comments-required' },
};
let translations;
const loadTranslations = async () => {
  translations ??= await fetch('./public/data/translations.json').then((res) => res.json());
  return translations[document.documentElement.lang] ?? translations.es;
};

const clearError = (control) => {
  control.removeAttribute('aria-invalid');
  control.removeAttribute('aria-describedby');
  document.getElementById(`${control.id}-error`)?.remove();
};

const showError = (control, text) => {
  const error = document.createElement('p');
  error.className = 'field__error';
  error.id = `${control.id}-error`;
  error.innerHTML = '<svg aria-hidden="true"><use href="public/icons/icons.svg#error"></use></svg>';
  error.append(text);
  control.after(error);
  control.setAttribute('aria-invalid', 'true');
  control.setAttribute('aria-describedby', error.id);
};

export function initContactForm() {
  const $form = document.querySelector('.contact-form');
  const $loader = document.querySelector('.contact-form__loader');
  const $response = document.querySelector('.contact-form__response');
  const controls = [...$form.querySelectorAll('.field__control')];
  controls.forEach((control) => control.addEventListener('input', () => control.validity.valid && clearError(control)));

  $form.addEventListener('submit', async (e) => {
    e.preventDefault();
    controls.forEach(clearError);
    const invalid = controls.filter((control) => !control.validity.valid);
    if (invalid.length) {
      const texts = await loadTranslations();
      invalid.forEach((control) => {
        const reasons = ERRORS[control.name];
        const reason = Object.keys(reasons).find((key) => control.validity[key]) ?? 'valueMissing';
        showError(control, texts[reasons[reason]]);
      });
      invalid[0].focus();
      return;
    }
    $loader.classList.remove('d-none');

    fetch('https://formsubmit.co/ajax/yulibeth.rivero@gmail.com', {
      method: 'POST',
      body: new FormData(e.target),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(() => {
        location.hash = '#thanks';
        $form.reset();
      })
      .catch((err) => {
        const message = err.statusText || 'Ocurrió un error al enviar, intenta nuevamente';
        $response.querySelector('h3').textContent = `Error ${err.status ?? ''}: ${message}`;
      })
      .finally(() => {
        $loader.classList.add('d-none');
        setTimeout(() => {
          location.hash = '#close';
        }, 3000);
      });
  });
}
