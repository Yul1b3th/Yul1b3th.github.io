// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Carrusel accesible con el patrón de WAI-ARIA, configurable con atributos data
// Una foto a la vez se desliza o funde como Bootstrap y varias tarjetas usan scroll-snap

import { prefersReducedMotion } from '../utils/motion.js';

const MIN_INTERVAL = 5000;
const SWIPE = 40;

// Textos que crea el carrusel, en el idioma del lang más cercano; si no está, en español
const MESSAGES = {
  es: { carousel: 'carrusel', slide: 'diapositiva', position: '{n} de {total}', goTo: 'Ir a la {n} de {total}', play: 'Reproducir', pause: 'Pausar' },
  en: { carousel: 'carousel', slide: 'slide', position: '{n} of {total}', goTo: 'Go to slide {n} of {total}', play: 'Play', pause: 'Pause' },
};
const messagesFor = (el) => MESSAGES[(el.closest('[lang]')?.lang || 'es').slice(0, 2).toLowerCase()] ?? MESSAGES.es;
const fill = (text, n, total) => text.replace('{n}', n).replace('{total}', total);

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
    const fade = carousel.classList.contains('carousel--fade');
    // Con varias tarjetas se copian las primeras al final para seguir hacia delante al dar la vuelta
    const endless = multi && !row && loop;
    let index = Math.min(Math.max(Number(carouselStart) || 1, 1), slides.length) - 1;
    let sliding = false;
    let onSlide = () => {};
    let nearestCard = () => 0;
    let settleOnClone = () => {};
    let takeControl = () => {};
    let onLanguage = () => {};
    // Cada diapositiva puede tener su propio tiempo con data-carousel-interval
    const slideInterval = (i) => Math.max(Number(slides[i].dataset.carouselInterval) || interval, MIN_INTERVAL);

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
      // Sigue visible mientras el ratón está encima, también después de pulsar, como en Material
      return content;
    };
    const prevTip = addTooltip(prev, 'prev', 'end');
    const nextTip = addTooltip(next, 'next', 'start');
    let t = messagesFor(carousel);

    // Al asomar, el relleno de la pista deja ver las vecinas y la actual queda en el centro
    const inset = () => (carousel.classList.contains('carousel--peek') ? parseFloat(getComputedStyle(track).paddingInlineStart) : 0);
    const left = (card) => card.offsetLeft - track.offsetLeft - inset();
    // Copias solo visuales, sin foco ni lector de pantalla
    const clones = endless
      ? slides.slice(0, Math.min(slides.length, 4)).map((slide) => {
          const clone = slide.cloneNode(true);
          clone.classList.add('is-clone');
          clone.setAttribute('aria-hidden', 'true');
          clone.inert = true;
          clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
          track.append(clone);
          return clone;
        })
      : [];

    slides.forEach((slide, i) => {
      slide.setAttribute('role', 'group');
    });

    // Un indicador por diapositiva, el actual es una píldora que se llena con el pase automático
    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__indicator';
      dot.addEventListener('click', () => {
        takeControl();
        goTo(i);
      });
      indicators?.append(dot);
      return dot;
    });

    // Los textos se rehacen al cambiar de idioma con el evento languagechange
    const translate = () => {
      t = messagesFor(carousel);
      carousel.setAttribute('aria-roledescription', t.carousel);
      slides.forEach((slide, i) => {
        slide.setAttribute('aria-roledescription', t.slide);
        slide.setAttribute('aria-label', fill(t.position, i + 1, slides.length));
      });
      dots.forEach((dot, i) => dot.setAttribute('aria-label', fill(t.goTo, i + 1, slides.length)));
      if (prevTip) prevTip.textContent = prev.getAttribute('aria-label') ?? '';
      if (nextTip) nextTip.textContent = next.getAttribute('aria-label') ?? '';
      onLanguage();
    };
    translate();
    document.addEventListener('languagechange', translate);

    // En fila se avanza una página entera, tantas tarjetas como se ven
    const step = () => {
      if (!row) return 1;
      const start = slides[0].offsetLeft;
      return Math.max(1, slides.filter((slide) => slide.offsetLeft - start + slide.offsetWidth <= track.clientWidth + 1).length);
    };
    const last = () => (row ? Math.max(0, slides.length - step()) : slides.length - 1);

    const paint = () => {
      carousel.style.setProperty('--carousel-interval', `${slideInterval(index)}ms`);
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
      // Fundido, la actual se apaga mientras la nueva aparece encima
      if (fade) {
        current.classList.add('is-leaving');
        current.classList.remove('is-active');
        incoming.classList.add('is-active');
        const faded = (event) => {
          if (event.target !== current || event.propertyName !== 'opacity') return;
          current.removeEventListener('transitionend', faded);
          current.classList.remove('is-leaving');
          sliding = false;
        };
        current.addEventListener('transitionend', faded);
        return;
      }
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
        const behavior = prefersReducedMotion() ? 'instant' : 'smooth';
        if (row) {
          if (i > last()) i = loop && index >= last() ? 0 : last();
          if (i < 0) i = loop && index === 0 ? last() : 0;
        }
        if (endless && i >= slides.length) {
          // Sigue hacia la copia de la primera y al parar vuelve a la real sin que se note
          index = i - slides.length;
          track.scrollTo({ left: left(clones[index]), behavior });
        } else if (endless && i < 0) {
          // Desde la primera salta a su copia y retrocede una tarjeta hasta la última
          track.scrollTo({ left: left(clones[0]), behavior: 'instant' });
          index = slides.length - 1;
          track.scrollTo({ left: left(slides[index]), behavior });
        } else {
          index = (i + slides.length) % slides.length;
          track.scrollTo({ left: left(slides[index]), behavior });
        }
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

    prev?.addEventListener('click', () => {
      takeControl();
      goTo(index - step(), -1);
    });
    next?.addEventListener('click', () => {
      takeControl();
      goTo(index + step(), 1);
    });

    if (multi) {
      // Al deslizar se toma como actual la tarjeta más cercana al inicio, también si es una copia
      const cards = [...slides, ...clones];
      nearestCard = () => nearest();
      settleOnClone = () => {
        const i = nearest();
        index = i - slides.length;
        track.scrollTo({ left: left(cards[i]), behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
        paint();
        onSlide();
      };
      const nearest = () =>
        cards.reduce((best, card, i) => (Math.abs(left(card) - track.scrollLeft) < Math.abs(left(cards[best]) - track.scrollLeft) ? i : best), 0);
      track.addEventListener('scroll', () => {
        const current = nearest() % slides.length;
        if (current !== index) {
          index = current;
          paint();
        }
        clearTimeout(settle);
        settle = setTimeout(rewind, 150);
      }, { passive: true });
      // Al parar sobre una copia se pasa a la tarjeta real equivalente
      let settle;
      const rewind = () => {
        const i = nearest();
        if (endless && i >= slides.length && !drag) track.scrollTo({ left: left(slides[i - slides.length]), behavior: 'instant' });
      };
    }

    // Arrastrar con el ratón o el dedo, sin abrir el enlace que había debajo
    let drag = null;
    track.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || (multi && event.pointerType !== 'mouse')) return;
      drag = { x: event.clientX, left: track.scrollLeft, moved: false };
      track.classList.add('is-dragging');
    });
    track.addEventListener('pointermove', (event) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      // Captura el puntero solo al arrastrar, si no el clic no llega a los enlaces
      if (Math.abs(dx) > 5 && !drag.moved) {
        drag.moved = true;
        track.setPointerCapture(event.pointerId);
      }
      if (multi) track.scrollLeft = drag.left - dx;
    });
    const endDrag = (event) => {
      if (!drag) return;
      track.classList.remove('is-dragging');
      const { moved, x } = drag;
      drag = null;
      track.dataset.dragged = String(moved);
      if (!moved) return;
      // Si se suelta sobre una copia se queda ahí y luego salta a la real, sin barrer hacia atrás
      if (multi && endless && nearestCard() >= slides.length) settleOnClone();
      else if (multi) goTo(index);
      else {
        const dx = event.clientX - x;
        if (Math.abs(dx) >= SWIPE) {
          takeControl();
          goTo(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
        }
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
    let remaining = slideInterval(index);
    let startedAt = 0;
    let running = false;
    let userPaused = reduced;
    let hovered = false;

    // El botón solo cambia con un clic; ratón y foco pausan sin tocar el botón
    const render = () => {
      carousel.classList.toggle('is-stopped', userPaused);
      play.dataset.playing = String(!userPaused);
      play.setAttribute('aria-label', userPaused ? t.play : t.pause);
      playTip.textContent = play.getAttribute('aria-label');
    };
    onLanguage = render;
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
      remaining = slideInterval(index);
      if (running) {
        clearTimeout(timer);
        startedAt = performance.now();
        timer = setTimeout(() => goTo(index + 1, 1), remaining);
      }
    };
    const refresh = () => {
      const focused = carousel.contains(document.activeElement) && document.activeElement !== play;
      render();
      run(!userPaused && !hovered && !focused && !document.hidden);
    };
    // Como Bootstrap 6, si la persona usa flechas, puntos o desliza, el pase se para para siempre
    takeControl = () => {
      if (userPaused) return;
      userPaused = true;
      refresh();
    };
    document.addEventListener('visibilitychange', refresh);

    play.addEventListener('click', () => {
      userPaused = !userPaused;
      refresh();
    });
    carousel.addEventListener('mouseenter', () => { hovered = true; refresh(); });
    carousel.addEventListener('mouseleave', () => { hovered = false; refresh(); });
    // Con el teclado el pase se para y no vuelve solo, como pide el patrón de la W3C
    carousel.addEventListener('focusin', (event) => {
      if (event.target !== play && event.target.matches(':focus-visible')) userPaused = true;
      refresh();
    });
    carousel.addEventListener('focusout', () => setTimeout(refresh));
    // Si la persona elige reducir el movimiento, el pase se para
    document.addEventListener('motionchange', () => {
      if (prefersReducedMotion()) userPaused = true;
      refresh();
    });
    refresh();
  });
}
