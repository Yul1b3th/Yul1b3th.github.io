// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Carrusel accesible con el patrón de WAI-ARIA, configurable con atributos data
// La reproducción automática siempre trae botón de pausa y se para con el ratón o el teclado

const MIN_INTERVAL = 5000;

export function initCarousels(root = document) {
  root.querySelectorAll('.carousel').forEach((carousel) => {
    const track = carousel.querySelector('.carousel__track');
    const slides = [...track.children];
    const prev = carousel.querySelector('.carousel__prev');
    const next = carousel.querySelector('.carousel__next');
    const indicators = carousel.querySelector('.carousel__indicators');
    const { carouselAutoplay, carouselInterval, carouselLoop } = carousel.dataset;
    const loop = carouselLoop !== 'false';
    const interval = Math.max(Number(carouselInterval) || MIN_INTERVAL, MIN_INTERVAL);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0;

    slides.forEach((slide, i) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'diapositiva');
      slide.setAttribute('aria-label', `${i + 1} de ${slides.length}`);
    });

    // Un indicador por diapositiva
    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__indicator';
      dot.setAttribute('aria-label', `Ir a la ${i + 1} de ${slides.length}`);
      dot.addEventListener('click', () => goTo(i));
      indicators?.append(dot);
      return dot;
    });

    const paint = () => {
      dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
      if (!loop) {
        if (prev) prev.disabled = index === 0;
        if (next) next.disabled = index === slides.length - 1;
      }
    };

    const goTo = (i) => {
      index = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
      paint();
    };

    prev?.addEventListener('click', () => goTo(index - 1));
    next?.addEventListener('click', () => goTo(index + 1));

    // Al deslizar se toma como actual la diapositiva más cercana al inicio, también con varias a la vez
    track.addEventListener('scroll', () => {
      const left = track.scrollLeft;
      const current = slides.reduce((best, slide, i) =>
        Math.abs(slide.offsetLeft - track.offsetLeft - left) < Math.abs(slides[best].offsetLeft - track.offsetLeft - left) ? i : best, 0);
      if (current !== index) {
        index = current;
        paint();
      }
    }, { passive: true });

    // Arrastrar con el ratón, en el móvil ya se desliza con el dedo
    let drag = null;
    track.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      drag = { x: event.clientX, left: track.scrollLeft, moved: false };
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
    });
    track.addEventListener('pointermove', (event) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      if (Math.abs(dx) > 5) drag.moved = true;
      track.scrollLeft = drag.left - dx;
    });
    const endDrag = () => {
      if (!drag) return;
      track.classList.remove('is-dragging');
      const moved = drag.moved;
      drag = null;
      track.dataset.dragged = String(moved);
      if (moved) goTo(index);
    };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    // Tras arrastrar no se abre el enlace que había debajo
    track.addEventListener('click', (event) => {
      if (track.dataset.dragged === 'true') event.preventDefault();
    }, true);
    track.addEventListener('dragstart', (event) => event.preventDefault());

    paint();
    if (carouselAutoplay !== 'true') return;

    // Botón de pausa obligatorio con reproducción automática (WCAG 2.2.2)
    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'button button--icon button--sm carousel__play';
    play.innerHTML = '<span class="carousel__play-icon" aria-hidden="true"></span>';
    carousel.querySelector('.carousel__controls').prepend(play);

    let timer;
    let userPaused = reduced;
    let hovered = false;

    const setPlaying = (playing) => {
      clearInterval(timer);
      if (playing) timer = setInterval(() => goTo(index + 1), interval);
      play.setAttribute('aria-pressed', String(playing));
      play.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir');
      track.setAttribute('aria-live', playing ? 'off' : 'polite');
    };
    const refresh = () => setPlaying(!userPaused && !hovered && !carousel.contains(document.activeElement));

    play.addEventListener('click', () => {
      userPaused = play.getAttribute('aria-pressed') === 'true';
      setPlaying(!userPaused);
    });
    carousel.addEventListener('mouseenter', () => { hovered = true; refresh(); });
    carousel.addEventListener('mouseleave', () => { hovered = false; refresh(); });
    carousel.addEventListener('focusin', (event) => { if (event.target !== play) setPlaying(false); });
    carousel.addEventListener('focusout', () => setTimeout(refresh));
    refresh();
  });
}
