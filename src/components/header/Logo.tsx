
import React from 'react';
import { Code2 } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <Code2 className="w-6 h-6 text-editor-accent" />
      <h1 className="text-xl font-semibold tracking-tight">Ako.js</h1>
    </div>
  );
};

export default Logo;
