
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ActivityLog from './ActivityLog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface CollaborationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  
  // Mock data for demonstration
  useEffect(() => {
    // In a real app, you would fetch messages from Supabase
    setMessages([
      {
        id: '1',
        content: 'مرحباً بالجميع في مشروعنا الجديد!',
        sender: {
          id: '1',
          name: 'علي محمد',
          avatar: '',
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isCurrentUser: true,
      },
      {
        id: '2',
        content: 'أهلاً! أنا متحمس للعمل على هذا المشروع معكم.',
        sender: {
          id: '2',
          name: 'سارة أحمد',
          avatar: '',
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isCurrentUser: false,
      },
      {
        id: '3',
        content: 'هل يمكننا البدء بالعمل على الصفحة الرئيسية؟',
        sender: {
          id: '2',
          name: 'سارة أحمد',
          avatar: '',
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
        isCurrentUser: false,
      },
      {
        id: '4',
        content: 'نعم، سأبدأ بإعداد هيكل الصفحة وسأشاركه معكم قريباً.',
        sender: {
          id: '1',
          name: 'علي محمد',
          avatar: '',
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
        isCurrentUser: true,
      },
    ]);
    
    setActivities([
      {
        id: '1',
        username: 'علي محمد',
        action: 'أنشأ ملف جديد',
        timestamp: 'قبل 2 ساعة',
        fileId: '123',
        fileName: 'index.html',
      },
      {
        id: '2',
        username: 'سارة أحمد',
        action: 'عدل الملف',
        timestamp: 'قبل 30 دقيقة',
        fileId: '124',
        fileName: 'style.css',
      },
      {
        id: '3',
        username: 'محمد علي',
        action: 'حذف ملف',
        timestamp: 'قبل 25 دقيقة',
        fileId: '125',
        fileName: 'old.js',
      },
      {
        id: '4',
        username: 'علي محمد',
        action: 'أنشأ مجلد جديد',
        timestamp: 'قبل 20 دقيقة',
        fileId: '126',
        fileName: 'components',
      },
    ]);
  }, []);
  
  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender: {
        id: user?.id || '1',
        name: user?.username || 'المستخدم الحالي',
        avatar: user?.avatarUrl || '',
      },
      timestamp: new Date(),
      isCurrentUser: true,
    };
    
    setMessages([...messages, newMessage]);
    
    // In a real app, you would send the message to Supabase
    toast({
      title: "تم إرسال الرسالة",
      description: "تم إرسال رسالتك إلى المتعاونين",
      duration: 2000,
    });
  };
  
  const handleSendFile = (file: File) => {
    // Handle file upload
    toast({
      title: "تم إرسال الملف",
      description: `تم إرسال الملف ${file.name} إلى المتعاونين`,
      duration: 2000,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 py-2 border-b">
          <DialogTitle>التعاون في الوقت الفعلي</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="chat">المحادثة</TabsTrigger>
            <TabsTrigger value="activity">النشاط</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="flex-1 flex flex-col p-4 pt-2">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-2 pt-2">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-4">
              <ChatInput 
                onSendMessage={handleSendMessage} 
                onSendFile={handleSendFile} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="flex-1 p-4 pt-2">
            <ActivityLog activities={activities} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationPanel;
