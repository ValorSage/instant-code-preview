
import React, { useState } from 'react';
import { saveToLocalStorage } from '../utils/editorUtils';
import { toast } from '@/components/ui/use-toast';
import { 
  Share2, 
  Save, 
  Home,
  Code2, 
  Moon, 
  Sun,
  User,
  LogIn,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

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
          <div className="flex items-center space-x-2">
            <Code2 className="w-6 h-6 text-editor-accent" />
            <h1 className="text-xl font-semibold tracking-tight">Ako.js</h1>
          </div>
          
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
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="transition-all hover:bg-secondary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
                <Save className="w-4 h-4 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="transition-all hover:bg-secondary"
                onClick={handleShare}
              >
                Share
                <Share2 className="w-4 h-4 ml-2" />
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className="transition-all hover:bg-secondary hidden md:flex"
                onClick={handleLogin}
              >
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="transition-all hover:bg-secondary hidden md:flex"
                onClick={handleProfile}
              >
                <User className="w-4 h-4 mr-1" />
                Profile
              </Button>
            </>
          )}
          
          <div className="flex items-center h-8 p-1 border rounded-md bg-background border-border">
            <button 
              className={`p-1 rounded-sm transition-all ${!isDarkMode ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}
              onClick={() => !isDarkMode ? null : toggleDarkMode()}
              aria-label="Light mode"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button 
              className={`p-1 rounded-sm transition-all ${isDarkMode ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}
              onClick={() => isDarkMode ? null : toggleDarkMode()}
              aria-label="Dark mode"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && isMobile && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-border p-4 flex flex-col space-y-3 animate-fade-in shadow-md">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center justify-start"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center justify-start"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center justify-start"
            onClick={handleLogin}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center justify-start"
            onClick={handleProfile}
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center justify-start"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
