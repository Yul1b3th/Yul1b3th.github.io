// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Movimiento: system o reduce, igual que el tema
// Con reduce se pone data-motion en el html y el sistema quita animaciones

const KEY = 'motion';

export function getMotion() {
  try {
    return localStorage.getItem(KEY) ?? 'system';
  } catch {
    return 'system';
  }
}

export function applyMotion(motion, target = document.documentElement) {
  if (motion === 'reduce') target.setAttribute('data-motion', 'reduce');
  else target.removeAttribute('data-motion');

  try {
    if (motion === 'reduce') localStorage.setItem(KEY, motion);
    else localStorage.removeItem(KEY);
  } catch {
    // Sin almacenamiento la preferencia se aplica igual en esta visita
  }
  document.dispatchEvent(new CustomEvent('motionchange', { detail: { motion } }));
}

// Verdadero si lo pide el sistema operativo o la persona en la web
export function prefersReducedMotion() {
  return (
    document.documentElement.dataset.motion === 'reduce' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
