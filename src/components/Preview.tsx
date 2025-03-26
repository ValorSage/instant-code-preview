import React, { useRef, useEffect, useState } from 'react';
import { runCode, runCodeWithWasm } from '@/utils/editorUtils';
import { Button } from '@/components/ui/button';
import { RefreshCw, Maximize2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PreviewProps {
  html: string;
  css: string;
  js: string;
  shouldRun: boolean;
  onRunComplete: () => void;
  activeLanguage?: string;
  activeContent?: string;
  autoRefresh?: boolean;
}

const Preview: React.FC<PreviewProps> = ({
  html,
  css,
  js,
  shouldRun,
  onRunComplete,
  activeLanguage,
  activeContent,
  autoRefresh = false
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastRunContent, setLastRunContent] = useState('');
  const [prevContent, setPrevContent] = useState('');
  const [contentChanged, setContentChanged] = useState(false);
  
  const isNonExecutableLanguage = (lang?: string): boolean => {
    if (!lang) return false;
    return ['java', 'cpp', 'csharp', 'swift', 'kotlin'].includes(lang.toLowerCase());
  };
  
  const runPreview = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    setContentChanged(false);
    
    if (activeLanguage && 
        !['html', 'css', 'js', 'javascript'].includes(activeLanguage.toLowerCase()) && 
        activeContent) {
        
      runCodeWithWasm(activeContent, activeLanguage, iframe);
      setLastRunContent(activeContent || '');
      
      toast({
        title: `Running ${activeLanguage} code`,
        description: "Code is being executed in the preview",
        duration: 1500,
      });
    } else {
      runCode(html, css, js, iframe);
      
      toast({
        title: "Preview updated",
        description: "The preview has been refreshed",
        duration: 1500,
      });
    }
  };
  
  useEffect(() => {
    if (activeContent && prevContent !== activeContent) {
      setContentChanged(true);
      setPrevContent(activeContent);
      
      if (autoRefresh && !isNonExecutableLanguage(activeLanguage)) {
        runPreview();
      }
    }
  }, [activeContent, prevContent, autoRefresh, activeLanguage]);
  
  useEffect(() => {
    if (shouldRun) {
      runPreview();
      onRunComplete();
    }
  }, [shouldRun, html, css, js, activeLanguage, activeContent, onRunComplete]);
  
  const toggleFullscreen = () => {
    const previewContainer = document.querySelector('.preview-container');
    if (!previewContainer) return;
    
    if (!isFullscreen) {
      previewContainer.classList.add('fullscreen-preview');
      setIsFullscreen(true);
    } else {
      previewContainer.classList.remove('fullscreen-preview');
      setIsFullscreen(false);
    }
  };

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
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={runPreview}
            disabled={!contentChanged && !shouldRun}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${contentChanged ? 'text-primary' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={toggleFullscreen}
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      <div className="iframe-container h-[calc(100%-33px)] w-full bg-white dark:bg-gray-900">
        <iframe
          ref={iframeRef}
          title="Code Preview"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-modals allow-same-origin allow-popups"
        ></iframe>
      </div>
      
      <style jsx global>{`
        .fullscreen-preview {
          position: fixed !important;
          top: 0;
          left: 0;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 9999;
          border-radius: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default Preview;
