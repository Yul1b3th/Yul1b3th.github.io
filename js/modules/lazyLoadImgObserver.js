export function lazyLoadImgObserver () {
      window.addEventListener("resize", lazyLoadImg);
    window.addEventListener("DOMContentLoaded", lazyLoadImg);
    function lazyLoadImg () {
      const bgLazyLoadImg = document.querySelectorAll('.bg-lazy-load-img');
      const LazyLoadImg = document.querySelectorAll('.lazy-load-img');

      const callbackLazyLoadImg = (entries, LazyLoadImgObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains('bg-lazy-load-img')) {
              let id = entry.target.getAttribute('id');
              if ((id == 'header') && (window.innerWidth >= 992)) {
                entry.target.style.backgroundImage = `url("./img/header.jpg")`;
              } else {
                entry.target.style.backgroundImage = `url("${entry.target.dataset.src}")`;
              }
            } else if (entry.target.classList.contains('lazy-load-img')) {
              entry.target.src = entry.target.dataset.src;
            }
            entry.target.classList.add('fade-lazy-load-img');
            LazyLoadImgObserver.unobserve(entry.target);
          }
        });
      };

      const optionsLazyLoadImg = {
        rootMargin: '-1px',
      };

      const LazyLoadImgObserver = new IntersectionObserver(callbackLazyLoadImg, optionsLazyLoadImg);

      bgLazyLoadImg.forEach((target) => LazyLoadImgObserver.observe(target));

      LazyLoadImg.forEach((target) => LazyLoadImgObserver.observe(target));
    }
}
