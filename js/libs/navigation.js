// Obtener las secciones y el menú de navegación
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

// Crear un Intersection Observer
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                setActiveLink(sectionId);
            }
        });
    },
    { threshold: 0.5 } // Cambia este valor para ajustar el punto de activación del menú
);

// Observar cada sección
sections.forEach((section) => {
    observer.observe(section);
});

// Cambiar la clase activa del enlace del menú
function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Hacer scroll al hacer clic en un enlace del menú
navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Hacer scroll al presionar las teclas P y N
document.addEventListener('keydown', (e) => {
    const currentIndex = Array.from(sections).findIndex((section) => section.getBoundingClientRect().top >= 0);
    let targetIndex;

    if (e.key === 'p' || e.key === 'P') {
        targetIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    } else if (e.key === 'n' || e.key === 'N') {
        targetIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : sections.length - 1;
    } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        targetIndex = Number(e.key) - 1;
    }

    if (targetIndex !== undefined && targetIndex !== currentIndex) {
        sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
    }
});