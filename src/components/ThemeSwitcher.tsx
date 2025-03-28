
import React, { useEffect, useState } from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ isDarkMode, onToggle }) => {
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(
    localStorage.getItem('akojs-theme-mode') as 'light' | 'dark' | 'system' || 'system'
  );

  useEffect(() => {
    const savedMode = localStorage.getItem('akojs-theme-mode') as 'light' | 'dark' | 'system' | null;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    // Apply the correct theme based on mode
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
      if (isDarkMode !== prefersDark) {
        onToggle();
      }
    } else {
      const shouldBeDark = mode === 'dark';
      document.documentElement.classList.toggle('dark', shouldBeDark);
      if (isDarkMode !== shouldBeDark) {
        onToggle();
      }
    }
  }, [mode, isDarkMode, onToggle]);

  const handleSetMode = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    localStorage.setItem('akojs-theme-mode', newMode);
  };

  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <Button
        variant={mode === 'light' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleSetMode('light')}
        className="flex items-center gap-2"
      >
        <Sun className="h-4 w-4" />
        <span>فاتح</span>
      </Button>
      
      <Button
        variant={mode === 'dark' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleSetMode('dark')}
        className="flex items-center gap-2"
      >
        <Moon className="h-4 w-4" />
        <span>داكن</span>
      </Button>
      
      <Button
        variant={mode === 'system' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleSetMode('system')}
        className="flex items-center gap-2"
      >
        <Laptop className="h-4 w-4" />
        <span>تلقائي</span>
      </Button>
    </div>
  );
};

export default ThemeSwitcher;
