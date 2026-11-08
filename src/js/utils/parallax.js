// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Parallax por capas con data-parallax, la velocidad es un número y negativo va al revés
// Las capas siguen al scroll con suavizado, como el scrub de GSAP, y se paran con reducir movimiento

import { prefersReducedMotion } from './motion.js';

const EASE = 0.1;

export function initParallax(root = document) {
  const layers = [...root.querySelectorAll('[data-parallax]')].map((el) => ({ el, current: 0 }));
  if (!layers.length) return;
  let running = false;

  // Distancia del centro de la sección al centro de la ventana, como mucho una pantalla
  const target = (layer) => {
    const section = layer.el.closest('section') ?? layer.el.parentElement;
    const rect = section.getBoundingClientRect();
    const limit = window.innerHeight;
    const offset = Math.max(-limit, Math.min(limit, rect.top + rect.height / 2 - window.innerHeight / 2));
    return offset * Number(layer.el.dataset.parallax);
  };

  const frame = () => {
    if (prefersReducedMotion()) {
      layers.forEach((layer) => {
        layer.current = 0;
        layer.el.style.transform = '';
      });
      running = false;
      return;
    }
    let moving = false;
    layers.forEach((layer) => {
      const goal = target(layer);
      layer.current += (goal - layer.current) * EASE;
      if (Math.abs(goal - layer.current) < 0.1) layer.current = goal;
      else moving = true;
      layer.el.style.transform = `translateY(${layer.current.toFixed(1)}px)`;
    });
    running = moving;
    if (moving) requestAnimationFrame(frame);
  };

  const request = () => {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  };

  layers.forEach((layer) => (layer.current = prefersReducedMotion() ? 0 : target(layer)));
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  document.addEventListener('motionchange', request);
  request();
}
