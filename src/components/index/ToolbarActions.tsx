
import React from 'react';
import { Search, Users, Settings, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DirectionToggle from '@/components/DirectionToggle';
import LanguageSelector from '@/components/LanguageSelector';
import { Link } from 'react-router-dom';

interface ToolbarActionsProps {
  direction: 'ltr' | 'rtl';
  onDirectionChange: (newDirection: 'ltr' | 'rtl') => void;
  selectedLanguage: string;
  onLanguageSelect: (langId: string) => void;
  onSearchClick: () => void;
  onRealTimeClick: () => void;
  onKeyboardShortcutsClick: () => void;
  showRealTimePanel: boolean;
}

const ToolbarActions: React.FC<ToolbarActionsProps> = ({
  direction,
  onDirectionChange,
  selectedLanguage,
  onLanguageSelect,
  onSearchClick,
  onRealTimeClick,
  onKeyboardShortcutsClick,
  showRealTimePanel
}) => {
  return (
    <div className="flex items-center gap-2">
      <DirectionToggle 
        direction={direction}
        onChange={onDirectionChange}
      />
      
      <LanguageSelector 
        selectedLanguage={selectedLanguage}
        onLanguageSelect={onLanguageSelect}
      />
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onSearchClick} className="h-8 w-8 p-1">
              <Search className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>بحث في الملفات (Ctrl+Shift+F)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={showRealTimePanel ? "secondary" : "ghost"} 
              size="sm" 
              onClick={onRealTimeClick} 
              className="h-8 w-8 p-1"
            >
              <Users className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>التعاون في الوقت الحقيقي</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-1">
              <Link to="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>إعدادات متقدمة</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onKeyboardShortcutsClick} className="h-8 w-8 p-1">
              <Keyboard className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>اختصارات لوحة المفاتيح</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ToolbarActions;
