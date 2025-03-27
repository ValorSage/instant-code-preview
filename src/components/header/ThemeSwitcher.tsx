
import React, { useEffect, useState } from 'react';
import { Moon, Sun, Computer } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  isDarkMode,
  toggleDarkMode
}) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(isDarkMode ? 'dark' : 'light');
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
      if (themeMode === 'system') {
        // If in system mode, change the theme according to system preference
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  // Apply theme based on mode
  useEffect(() => {
    let shouldBeDark = isDarkMode;
    
    if (themeMode === 'system') {
      shouldBeDark = systemPrefersDark;
    } else {
      shouldBeDark = themeMode === 'dark';
    }
    
    document.documentElement.classList.toggle('dark', shouldBeDark);
    
    // Update parent component's state if needed
    if (isDarkMode !== shouldBeDark) {
      toggleDarkMode();
    }
  }, [themeMode, systemPrefersDark, isDarkMode, toggleDarkMode]);

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    localStorage.setItem('akojs-theme-mode', mode);
  };

  // Load theme preference on component mount
  useEffect(() => {
    const savedMode = localStorage.getItem('akojs-theme-mode') as 'light' | 'dark' | 'system' | null;
    if (savedMode) {
      setThemeMode(savedMode);
    }
  }, []);

  return (
    <div className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-1 rounded-md">
                  {themeMode === 'light' && <Sun className="h-5 w-5" />}
                  {themeMode === 'dark' && <Moon className="h-5 w-5" />}
                  {themeMode === 'system' && <Computer className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px]">
                <DropdownMenuItem 
                  onClick={() => handleThemeChange('light')}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Sun className="h-4 w-4" />
                  <span>الوضع النهاري</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleThemeChange('dark')}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Moon className="h-4 w-4" />
                  <span>الوضع الليلي</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleThemeChange('system')}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Computer className="h-4 w-4" />
                  <span>إعدادات النظام</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>تغيير المظهر</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ThemeSwitcher;
