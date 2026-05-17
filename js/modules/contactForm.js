export function contactForm() {
  const form = document.querySelector('.contact-form'); // tu <form class="contact-form">
  const fd = new FormData(form);

  console.log(fd);

  // Recorrer y ver clave/valor
  fd.forEach((value, key) => console.log(key, value));

  console.log(Object.fromEntries(fd)); // objeto clave/valor
  console.table([...fd.entries()]); // tabla
  for (const [k, v] of fd) console.log(k, v); // iterar pares
  console.log(new URLSearchParams(fd).toString()); // querystring

  ((d) => {
    const $form = d.querySelector('.contact-form'),
      $loader = d.querySelector('.contact-form-loader'),
      $response = d.querySelector('.contact-form-response');

    $form.addEventListener('submit', (e) => {
      e.preventDefault(); // Evitar que el formulario se envíe

      const fd = new FormData(e.target);
      console.table([...fd.entries()]); // tabla
      console.log(Object.fromEntries(fd)); // objeto clave/valor

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
