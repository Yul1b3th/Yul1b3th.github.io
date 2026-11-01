// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Notificaciones flotantes en una región aria-live, con línea de progreso
// Se paran con el ratón o el foco y el tiempo se configura con duration o data-toast-duration

const ICONS = { success: 'check_circle', warning: 'warning', error: 'error', info: 'info' };
const MIN_DURATION = 4000;

function region() {
  let element = document.querySelector('.toast-region');
  if (!element) {
    element = document.createElement('div');
    element.className = 'toast-region';
    element.setAttribute('role', 'status');
    element.setAttribute('aria-live', 'polite');
    document.body.append(element);
  }
  return element;
}

export function showToast(message, { type = 'info', duration = 6000, icons = 'icons.svg' } = {}) {
  const time = duration > 0 ? Math.max(duration, MIN_DURATION) : 0;
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.style.setProperty('--toast-duration', `${time}ms`);
  toast.innerHTML = `<svg class="toast__icon" aria-hidden="true"><use href="${icons}#${ICONS[type] ?? 'info'}"></use></svg>
    <p class="toast__text"></p>
    <button class="button button--icon button--sm toast__close" type="button" aria-label="Cerrar aviso"><svg aria-hidden="true"><use href="${icons}#close"></use></svg></button>
    ${time ? '<span class="toast__progress" aria-hidden="true"></span>' : ''}`;
  toast.querySelector('.toast__text').textContent = message;
  region().append(toast);

  // El tiempo que queda se guarda al pausar para seguir donde iba
  let timer;
  let remaining = time;
  let started = 0;
  const close = () => toast.remove();
  const start = () => {
    if (!time) return;
    started = Date.now();
    timer = setTimeout(close, remaining);
    toast.classList.remove('is-paused');
  };
  const pause = () => {
    if (!time || toast.classList.contains('is-paused')) return;
    clearTimeout(timer);
    remaining -= Date.now() - started;
    toast.classList.add('is-paused');
  };
  toast.querySelector('.toast__close').addEventListener('click', close);
  toast.addEventListener('mouseenter', pause);
  toast.addEventListener('mouseleave', start);
  toast.addEventListener('focusin', pause);
  toast.addEventListener('focusout', start);
  start();
  return toast;
}

// Botones que muestran un toast con data-toast, data-toast-type y data-toast-duration
export function initToasts(root = document, { icons = 'icons.svg' } = {}) {
  root.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-toast]');
    if (!trigger) return;
    const { toast, toastType, toastDuration } = trigger.dataset;
    showToast(toast, { type: toastType, duration: toastDuration === undefined ? 6000 : Number(toastDuration), icons });
  });
}
