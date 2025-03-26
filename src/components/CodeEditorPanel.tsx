
import React from 'react';
import CodeEditor from '@/components/CodeEditor';
import EditorControls from '@/components/EditorControls';
import { FileType } from '@/components/FileExplorer/FileExplorer';
import { CodesandboxIcon, Package, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface CodeEditorPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedFile: FileType | null;
  fileContent: string;
  setEditorContent: (content: string) => void;
  onRun: () => void;
  onReset: () => void;
  onAddFile: () => void;
  onSaveAll: () => void;
  onExport: () => void;
  getEditorContent: () => string;
}

const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  activeTab,
  setActiveTab,
  selectedFile,
  fileContent,
  setEditorContent,
  onRun,
  onReset,
  onAddFile,
  onSaveAll,
  onExport,
  getEditorContent
}) => {
  const isMobile = useIsMobile();
  
  // Language label - for display purposes
  const getLanguageLabel = (language: string): string => {
    switch (language.toLowerCase()) {
      case 'js': return 'JavaScript';
      case 'ts': return 'TypeScript';
      case 'py': return 'Python';
      case 'cpp': return 'C++';
      case 'cs': return 'C#';
      default: return language.charAt(0).toUpperCase() + language.slice(1);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-card">
      <div className="editor-header flex items-center justify-between py-1 px-2 bg-background border-b border-border">
        <div className="flex items-center">
          <CodesandboxIcon className="w-5 h-5 mr-2 text-primary" />
          <span className="font-medium text-sm">
            {selectedFile ? (
              <span className="flex items-center">
                <span className="text-muted-foreground">{selectedFile.name}</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-primary">{getLanguageLabel(selectedFile.language || '')}</span>
              </span>
            ) : (
              <span>Ako.js Editor</span>
            )}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isMobile && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={onAddFile}
                    >
                      <Package className="w-4 h-4 mr-1" />
                      <span className="text-xs">Packages</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Import Libraries & Packages</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={onExport}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      <span className="text-xs">Share</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share Your Code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </div>
      
      <EditorControls 
        onRun={onRun} 
        onReset={onReset}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddFile={onAddFile}
        onSaveAll={onSaveAll}
        onExport={onExport}
      />
      
      <div className="relative flex-grow overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 p-4">
          <CodeEditor 
            value={getEditorContent()} 
            onChange={setEditorContent} 
            language={activeTab} 
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPanel;
