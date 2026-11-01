// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Carrusel accesible con el patrón de WAI-ARIA, configurable con atributos data
// La reproducción automática siempre trae botón de pausa y se para con el ratón o el teclado

import { prefersReducedMotion } from '../utils/motion.js';

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
    const reduced = prefersReducedMotion();
    // Sobre la foto o en fila tipo Netflix las flechas van a los lados y la ayuda también
    const sideTips = carousel.matches('.carousel--overlay, .carousel--row');
    const row = carousel.classList.contains('carousel--row');
    let index = 0;

    // Ayuda visible con el nombre de los botones de icono, a un lado si van sobre la foto
    const addTooltip = (button, name, side) => {
      if (!button) return null;
      const wrap = document.createElement('span');
      wrap.className = `tooltip carousel__tooltip carousel__tooltip--${name}${sideTips ? ` tooltip--${side}` : ''}`;
      const content = document.createElement('span');
      content.className = 'tooltip__content';
      content.setAttribute('aria-hidden', 'true');
      content.textContent = button.getAttribute('aria-label') ?? '';
      button.replaceWith(wrap);
      wrap.append(button, content);
      const reset = () => wrap.classList.remove('is-dismissed');
      wrap.addEventListener('mouseleave', reset);
      wrap.addEventListener('focusout', reset);
      return content;
    };
    addTooltip(prev, 'prev', 'end');
    addTooltip(next, 'next', 'start');

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

    // En fila se avanza una página entera, tantas tarjetas como se ven
    const step = () => {
      if (!row) return 1;
      const start = slides[0].offsetLeft;
      return Math.max(1, slides.filter((slide) => slide.offsetLeft - start + slide.offsetWidth <= track.clientWidth + 1).length);
    };
    const last = () => (row ? Math.max(0, slides.length - step()) : slides.length - 1);

    const paint = () => {
      dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
      if (!loop) {
        if (prev) prev.disabled = index === 0;
        if (next) next.disabled = index >= last();
      }
    };

    const goTo = (i) => {
      if (row) {
        if (i > last()) i = loop && index >= last() ? 0 : last();
        if (i < 0) i = loop && index === 0 ? last() : 0;
      }
      index = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      paint();
    };

    prev?.addEventListener('click', () => goTo(index - step()));
    next?.addEventListener('click', () => goTo(index + step()));

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
    const playTip = addTooltip(play, 'play', 'end');

    let timer;
    let userPaused = reduced;
    let hovered = false;

    // El botón solo cambia con un clic; ratón y foco pausan sin tocar el botón
    const render = () => {
      play.dataset.playing = String(!userPaused);
      play.setAttribute('aria-label', userPaused ? 'Reproducir' : 'Pausar');
      playTip.textContent = play.getAttribute('aria-label');
    };
    const run = (on) => {
      clearInterval(timer);
      if (on) timer = setInterval(() => goTo(index + 1), interval);
      track.setAttribute('aria-live', on ? 'off' : 'polite');
    };
    const refresh = () => {
      const focused = carousel.contains(document.activeElement) && document.activeElement !== play;
      render();
      run(!userPaused && !hovered && !focused);
    };

    play.addEventListener('click', () => {
      userPaused = !userPaused;
      refresh();
    });
    carousel.addEventListener('mouseenter', () => { hovered = true; refresh(); });
    carousel.addEventListener('mouseleave', () => { hovered = false; refresh(); });
    carousel.addEventListener('focusin', refresh);
    carousel.addEventListener('focusout', () => setTimeout(refresh));
    // Si la persona elige reducir el movimiento, el pase se para
    document.addEventListener('motionchange', () => {
      if (prefersReducedMotion()) userPaused = true;
      refresh();
    });
    refresh();
  });
}
