
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Globe, Code, MessageSquare, Play, Users, FileCode, Settings } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProjectPublisher from '@/components/collaboration/ProjectPublisher';
import CollaborationStatus from '@/components/collaboration/CollaborationStatus';
import MessagingPanel, { Message } from '@/components/collaboration/MessagingPanel';
import LiveCodeRunner from '@/components/development/LiveCodeRunner';
import { toast } from '@/hooks/use-toast';

const DevelopmentTools: React.FC = () => {
  // البيانات التجريبية للتعاون
  const [collaborators, setCollaborators] = useState([
    { id: '1', name: 'محمد أحمد', status: 'online' as const, currentFile: 'index.html' },
    { id: '2', name: 'سارة محمود', status: 'online' as const, currentFile: 'styles.css' },
    { id: '3', name: 'أحمد علي', status: 'idle' as const, lastActive: new Date(Date.now() - 15 * 60000) },
    { id: '4', name: 'فاطمة حسن', status: 'offline' as const, lastActive: new Date(Date.now() - 120 * 60000) }
  ]);
  
  // البيانات التجريبية للرسائل
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      senderName: 'محمد أحمد',
      content: 'مرحباً بالجميع! هل يمكننا مناقشة التصميم الجديد؟',
      timestamp: new Date(Date.now() - 30 * 60000),
      isCurrentUser: false
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'سارة محمود',
      content: 'بالتأكيد! أنا أعمل على CSS الآن.',
      timestamp: new Date(Date.now() - 25 * 60000),
      isCurrentUser: false
    },
    {
      id: '3',
      senderId: 'current',
      senderName: 'أنت',
      content: 'رائع! سأعمل على JavaScript.',
      timestamp: new Date(Date.now() - 20 * 60000),
      isCurrentUser: true
    }
  ]);
  
  // نموذج كود جافاسكريبت بسيط للمحاكاة
  const sampleJsCode = `// مثال على كود جافاسكريبت بسيط
function sayHello(name) {
  console.log("مرحباً، " + name + "!");
  return "تم الترحيب بـ " + name;
}

// استدعاء الدالة
for (let i = 0; i < 3; i++) {
  sayHello("مستخدم " + (i + 1));
}

console.log("تم تنفيذ الكود بنجاح!");`;

  // معالجة إرسال رسالة جديدة
  const handleSendMessage = (content: string, attachment?: File) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current',
      senderName: 'أنت',
      content,
      timestamp: new Date(),
      isCurrentUser: true
    };
    
    // إذا كان هناك مرفق، أضفه للرسالة
    if (attachment) {
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.name);
      
      newMessage.attachment = {
        name: attachment.name,
        type: isImage ? 'image' : 'file',
        url: URL.createObjectURL(attachment), // في التطبيق الحقيقي، سيتم رفع الملف للخادم
        size: formatFileSize(attachment.size)
      };
    }
    
    setMessages(prev => [...prev, newMessage]);
    
    // محاكاة الرد التلقائي بعد فترة
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const responder = collaborators[Math.floor(Math.random() * 2)]; // اختيار متعاون عشوائي من أول متعاونَين
        
        const response: Message = {
          id: Date.now().toString(),
          senderId: responder.id,
          senderName: responder.name,
          content: getRandomResponse(),
          timestamp: new Date(),
          isCurrentUser: false
        };
        
        setMessages(prev => [...prev, response]);
      }, 5000 + Math.random() * 10000); // الرد بعد 5-15 ثانية
    }
  };
  
  // الردود العشوائية للمحاكاة
  const getRandomResponse = () => {
    const responses = [
      'شكراً للمشاركة!',
      'هذا يبدو رائعاً. هل يمكننا إضافة المزيد من الميزات؟',
      'أتفق تماماً مع اقتراحك.',
      'سأعمل على ذلك حالاً.',
      'هل يمكننا مناقشة هذا في الاجتماع القادم؟',
      'رائع! سأضيف هذه التغييرات إلى الكود.',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  // تنسيق حجم الملف
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  // معالجة تنفيذ الكود
  const handleCodeRun = (result: string) => {
    console.log('نتيجة تنفيذ الكود:', result);
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">أدوات التطوير المتقدمة</h1>
      
      <Tabs defaultValue="publisher" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="publisher">
            <Globe className="h-4 w-4 mr-2" />
            نشر المشاريع
          </TabsTrigger>
          <TabsTrigger value="collaboration">
            <Users className="h-4 w-4 mr-2" />
            التعاون
          </TabsTrigger>
          <TabsTrigger value="messaging">
            <MessageSquare className="h-4 w-4 mr-2" />
            المراسلة
          </TabsTrigger>
          <TabsTrigger value="codeRunner">
            <Play className="h-4 w-4 mr-2" />
            تنفيذ الكود
          </TabsTrigger>
        </TabsList>
        
        <div className="border rounded-lg p-6 min-h-[500px]">
          <TabsContent value="publisher" className="mt-0">
            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold mb-2">نشر وتوزيع المشاريع</h2>
              <p className="text-muted-foreground mb-4">
                يمكنك نشر مشاريعك ومشاركتها مع الآخرين من خلال روابط مباشرة وإدارة الإصدارات المنشورة.
              </p>
              
              <div className="mt-4">
                <ProjectPublisher 
                  projectId="demo123" 
                  projectName="المشروع التجريبي" 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="collaboration" className="mt-0">
            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold mb-2">التعاون في الوقت الحقيقي</h2>
              <p className="text-muted-foreground mb-4">
                تعاون مع فريقك في الوقت الحقيقي، وشاهد التغييرات مباشرة، وتواصل بسهولة.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CollaborationStatus 
                  collaborators={collaborators}
                  projectName="المشروع التجريبي"
                  isConnected={true}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>نشاط المشروع</CardTitle>
                    <CardDescription>آخر تحديثات المشروع والتغييرات</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                          <FileCode className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">تحديث ملف index.html</p>
                            <p className="text-xs text-muted-foreground">بواسطة محمد أحمد - منذ 10 دقائق</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                          <FileCode className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">إنشاء ملف styles.css</p>
                            <p className="text-xs text-muted-foreground">بواسطة سارة محمود - منذ 25 دقيقة</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                          <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">انضمام عضو جديد للمشروع</p>
                            <p className="text-xs text-muted-foreground">انضم أحمد علي - منذ 2 ساعة</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                          <Settings className="h-5 w-5 text-orange-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">تحديث إعدادات المشروع</p>
                            <p className="text-xs text-muted-foreground">بواسطك - منذ 3 ساعات</p>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="messaging" className="mt-0">
            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold mb-2">نظام المراسلة</h2>
              <p className="text-muted-foreground mb-4">
                تواصل مع فريقك عبر نظام مراسلة متكامل يدعم إرسال النصوص والملفات والصور.
              </p>
              
              <div className="mt-4 max-w-4xl mx-auto">
                <MessagingPanel 
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  height="h-[500px]"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="codeRunner" className="mt-0">
            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold mb-2">تنفيذ الكود في الوقت الحقيقي</h2>
              <p className="text-muted-foreground mb-4">
                قم بتشغيل واختبار الكود البرمجي مباشرة ومشاهدة النتائج في الوقت الحقيقي.
              </p>
              
              <div className="mt-4">
                <LiveCodeRunner 
                  code={sampleJsCode}
                  language="javascript"
                  onCodeRun={handleCodeRun}
                />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DevelopmentTools;
