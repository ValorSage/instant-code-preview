
import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  isDarkMode,
  toggleDarkMode
}) => {
  return (
    <div className="flex items-center h-8 p-1 border rounded-md bg-background border-border transition-colors duration-300">
      <button 
        className={`p-1 rounded-sm transition-all duration-300 ${!isDarkMode ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        onClick={() => !isDarkMode ? null : toggleDarkMode()}
        aria-label="Light mode"
      >
        <Sun className={`w-4 h-4 transition-transform duration-300 ${!isDarkMode ? 'rotate-0' : '-rotate-90 scale-75 opacity-70'}`} />
      </button>
      <button 
        className={`p-1 rounded-sm transition-all duration-300 ${isDarkMode ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        onClick={() => isDarkMode ? null : toggleDarkMode()}
        aria-label="Dark mode"
      >
        <Moon className={`w-4 h-4 transition-transform duration-300 ${isDarkMode ? 'rotate-0' : 'rotate-90 scale-75 opacity-70'}`} />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
