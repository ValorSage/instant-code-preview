
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FileExplorer from '@/components/FileExplorer/FileExplorer';
import { FileType } from '@/components/FileExplorer/FileExplorer';
import EditorControls from '@/components/EditorControls';
import CodeEditor from '@/components/CodeEditor';
import Preview from '@/components/Preview';

interface MobileLayoutProps {
  showFileExplorer: boolean;
  setShowFileExplorer: (show: boolean) => void;
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
  handleSaveAll: () => void;
  handleExportProject: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  showFileExplorer,
  setShowFileExplorer,
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
  handleSaveAll,
  handleExportProject
}) => {
  return (
    <div className="flex flex-col h-full space-y-4 animate-fade-in">
      {/* File Explorer Dialog for Mobile */}
      <Dialog open={showFileExplorer} onOpenChange={setShowFileExplorer}>
        <DialogContent className="sm:max-w-[90%] h-[80vh]">
          <DialogHeader>
            <DialogTitle>File Explorer</DialogTitle>
          </DialogHeader>
          <div className="h-[calc(100%-60px)]">
            <FileExplorer 
              files={files}
              onFileSelect={(file) => {
                handleFileSelect(file);
                setShowFileExplorer(false);
              }}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
              onFileRename={handleFileRename}
              selectedFileId={selectedFile?.id || null}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="flex flex-col h-1/2 bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        <EditorControls 
          onRun={handleRun} 
          onReset={handleReset}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onAddFile={() => setShowFileExplorer(true)}
          onSaveAll={handleSaveAll}
          onExport={handleExportProject}
        />
        
        <div className="relative flex-grow overflow-hidden transition-all duration-300">
          <div className="absolute inset-0 p-2">
            <CodeEditor 
              value={getEditorContent()} 
              onChange={setEditorContent} 
              language={activeTab} 
            />
          </div>
        </div>
      </div>
      
      <div className="h-1/2">
        <Preview 
          html={html} 
          css={css} 
          js={getFinalJs()} 
          shouldRun={shouldRun}
          onRunComplete={onRunComplete}
        />
      </div>
    </div>
  );
};

export default MobileLayout;
