
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
import { Globe, Share2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useProjects } from '@/contexts/ProjectContext';

interface PublishButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const PublishButton: React.FC<PublishButtonProps> = ({ 
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const { currentProject } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  
  const handlePublish = async () => {
    if (!currentProject) {
      toast({
        title: "لا يمكن النشر",
        description: "يرجى اختيار مشروع أولاً قبل النشر",
        variant: "destructive",
      });
      return;
    }
    
    // Set publishing state to show loading
    setIsPublishing(true);
    
    try {
      // Here we would integrate with a deployment service like Netlify or Vercel
      // For now, we'll simulate a successful deployment with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock published URL
      const publishUrl = `https://ako-${currentProject.id.substring(0, 8)}.netlify.app`;
      setPublishedUrl(publishUrl);
      
      toast({
        title: "تم النشر بنجاح",
        description: "تم نشر المشروع وهو متاح الآن عبر الرابط المعروض",
      });
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
          description: "تم نسخ رابط المشروع المنشور إلى الحافظة",
        });
      })
      .catch(() => {
        toast({
          title: "فشل النسخ",
          description: "لم نتمكن من نسخ الرابط إلى الحافظة",
          variant: "destructive",
        });
      });
  };
  
  const openPublishedProject = () => {
    if (publishedUrl) {
      window.open(publishedUrl, '_blank');
    }
  };
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsDialogOpen(true)}
      >
        {size === 'icon' ? (
          <Globe className="h-4 w-4" />
        ) : (
          <>
            <Globe className="h-4 w-4 mr-2" />
            <span>نشر المشروع</span>
          </>
        )}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>نشر المشروع</DialogTitle>
            <DialogDescription>
              {publishedUrl 
                ? "تم نشر المشروع بنجاح! يمكنك الآن مشاركة الرابط مع الآخرين."
                : "نشر المشروع الحالي ومشاركته مع الآخرين عبر رابط عام."}
            </DialogDescription>
          </DialogHeader>
          
          {!publishedUrl ? (
            <div className="py-4">
              <p className="text-sm mb-4">
                سيتم نشر المشروع الحالي{" "}
                <strong>{currentProject?.name || "غير محدد"}</strong> وسيكون متاحًا
                عبر رابط عام. هل تريد المتابعة؟
              </p>
              
              <p className="text-xs text-muted-foreground">
                ملاحظة: سيتم نشر آخر نسخة محفوظة من المشروع. تأكد من حفظ التغييرات قبل النشر.
              </p>
            </div>
          ) : (
            <div className="py-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="published-url">رابط المشروع المنشور</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="published-url"
                    value={publishedUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyUrl}
                    className="flex-shrink-0"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button
                variant="secondary"
                className="w-full"
                onClick={openPublishedProject}
              >
                <Globe className="h-4 w-4 mr-2" />
                <span>فتح المشروع المنشور</span>
              </Button>
            </div>
          )}
          
          <DialogFooter>
            {publishedUrl ? (
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                إغلاق
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handlePublish} disabled={isPublishing}>
                  {isPublishing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      <span>جاري النشر...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      <span>نشر الآن</span>
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PublishButton;
