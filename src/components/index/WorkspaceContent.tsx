
import React from 'react';
import IndexLayout from '@/components/index/IndexLayout';
import { FileType } from '@/components/FileExplorer/FileExplorer';

interface WorkspaceContentProps {
  showFileExplorer: boolean;
  setShowFileExplorer: React.Dispatch<React.SetStateAction<boolean>>;
  files: FileType[];
  handleFileSelect: (file: FileType) => void;
  handleFileCreate: (name: string, type: 'file' | 'folder', parent?: string, language?: string) => void;
  handleFileDelete: (id: string) => void;
  handleFileRename: (id: string, newName: string) => void;
  handleFileMove: (id: string, newParentId: string | null) => void;
  selectedFile: FileType | null;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
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

const WorkspaceContent: React.FC<WorkspaceContentProps> = (props) => {
  return (
    <div className="flex-1">
      <IndexLayout
        showFileExplorer={props.showFileExplorer}
        setShowFileExplorer={props.setShowFileExplorer}
        files={props.files}
        handleFileSelect={props.handleFileSelect}
        handleFileCreate={props.handleFileCreate}
        handleFileDelete={props.handleFileDelete}
        handleFileRename={props.handleFileRename}
        handleFileMove={props.handleFileMove}
        selectedFile={props.selectedFile}
        activeTab={props.activeTab}
        setActiveTab={props.setActiveTab}
        getEditorContent={props.getEditorContent}
        setEditorContent={props.setEditorContent}
        html={props.html}
        css={props.css}
        getFinalJs={props.getFinalJs}
        shouldRun={props.shouldRun}
        onRunComplete={props.onRunComplete}
        handleRun={props.handleRun}
        handleReset={props.handleReset}
        handleSaveAll={props.handleSaveAll}
        handleExportProject={props.handleExportProject}
        toggleFileExplorer={props.toggleFileExplorer}
        fileContent={props.fileContent}
        showRealTimePanel={props.showRealTimePanel}
      />
    </div>
  );
};

export default WorkspaceContent;
