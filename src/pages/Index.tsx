
import React, { useEffect, useState } from 'react';
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
  saveFilesToLocalStorage,
  moveFileInTree
} from '@/utils/fileUtils';
import { toast } from '@/hooks/use-toast';
import { FileType } from '@/components/FileExplorer/FileExplorer';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users } from 'lucide-react';

// This would be populated from real user data in a full implementation
const onlineUsers = [
  { id: 'u1', name: 'User 1', color: '#4f46e5' },
  { id: 'u2', name: 'User 2', color: '#059669' },
];

const Index = () => {
  const isMobile = useIsMobile();
  const editor = useEditor();
  const [showCollaborators, setShowCollaborators] = useState(false);
  
  // Show introduction toast on first load
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
      title: `${file.type === 'file' ? 'تم إنشاء الملف' : 'تم إنشاء المجلد'}`,
      description: `تم إنشاء ${file.name} بنجاح.`,
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
      title: "تم الحذف",
      description: "تم حذف الملف أو المجلد.",
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
      title: "تمت إعادة التسمية",
      description: `تمت إعادة التسمية إلى ${newName} بنجاح.`,
      duration: 2000,
    });
  };
  
  // Handle file move (for drag and drop)
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

  // Toggle collaborators visibility
  const toggleCollaborators = () => {
    setShowCollaborators(!showCollaborators);
    
    if (!showCollaborators) {
      toast({
        title: "التعاون في الوقت الحقيقي",
        description: "سيتم توفير ميزات التعاون الكامل قريباً!",
        duration: 3000,
      });
    }
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
        {/* Collaboration indicators (will be fully implemented in future) */}
        <div className="flex items-center justify-end px-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleCollaborators} className="relative">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-xs">التعاون</span>
                  {showCollaborators && (
                    <div className="absolute top-full right-0 mt-2 p-2 bg-card border border-border rounded-md shadow-md z-50 min-w-[200px]">
                      <div className="text-xs font-medium mb-2">المستخدمون المتصلون:</div>
                      {onlineUsers.map(user => (
                        <div key={user.id} className="flex items-center mb-1">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: user.color }}
                          ></div>
                          <span className="text-xs">{user.name}</span>
                        </div>
                      ))}
                      <div className="text-xs text-muted-foreground mt-2">
                        ستتوفر ميزات التعاون الكامل قريباً!
                      </div>
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                التعاون في الوقت الحقيقي
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
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
          // Desktop layout
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
      </main>
      
      <footer className="py-3 text-center text-sm text-muted-foreground border-t border-border">
        <p>Ako.js - منصة تحرير الكود المباشر بتجربة مستخدم سلسة</p>
        <div className="flex items-center justify-center mt-1 space-x-2">
          <Badge variant="outline" className="text-xs h-5">v1.0</Badge>
          <Badge variant="outline" className="text-xs h-5">Arabic UI</Badge>
          <Badge variant="outline" className="text-xs h-5">Multi-language</Badge>
        </div>
      </footer>
    </div>
  );
};

export default Index;
