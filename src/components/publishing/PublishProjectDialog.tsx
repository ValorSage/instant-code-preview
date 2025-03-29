
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Copy, ExternalLink, RefreshCw, Check, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useProjects } from '@/contexts/ProjectContext';

interface PublishProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PublishProjectDialog: React.FC<PublishProjectDialogProps> = ({ isOpen, onClose }) => {
  const { currentProject } = useProjects();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [projectTitle, setProjectTitle] = useState(currentProject?.name || '');
  const [projectDescription, setProjectDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [publishingHistory, setPublishingHistory] = useState<Array<{url: string, date: Date, status: string}>>([]);

  const handlePublish = async () => {
    if (!currentProject) {
      toast({
        title: "لم يتم تحديد المشروع",
        description: "الرجاء تحديد مشروع للنشر",
        variant: "destructive",
      });
      return;
    }

    if (!projectTitle.trim()) {
      toast({
        title: "العنوان مطلوب",
        description: "الرجاء إدخال عنوان للمشروع",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    
    try {
      // محاكاة النشر - سيتم استبدال هذا بالتكامل الفعلي
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const deployId = Math.random().toString(36).substring(2, 10);
      const newUrl = `https://coder-${deployId}.netlify.app`;
      
      setPublishedUrl(newUrl);
      setPublishingHistory(prev => [
        { url: newUrl, date: new Date(), status: 'ناجح' },
        ...prev
      ]);
      
      toast({
        title: "تم النشر بنجاح",
        description: "تم نشر المشروع بنجاح ويمكن الوصول إليه عبر الرابط المقدم",
      });
      
      setActiveTab('share');
    } catch (error) {
      console.error('Error publishing project:', error);
      toast({
        title: "فشل النشر",
        description: "حدث خطأ أثناء نشر المشروع. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyUrl = () => {
    if (!publishedUrl) return;
    
    navigator.clipboard.writeText(publishedUrl)
      .then(() => {
        toast({
          title: "تم نسخ الرابط",
          description: "تم نسخ رابط المشروع المنشور",
        });
      })
      .catch(() => {
        toast({
          title: "فشل النسخ",
          description: "تعذر نسخ الرابط إلى الحافظة",
          variant: "destructive",
        });
      });
  };

  const openPublishedProject = () => {
    if (publishedUrl) {
      window.open(publishedUrl, '_blank');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">نشر المشروع</DialogTitle>
          <DialogDescription>
            نشر المشروع بحيث يمكن للآخرين الوصول إليه
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
            <TabsTrigger value="share" disabled={!publishedUrl}>المشاركة</TabsTrigger>
            <TabsTrigger value="history">السجل</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-title">عنوان المشروع</Label>
                <Input
                  id="project-title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="أدخل عنوان المشروع"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description">وصف المشروع (اختياري)</Label>
                <Textarea
                  id="project-description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="وصف قصير للمشروع"
                  className="resize-none h-24"
                />
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  id="is-public"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <Label htmlFor="is-public" className="cursor-pointer">مشروع عام (يمكن للجميع الوصول إليه)</Label>
              </div>

              <div className="rounded-md bg-muted p-4 text-sm">
                <h4 className="font-semibold mb-2">ملاحظات النشر:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>سيتم نشر أحدث نسخة محفوظة من المشروع</li>
                  <li>قد يستغرق النشر بضع دقائق حسب حجم المشروع</li>
                  <li>إذا كان المشروع عامًا، يمكن لأي شخص لديه الرابط الوصول إليه</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                إلغاء
              </Button>
              <Button 
                onClick={handlePublish} 
                disabled={isPublishing || !projectTitle.trim()} 
                className="w-full sm:w-auto"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>جارِ النشر...</span>
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    <span>نشر المشروع</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="share" className="space-y-4 py-4">
            {publishedUrl && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-medium">تم نشر المشروع بنجاح!</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    نشط
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-url">رابط المشروع</Label>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Input
                      id="project-url"
                      value={publishedUrl}
                      readOnly
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={handleCopyUrl} title="نسخ الرابط">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={openPublishedProject} title="فتح الرابط">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>مشاركة المشروع</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>فيسبوك</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      <span>تويتر</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span>لينكد إن</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Button onClick={handlePublish} disabled={isPublishing} className="w-full">
                    {isPublishing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>جارِ إعادة النشر...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        <span>إعادة نشر المشروع</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <div className="py-4">
              <h3 className="text-sm font-medium mb-3">سجل عمليات النشر</h3>
              
              {publishingHistory.length > 0 ? (
                <div className="space-y-3">
                  {publishingHistory.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${item.status === 'ناجح' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="font-medium">{formatDate(item.date)}</span>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground truncate max-w-xs">
                          {item.url}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => window.open(item.url, '_blank')}>
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        <span>فتح</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-muted/50 rounded-md">
                  <Globe className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">لا توجد عمليات نشر سابقة</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PublishProjectDialog;
