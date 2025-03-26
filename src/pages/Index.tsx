
import React from 'react';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEditor } from '@/hooks/use-editor';
import MobileLayout from '@/components/MobileLayout';
import DesktopLayout from '@/components/DesktopLayout';
import { 
  addFileToTree,
  deleteFileFromTree,
  renameFile,
  findFileById,
  saveFilesToLocalStorage
} from '@/utils/fileUtils';
import { toast } from '@/hooks/use-toast';
import { FileType } from '@/components/FileExplorer/FileExplorer';

const Index = () => {
  const isMobile = useIsMobile();
  const editor = useEditor();
  
  // Handle file creation
  const handleFileCreate = (file: FileType, parentId?: string) => {
    const updatedFiles = addFileToTree(editor.files, file, parentId);
    editor.setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    
    // Select the newly created file if it's a file (not a folder)
    if (file.type === 'file') {
      editor.setSelectedFile(file);
    }
    
    toast({
      title: `${file.type === 'file' ? 'File' : 'Folder'} created`,
      description: `${file.name} has been created successfully.`,
      duration: 2000,
    });
  };

  // Handle file deletion
  const handleFileDelete = (fileId: string) => {
    // If the deleted file is currently selected, clear selection
    if (editor.selectedFile && editor.selectedFile.id === fileId) {
      editor.setSelectedFile(null);
    }
    
    const updatedFiles = deleteFileFromTree(editor.files, fileId);
    editor.setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    
    toast({
      title: "Deleted",
      description: "The file or folder has been deleted.",
      duration: 2000,
    });
  };

  // Handle file rename
  const handleFileRename = (fileId: string, newName: string) => {
    const updatedFiles = renameFile(editor.files, fileId, newName);
    editor.setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    
    // Update selected file if it was renamed
    if (editor.selectedFile && editor.selectedFile.id === fileId) {
      const updatedFile = findFileById(updatedFiles, fileId);
      if (updatedFile) {
        editor.setSelectedFile(updatedFile);
      }
    }
    
    toast({
      title: "Renamed",
      description: `Renamed to ${newName} successfully.`,
      duration: 2000,
    });
  };

  return (
    <div className={`min-h-screen flex flex-col bg-background transition-colors duration-300`}>
      <Header 
        html={editor.html} 
        css={editor.css} 
        js={editor.js}
        script={editor.script}
        isDarkMode={editor.isDarkMode}
        toggleDarkMode={editor.toggleDarkMode}
        onSave={editor.handleSave}
      />
      
      <main className="flex flex-col flex-grow p-2 md:p-6 space-y-4">
        {isMobile ? (
          // Mobile layout
          <MobileLayout 
            showFileExplorer={editor.showFileExplorer}
            setShowFileExplorer={editor.setShowFileExplorer}
            files={editor.files}
            handleFileSelect={editor.handleFileSelect}
            handleFileCreate={handleFileCreate}
            handleFileDelete={handleFileDelete}
            handleFileRename={handleFileRename}
            selectedFile={editor.selectedFile}
            activeTab={editor.activeTab}
            setActiveTab={editor.setActiveTab}
            getEditorContent={editor.getEditorContent}
            setEditorContent={editor.setEditorContent}
            html={editor.html}
            css={editor.css}
            getFinalJs={editor.getFinalJs}
            shouldRun={editor.shouldRun}
            onRunComplete={editor.handleRunComplete}
            handleRun={editor.handleRun}
            handleReset={editor.handleReset}
            handleSaveAll={editor.handleSaveAll}
            handleExportProject={editor.handleExportProject}
          />
        ) : (
          // Desktop layout
          <DesktopLayout 
            showFileExplorer={editor.showFileExplorer}
            files={editor.files}
            handleFileSelect={editor.handleFileSelect}
            handleFileCreate={handleFileCreate}
            handleFileDelete={handleFileDelete}
            handleFileRename={handleFileRename}
            selectedFile={editor.selectedFile}
            activeTab={editor.activeTab}
            setActiveTab={editor.setActiveTab}
            getEditorContent={editor.getEditorContent}
            setEditorContent={editor.setEditorContent}
            html={editor.html}
            css={editor.css}
            getFinalJs={editor.getFinalJs}
            shouldRun={editor.shouldRun}
            onRunComplete={editor.handleRunComplete}
            handleRun={editor.handleRun}
            handleReset={editor.handleReset}
            toggleFileExplorer={editor.toggleFileExplorer}
            handleSaveAll={editor.handleSaveAll}
            handleExportProject={editor.handleExportProject}
            fileContent={editor.fileContent}
          />
        )}
      </main>
      
      <footer className="py-3 text-center text-sm text-muted-foreground border-t border-border">
        <p>Ako.js - A modern web-based code editor inspired by CodePen</p>
      </footer>
    </div>
  );
};

export default Index;
