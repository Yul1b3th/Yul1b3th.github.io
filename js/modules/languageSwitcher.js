export function languageSwitcher() {
  const languageSelector = document.getElementById('language-selector');
  const elementsToTranslate = document.querySelectorAll('[data-translate]');
  const htmlElement = document.documentElement;

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
        const key = element.getAttribute('data-translate');
        element.textContent = translations[key];
      });
      // Cambiar el atributo lang del elemento <html>
      htmlElement.setAttribute('lang', language);
    }
  };

  languageSelector.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    translatePage(selectedLanguage);
  });

  // Set default language
  translatePage(languageSelector.value);
}