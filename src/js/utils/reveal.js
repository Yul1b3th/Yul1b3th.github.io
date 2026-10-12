// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Muestra con una animación los elementos .reveal cuando entran en pantalla
// Sin soporte o con movimiento reducido no oculta nada

export function initReveal(selector = '.reveal') {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js-reveal');
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
  document.querySelectorAll(selector).forEach((element) => observer.observe(element));
}
