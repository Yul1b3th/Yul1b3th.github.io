// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Ordena las tablas con botones .table__sort en la cabecera
// Marca la columna con aria-sort y entiende números y fechas ISO

export function initTables(root = document) {
  root.querySelectorAll('.table').forEach((table) => {
    const headers = [...table.querySelectorAll('thead th')];
    headers.forEach((th, column) => {
      const button = th.querySelector('.table__sort');
      if (!button) return;
      button.addEventListener('click', () => {
        const direction = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        headers.forEach((other) => other.removeAttribute('aria-sort'));
        th.setAttribute('aria-sort', direction);
        const body = table.tBodies[0];
        const rows = [...body.rows];
        const value = (row) => row.cells[column].dataset.value ?? row.cells[column].textContent.trim();
        rows.sort((a, b) => value(a).localeCompare(value(b), 'es', { numeric: true }) * (direction === 'ascending' ? 1 : -1));
        body.append(...rows);
      });
    });
  });
}
