// Desplegable de tema con la preferencia guardada
import { initDropdown } from './dropdown.js';
import { getTheme, applyTheme } from '../utils/theme.js';

export function initThemeSwitcher() {
  const root = document.getElementById('theme-dropdown');
  if (!root) return;

  const selector = initDropdown(root, { onChange: (value) => applyTheme(value) });
  selector.setValue(getTheme(), { silent: true });
}
