export function scrollTopButton () {
    const $toTop = document.querySelector('.scroll-top-btn');

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 100) {
        $toTop.classList.remove('hidden');
      } else {
        $toTop.classList.add('hidden');
      }
    });

    $toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}