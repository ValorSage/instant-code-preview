
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  Save, 
  Home,
  LogIn,
  User
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onSave: () => void;
  onShare: () => void;
  onLogin: () => void;
  onProfile: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onSave,
  onShare,
  onLogin,
  onProfile
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-border p-4 flex flex-col space-y-3 animate-fade-in shadow-md">
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center justify-start"
        onClick={onSave}
      >
        <Save className="w-4 h-4 mr-2" />
        Save
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center justify-start"
        onClick={onShare}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center justify-start"
        onClick={onLogin}
      >
        <LogIn className="w-4 h-4 mr-2" />
        Login
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center justify-start"
        onClick={onProfile}
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
  );
};

export default MobileMenu;
