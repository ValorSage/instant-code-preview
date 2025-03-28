
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import CollaborationTabs from './CollaborationTabs';
import { useMockCollaborationData } from './useMockData';

interface CollaborationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  isOpen,
  onClose
}) => {
  const { messages, setMessages, activities, setActivities, user } = useMockCollaborationData();
  const [activeTab, setActiveTab] = useState('chat');
  
  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender: {
        id: user?.id || '1',
        name: user?.email?.split('@')[0] || 'المستخدم الحالي', // Use email or default value
        avatar: '',
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
        
        <CollaborationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          messages={messages}
          activities={activities}
          onSendMessage={handleSendMessage}
          onSendFile={handleSendFile}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationPanel;
