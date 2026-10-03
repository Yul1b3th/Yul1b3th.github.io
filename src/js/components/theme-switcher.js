// Selector de tema con la preferencia guardada
import { initSelector } from './selector.js';
import { getTheme, applyTheme } from '../utils/theme.js';

export function initThemeSwitcher() {
  const root = document.getElementById('theme-selector');
  if (!root) return;

  const selector = initSelector(root, { onChange: (value) => applyTheme(value) });
  selector.setValue(getTheme(), { silent: true });
}
