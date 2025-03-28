
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeSwitcher from '@/components/header/ThemeSwitcher';
import { Save, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PublishButton from '@/components/PublishButton';

interface HeaderActionsProps {
  onSave?: () => void;
  showSaveButton?: boolean;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  onSave,
  showSaveButton = true,
  isDarkMode,
  toggleDarkMode
}) => {
  const { user, signOut } = useAuth();
  
  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      {/* Publish Button */}
      <PublishButton 
        variant="outline" 
        size="sm"
        className="h-9"
      />
      
      {/* Save Button - only show if onSave prop is provided */}
      {showSaveButton && onSave && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          className="h-9"
        >
          <Save className="h-4 w-4 mr-2" />
          <span>حفظ</span>
        </Button>
      )}
      
      {/* Theme Switcher */}
      {isDarkMode !== undefined && toggleDarkMode && (
        <ThemeSwitcher isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      )}
      
      {/* Profile Button */}
      <Button variant="ghost" size="sm" asChild className="h-9">
        <Link to="/profile">
          <User className="h-4 w-4 mr-2" />
          <span>الملف الشخصي</span>
        </Link>
      </Button>
      
      {/* Logout Button */}
      {user && (
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="h-9"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>تسجيل الخروج</span>
        </Button>
      )}
    </div>
  );
};

export default HeaderActions;
