
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Share2, LogIn, User } from 'lucide-react';

interface HeaderActionsProps {
  isSaving: boolean;
  onSave: () => void;
  onShare: () => void;
  onLogin: () => void;
  onProfile: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  isSaving,
  onSave,
  onShare,
  onLogin,
  onProfile
}) => {
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="transition-all hover:bg-secondary"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save'}
        <Save className="w-4 h-4 ml-2" />
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="transition-all hover:bg-secondary"
        onClick={onShare}
      >
        Share
        <Share2 className="w-4 h-4 ml-2" />
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        className="transition-all hover:bg-secondary hidden md:flex"
        onClick={onLogin}
      >
        <LogIn className="w-4 h-4 mr-1" />
        Login
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="transition-all hover:bg-secondary hidden md:flex"
        onClick={onProfile}
      >
        <User className="w-4 h-4 mr-1" />
        Profile
      </Button>
    </>
  );
};

export default HeaderActions;
