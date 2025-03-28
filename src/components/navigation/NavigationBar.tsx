
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Home, 
  Search, 
  FolderOpen,
  Code,
  Settings,
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  Globe,
  Users,
  BookOpen,
  Hash,
  Cloud
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavigationItem {
  name: string;
  icon: React.ElementType;
  href: string;
  active?: boolean;
  disabled?: boolean;
}

interface NavigationBarProps {
  expanded: boolean;
  toggleExpanded: () => void;
  onSearch?: () => void;
  onOpenProject?: () => void;
  onNavigate?: (href: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  expanded, 
  toggleExpanded, 
  onSearch,
  onOpenProject,
  onNavigate
}) => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    { name: 'الرئيسية', icon: Home, href: '/', active: true },
    { name: 'المشاريع', icon: FolderOpen, href: '/projects' },
    { name: 'محاكيات', icon: Code, href: '/simulations' },
    { name: 'مشاركة', icon: Globe, href: '/publish' },
    { name: 'التعاون', icon: Users, href: '/collaboration' },
    { name: 'المحاكيات', icon: BookOpen, href: '/environments' },
    { name: 'المتجر', icon: Hash, href: '/extensions' },
    { name: 'التخزين السحابي', icon: Cloud, href: '/storage' },
    { name: 'الإعدادات', icon: Settings, href: '/settings' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigate = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const renderNavigationItems = () => (
    <div className="flex flex-col space-y-1">
      {navigationItems.map((item) => (
        <TooltipProvider key={item.name}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={item.active ? "default" : "ghost"}
                size={expanded ? "default" : "icon"}
                className={cn(
                  item.active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  expanded && "justify-start",
                  item.disabled && "opacity-50 cursor-not-allowed",
                  "transition-all"
                )}
                onClick={() => handleNavigate(item.href)}
                disabled={item.disabled}
              >
                <item.icon className={cn("h-5 w-5", expanded && "mr-2")} />
                {expanded && <span>{item.name}</span>}
              </Button>
            </TooltipTrigger>
            {!expanded && (
              <TooltipContent side="right">
                <p>{item.name}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed left-4 top-4 z-50 md:hidden"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden">
            <div className="fixed inset-y-0 right-0 w-64 bg-background border-l p-4 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">القائمة</h2>
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {onSearch && (
                <div className="mb-4">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-start"
                    onClick={() => {
                      onSearch();
                      toggleMobileMenu();
                    }}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    <span>بحث</span>
                  </Button>
                </div>
              )}
              
              {onOpenProject && (
                <div className="mb-4">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-start"
                    onClick={() => {
                      onOpenProject();
                      toggleMobileMenu();
                    }}
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    <span>فتح مشروع</span>
                  </Button>
                </div>
              )}
              
              <div className="flex-1">
                {renderNavigationItems()}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div 
      className={cn(
        "h-full border-r bg-background transition-all duration-300 ease-in-out hidden md:flex flex-col",
        expanded ? "w-56" : "w-16"
      )}
    >
      <div className="p-3 flex items-center justify-between border-b">
        {expanded ? (
          <div className="font-semibold text-lg">AKO.js</div>
        ) : (
          <div className="w-full flex justify-center">
            <span className="font-bold">AKO</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleExpanded}
          className="h-8 w-8"
        >
          {expanded ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="p-2">
        {expanded ? (
          <div className="space-y-2">
            {onSearch && (
              <Button variant="outline" className="w-full justify-start" onClick={onSearch}>
                <Search className="h-4 w-4 mr-2" />
                <span>بحث</span>
              </Button>
            )}
            
            {onOpenProject && (
              <Button variant="outline" className="w-full justify-start" onClick={onOpenProject}>
                <FolderOpen className="h-4 w-4 mr-2" />
                <span>فتح مشروع</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {onSearch && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={onSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>بحث</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {onOpenProject && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={onOpenProject}>
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>فتح مشروع</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {renderNavigationItems()}
      </div>
    </div>
  );
};

export default NavigationBar;
