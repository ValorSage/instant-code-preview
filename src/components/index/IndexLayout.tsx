
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileLayout from '@/components/MobileLayout';
import DesktopLayout from '@/components/DesktopLayout';
import { FileType } from '@/components/FileExplorer/FileExplorer';

interface IndexLayoutProps {
  showFileExplorer: boolean;
  setShowFileExplorer: React.Dispatch<React.SetStateAction<boolean>>;
  files: FileType[];
  handleFileSelect: (file: FileType) => void;
  handleFileCreate: (name: string, type: 'file' | 'folder', parent?: string, language?: string) => void;
  handleFileDelete: (fileId: string) => void;
  handleFileRename: (fileId: string, newName: string) => void;
  handleFileMove: (fileId: string, targetFolderId: string | null) => void;
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
  toggleFileExplorer: () => void;
  fileContent: string;
  showRealTimePanel: boolean;
}

const IndexLayout: React.FC<IndexLayoutProps> = ({
  showFileExplorer,
  setShowFileExplorer,
  files,
  handleFileSelect,
  handleFileCreate,
  handleFileDelete,
  handleFileRename,
  handleFileMove,
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
  handleExportProject,
  toggleFileExplorer,
  fileContent,
  showRealTimePanel
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-1 gap-4">
      {isMobile ? (
        <MobileLayout 
          showFileExplorer={showFileExplorer}
          setShowFileExplorer={setShowFileExplorer}
          files={files}
          handleFileSelect={handleFileSelect}
          handleFileCreate={handleFileCreate}
          handleFileDelete={handleFileDelete}
          handleFileRename={handleFileRename}
          handleFileMove={handleFileMove}
          selectedFile={selectedFile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          getEditorContent={getEditorContent}
          setEditorContent={setEditorContent}
          html={html}
          css={css}
          getFinalJs={getFinalJs}
          shouldRun={shouldRun}
          onRunComplete={onRunComplete}
          handleRun={handleRun}
          handleReset={handleReset}
          handleSaveAll={handleSaveAll}
          handleExportProject={handleExportProject}
        />
      ) : (
        <DesktopLayout 
          showFileExplorer={showFileExplorer}
          files={files}
          handleFileSelect={handleFileSelect}
          handleFileCreate={handleFileCreate}
          handleFileDelete={handleFileDelete}
          handleFileRename={handleFileRename}
          handleFileMove={handleFileMove}
          selectedFile={selectedFile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          getEditorContent={getEditorContent}
          setEditorContent={setEditorContent}
          html={html}
          css={css}
          getFinalJs={getFinalJs}
          shouldRun={shouldRun}
          onRunComplete={onRunComplete}
          handleRun={handleRun}
          handleReset={handleReset}
          toggleFileExplorer={toggleFileExplorer}
          handleSaveAll={handleSaveAll}
          handleExportProject={handleExportProject}
          fileContent={fileContent}
        />
      )}
    </div>
  );
};

export default IndexLayout;
