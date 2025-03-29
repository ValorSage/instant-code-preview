
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ProjectPublisherProps {
  projectId?: string;
  projectName?: string;
}

const ProjectPublisher: React.FC<ProjectPublisherProps> = ({ projectId, projectName }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [publishingHistory, setPublishingHistory] = useState<{ url: string; date: Date; status: string }[]>([]);
  const [activeTab, setActiveTab] = useState('publish');

  const handlePublish = async () => {
    if (!projectId) {
      toast({
        title: "لم يتم تحديد مشروع",
        description: "الرجاء تحديد مشروع للنشر",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    
    // محاكاة عملية النشر
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newUrl = `https://ako-${projectId.substring(0, 8)}.netlify.app`;
    setPublishedUrl(newUrl);
    
    // إضافة السجل الجديد للتاريخ
    setPublishingHistory(prev => [
      { url: newUrl, date: new Date(), status: 'ناجح' },
      ...prev.slice(0, 4) // الاحتفاظ بأحدث 5 عمليات نشر فقط
    ]);

    setIsPublishing(false);
    
    toast({
      title: "تم النشر بنجاح",
      description: `تم نشر المشروع "${projectName || 'غير محدد'}" بنجاح!`,
    });
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
          title: "فشل نسخ الرابط",
          description: "حدث خطأ عند محاولة نسخ الرابط",
          variant: "destructive",
        });
      });
  };

  const handleVisitSite = () => {
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
    <Card className="w-full">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="publish">النشر</TabsTrigger>
          <TabsTrigger value="history">تاريخ النشر</TabsTrigger>
        </TabsList>

        <TabsContent value="publish" className="space-y-4">
          <CardHeader>
            <CardTitle>نشر المشروع</CardTitle>
            <CardDescription>
              قم بنشر المشروع الحالي عبر الإنترنت لمشاركته مع الآخرين
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {publishedUrl ? (
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Globe className="h-5 w-5 text-green-500" />
                      <span className="font-medium">رابط المشروع:</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      نشط
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center space-x-2 rtl:space-x-reverse">
                    <Input 
                      value={publishedUrl} 
                      readOnly 
                      className="flex-1 bg-background"
                    />
                    <Button variant="outline" size="icon" onClick={handleCopyUrl}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleVisitSite}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-md bg-muted/50 p-4 text-sm">
                  <p className="font-medium mb-2">ملاحظات:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>يمكنك مشاركة هذا الرابط مع أي شخص لعرض المشروع</li>
                    <li>يتم تحديث المشروع المنشور تلقائياً عند الضغط على "إعادة النشر"</li>
                    <li>إذا قمت بتعديل المشروع، ستحتاج إلى إعادة النشر لتحديث الإصدار العام</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-muted p-6 flex flex-col items-center justify-center text-center space-y-3">
                <Globe className="h-12 w-12 text-muted-foreground/70" />
                <div>
                  <h3 className="text-lg font-medium">المشروع غير منشور</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    انشر مشروعك لمشاركته عبر رابط عام يمكن لأي شخص الوصول إليه
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            {publishedUrl ? (
              <Button onClick={handlePublish} disabled={isPublishing}>
                {isPublishing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    <span>جاري إعادة النشر...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>إعادة النشر</span>
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handlePublish} disabled={isPublishing} className="w-full">
                {isPublishing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    <span>جاري النشر...</span>
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    <span>نشر المشروع</span>
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </TabsContent>

        <TabsContent value="history">
          <CardHeader>
            <CardTitle>تاريخ النشر</CardTitle>
            <CardDescription>
              سجل جميع عمليات النشر السابقة لهذا المشروع
            </CardDescription>
          </CardHeader>
          <CardContent>
            {publishingHistory.length > 0 ? (
              <div className="space-y-4">
                {publishingHistory.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Badge 
                          variant={item.status === 'ناجح' ? 'outline' : 'destructive'} 
                          className={item.status === 'ناجح' ? 'h-2 w-2 p-0 rounded-full bg-green-500' : 'h-2 w-2 p-0 rounded-full'} 
                        />
                        <span className="font-medium">{formatDate(item.date)}</span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground truncate max-w-xs">
                        {item.url}
                      </div>
                    </div>
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      <Button variant="outline" size="sm" onClick={() => window.open(item.url, '_blank')}>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-muted rounded-md">
                <p className="text-muted-foreground">لا توجد عمليات نشر سابقة</p>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ProjectPublisher;
