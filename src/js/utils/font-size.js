// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Tamaño del texto: sm, md, lg o xl, igual que el tema y el movimiento
// md es el tamaño normal y quita el atributo del html

const KEY = 'font-size';
const SIZES = ['sm', 'md', 'lg', 'xl'];

export function getFontSize() {
  try {
    const size = localStorage.getItem(KEY);
    return SIZES.includes(size) ? size : 'md';
  } catch {
    return 'md';
  }
}

export function applyFontSize(size, target = document.documentElement) {
  const value = SIZES.includes(size) ? size : 'md';
  if (value === 'md') target.removeAttribute('data-font-size');
  else target.setAttribute('data-font-size', value);

  try {
    if (value === 'md') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, value);
  } catch {
    // Sin almacenamiento la preferencia se aplica igual en esta visita
  }
  document.dispatchEvent(new CustomEvent('fontsizechange', { detail: { size: value } }));
}
