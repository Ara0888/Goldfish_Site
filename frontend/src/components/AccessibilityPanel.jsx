import { useState, useEffect } from 'react';

export default function AccessibilityPanel() {
  const [fontSize, setFontSize] = useState(0);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);

  const sizes = ['', 'font-large', 'font-xlarge', 'font-xxlarge'];

  const changeFontSize = (dir) => {
    const next = dir === 'up' ? Math.min(fontSize + 1, 3) : Math.max(fontSize - 1, 0);
    sizes.forEach(s => document.body.classList.remove(s));
    if (next > 0) document.body.classList.add(sizes[next]);
    setFontSize(next);
    
    // Объявление для скринридера
    announceToScreenReader(`Размер шрифта изменён на ${next === 1 ? 'увеличенный' : next === 2 ? 'большой' : 'очень большой'}`);
  };

  const toggleContrast = () => {
    document.body.classList.toggle('high-contrast');
    setHighContrast(!highContrast);
    announceToScreenReader(`Режим высокой контрастности ${!highContrast ? 'включён' : 'выключен'}`);
  };

  const toggleScreenReader = () => {
    setScreenReaderMode(!screenReaderMode);
    document.body.classList.toggle('screen-reader-mode');
    announceToScreenReader(`Режим экранного диктора ${!screenReaderMode ? 'включён' : 'выключен'}`);
  };

  // Функция объявления для скринридера
  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  };

  // Горячие клавиши
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === '+') {
        e.preventDefault();
        changeFontSize('up');
      }
      if (e.altKey && e.key === '-') {
        e.preventDefault();
        changeFontSize('down');
      }
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        toggleContrast();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <aside className="accessibility-panel" aria-label="Панель специальных возможностей">
      <button 
        onClick={() => changeFontSize('up')} 
        title="Увеличить шрифт (Alt + +)" 
        aria-label="Увеличить размер шрифта"
      >
        A+
      </button>
      <button 
        onClick={() => changeFontSize('down')} 
        title="Уменьшить шрифт (Alt + -)" 
        aria-label="Уменьшить размер шрифта"
      >
        A-
      </button>
      <button 
        onClick={toggleContrast} 
        title="Высокая контрастность (Alt + C)" 
        aria-label="Переключить режим высокой контрастности"
        aria-pressed={highContrast}
      >
        ◐
      </button>
      <button 
        onClick={toggleScreenReader} 
        title="Режим скринридера" 
        aria-label="Переключить режим экранного диктора"
        aria-pressed={screenReaderMode}
      >
        🔊
      </button>
    </aside>
  );
}