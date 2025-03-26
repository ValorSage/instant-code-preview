
import React from 'react';
import CodeEditor from '@/components/CodeEditor';
import EditorControls from '@/components/EditorControls';
import { FileType } from '@/components/FileExplorer/FileExplorer';

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
  return (
    <div className="flex flex-col h-full bg-card">
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
