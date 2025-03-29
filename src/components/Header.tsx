
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/userUtils';
import { Menu, X, Home, Code, Settings, User, LogOut, Github, Sun, Moon, ExternalLink } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  html: string;
  css: string;
  js: string;
  script: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onSave: () => void;
}

const Header: React.FC<HeaderProps> = ({
  html,
  css,
  js,
  script,
  isDarkMode,
  toggleDarkMode,
  onSave,
}) => {
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح"
    });
    navigate('/auth');
  };

  const isAuthPage = location.pathname === '/auth';
  
  if (isAuthPage) {
    return null; // Don't show header on auth page
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <SheetHeader className="text-right">
                <SheetTitle>منصة كودر التفاعلية</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-6">
                <Button variant="ghost" className="justify-start" asChild onClick={() => setIsMenuOpen(false)}>
                  <Link to="/">
                    <Home className="mr-2 h-5 w-5" />
                    الرئيسية
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild onClick={() => setIsMenuOpen(false)}>
                  <Link to="/projects">
                    <Code className="mr-2 h-5 w-5" />
                    المشاريع
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild onClick={() => setIsMenuOpen(false)}>
                  <Link to="/tools">
                    <Settings className="mr-2 h-5 w-5" />
                    أدوات التطوير
                  </Link>
                </Button>
                {user ? (
                  <>
                    <Button variant="ghost" className="justify-start" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link to="/profile">
                        <User className="mr-2 h-5 w-5" />
                        الملف الشخصي
                      </Link>
                    </Button>
                    <Button variant="ghost" className="justify-start text-red-500" onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}>
                      <LogOut className="mr-2 h-5 w-5" />
                      تسجيل الخروج
                    </Button>
                  </>
                ) : (
                  <Button variant="default" className="justify-start" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to="/auth">
                      <LogOut className="mr-2 h-5 w-5" />
                      تسجيل الدخول
                    </Link>
                  </Button>
                )}
              </div>
              <div className="mt-auto flex justify-between items-center">
                <Button variant="outline" size="icon" onClick={toggleDarkMode}>
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="inline-block font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 text-xl">كودر</span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse lg:space-x-6">
            <Button variant="ghost" asChild>
              <Link to="/" className={location.pathname === '/' ? 'text-primary font-medium' : ''}>
                الرئيسية
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/projects" className={location.pathname === '/projects' ? 'text-primary font-medium' : ''}>
                المشاريع
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/tools" className={location.pathname === '/tools' ? 'text-primary font-medium' : ''}>
                أدوات التطوير
              </Link>
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hidden md:flex">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">تبديل الوضع المظلم</span>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" size="icon">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatarUrl || ''} alt={profile?.username || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {profile?.username ? getInitials(profile.username) : 'غير متاح'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.username || 'غير متاح'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>الملف الشخصي</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/projects" className="cursor-pointer">
                    <Code className="mr-2 h-4 w-4" />
                    <span>المشاريع</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>الإعدادات</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/auth">تسجيل الدخول</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
