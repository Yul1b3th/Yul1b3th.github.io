// Desplegable de apariencia, tema guardado y opción de reducir movimiento
import { initDropdown } from './dropdown.js';
import { getTheme, applyTheme } from '../utils/theme.js';
import { getMotion, applyMotion } from '../utils/motion.js';

export function initThemeSwitcher() {
  const root = document.getElementById('theme-dropdown');
  if (!root) return;

  const selector = initDropdown(root, {
    onChange: (value) => applyTheme(value),
    onToggle: (value, checked) => value === 'reduce-motion' && applyMotion(checked ? 'reduce' : 'system'),
  });
  selector.setValue(getTheme(), { silent: true });
  selector.setChecked('reduce-motion', getMotion() === 'reduce', { silent: true });
}
