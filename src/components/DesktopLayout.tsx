
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import FileExplorer from '@/components/FileExplorer/FileExplorer';
import { FileType } from '@/components/FileExplorer/FileExplorer';
import Preview from '@/components/Preview';
import CodeEditorPanel from '@/components/CodeEditorPanel';

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
  return (
    <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border border-border overflow-hidden shadow-sm animate-fade-in">
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
      <ResizablePanel defaultSize={50} minSize={30}>
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
      
      <ResizableHandle withHandle />
      
      {/* Preview Panel */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="h-full">
          <Preview 
            html={html} 
            css={css} 
            js={getFinalJs()} 
            shouldRun={shouldRun}
            onRunComplete={onRunComplete}
            activeLanguage={selectedFile?.language || activeTab}
            activeContent={selectedFile?.content || getEditorContent()}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DesktopLayout;
