
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import FileExplorer from '@/components/FileExplorer/FileExplorer';
import { FileType } from '@/components/FileExplorer/FileExplorer';
import Preview from '@/components/Preview';
import CodeEditorPanel from '@/components/CodeEditorPanel';
import { Button } from '@/components/ui/button';
import { Columns, MonitorPlay, SplitSquareVertical } from 'lucide-react';

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

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end p-1 bg-card border-b border-border">
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
            defaultSize={viewMode === 'split' ? 50 : 100} 
            minSize={30}
            className={viewMode === 'editor' ? 'flex-grow' : ''}
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
            defaultSize={viewMode === 'split' ? 50 : 100} 
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
                autoRefresh={true} // New prop for auto-refresh
              />
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default DesktopLayout;
