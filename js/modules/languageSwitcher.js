import { initSelector } from './selector.js';

export function languageSwitcher() {
  const languageRoot = document.getElementById('language-selector');
  const elementsToTranslate = document.querySelectorAll('[data-translate]');
  const htmlElement = document.documentElement;
  const downloadCvBtn = document.getElementById('download-cv-btn');

  const loadTranslations = async (language) => {
    try {
      const response = await fetch('./data/translations.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const translations = await response.json();
      return translations[language];
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  };

  const translatePage = async (language) => {
    const translations = await loadTranslations(language);
    if (translations) {
      elementsToTranslate.forEach(element => {
        const keys = element.getAttribute('data-translate').split(' ');
        keys.forEach(key => {
          const translation = translations[key];
          if (translation) {
            if (element.tagName === 'META') {
              element.setAttribute('content', translation);
            } else if (element.tagName === 'A' && element.hasAttribute('aria-label')) {
              element.setAttribute('aria-label', translation);
            } else if (key.endsWith('-label') && element.hasAttribute('aria-label')) {
              element.setAttribute('aria-label', translation);
            } else if (element.hasAttribute('placeholder') && key.includes('placeholder')) {
              element.setAttribute('placeholder', translation);
            } else if (element.hasAttribute('title') && key.includes('title')) {
              element.setAttribute('title', translation);
            } else if (element.hasAttribute('alt') && key.includes('alt')) {
              element.setAttribute('alt', translation);
            } else {
              element.innerHTML = translation;
            }
          }
        });
      });
      // Cambiar el atributo lang del elemento <html>
      htmlElement.setAttribute('lang', language);
      // Cambiar el enlace del botón de descarga del CV
      const cvLink = `./assets/yulibeth-rivero-${language}.pdf`;
      downloadCvBtn.setAttribute('href', cvLink);
      // Avisa a los selectores para que actualicen su texto
      document.dispatchEvent(new CustomEvent('languagechange', { detail: language }));
    }
  };

  const getDefaultLanguage = () => {
    try {
      const saved = localStorage.getItem('language');
      if (saved === 'es' || saved === 'en') return saved;
    } catch {}
    const browserLanguage = navigator.language || navigator.languages[0];
    if (browserLanguage.startsWith('es')) {
      return 'es';
    } else if (browserLanguage.startsWith('en')) {
      return 'en';
    } else {
      return 'en'; // Default to English if the language is neither Spanish nor English
    }
  };

  const languageSelector = initSelector(languageRoot, {
    onChange: (language) => {
      try {
        localStorage.setItem('language', language);
      } catch {}
      translatePage(language);
    },
  });

  // Idioma guardado o el del navegador
  const defaultLanguage = getDefaultLanguage();
  languageSelector.setValue(defaultLanguage, { silent: true });
  translatePage(defaultLanguage);
}