
import React from 'react';
import { Badge } from '@/components/ui/badge';

const IndexFooter: React.FC = () => {
  return (
    <footer className="py-3 text-center text-sm text-muted-foreground border-t border-border">
      <p>Ako.js - منصة تحرير الكود المباشر بتجربة مستخدم سلسة</p>
      <div className="flex items-center justify-center mt-1 space-x-2 rtl:space-x-reverse">
        <Badge variant="outline" className="text-xs h-5">v1.0</Badge>
        <Badge variant="outline" className="text-xs h-5">Arabic UI</Badge>
        <Badge variant="outline" className="text-xs h-5">Multi-language</Badge>
      </div>
    </footer>
  );
};

export default IndexFooter;
