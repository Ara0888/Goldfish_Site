import { useState, useEffect } from 'react';
import './AccessibilityPanel.css';

export default function AccessibilityPanel() {
  const [fontSize, setFontSize] = useState(0);
  const [highContrast, setHighContrast] = useState(false);

  const sizes = ['', 'font-large', 'font-xlarge', 'font-xxlarge'];

  const changeFontSize = (dir) => {
    const next = dir === 'up' ? Math.min(fontSize + 1, 3) : Math.max(fontSize - 1, 0);
    

    document.body.classList.remove('font-large', 'font-xlarge', 'font-xxlarge');
    
    if (next > 0) {
      document.body.classList.add(sizes[next]);
    }
    
    setFontSize(next);
  };

  const toggleContrast = () => {
    document.body.classList.toggle('high-contrast');
    setHighContrast(!highContrast);
  };

  return (
    <aside className="accessibility-panel" aria-label="Панель специальных возможностей">
      <button 
        onClick={() => changeFontSize('up')} 
        title="Увеличить шрифт" 
        aria-label="Увеличить размер шрифта"
      >
        A+
      </button>
      <button 
        onClick={() => changeFontSize('down')} 
        title="Уменьшить шрифт" 
        aria-label="Уменьшить размер шрифта"
      >
        A-
      </button>
      <button 
        onClick={toggleContrast} 
        title="Высокая контрастность" 
        aria-label="Переключить режим высокой контрастности"
        aria-pressed={highContrast}
      >
        ◐
      </button>
    </aside>
  );
}