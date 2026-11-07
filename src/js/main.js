// main.js: punto de entrada
import { initNavbars } from './components/navbar.js';
import { initTopbars } from './components/topbar.js';
import { initDrawers } from './components/drawer.js';
import { initThemeSwitcher } from './components/theme-switcher.js';
import { initLanguageSwitcher } from './components/language-switcher.js';
import { initContactForm } from './components/contact-form.js';
import { initScrollTop } from './components/scroll-top.js';
import { initFooter } from './components/footer.js';
import { initAnimate } from './utils/animate.js';

// La barra copia sus enlaces al panel antes de traducir la página
initNavbars();
initTopbars();
initDrawers();
initThemeSwitcher();
initLanguageSwitcher();
initContactForm();
initScrollTop();
initFooter();
initAnimate();
