
import React, { useState } from 'react';
import { Code2 } from 'lucide-react';

const Logo = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="flex items-center space-x-2 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = '/'}
    >
      <div className="relative">
        <Code2 
          className={`w-6 h-6 text-editor-accent transition-all duration-300 ${
            isHovered ? 'rotate-12 scale-110' : ''
          }`} 
        />
        {isHovered && (
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>
      <h1 className="text-xl font-semibold tracking-tight group-hover:text-editor-accent transition-colors duration-300">
        Ako.js
        <span className="ml-1 text-xs font-normal text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          v1.0
        </span>
      </h1>
    </div>
  );
};

export default Logo;
