import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu, Play, Save, Upload, RefreshCw } from "lucide-react";
import FileExplorer, { FileType } from '@/components/FileExplorer/FileExplorer';
import CodeEditorPanel from '@/components/CodeEditorPanel';
import Preview from '@/components/Preview';

interface MobileLayoutProps {
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
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
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
}) => {
  const [activeView, setActiveView] = useState<'code' | 'preview'>('code');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Function to adapt the new handleFileCreate signature to what FileExplorer expects
  const handleFileCreateAdapter = (file: FileType, parentId?: string) => {
    // Call the new function signature with appropriate parameters
    handleFileCreate(file.name, file.type, parentId, file.language);
  };
  
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between p-2 bg-card border-b border-border">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[80vh]">
            <div className="p-4 h-full overflow-y-auto">
              <FileExplorer 
                files={files}
                onFileSelect={(file) => {
                  handleFileSelect(file);
                  setIsDrawerOpen(false);
                }}
                onFileCreate={handleFileCreateAdapter}
                onFileDelete={handleFileDelete}
                onFileRename={handleFileRename}
                onFileMove={handleFileMove}
                selectedFileId={selectedFile?.id || null}
              />
            </div>
          </DrawerContent>
        </Drawer>
        
        <Tabs defaultValue="code" className="w-full">
          <TabsList className="justify-center">
            <TabsTrigger value="code" onClick={() => setActiveView('code')}>Code</TabsTrigger>
            <TabsTrigger value="preview" onClick={() => setActiveView('preview')}>Preview</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Main content panel */}
      <div className="flex-grow overflow-hidden">
        {activeView === 'code' ? (
          <CodeEditorPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedFile={selectedFile}
            fileContent={selectedFile?.content || ''}
            setEditorContent={setEditorContent}
            onRun={handleRun}
            onReset={handleReset}
            onAddFile={() => setIsDrawerOpen(true)}
            onSaveAll={handleSaveAll}
            onExport={handleExportProject}
            getEditorContent={getEditorContent}
          />
        ) : (
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
        )}
      </div>
      
      {/* Bottom action bar */}
      <div className="flex items-center justify-around p-2 bg-card border-t border-border">
        <Button variant="outline" size="icon" onClick={handleRun}>
          <Play className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleSaveAll}>
          <Save className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleExportProject}>
          <Upload className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset}>
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MobileLayout;
