// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Carrusel accesible con el patrón de WAI-ARIA, configurable con atributos data
// Una foto a la vez se desliza como Bootstrap 5.3 y varias tarjetas usan scroll-snap

import { prefersReducedMotion } from '../utils/motion.js';

const MIN_INTERVAL = 5000;
const SWIPE = 40;

export function initCarousels(root = document) {
  root.querySelectorAll('.carousel').forEach((carousel) => {
    const track = carousel.querySelector('.carousel__track');
    const slides = [...track.children];
    const prev = carousel.querySelector('.carousel__prev');
    const next = carousel.querySelector('.carousel__next');
    const indicators = carousel.querySelector('.carousel__indicators');
    const { carouselAutoplay, carouselInterval, carouselLoop, carouselStart } = carousel.dataset;
    const loop = carouselLoop !== 'false';
    const interval = Math.max(Number(carouselInterval) || MIN_INTERVAL, MIN_INTERVAL);
    const reduced = prefersReducedMotion();
    // Sobre la foto o en fila tipo Netflix las flechas van a los lados y la ayuda también
    const sideTips = carousel.matches('.carousel--overlay, .carousel--row');
    const multi = carousel.classList.contains('carousel--multi');
    const row = carousel.classList.contains('carousel--row');
    let index = Math.min(Math.max(Number(carouselStart) || 1, 1), slides.length) - 1;
    let sliding = false;
    let onSlide = () => {};

    carousel.classList.toggle('carousel--slide', !multi);
    carousel.style.setProperty('--carousel-interval', `${interval}ms`);

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
      wrap.addEventListener('pointerdown', () => wrap.classList.add('is-dismissed'));
      return content;
    };
    addTooltip(prev, 'prev', 'end');
    addTooltip(next, 'next', 'start');

    slides.forEach((slide, i) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'diapositiva');
      slide.setAttribute('aria-label', `${i + 1} de ${slides.length}`);
    });

    // Un indicador por diapositiva, el actual es una píldora que se llena con el pase automático
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

    // Deslizar como Bootstrap, la nueva entra por un lado y la actual sale por el otro
    const slideTo = (target, direction) => {
      const current = slides[index];
      const incoming = slides[target];
      index = target;
      paint();
      onSlide();
      if (prefersReducedMotion()) {
        current.classList.remove('is-active');
        incoming.classList.add('is-active');
        return;
      }
      sliding = true;
      // La que entra se coloca a un lado sin transición y después se anima
      incoming.style.transition = 'none';
      incoming.classList.add(direction > 0 ? 'is-next' : 'is-prev');
      incoming.getBoundingClientRect();
      incoming.style.transition = '';
      incoming.classList.add(direction > 0 ? 'is-start' : 'is-end');
      current.classList.add(direction > 0 ? 'is-start' : 'is-end');
      const done = (event) => {
        if (event.target !== current || event.propertyName !== 'transform') return;
        current.removeEventListener('transitionend', done);
        incoming.classList.remove('is-next', 'is-prev', 'is-start', 'is-end');
        incoming.classList.add('is-active');
        current.classList.remove('is-active', 'is-start', 'is-end');
        sliding = false;
      };
      current.addEventListener('transitionend', done);
    };

    const goTo = (i, direction) => {
      if (multi) {
        if (row) {
          if (i > last()) i = loop && index >= last() ? 0 : last();
          if (i < 0) i = loop && index === 0 ? last() : 0;
        }
        index = (i + slides.length) % slides.length;
        track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        paint();
        onSlide();
        return;
      }
      if (sliding) return;
      if (!loop && (i < 0 || i >= slides.length)) return;
      const target = (i + slides.length) % slides.length;
      if (target === index) return;
      slideTo(target, direction ?? (target > index ? 1 : -1));
    };

    prev?.addEventListener('click', () => goTo(index - step(), -1));
    next?.addEventListener('click', () => goTo(index + step(), 1));

    if (multi) {
      // Al deslizar se toma como actual la tarjeta más cercana al inicio
      track.addEventListener('scroll', () => {
        const left = track.scrollLeft;
        const current = slides.reduce((best, slide, i) =>
          Math.abs(slide.offsetLeft - track.offsetLeft - left) < Math.abs(slides[best].offsetLeft - track.offsetLeft - left) ? i : best, 0);
        if (current !== index) {
          index = current;
          paint();
        }
      }, { passive: true });
    }

    // Arrastrar con el ratón o el dedo, sin abrir el enlace que había debajo
    let drag = null;
    track.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || (multi && event.pointerType !== 'mouse')) return;
      drag = { x: event.clientX, left: track.scrollLeft, moved: false };
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
    });
    track.addEventListener('pointermove', (event) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      if (Math.abs(dx) > 5) drag.moved = true;
      if (multi) track.scrollLeft = drag.left - dx;
    });
    const endDrag = (event) => {
      if (!drag) return;
      track.classList.remove('is-dragging');
      const { moved, x } = drag;
      drag = null;
      track.dataset.dragged = String(moved);
      if (!moved) return;
      if (multi) goTo(index);
      else {
        const dx = event.clientX - x;
        if (Math.abs(dx) >= SWIPE) goTo(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      }
    };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('click', (event) => {
      if (track.dataset.dragged === 'true') event.preventDefault();
    }, true);
    track.addEventListener('dragstart', (event) => event.preventDefault());

    // Diapositiva inicial con data-carousel-start, contando desde 1
    if (multi) {
      if (index > 0) requestAnimationFrame(() => track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft, behavior: 'instant' }));
    } else {
      slides[index].classList.add('is-active');
    }

    paint();
    if (carouselAutoplay !== 'true') return;

    // Botón de pausa obligatorio con reproducción automática (WCAG 2.2.2)
    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'button button--icon button--sm carousel__play';
    play.innerHTML = '<span class="carousel__play-icon" aria-hidden="true"></span>';
    carousel.querySelector('.carousel__controls').prepend(play);
    const playTip = addTooltip(play, 'play', 'end');
    carousel.classList.add('carousel--autoplay');

    let timer;
    let remaining = interval;
    let startedAt = 0;
    let running = false;
    let userPaused = reduced;
    let hovered = false;

    // El botón solo cambia con un clic; ratón y foco pausan sin tocar el botón
    const render = () => {
      play.dataset.playing = String(!userPaused);
      play.setAttribute('aria-label', userPaused ? 'Reproducir' : 'Pausar');
      playTip.textContent = play.getAttribute('aria-label');
    };
    // Cada diapositiva tiene su tiempo; al pausar se guarda lo que falta para que cuadre con la píldora
    const run = (on) => {
      if (on === running) return;
      running = on;
      clearTimeout(timer);
      carousel.classList.toggle('is-playing', on);
      track.setAttribute('aria-live', on ? 'off' : 'polite');
      if (on) {
        startedAt = performance.now();
        timer = setTimeout(() => goTo(index + 1, 1), remaining);
      } else {
        remaining = Math.max(0, remaining - (performance.now() - startedAt));
      }
    };
    onSlide = () => {
      remaining = interval;
      if (running) {
        clearTimeout(timer);
        startedAt = performance.now();
        timer = setTimeout(() => goTo(index + 1, 1), remaining);
      }
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
