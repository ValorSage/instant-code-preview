
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FileType } from '@/components/FileExplorer/FileExplorer';
import FileExplorer from '@/components/FileExplorer/FileExplorer';
import CodeEditor from '@/components/CodeEditor';
import Preview from '@/components/Preview';
import { FolderOpen, Play, Undo2, Save, Menu, X, FileCode, Eye, FileDown, Share2, Search, Settings, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewTab, setViewTab] = useState("editor");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('project.html');
  const [showAdvancedEditorControls, setShowAdvancedEditorControls] = useState(false);
  
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
  
  const handleViewChange = (tab: string) => {
    setViewTab(tab);
    
    if (tab === 'preview') {
      // When switching to preview, automatically run the code
      handleRun();
      
      toast({
        title: "المعاينة",
        description: "تم التبديل إلى وضع المعاينة",
        duration: 1500,
      });
    }
  };
  
  const handleShareProject = () => {
    // Generate a unique shareable URL for the project
    // In a real app, this would call an API to create a shareable link
    const mockShareableUrl = `https://akojs.dev/s/${Math.random().toString(36).substring(2, 8)}`;
    setShareUrl(mockShareableUrl);
    setShareDialogOpen(true);
  };
  
  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط المشاركة إلى الحافظة",
        duration: 2000,
      });
    }).catch(err => {
      console.error('حدث خطأ أثناء نسخ الرابط:', err);
    });
  };
  
  const handleDownloadProject = () => {
    setDownloadDialogOpen(true);
  };
  
  const handleDownloadConfirm = () => {
    // Create a complete HTML file with all the code
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName.replace('.html', '')}</title>
    <style>
${css}
    </style>
</head>
<body>
${html}
    <script>
${getFinalJs()}
    </script>
</body>
</html>
    `;
    
    // Create a download link
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setDownloadDialogOpen(false);
    
    toast({
      title: "تم التنزيل",
      description: `تم تنزيل المشروع كملف ${fileName}`,
      duration: 2000,
    });
  };
  
  // Language selector based on active tab or selected file
  const languageOptions = [
    'html', 'css', 'javascript', 'typescript', 
    'python', 'java', 'cpp', 'csharp', 'go', 
    'rust', 'php', 'ruby', 'swift', 'kotlin', 'lua', 'sql'
  ];
  const activeLanguage = selectedFile?.language || activeTab;
  
  const toggleAdvancedEditorControls = () => {
    setShowAdvancedEditorControls(!showAdvancedEditorControls);
  };
  
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
              >
                <FileDown className="h-4 w-4 mr-1" />
                <span className="text-xs">المزيد</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExportProject}>
                <FileDown className="h-4 w-4 mr-2" />
                تصدير كملف JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadProject}>
                <Download className="h-4 w-4 mr-2" />
                تنزيل كملف HTML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareProject}>
                <Share2 className="h-4 w-4 mr-2" />
                مشاركة المشروع
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleAdvancedEditorControls}>
                <Settings className="h-4 w-4 mr-2" />
                خيارات المحرر
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs value={viewTab} onValueChange={handleViewChange} className="flex-grow flex flex-col">
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="editor" className="flex items-center">
            <FileCode className="h-4 w-4 mr-1.5" />
            المحرر
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center">
            <Eye className="h-4 w-4 mr-1.5" />
            المعاينة
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="flex-grow flex flex-col overflow-hidden m-0">
          <div className="mb-2 flex">
            <select 
              value={activeLanguage} 
              onChange={(e) => setActiveTab(e.target.value)}
              className="flex-1 h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
            >
              {languageOptions.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleAdvancedEditorControls}
              className="ml-2 h-10"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          {showAdvancedEditorControls && (
            <div className="mb-2 p-2 bg-muted/20 rounded-md border border-border">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  تنسيق الكود
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  ضغط الكود
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  إلغاء التراجع
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Search className="h-3.5 w-3.5 mr-1" />
                  بحث واستبدال
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex-grow rounded-lg border border-border overflow-hidden">
            <CodeEditor 
              value={getEditorContent()} 
              onChange={setEditorContent} 
              language={activeLanguage} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="flex-grow m-0 overflow-hidden">
          <div className="h-full rounded-lg border border-border overflow-hidden">
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
        </TabsContent>
      </Tabs>
      
      {/* Share Project Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>مشاركة المشروع</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2 pt-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="share-link" className="sr-only">
                رابط المشاركة
              </Label>
              <Input
                id="share-link"
                dir="ltr"
                defaultValue={shareUrl}
                readOnly
                className="h-9"
              />
            </div>
            <Button size="sm" onClick={handleCopyShareUrl}>
              نسخ
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShareDialogOpen(false)}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Download Project Dialog */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تنزيل المشروع</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file-name">اسم الملف</Label>
              <Input
                id="file-name"
                dir="ltr"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDownloadDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="button" onClick={handleDownloadConfirm}>
              تنزيل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileLayout;
