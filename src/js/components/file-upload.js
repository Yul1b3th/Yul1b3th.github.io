// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Elige archivos con el botón o arrastrándolos, los valida y los lista con miniatura
// La lista se copia al input con DataTransfer para que el formulario envíe lo que se ve

const count = (n) => `${n} ${n === 1 ? 'archivo elegido' : 'archivos elegidos'}`;

const formatSize = (bytes) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`);

// Comprueba el tipo con las mismas reglas que accept, que el navegador solo usa como sugerencia
const matchesAccept = (file, accept) => {
  if (!accept) return true;
  return accept.split(',').map((rule) => rule.trim().toLowerCase()).some((rule) => {
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule);
    if (rule.endsWith('/*')) return file.type.startsWith(rule.slice(0, -1));
    return file.type === rule;
  });
};

export function initFileUploads(root = document) {
  root.querySelectorAll('.file-upload').forEach((upload) => {
    const input = upload.querySelector('.file-upload__input');
    const dropzone = upload.querySelector('.file-upload__dropzone');
    const list = upload.querySelector('.file-upload__list');
    const error = upload.querySelector('.field__error');
    const status = upload.querySelector('[data-file-status]');
    const maxSize = Number(upload.dataset.fileMaxSize) || Infinity;
    const maxFiles = input.multiple ? Number(upload.dataset.fileMaxFiles) || Infinity : 1;
    const icons = upload.dataset.fileIcons ?? 'icons.svg';
    let files = [];

    const announce = (text) => {
      if (status) status.textContent = text;
    };

    const showErrors = (messages) => {
      if (!error) return;
      error.hidden = messages.length === 0;
      error.querySelector('[data-file-error-text]').textContent = messages.join(' ');
      input.setAttribute('aria-invalid', String(messages.length > 0));
    };

    // El input solo admite una FileList, se crea con DataTransfer
    const syncInput = () => {
      const transfer = new DataTransfer();
      files.forEach(({ file }) => transfer.items.add(file));
      input.files = transfer.files;
    };

    const render = () => {
      list.replaceChildren(...files.map((entry) => {
        const item = document.createElement('li');
        item.className = 'file-upload__item';
        const thumb = entry.url
          ? `<img class="file-upload__thumb" src="${entry.url}" alt="">`
          : '<span class="file-upload__thumb" aria-hidden="true"></span>';
        item.innerHTML = `${thumb}<span class="file-upload__info"><span class="file-upload__name"></span><span class="file-upload__size">${formatSize(entry.file.size)}</span></span>
          <button class="button button--icon button--sm" type="button"><svg aria-hidden="true"><use href="${icons}#close"></use></svg></button>`;
        item.querySelector('.file-upload__name').textContent = entry.file.name;
        const remove = item.querySelector('button');
        remove.setAttribute('aria-label', `Quitar ${entry.file.name}`);
        remove.addEventListener('click', () => {
          if (entry.url) URL.revokeObjectURL(entry.url);
          files = files.filter((other) => other !== entry);
          syncInput();
          render();
          showErrors([]);
          announce(`${entry.file.name} quitado. ${count(files.length)}.`);
          (list.querySelector('button') ?? input).focus();
        });
        return item;
      }));
    };

    const add = (incoming) => {
      const messages = [];
      const added = [];
      for (const file of incoming) {
        const repeated = files.some(({ file: f }) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified);
        if (repeated) continue;
        if (!matchesAccept(file, input.accept)) messages.push(`${file.name} no es de un tipo permitido.`);
        else if (file.size > maxSize * 1024 * 1024) messages.push(`${file.name} pesa ${formatSize(file.size)}; el máximo es ${maxSize} MB.`);
        else if (files.length >= maxFiles) messages.push(`Solo se pueden subir ${maxFiles} archivos.`);
        else {
          const entry = { file, url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null };
          if (maxFiles === 1) {
            files.forEach(({ url }) => url && URL.revokeObjectURL(url));
            files = [];
          }
          files.push(entry);
          added.push(file.name);
        }
      }
      syncInput();
      render();
      showErrors([...new Set(messages)]);
      if (added.length) announce(`${added.length === 1 ? 'Añadido' : `${added.length} añadidos`}. ${count(files.length)}.`);
    };

    input.addEventListener('change', () => add([...input.files]));

    // Arrastrar y soltar es una mejora: el botón siempre funciona
    ['dragenter', 'dragover'].forEach((type) => dropzone.addEventListener(type, (event) => {
      event.preventDefault();
      dropzone.classList.add('is-dragover');
    }));
    ['dragleave', 'drop'].forEach((type) => dropzone.addEventListener(type, () => dropzone.classList.remove('is-dragover')));
    dropzone.addEventListener('drop', (event) => {
      event.preventDefault();
      if (!input.disabled) add([...event.dataTransfer.files]);
    });
  });
}
