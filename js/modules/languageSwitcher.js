export function languageSwitcher() {
  const languageSelector = document.getElementById('language-selector');
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
            if (element.tagName === 'A' && element.hasAttribute('aria-label')) {
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
    }
  };

  const getDefaultLanguage = () => {
    const browserLanguage = navigator.language || navigator.languages[0];
    if (browserLanguage.startsWith('es')) {
      return 'es';
    } else if (browserLanguage.startsWith('en')) {
      return 'en';
    } else {
      return 'en'; // Default to English if the language is neither Spanish nor English
    }
  };

  languageSelector.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    translatePage(selectedLanguage);
  });

  // Set default language based on browser language
  const defaultLanguage = getDefaultLanguage();
  languageSelector.value = defaultLanguage;
  translatePage(defaultLanguage);
}