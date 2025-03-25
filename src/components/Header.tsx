
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Menu } from 'lucide-react';
import { saveToLocalStorage } from '../utils/editorUtils';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './header/Logo';
import ThemeSwitcher from './header/ThemeSwitcher';
import HeaderActions from './header/HeaderActions';
import MobileMenu from './header/MobileMenu';

interface HeaderProps {
  html: string;
  css: string;
  js: string;
  script?: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onSave?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  html, 
  css, 
  js,
  script = '',
  isDarkMode,
  toggleDarkMode,
  onSave
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSave = () => {
    if (onSave) {
      onSave();
      return;
    }
    
    setIsSaving(true);
    setTimeout(() => {
      saveToLocalStorage(html, css, js, script);
      toast({
        title: "Project saved",
        description: "Your code has been saved to local storage",
      });
      setIsSaving(false);
    }, 600);
  };

  const handleShare = () => {
    // In a real app, this would generate a shareable link
    toast({
      title: "Share feature",
      description: "This would generate a shareable link in a real application",
    });
  };

  const handleLogin = () => {
    toast({
      title: "Login",
      description: "This would open a login dialog in a real application",
    });
  };

  const handleProfile = () => {
    toast({
      title: "Profile",
      description: "This would navigate to the user profile in a real application",
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="relative z-10 flex flex-col px-4 py-2 border-b backdrop-blur-md bg-white/70 dark:bg-black/40 border-border animate-slide-down">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Logo />
          
          <nav className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-1"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          {isMobile ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMobileMenu}
              className="md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          ) : (
            <HeaderActions 
              isSaving={isSaving}
              onSave={handleSave}
              onShare={handleShare}
              onLogin={handleLogin}
              onProfile={handleProfile}
            />
          )}
          
          <ThemeSwitcher isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen && isMobile}
        onSave={handleSave}
        onShare={handleShare}
        onLogin={handleLogin}
        onProfile={handleProfile}
      />
    </header>
  );
};

export default Header;
