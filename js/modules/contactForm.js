export function contactForm() {
  ((d) => {
    const $form = d.querySelector('.contact-form'),
      $loader = d.querySelector('.contact-form-loader'),
      $response = d.querySelector('.contact-form-response');

    $form.addEventListener('submit', (e) => {
      e.preventDefault(); // Evitar que el formulario se envíe
      $loader.classList.remove('none');

      fetch('https://formsubmit.co/ajax/yulibeth.rivero@gmail.com', {
        method: 'POST',
        body: new FormData(e.target),
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((json) => {
          console.log(json);
          location.hash = '#thanks';
          $form.reset();
        })
        .catch((err) => {
          console.log(err);
          let message = err.statusText || 'Ocurrió un error al enviar, intenta nuevamente';
          $response.querySelector('h3').innerHTML = `Error ${err.status}: ${message}`;
        })
        .finally(() => {
          $loader.classList.add('none');
          setTimeout(() => {
            location.hash = '#close';
          }, 3000);
        });
    });
  })(document);
}