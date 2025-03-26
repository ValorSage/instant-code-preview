import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import Preview from '@/components/Preview';
import EditorControls from '@/components/EditorControls';
import FileExplorer from '@/components/FileExplorer/FileExplorer';
import { FileType } from '@/components/FileExplorer/FileExplorer';
import { 
  defaultHtml, 
  defaultCss, 
  defaultJs, 
  loadFromLocalStorage, 
  saveToLocalStorage 
} from '@/utils/editorUtils';
import {
  loadFilesFromLocalStorage,
  saveFilesToLocalStorage,
  addFileToTree,
  deleteFileFromTree,
  renameFile,
  updateFileContent,
  findFileById,
  createNewFile,
  createNewFolder,
  getDefaultFileContent
} from '@/utils/fileUtils';
import { toast } from '@/components/ui/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Index = () => {
  // State for editor content
  const [html, setHtml] = useState(defaultHtml);
  const [css, setCss] = useState(defaultCss);
  const [js, setJs] = useState(defaultJs);
  const [script, setScript] = useState('// Add your custom script here');
  const [activeTab, setActiveTab] = useState('html');
  const [shouldRun, setShouldRun] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [files, setFiles] = useState<FileType[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [fileContent, setFileContent] = useState('');
  const isMobile = useIsMobile();
  
  // Load saved code and files on initial render
  useEffect(() => {
    // Load default editor content
    const savedCode = loadFromLocalStorage();
    if (savedCode) {
      setHtml(savedCode.html);
      setCss(savedCode.css);
      setJs(savedCode.js);
      setScript(savedCode.script || '// Add your custom script here');
    }
    
    // Load files from localStorage
    const savedFiles = loadFilesFromLocalStorage();
    setFiles(savedFiles);
    
    // Run the saved code
    setTimeout(() => {
      setShouldRun(true);
    }, 500);
    
    // Check user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);
  
  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Update file content when a file is selected
  useEffect(() => {
    if (selectedFile && selectedFile.type === 'file') {
      setFileContent(selectedFile.content || '');
      // Set active tab based on file language
      if (selectedFile.language) {
        setActiveTab(selectedFile.language);
      }
    }
  }, [selectedFile]);

  // Handle file selection
  const handleFileSelect = (file: FileType) => {
    if (file.type === 'file') {
      setSelectedFile(file);
    }
  };

  // Handle file creation
  const handleFileCreate = (file: FileType, parentId?: string) => {
    const updatedFiles = addFileToTree(files, file, parentId);
    setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    
    // Select the newly created file if it's a file (not a folder)
    if (file.type === 'file') {
      setSelectedFile(file);
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
    if (selectedFile && selectedFile.id === fileId) {
      setSelectedFile(null);
    }
    
    const updatedFiles = deleteFileFromTree(files, fileId);
    setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    
    toast({
      title: "Deleted",
      description: "The file or folder has been deleted.",
      duration: 2000,
    });
  };

  // Handle file rename
  const handleFileRename = (fileId: string, newName: string) => {
    const updatedFiles = renameFile(files, fileId, newName);
    setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    
    // Update selected file if it was renamed
    if (selectedFile && selectedFile.id === fileId) {
      const updatedFile = findFileById(updatedFiles, fileId);
      if (updatedFile) {
        setSelectedFile(updatedFile);
      }
    }
    
    toast({
      title: "Renamed",
      description: `Renamed to ${newName} successfully.`,
      duration: 2000,
    });
  };

  // Handle file content update
  const handleFileContentUpdate = useCallback((content: string) => {
    if (selectedFile && selectedFile.type === 'file') {
      // Update the file content in the files tree
      const updatedFiles = updateFileContent(files, selectedFile.id, content);
      setFiles(updatedFiles);
      saveFilesToLocalStorage(updatedFiles);
      
      // Update the selected file reference
      const updatedFile = findFileById(updatedFiles, selectedFile.id);
      if (updatedFile) {
        setSelectedFile(updatedFile);
      }
      
      // Also update the file content state
      setFileContent(content);
    }
  }, [files, selectedFile]);

  const handleRun = () => {
    // If a file is selected, we need to save its content first
    if (selectedFile && selectedFile.type === 'file') {
      handleFileContentUpdate(fileContent);
    }
    
    // Run the code in the main editor (HTML, CSS, JS)
    setShouldRun(true);
    
    toast({
      title: "Code executed",
      description: "Your code is now running in the preview",
      duration: 2000,
    });
  };

  const handleRunComplete = () => {
    setShouldRun(false);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset? This will clear your current code.')) {
      setHtml(defaultHtml);
      setCss(defaultCss);
      setJs(defaultJs);
      setScript('// Add your custom script here');
      setShouldRun(true);
      toast({
        title: "Code reset",
        description: "Editor has been reset to default code",
      });
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSave = () => {
    // Save main editor content
    saveToLocalStorage(html, css, js, script);
    
    // If a file is selected, save its content
    if (selectedFile && selectedFile.type === 'file') {
      handleFileContentUpdate(fileContent);
    }
    
    // Save all files
    saveFilesToLocalStorage(files);
    
    toast({
      title: "Project saved",
      description: "Your code has been saved to local storage",
    });
  };

  const handleSaveAll = () => {
    // Save all files
    saveFilesToLocalStorage(files);
    
    // Save main editor content
    saveToLocalStorage(html, css, js, script);
    
    toast({
      title: "All files saved",
      description: "All project files have been saved",
      duration: 2000,
    });
  };

  const handleExportProject = () => {
    // TODO: Implement project export functionality
    toast({
      title: "Export not implemented",
      description: "This feature will be available in a future update",
      duration: 2000,
    });
  };

  const toggleFileExplorer = () => {
    setShowFileExplorer(!showFileExplorer);
  };

  const getFinalJs = () => {
    // If script tab is active, combine js and script
    return `${js}\n\n// Custom script\n${script}`;
  };

  // Get content for the editor based on the active tab
  const getEditorContent = () => {
    // If a file is selected, show its content
    if (selectedFile && selectedFile.type === 'file') {
      return fileContent;
    }
    
    // Otherwise show the main editor content based on the active tab
    switch (activeTab) {
      case 'html':
        return html;
      case 'css':
        return css;
      case 'js':
      case 'javascript':
        return js;
      case 'script':
        return script;
      default:
        // For other languages, show a default template
        return getDefaultFileContent(activeTab);
    }
  };

  // Set content for the editor based on the active tab
  const setEditorContent = (content: string) => {
    // If a file is selected, update its content
    if (selectedFile && selectedFile.type === 'file') {
      setFileContent(content);
      return;
    }
    
    // Otherwise update the main editor content based on the active tab
    switch (activeTab) {
      case 'html':
        setHtml(content);
        break;
      case 'css':
        setCss(content);
        break;
      case 'js':
      case 'javascript':
        setJs(content);
        break;
      case 'script':
        setScript(content);
        break;
      default:
        // For other languages, we don't update any state
        break;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-background transition-colors duration-300`}>
      <Header 
        html={html} 
        css={css} 
        js={js}
        script={script}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onSave={handleSave}
      />
      
      <main className="flex flex-col flex-grow p-2 md:p-6 space-y-4">
        {isMobile ? (
          // Mobile layout
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
                onAddFile={toggleFileExplorer}
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
                onRunComplete={handleRunComplete}
              />
            </div>
          </div>
        ) : (
          // Desktop layout
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
              <div className="flex flex-col h-full bg-card">
                <EditorControls 
                  onRun={handleRun} 
                  onReset={handleReset}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onAddFile={toggleFileExplorer}
                  onSaveAll={handleSaveAll}
                  onExport={handleExportProject}
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
                  onRunComplete={handleRunComplete}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </main>
      
      <footer className="py-3 text-center text-sm text-muted-foreground border-t border-border">
        <p>Ako.js - A modern web-based code editor inspired by CodePen</p>
      </footer>
    </div>
  );
};

export default Index;
