import React, { useRef, useEffect } from 'react';
import { runCode, runCodeWithWasm } from '@/utils/editorUtils';

interface PreviewProps {
  html: string;
  css: string;
  js: string;
  shouldRun: boolean;
  onRunComplete: () => void;
  activeLanguage?: string;
  activeContent?: string;
}

const Preview: React.FC<PreviewProps> = ({
  html,
  css,
  js,
  shouldRun,
  onRunComplete,
  activeLanguage,
  activeContent
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    if (shouldRun) {
      const iframe = iframeRef.current;
      
      // If we have an active language that's not HTML/CSS/JS, run that
      if (activeLanguage && 
          !['html', 'css', 'js', 'javascript'].includes(activeLanguage.toLowerCase()) && 
          activeContent) {
        runCodeWithWasm(activeContent, activeLanguage, iframe);
      } else {
        // Otherwise run the standard HTML/CSS/JS
        runCode(html, css, js, iframe);
      }
      
      onRunComplete();
    }
  }, [shouldRun, html, css, js, activeLanguage, activeContent, onRunComplete]);

  return (
    <div className="preview-container h-full w-full overflow-hidden animate-scale-in rounded-lg border border-border neomorphism">
      <div className="flex items-center justify-between p-2 bg-muted border-b border-border">
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          {activeLanguage && !['html', 'css', 'js', 'javascript'].includes(activeLanguage.toLowerCase())
            ? `Preview (${activeLanguage})`
            : 'Preview'}
        </div>
        <div className="w-12"></div> {/* Spacer for alignment */}
      </div>
      
      <div className="iframe-container h-[calc(100%-33px)] w-full bg-white dark:bg-gray-900">
        <iframe
          ref={iframeRef}
          title="Code Preview"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-modals allow-same-origin allow-popups"
        ></iframe>
      </div>
    </div>
  );
};

export default Preview;
