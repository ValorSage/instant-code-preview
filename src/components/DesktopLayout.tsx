
import React, { useState, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import FileExplorer from '@/components/FileExplorer/FileExplorer';
import { FileType } from '@/components/FileExplorer/FileExplorer';
import Preview from '@/components/Preview';
import CodeEditorPanel from '@/components/CodeEditorPanel';
import { Button } from '@/components/ui/button';
import { 
  Columns, 
  MonitorPlay, 
  SplitSquareVertical, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

interface DesktopLayoutProps {
  showFileExplorer: boolean;
  files: FileType[];
  handleFileSelect: (file: FileType) => void;
  handleFileCreate: (file: FileType, parentId?: string) => void;
  handleFileDelete: (fileId: string) => void;
  handleFileRename: (fileId: string, newName: string) => void;
  selectedFile: FileType | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  getEditorContent: () => string;
  setEditorContent: (content: string) => void;
  html: string;
  css: string;
  getFinalJs: () => string;
  shouldRun: boolean;
  onRunComplete: () => void;
  handleRun: () => void;
  handleReset: () => void;
  toggleFileExplorer: () => void;
  handleSaveAll: () => void;
  handleExportProject: () => void;
  fileContent: string;
}

type ViewMode = 'split' | 'editor' | 'preview';

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  showFileExplorer,
  files,
  handleFileSelect,
  handleFileCreate,
  handleFileDelete,
  handleFileRename,
  selectedFile,
  activeTab,
  setActiveTab,
  getEditorContent,
  setEditorContent,
  html,
  css,
  getFinalJs,
  shouldRun,
  onRunComplete,
  handleRun,
  handleReset,
  toggleFileExplorer,
  handleSaveAll,
  handleExportProject,
  fileContent
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [editorPanelSize, setEditorPanelSize] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Register keyboard shortcuts for view mode changes
  useKeyboardShortcuts({
    onRun: handleRun,
    onSave: handleSaveAll,
    onToggleFileExplorer: toggleFileExplorer,
    onShowHelp: () => {
      toast({
        title: "Keyboard Shortcuts",
        description: "Ctrl+1: Editor view | Ctrl+2: Split view | Ctrl+3: Preview view | Ctrl+Enter: Run | Ctrl+S: Save",
        duration: 5000,
      });
    }
  });
  
  // Handle keyboard events for changing view modes
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if input elements are focused (don't trigger shortcuts)
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable
      ) {
        return;
      }
      
      // Ctrl+1 or Cmd+1 to switch to editor mode
      if ((event.ctrlKey || event.metaKey) && event.key === '1') {
        event.preventDefault();
        setViewMode('editor');
        return;
      }
      
      // Ctrl+2 or Cmd+2 to switch to split mode
      if ((event.ctrlKey || event.metaKey) && event.key === '2') {
        event.preventDefault();
        setViewMode('split');
        return;
      }
      
      // Ctrl+3 or Cmd+3 to switch to preview mode
      if ((event.ctrlKey || event.metaKey) && event.key === '3') {
        event.preventDefault();
        setViewMode('preview');
        return;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Toggle expanded view
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    
    toast({
      title: !isExpanded ? "Expanded View" : "Normal View",
      description: !isExpanded ? "Workspace expanded to full screen" : "Workspace returned to normal view",
      duration: 2000,
    });
  };
  
  return (
    <div className={`flex flex-col h-full transition-all duration-300 ${isExpanded ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <div className="flex justify-between p-1 bg-card border-b border-border shadow-sm">
        <div className="flex items-center">
          {isExpanded && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleFileExplorer}
              className="h-7 mr-2"
            >
              {showFileExplorer ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span className="text-xs ml-1">{showFileExplorer ? "Hide Files" : "Show Files"}</span>
            </Button>
          )}
        </div>
        
        <div className="flex space-x-1">
          <Button 
            variant={viewMode === 'editor' ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setViewMode('editor')}
            className="h-7 px-2"
          >
            <Columns className="h-4 w-4 mr-1" />
            <span className="text-xs">Editor</span>
          </Button>
          
          <Button 
            variant={viewMode === 'split' ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setViewMode('split')}
            className="h-7 px-2"
          >
            <SplitSquareVertical className="h-4 w-4 mr-1" />
            <span className="text-xs">Split</span>
          </Button>
          
          <Button 
            variant={viewMode === 'preview' ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setViewMode('preview')}
            className="h-7 px-2"
          >
            <MonitorPlay className="h-4 w-4 mr-1" />
            <span className="text-xs">Preview</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleExpanded}
            className="h-7 px-2 ml-2"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <ResizablePanelGroup 
        direction="horizontal" 
        className="flex-grow rounded-lg border border-border overflow-hidden shadow-sm animate-fade-in"
      >
        {/* File Explorer Panel (conditionally shown) */}
        {showFileExplorer && (
          <>
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <FileExplorer 
                files={files}
                onFileSelect={handleFileSelect}
                onFileCreate={handleFileCreate}
                onFileDelete={handleFileDelete}
                onFileRename={handleFileRename}
                selectedFileId={selectedFile?.id || null}
              />
            </ResizablePanel>
            
            <ResizableHandle />
          </>
        )}
        
        {/* Code Editor Panel */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <ResizablePanel 
            defaultSize={viewMode === 'split' ? editorPanelSize : 100} 
            minSize={30}
            className={viewMode === 'editor' ? 'flex-grow' : ''}
            onResize={(size) => {
              if (viewMode === 'split') {
                setEditorPanelSize(size);
              }
            }}
          >
            <CodeEditorPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedFile={selectedFile}
              fileContent={fileContent}
              setEditorContent={setEditorContent}
              onRun={handleRun}
              onReset={handleReset}
              onAddFile={toggleFileExplorer}
              onSaveAll={handleSaveAll}
              onExport={handleExportProject}
              getEditorContent={getEditorContent}
            />
          </ResizablePanel>
        )}
        
        {viewMode === 'split' && <ResizableHandle withHandle />}
        
        {/* Preview Panel */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <ResizablePanel 
            defaultSize={viewMode === 'split' ? 100 - editorPanelSize : 100} 
            minSize={30}
            className={viewMode === 'preview' ? 'flex-grow' : ''}
          >
            <div className="h-full">
              <Preview 
                html={html} 
                css={css} 
                js={getFinalJs()} 
                shouldRun={shouldRun}
                onRunComplete={onRunComplete}
                activeLanguage={selectedFile?.language || activeTab}
                activeContent={selectedFile?.content || getEditorContent()}
                autoRefresh={true}
              />
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default DesktopLayout;
