
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlignLeft, AlignRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DirectionToggleProps {
  direction: 'ltr' | 'rtl';
  onChange: (direction: 'ltr' | 'rtl') => void;
}

const DirectionToggle: React.FC<DirectionToggleProps> = ({ direction, onChange }) => {
  const toggleDirection = () => {
    const newDirection = direction === 'rtl' ? 'ltr' : 'rtl';
    onChange(newDirection);
    
    // تحديث اتجاه الوثيقة
    document.documentElement.dir = newDirection;
    localStorage.setItem('akojs-direction', newDirection);
    
    // تحديث اللغة (اختياري)
    const newLang = newDirection === 'rtl' ? 'ar' : 'en';
    document.documentElement.lang = newLang;
    localStorage.setItem('akojs-lang', newLang);
    
    toast({
      title: direction === 'rtl' ? "Left-to-Right Enabled" : "تم تفعيل اليمين لليسار",
      description: direction === 'rtl' ? "Interface direction changed to LTR" : "تم تغيير اتجاه الواجهة إلى RTL",
      duration: 2000,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDirection}
      title={direction === 'rtl' ? "تغيير إلى اليسار لليمين" : "تغيير إلى اليمين لليسار"}
    >
      {direction === 'rtl' ? <AlignLeft className="h-5 w-5" /> : <AlignRight className="h-5 w-5" />}
    </Button>
  );
};

export default DirectionToggle;
