// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Anima los elementos .animate al entrar en pantalla o al cargar la página
// Lee data-animate-delay, data-animate-duration y data-animate-trigger

import { prefersReducedMotion } from './motion.js';

const DURATIONS = ['fast', 'base', 'moderate', 'slow', 'hero'];

export function initAnimate(root = document) {
  const elements = root.querySelectorAll('.animate:not(.is-visible)');

  elements.forEach((element) => {
    const { animateDelay, animateDuration } = element.dataset;
    const delay = Number.parseInt(animateDelay, 10);
    if (delay > 0) element.style.setProperty('--animate-delay', `${delay}ms`);
    if (DURATIONS.includes(animateDuration)) element.style.setProperty('--animate-duration', `var(--duration-${animateDuration})`);
  });

  // Con movimiento reducido o sin soporte no se oculta nada
  const reduced = prefersReducedMotion();
  if (reduced || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js-animate');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );

  elements.forEach((element) => {
    if (element.dataset.animateTrigger !== 'load') observer.observe(element);
  });
}
