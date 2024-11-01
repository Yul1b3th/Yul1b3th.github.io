// main.js

import { scrollTopButton } from './modules/scrollTopButton.js';
import { navigationMenu } from './modules/navigationMenu.js';
import { contactForm } from './modules/contactForm.js';
import { scrollSpyObserver } from './modules/scrollSpyObserver.js';
import { lazyLoadImgObserver } from './modules/lazyLoadImgObserver.js';
import { languageSwitcher } from './modules/languageSwitcher.js';

scrollTopButton();
navigationMenu();
contactForm();
scrollSpyObserver();
lazyLoadImgObserver();
languageSwitcher();

// window.onload = function() {
//   setTimeout(function() {
//     history.replaceState(null, null, '#home');
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     history.pushState(null, null, ' ');
//   }, 1);
// }