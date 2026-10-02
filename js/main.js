// main.js

import { scrollTopButton } from './modules/scrollTopButton.js';
import { navigationMenu } from './modules/navigationMenu.js';
import { contactForm } from './modules/contactForm.js';
import { scrollSpyObserver } from './modules/scrollSpyObserver.js';
import { languageSwitcher } from './modules/languageSwitcher.js';
import { initSelector } from './modules/selector.js';
import { getTheme, applyTheme } from './modules/theme.js';

scrollTopButton();
navigationMenu();
contactForm();
scrollSpyObserver();
languageSwitcher();

// Selector de tema con la preferencia guardada
const themeSelector = initSelector(document.getElementById('theme-selector'), { onChange: (value) => applyTheme(value) });
themeSelector.setValue(getTheme(), { silent: true });

// Año actual en el pie
document.getElementById('year').textContent = new Date().getFullYear();
