
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FileType } from '@/components/FileExplorer/FileExplorer';
import FileExplorer from '@/components/FileExplorer/FileExplorer';
import CodeEditor from '@/components/CodeEditor';
import Preview from '@/components/Preview';
import { FolderOpen, Play, Undo2, Save, Menu, X, FileCode, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MobileLayoutProps {
  showFileExplorer: boolean;
  setShowFileExplorer: (show: boolean) => void;
  files: FileType[];
  handleFileSelect: (file: FileType) => void;
  handleFileCreate: (file: FileType, parentId?: string) => void;
  handleFileDelete: (fileId: string) => void;
  handleFileRename: (fileId: string, newName: string) => void;
  handleFileMove?: (fileId: string, targetFolderId: string | null) => void;
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
  handleExportProject
}) => {
  const [currentTab, setCurrentTab] = useState<'editor' | 'preview'>('editor');
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const onSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setShowFileExplorer(false);
    }
  };
  
  const handleFileSelectAndClose = (file: FileType) => {
    handleFileSelect(file);
    setSheetOpen(false);
  };
  
  const toggleTab = () => {
    setCurrentTab(currentTab === 'editor' ? 'preview' : 'editor');
    
    if (currentTab === 'editor') {
      // When switching to preview, automatically run the code
      handleRun();
      
      toast({
        title: "المعاينة",
        description: "تم التبديل إلى وضع المعاينة",
        duration: 1500,
      });
    } else {
      toast({
        title: "المحرر",
        description: "تم التبديل إلى وضع المحرر",
        duration: 1500,
      });
    }
  };
  
  // Language selector based on active tab or selected file
  const languageOptions = ['html', 'css', 'javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust'];
  const activeLanguage = selectedFile?.language || activeTab;
  
  return (
    <div className="mobile-layout h-full w-full flex flex-col">
      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg border border-border mb-2">
        <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {sheetOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-4/5">
            <div className="h-full overflow-hidden">
              <FileExplorer
                files={files}
                onFileSelect={handleFileSelectAndClose}
                onFileCreate={handleFileCreate}
                onFileDelete={handleFileDelete}
                onFileRename={handleFileRename}
                onFileMove={handleFileMove}
                selectedFileId={selectedFile?.id || null}
              />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRun}
            className="h-8"
          >
            <Play className="h-4 w-4 mr-1" />
            <span className="text-xs">تشغيل</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveAll}
            className="h-8"
          >
            <Save className="h-4 w-4 mr-1" />
            <span className="text-xs">حفظ</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8"
          >
            <Undo2 className="h-4 w-4 mr-1" />
            <span className="text-xs">إعادة تعيين</span>
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTab}
          className="h-8"
        >
          {currentTab === 'editor' ? 
            <><Eye className="h-4 w-4 mr-1" /> المعاينة</> : 
            <><FileCode className="h-4 w-4 mr-1" /> المحرر</>
          }
        </Button>
      </div>
      
      {currentTab === 'editor' && (
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="mb-2">
            <select 
              value={activeLanguage} 
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
            >
              {languageOptions.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-grow rounded-lg border border-border overflow-hidden">
            <CodeEditor 
              value={getEditorContent()} 
              onChange={setEditorContent} 
              language={activeLanguage} 
            />
          </div>
        </div>
      )}
      
      {currentTab === 'preview' && (
        <div className="flex-grow rounded-lg border border-border overflow-hidden">
          <Preview 
            html={html} 
            css={css} 
            js={getFinalJs()} 
            shouldRun={shouldRun}
            onRunComplete={onRunComplete}
            activeLanguage={activeLanguage}
            activeContent={getEditorContent()}
            autoRefresh={true}
          />
        </div>
      )}
    </div>
  );
};

export default MobileLayout;
