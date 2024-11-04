export function contactForm() {
  ( ( d ) => {
    const $form = d.querySelector('.contact-form'),
      $loader = d.querySelector('.contact-form-loader'),
      $response = d.querySelector('.contact-form-response');

    $form.addEventListener('submit', (e) => {
      e.preventDefault(); // Evitar que el formulario se envíe
      $loader.classList.remove('none');

      emailjs.sendForm('service_41ccklt', 'template_i1spjqs', e.target)
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