
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEditor } from '@/hooks/use-editor';
import { toast } from '@/hooks/use-toast';
import SearchDialog from '@/components/SearchDialog';
import ProjectManagementDialog from '@/components/ProjectManagementDialog';
import RealTimeCollaboration from '@/components/collaboration/RealTimeCollaboration';
import CollaborationPanel from '@/components/collaboration/CollaborationPanel';
import IndexHeader from '@/components/index/IndexHeader';
import ToolbarActions from '@/components/index/ToolbarActions';
import IndexFooter from '@/components/index/IndexFooter';
import IndexLayout from '@/components/index/IndexLayout';
import { FileType } from '@/components/FileExplorer/FileExplorer';
import { useIndexActions } from '@/components/index/IndexActions';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const isMobile = useIsMobile();
  const editor = useEditor();
  const { user, isLoading } = useAuth();
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [collaborationPanelOpen, setCollaborationPanelOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false);
  const [projectManagementOpen, setProjectManagementOpen] = useState(false);
  const [showRealTimePanel, setShowRealTimePanel] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>(document.documentElement.dir as 'ltr' | 'rtl');
  
  // Get file actions from the hook
  const fileActions = useIndexActions({
    files: editor.files,
    selectedFile: editor.selectedFile,
    addFileToTree: editor.addFileToTree,
    saveFilesToLocalStorage: editor.saveFilesToLocalStorage,
    setFiles: editor.setFiles,
    setSelectedFile: editor.setSelectedFile,
    deleteFileFromTree: editor.deleteFileFromTree,
    renameFile: editor.renameFile,
    findFileById: editor.findFileById,
    moveFileInTree: editor.moveFileInTree
  });
  
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('akojs-seen-intro');
    
    if (!hasSeenIntro) {
      setTimeout(() => {
        toast({
          title: "مرحباً بك في منصة كودر",
          description: "بيئة متكاملة للتطوير والتعاون. قم بإنشاء مشاريعك وشاركها مع الآخرين!",
          duration: 5000,
        });
        
        localStorage.setItem('akojs-seen-intro', 'true');
      }, 1000);
    }
  }, []);

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
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex flex-col">
        <Header 
          html={editor.html} 
          css={editor.css} 
          js={editor.js}
          script={editor.script}
          isDarkMode={editor.isDarkMode}
          toggleDarkMode={editor.toggleDarkMode}
          onSave={editor.handleSave}
        />
        
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              منصة كودر التفاعلية
            </h1>
            <p className="text-xl text-muted-foreground">
              بيئة تطوير متكاملة للمبرمجين. أنشئ، طور، وشارك مشاريعك بسهولة.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="mb-4 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-10 w-10"><path d="M8 17.7A6 6 0 0 0 2 12c0-3.3 2.7-6 6-6h8c2.2 0 4 1.8 4 4s-1.8 4-4 4H6c-1.1 0-2-.9-2-2s.9-2 2-2h6"/></svg>
                </div>
                <h3 className="text-lg font-semibold">تعاون في الوقت الحقيقي</h3>
                <p className="text-muted-foreground mt-2">العمل مع فريقك على نفس المشروع بشكل متزامن</p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="mb-4 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-10 w-10"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>
                </div>
                <h3 className="text-lg font-semibold">بيئات متعددة</h3>
                <p className="text-muted-foreground mt-2">دعم لمختلف لغات البرمجة وبيئات التشغيل</p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="mb-4 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-10 w-10"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                </div>
                <h3 className="text-lg font-semibold">نشر سهل</h3>
                <p className="text-muted-foreground mt-2">نشر واستضافة مشاريعك بضغطة زر واحدة</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button size="lg" asChild className="animate-pulse">
                <a href="/auth">ابدأ الآن</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </main>
        
        <footer className="py-6 border-t">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            <p>منصة كودر التفاعلية © {new Date().getFullYear()} - جميع الحقوق محفوظة</p>
          </div>
        </footer>
      </div>
    );
  }

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
            <IndexLayout
              showFileExplorer={editor.showFileExplorer}
              setShowFileExplorer={editor.setShowFileExplorer}
              files={editor.files}
              handleFileSelect={editor.handleFileSelect}
              handleFileCreate={fileActions.handleFileCreate}
              handleFileDelete={fileActions.handleFileDelete}
              handleFileRename={fileActions.handleFileRename}
              handleFileMove={fileActions.handleFileMove}
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
              toggleFileExplorer={editor.toggleFileExplorer}
              fileContent={editor.fileContent}
              showRealTimePanel={showRealTimePanel}
            />
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
