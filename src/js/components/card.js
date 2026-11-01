// Archivo de innovatech-ds. No editar aquí
// Se cambia en innovatech-ds y se copia con npm run sync

// Favorito y compartir de las tarjetas
// Compartir usa el menú del sistema y, si no existe, copia el enlace

export function initCards(root = document) {
  root.addEventListener('click', async (event) => {
    const favorite = event.target.closest('.card__favorite');
    if (favorite) {
      const pressed = favorite.getAttribute('aria-pressed') === 'true';
      favorite.setAttribute('aria-pressed', String(!pressed));
      favorite.dispatchEvent(new CustomEvent('favoritechange', { bubbles: true, detail: { pressed: !pressed } }));
      return;
    }

    const share = event.target.closest('[data-card-share]');
    if (!share) return;
    const url = new URL(share.dataset.cardShare || location.href, location.href).href;
    const title = share.dataset.cardTitle ?? document.title;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        share.setAttribute('aria-label', 'Enlace copiado');
        setTimeout(() => share.setAttribute('aria-label', 'Compartir'), 2000);
      }
    } catch {
      // La persona canceló el menú de compartir
    }
  });
}
