import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEditor } from '@/hooks/use-editor';
import MobileLayout from '@/components/MobileLayout';
import DesktopLayout from '@/components/DesktopLayout';
import { Button } from '@/components/ui/button';
import { 
  addFileToTree,
  deleteFileFromTree,
  renameFile,
  findFileById,
  saveFilesToLocalStorage,
  moveFileInTree
} from '@/utils/fileUtils';
import { toast } from '@/hooks/use-toast';
import { FileType } from '@/components/FileExplorer/FileExplorer';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Folders, Search, Users, Settings, Keyboard, FileBadge, Beaker, BookOpen, Globe } from 'lucide-react';
import SearchDialog from '@/components/SearchDialog';
import CollaborationPanel from '@/components/CollaborationPanel';
import AdvancedSettings from '@/components/AdvancedSettings';
import ProjectManagementDialog from '@/components/ProjectManagementDialog';
import RealTimeCollaboration from '@/components/RealTimeCollaboration';
import LanguageSelector from '@/components/LanguageSelector';
import DirectionToggle from '@/components/DirectionToggle';
import { useProjects } from '@/contexts/ProjectContext';

const isRtl = document.documentElement.dir === 'rtl';

const Index = () => {
  const isMobile = useIsMobile();
  const editor = useEditor();
  const { currentProject } = useProjects();
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
    const updatedFiles = addFileToTree(editor.files, file, parentId);
    editor.setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    
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
    
    const updatedFiles = deleteFileFromTree(editor.files, fileId);
    editor.setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    
    toast({
      title: "تم الحذف",
      description: "تم حذف الملف أو المجلد.",
      duration: 2000,
    });
  };

  const handleFileRename = (fileId: string, newName: string) => {
    const updatedFiles = renameFile(editor.files, fileId, newName);
    editor.setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    
    if (editor.selectedFile && editor.selectedFile.id === fileId) {
      const updatedFile = findFileById(updatedFiles, fileId);
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
    const updatedFiles = moveFileInTree(editor.files, fileId, targetFolderId);
    editor.setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    
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

  const handleSettingsDialogOpen = () => {
    setSettingsDialogOpen(true);
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
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {currentProject ? (
              <Badge variant="outline" className="text-xs px-3 py-1 h-7">
                {currentProject.name}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs px-3 py-1 h-7 bg-muted text-muted-foreground">
                لا يوجد مشروع
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleProjectManagementOpen}
              className="h-7 gap-1 text-xs"
            >
              <Folders className="h-3.5 w-3.5" />
              <span>إدارة المشاريع</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="h-7 gap-1 text-xs"
            >
              <Link to="/projects">
                <BookOpen className="h-3.5 w-3.5" />
                <span>كل المشاريع</span>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="h-7 gap-1 text-xs"
            >
              <Link to="/simulation">
                <Beaker className="h-3.5 w-3.5" />
                <span>بيئة المحاكاة</span>
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <DirectionToggle 
              direction={direction}
              onChange={handleDirectionChange}
            />
            
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageSelect={handleLanguageChange}
            />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleSearchDialogOpen} className="h-8 w-8 p-1">
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>بحث في الملفات (Ctrl+Shift+F)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={showRealTimePanel ? "secondary" : "ghost"} 
                    size="sm" 
                    onClick={toggleRealTimePanel} 
                    className="h-8 w-8 p-1"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>التعاون في الوقت الحقيقي</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-1">
                    <Link to="/settings">
                      <Settings className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>إعدادات متقدمة</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleKeyboardShortcutsOpen} className="h-8 w-8 p-1">
                    <Keyboard className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>اختصارات لوحة المفاتيح</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="flex flex-1 gap-4">
          {!isMobile && showRealTimePanel && (
            <div className="w-80 flex-shrink-0">
              <RealTimeCollaboration projectId={currentProject?.id} />
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
      
      <footer className="py-3 text-center text-sm text-muted-foreground border-t border-border">
        <p>Ako.js - منصة تحرير الكود المباشر بتجربة مستخدم سلسة</p>
        <div className="flex items-center justify-center mt-1 space-x-2 rtl:space-x-reverse">
          <Badge variant="outline" className="text-xs h-5">v1.0</Badge>
          <Badge variant="outline" className="text-xs h-5">Arabic UI</Badge>
          <Badge variant="outline" className="text-xs h-5">Multi-language</Badge>
        </div>
      </footer>
      
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
      
      <AdvancedSettings
        isOpen={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        autoSaveEnabled={editor.autoSaveEnabled}
        onToggleAutoSave={editor.toggleAutoSave}
        isDarkMode={editor.isDarkMode}
        onToggleDarkMode={editor.toggleDarkMode}
      />
      
      <ProjectManagementDialog
        isOpen={projectManagementOpen}
        onClose={() => setProjectManagementOpen(false)}
      />
    </div>
  );
};

export default Index;
