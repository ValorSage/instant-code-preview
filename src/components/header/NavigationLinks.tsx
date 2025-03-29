
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationLinksProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({ isMobile = false, onItemClick }) => {
  const location = useLocation();
  
  const links = [
    { href: '/', label: 'الرئيسية' },
    { href: '/projects', label: 'المشاريع' },
    { href: '/tools', label: 'أدوات التطوير' },
    { href: '/simulation', label: 'المحاكاة' },
  ];
  
  return (
    <nav className={cn(
      'flex',
      isMobile ? 'flex-col space-y-3' : 'space-x-4 rtl:space-x-reverse'
    )}>
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-md transition-colors',
            location.pathname === link.href
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent',
            isMobile && 'w-full'
          )}
          onClick={onItemClick}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavigationLinks;
