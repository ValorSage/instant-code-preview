
import React, { useState } from 'react';
import { saveToLocalStorage } from '../utils/editorUtils';
import { toast } from '@/components/ui/use-toast';
import { 
  Share2, 
  Save, 
  Github, 
  Settings, 
  Code2, 
  MonitorSmartphone, 
  Moon, 
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  html: string;
  css: string;
  js: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  html, 
  css, 
  js, 
  isDarkMode,
  toggleDarkMode
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveToLocalStorage(html, css, js);
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

  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-3 border-b backdrop-blur-md bg-white/70 dark:bg-black/40 border-border animate-slide-down">
      <div className="flex items-center space-x-2">
        <Code2 className="w-6 h-6 text-editor-accent" />
        <h1 className="text-xl font-semibold tracking-tight">LiveWeaver</h1>
      </div>
      
      <div className="flex items-center space-x-3">
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
        
        <Button 
          variant="ghost" 
          size="icon"
          className="transition-all hover:bg-secondary"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
