
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEditor } from '@/hooks/use-editor';
import MobileLayout from '@/components/MobileLayout';
import DesktopLayout from '@/components/DesktopLayout';
import { toast } from '@/hooks/use-toast';
import SearchDialog from '@/components/SearchDialog';
import ProjectManagementDialog from '@/components/ProjectManagementDialog';
import RealTimeCollaboration from '@/components/collaboration/RealTimeCollaboration';
import CollaborationPanel from '@/components/collaboration/CollaborationPanel';

// Import the new refactored components
import IndexHeader from '@/components/index/IndexHeader';
import ToolbarActions from '@/components/index/ToolbarActions';
import IndexFooter from '@/components/index/IndexFooter';
import { FileType } from '@/components/FileExplorer/FileExplorer';

const Index = () => {
  const isMobile = useIsMobile();
  const editor = useEditor();
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [collaborationPanelOpen, setCollaborationPanelOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false);
  const [projectManagementOpen, setProjectManagementOpen] = useState(false);
  const [showRealTimePanel, setShowRealTimePanel] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>(document.documentElement.dir as 'ltr' | 'rtl');
  
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('akojs-seen-intro');
    
    if (!hasSeenIntro) {
      setTimeout(() => {
        toast({
          title: "مرحباً بك في محرر Ako.js",
          description: "جرب وضع العرض المقسم والميزات المحسنة لإدارة الملفات!",
          duration: 5000,
        });
        
        localStorage.setItem('akojs-seen-intro', 'true');
      }, 1000);
    }
  }, []);
  
  const handleFileCreate = (file: FileType, parentId?: string) => {
    const updatedFiles = editor.addFileToTree(editor.files, file, parentId);
    editor.setFiles(updatedFiles);
    editor.saveFilesToLocalStorage(updatedFiles);
    
    if (file.type === 'file') {
      editor.setSelectedFile(file);
    }
    
    toast({
      title: `${file.type === 'file' ? 'تم إنشاء الملف' : 'تم إنشاء المجلد'}`,
      description: `تم إنشاء ${file.name} بنجاح.`,
      duration: 2000,
    });
  };

  const handleFileDelete = (fileId: string) => {
    if (editor.selectedFile && editor.selectedFile.id === fileId) {
      editor.setSelectedFile(null);
    }
    
    const updatedFiles = editor.deleteFileFromTree(editor.files, fileId);
    editor.setFiles(updatedFiles);
    editor.saveFilesToLocalStorage(updatedFiles);
    
    toast({
      title: "تم الحذف",
      description: "تم حذف الملف أو المجلد.",
      duration: 2000,
    });
  };

  const handleFileRename = (fileId: string, newName: string) => {
    const updatedFiles = editor.renameFile(editor.files, fileId, newName);
    editor.setFiles(updatedFiles);
    editor.saveFilesToLocalStorage(updatedFiles);
    
    if (editor.selectedFile && editor.selectedFile.id === fileId) {
      const updatedFile = editor.findFileById(updatedFiles, fileId);
      if (updatedFile) {
        editor.setSelectedFile(updatedFile);
      }
    }
    
    toast({
      title: "تمت إعادة التسمية",
      description: `تمت إعادة التسمية إلى ${newName} بنجاح.`,
      duration: 2000,
    });
  };
  
  const handleFileMove = (fileId: string, targetFolderId: string | null) => {
    const updatedFiles = editor.moveFileInTree(editor.files, fileId, targetFolderId);
    editor.setFiles(updatedFiles);
    editor.saveFilesToLocalStorage(updatedFiles);
    
    toast({
      title: "تم نقل الملف",
      description: "تم نقل الملف بنجاح.",
      duration: 2000,
    });
  };

  const handleDirectionChange = (newDirection: 'ltr' | 'rtl') => {
    setDirection(newDirection);
    document.documentElement.dir = newDirection;
    localStorage.setItem('akojs-direction', newDirection);
    
    const newLang = newDirection === 'rtl' ? 'ar' : 'en';
    document.documentElement.lang = newLang;
    localStorage.setItem('akojs-lang', newLang);
  };

  const toggleCollaborationPanel = () => {
    setCollaborationPanelOpen(!collaborationPanelOpen);
    
    if (!collaborationPanelOpen) {
      toast({
        title: "التعاون في الوقت الحقيقي",
        description: "تم تفعيل لوحة التعاون. شاهد تغييرات المتعاونين في الوقت الفعلي!",
        duration: 3000,
      });
    }
  };

  const handleSearchDialogOpen = () => {
    setSearchDialogOpen(true);
  };

  const handleKeyboardShortcutsOpen = () => {
    editor.showHelpToast();
  };

  const handleProjectManagementOpen = () => {
    setProjectManagementOpen(true);
  };

  const handleFileSelectFromSearch = (file: FileType) => {
    editor.handleFileSelect(file);
    setSearchDialogOpen(false);
  };

  const handleLanguageChange = (langId: string) => {
    setSelectedLanguage(langId);
    
    toast({
      title: "تم تغيير اللغة",
      description: `تم تغيير لغة البرمجة إلى ${langId}`,
      duration: 2000,
    });
  };

  const toggleRealTimePanel = () => {
    setShowRealTimePanel(!showRealTimePanel);
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
        <div className="flex items-center justify-between px-2">
          <IndexHeader 
            handleProjectManagementOpen={handleProjectManagementOpen} 
          />
          
          <ToolbarActions
            direction={direction}
            onDirectionChange={handleDirectionChange}
            selectedLanguage={selectedLanguage}
            onLanguageSelect={handleLanguageChange}
            onSearchClick={handleSearchDialogOpen}
            onRealTimeClick={toggleRealTimePanel}
            onKeyboardShortcutsClick={handleKeyboardShortcutsOpen}
            showRealTimePanel={showRealTimePanel}
          />
        </div>
        
        <div className="flex flex-1 gap-4">
          {!isMobile && showRealTimePanel && (
            <div className="w-80 flex-shrink-0">
              <RealTimeCollaboration projectId={editor.currentProject?.id} />
            </div>
          )}
          
          <div className="flex-1">
            {isMobile ? (
              <MobileLayout 
                showFileExplorer={editor.showFileExplorer}
                setShowFileExplorer={editor.setShowFileExplorer}
                files={editor.files}
                handleFileSelect={editor.handleFileSelect}
                handleFileCreate={handleFileCreate}
                handleFileDelete={handleFileDelete}
                handleFileRename={handleFileRename}
                handleFileMove={handleFileMove}
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
              <DesktopLayout 
                showFileExplorer={editor.showFileExplorer}
                files={editor.files}
                handleFileSelect={editor.handleFileSelect}
                handleFileCreate={handleFileCreate}
                handleFileDelete={handleFileDelete}
                handleFileRename={handleFileRename}
                handleFileMove={handleFileMove}
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
          </div>
        </div>
      </main>
      
      <IndexFooter />
      
      <SearchDialog 
        isOpen={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        files={editor.files}
        onFileSelect={handleFileSelectFromSearch}
        searchContent={true}
      />
      
      <CollaborationPanel
        isOpen={collaborationPanelOpen}
        onClose={() => setCollaborationPanelOpen(false)}
      />
      
      <ProjectManagementDialog
        isOpen={projectManagementOpen}
        onClose={() => setProjectManagementOpen(false)}
      />
    </div>
  );
};

export default Index;
