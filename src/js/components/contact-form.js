export function initContactForm() {
  const $form = document.querySelector('.contact-form');
  const $loader = document.querySelector('.contact-form__loader');
  const $response = document.querySelector('.contact-form__response');

  $form.addEventListener('submit', (e) => {
    e.preventDefault();
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
