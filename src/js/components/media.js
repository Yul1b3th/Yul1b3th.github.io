// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Vídeo de fondo con botón de pausa, quieto si se pide reducir movimiento
// Los vídeos con controles nativos solo se pausan con reducir movimiento si llevan autoplay

import { prefersReducedMotion } from '../utils/motion.js';

const MESSAGES = {
  es: { play: 'Reproducir vídeo', pause: 'Pausar vídeo' },
  en: { play: 'Play video', pause: 'Pause video' },
};

const messagesFor = (el) => MESSAGES[(el.closest('[lang]')?.lang || 'es').slice(0, 2).toLowerCase()] ?? MESSAGES.es;

export function initMedia(root = document) {
  root.querySelectorAll('[data-media-background]').forEach((video) => {
    if (video.dataset.mediaReady) return;
    video.dataset.mediaReady = 'true';

    // Sin sonido y en bucle, el navegador solo lo deja empezar solo así
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('aria-hidden', 'true');

    const frame = video.closest('.media__frame') ?? video.parentElement;
    const control = document.createElement('span');
    control.className = 'tooltip tooltip--start media__control';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'button button--icon media__toggle';
    toggle.innerHTML = '<span class="media__toggle-icon" aria-hidden="true"></span>';
    const tip = document.createElement('span');
    tip.className = 'tooltip__content';
    tip.setAttribute('aria-hidden', 'true');
    control.append(toggle, tip);
    frame.append(control);

    const render = () => {
      const t = messagesFor(video);
      const playing = !video.paused;
      const label = playing ? t.pause : t.play;
      toggle.dataset.playing = String(playing);
      toggle.setAttribute('aria-label', label);
      tip.textContent = label;
    };

    // Sin archivo queda el póster y el botón sobra
    const hideControl = () => {
      control.hidden = true;
    };
    video.querySelectorAll('source').forEach((source) => source.addEventListener('error', hideControl));
    if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) hideControl();

    toggle.addEventListener('click', () => {
      if (video.paused) video.play().catch(() => {});
      else video.pause();
    });
    video.addEventListener('play', render);
    video.addEventListener('pause', render);
    document.addEventListener('languagechange', render);

    const stop = () => {
      video.pause();
      render();
    };
    if (prefersReducedMotion()) stop();
    else video.play().catch(render);
    document.addEventListener('motionchange', () => prefersReducedMotion() && stop());
    render();
  });

  // Un vídeo con controles y autoplay también respeta reducir movimiento
  root.querySelectorAll('video[controls][autoplay]').forEach((video) => {
    if (prefersReducedMotion()) video.pause();
  });
}
