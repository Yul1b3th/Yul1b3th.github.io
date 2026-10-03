// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Tema de color: system, light, dark o hc
// Con system no se pone atributo y manda la preferencia del sistema

const KEY = 'theme';

export function getTheme() {
  try {
    return localStorage.getItem(KEY) ?? 'system';
  } catch {
    return 'system';
  }
}

export function applyTheme(theme, target = document.documentElement) {
  if (theme === 'system') target.removeAttribute('data-theme');
  else target.setAttribute('data-theme', theme);

  try {
    if (theme === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, theme);
  } catch {
    // Sin almacenamiento el tema se aplica igual en esta visita
  }
}
