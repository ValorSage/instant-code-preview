
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Globe, Copy, Check, ExternalLink, Server } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PublishProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  projectId: string;
}

const PublishProjectDialog: React.FC<PublishProjectDialogProps> = ({
  isOpen,
  onClose,
  projectName,
  projectId
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishTab, setPublishTab] = useState('web');
  const [projectSlug, setProjectSlug] = useState(projectName.toLowerCase().replace(/\s+/g, '-'));
  const [isCopied, setIsCopied] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  
  const handlePublish = async () => {
    setIsPublishing(true);
    
    // محاكاة نشر المشروع (في تطبيق حقيقي، هنا سيتم إرسال المشروع للخادم)
    setTimeout(() => {
      const demoUrl = `https://koder.app/projects/${projectSlug}-${projectId.slice(0, 8)}`;
      setPublishedUrl(demoUrl);
      setIsPublished(true);
      setIsPublishing(false);
      
      toast({
        title: "تم نشر المشروع بنجاح",
        description: "يمكنك الآن مشاركة رابط المشروع مع الآخرين.",
        duration: 5000,
      });
    }, 2500);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
    
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط المشروع إلى الحافظة.",
      duration: 3000,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900/90 backdrop-blur-lg border-purple-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">نشر المشروع</DialogTitle>
          <DialogDescription className="text-white/70">
            اختر طريقة نشر مشروعك "{projectName}" ومشاركته مع الآخرين.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="web" value={publishTab} onValueChange={setPublishTab} className="mt-4">
          <TabsList className="grid grid-cols-2 bg-gray-800/50">
            <TabsTrigger value="web" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">
              <Globe className="h-4 w-4 mr-2" />
              نشر على الويب
            </TabsTrigger>
            <TabsTrigger value="export" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">
              <Server className="h-4 w-4 mr-2" />
              تصدير المشروع
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="web" className="mt-4 space-y-4">
            {!isPublished ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="project-slug" className="text-white">رابط المشروع</Label>
                  <div className="flex items-center">
                    <span className="bg-gray-800 text-white/70 px-3 py-2 rounded-l-md border border-r-0 border-purple-500/20">
                      https://koder.app/projects/
                    </span>
                    <Input
                      id="project-slug"
                      value={projectSlug}
                      onChange={(e) => setProjectSlug(e.target.value)}
                      className="rounded-l-none border-purple-500/20"
                    />
                  </div>
                  <p className="text-xs text-white/60">
                    سيكون هذا هو عنوان URL العام لمشروعك المنشور.
                  </p>
                </div>
                
                <Alert className="bg-purple-900/20 border-purple-500/30">
                  <AlertDescription className="text-white">
                    عند النشر، سيكون مشروعك متاحًا للجميع عبر الرابط المخصص. يمكنك مشاركته مع أي شخص.
                  </AlertDescription>
                </Alert>
                
                <DialogFooter className="mt-4">
                  <Button 
                    onClick={handlePublish} 
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg"
                    disabled={isPublishing}
                  >
                    {isPublishing ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جارِ النشر...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Upload className="mr-2 h-5 w-5" />
                        نشر المشروع
                      </span>
                    )}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <div className="space-y-4">
                <Alert className="bg-green-900/20 border-green-500/30">
                  <AlertDescription className="text-white flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    تم نشر المشروع بنجاح!
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Label htmlFor="published-url" className="text-white">رابط المشروع المنشور</Label>
                  <div className="flex items-center">
                    <Input
                      id="published-url"
                      value={publishedUrl}
                      readOnly
                      className="rounded-r-none border-purple-500/20"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="rounded-l-none h-10 border border-l-0 border-purple-500/20"
                      onClick={() => copyToClipboard(publishedUrl)}
                    >
                      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsPublished(false);
                      setPublishedUrl('');
                    }}
                    className="border-purple-500/20 text-white hover:bg-purple-500/10"
                  >
                    إعادة النشر
                  </Button>
                  
                  <Button 
                    onClick={() => window.open(publishedUrl, '_blank')}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    فتح المشروع
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="export" className="mt-4 space-y-4">
            <Alert className="bg-blue-900/20 border-blue-500/30">
              <AlertDescription className="text-white">
                يمكنك تصدير المشروع كملف مضغوط يحتوي على جميع الملفات اللازمة لتشغيل المشروع محليًا أو نشره على خدمات الاستضافة.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">خيارات التصدير</Label>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center space-x-2 bg-gray-800/50 rounded-md p-3 border border-purple-500/20">
                    <input 
                      type="radio" 
                      id="export-zip" 
                      name="export-type" 
                      className="text-primary" 
                      defaultChecked 
                    />
                    <Label htmlFor="export-zip" className="text-white cursor-pointer flex-1">ZIP ملف مضغوط</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-gray-800/50 rounded-md p-3 border border-purple-500/20">
                    <input 
                      type="radio" 
                      id="export-github" 
                      name="export-type" 
                      className="text-primary" 
                    />
                    <Label htmlFor="export-github" className="text-white cursor-pointer flex-1">GitHub تصدير إلى</Label>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={() => {
                    toast({
                      title: "جارِ تصدير المشروع",
                      description: "سيتم تنزيل المشروع كملف مضغوط خلال ثوانٍ.",
                      duration: 5000,
                    });
                    
                    setTimeout(() => {
                      toast({
                        title: "تم تصدير المشروع بنجاح",
                        description: "تم تنزيل المشروع بنجاح.",
                        duration: 3000,
                      });
                    }, 2000);
                  }} 
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  تصدير المشروع
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// إضافة أيقونة التنزيل
const Download = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default PublishProjectDialog;
