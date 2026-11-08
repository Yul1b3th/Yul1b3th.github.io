// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Color de acento: mint (el de siempre), violet o navy
// Con mint no se pone atributo; cada proyecto suele fijarlo en el html con data-accent

const KEY = 'accent';
export const ACCENTS = ['mint', 'violet', 'navy'];

export function getAccent() {
  try {
    return localStorage.getItem(KEY) ?? document.documentElement.dataset.accent ?? 'mint';
  } catch {
    return document.documentElement.dataset.accent ?? 'mint';
  }
}

export function applyAccent(accent, target = document.documentElement, { save = true } = {}) {
  if (!ACCENTS.includes(accent) || accent === 'mint') target.removeAttribute('data-accent');
  else target.setAttribute('data-accent', accent);
  if (!save) return;

  try {
    if (accent === 'mint') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, accent);
  } catch {
    // Sin almacenamiento el acento se aplica igual en esta visita
  }
}
