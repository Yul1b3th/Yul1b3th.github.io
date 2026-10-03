// Año actual en el pie
export function initFooter() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}
