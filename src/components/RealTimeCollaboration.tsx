
import React, { useState, useEffect } from 'react';
import { User, MessageSquare, UserPlus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

// Mock data for demo
const mockCollaborators = [
  { id: 'user1', name: 'محمد أحمد', avatar: '', color: '#4f46e5', online: true },
  { id: 'user2', name: 'سارة خالد', avatar: '', color: '#059669', online: true },
  { id: 'user3', name: 'أحمد محمود', avatar: '', color: '#db2777', online: false },
];

const mockMessages = [
  { id: 'msg1', userId: 'user1', content: 'مرحباً بالجميع!', timestamp: new Date(Date.now() - 3600000) },
  { id: 'msg2', userId: 'user2', content: 'أنا أعمل على تحسين التنسيق CSS', timestamp: new Date(Date.now() - 1800000) },
  { id: 'msg3', userId: 'user1', content: 'رائع! سأعمل على الـ JavaScript', timestamp: new Date(Date.now() - 900000) },
];

const mockHistory = [
  { id: 'hist1', userId: 'user1', action: 'تعديل ملف index.html', timestamp: new Date(Date.now() - 7200000) },
  { id: 'hist2', userId: 'user2', action: 'إضافة ملف styles.css', timestamp: new Date(Date.now() - 5400000) },
  { id: 'hist3', userId: 'user1', action: 'تعديل ملف script.js', timestamp: new Date(Date.now() - 2700000) },
];

interface RealTimeCollaborationProps {
  projectId?: string; // ID المشروع (اختياري)
}

const RealTimeCollaboration: React.FC<RealTimeCollaborationProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'chat' | 'history'>('users');
  const [collaborators, setCollaborators] = useState(mockCollaborators);
  const [messages, setMessages] = useState(mockMessages);
  const [history, setHistory] = useState(mockHistory);
  const [newMessage, setNewMessage] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: `msg${Date.now()}`,
      userId: 'user1', // افتراضي للمستخدم الحالي
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // محاكاة إرسال عبر WebSocket
    setTimeout(() => {
      toast({
        title: "تم إرسال الرسالة",
        description: "تم إرسال رسالتك إلى المتعاونين",
        duration: 2000,
      });
    }, 500);
  };

  const handleInviteUser = () => {
    if (!inviteEmail.trim()) return;
    
    // محاكاة دعوة مستخدم
    toast({
      title: "تمت الدعوة",
      description: `تم إرسال دعوة إلى ${inviteEmail}`,
      duration: 2000,
    });
    
    setInviteEmail('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between border-b p-3 bg-muted/50">
        <h3 className="font-semibold">التعاون في الوقت الحقيقي</h3>
        <div className="flex space-x-1 rtl:space-x-reverse">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeTab === 'users' ? "secondary" : "ghost"} 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => setActiveTab('users')}
                >
                  <User className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>المتعاونون</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeTab === 'chat' ? "secondary" : "ghost"} 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => setActiveTab('chat')}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>الدردشة</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeTab === 'history' ? "secondary" : "ghost"} 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => setActiveTab('history')}
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>التاريخ</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Input 
                placeholder="أدخل البريد الإلكتروني للدعوة" 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleInviteUser}>
                <UserPlus className="h-4 w-4 mr-2" />
                دعوة
              </Button>
            </div>
            
            <div className="space-y-2">
              {collaborators.map(user => (
                <div key={user.id} className="flex items-center p-2 border rounded hover:bg-muted">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback style={{ backgroundColor: user.color }}>
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {messages.map(msg => {
                const user = collaborators.find(u => u.id === msg.userId);
                return (
                  <div key={msg.id} className="flex items-start space-x-2 rtl:space-x-reverse">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback style={{ backgroundColor: user?.color || '#888' }}>
                        {user?.name.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
                        <p className="text-sm font-medium">{user?.name || 'مستخدم'}</p>
                        <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="space-y-3">
            {history.map(item => {
              const user = collaborators.find(u => u.id === item.userId);
              return (
                <div key={item.id} className="p-2 border rounded hover:bg-muted">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback style={{ backgroundColor: user?.color || '#888' }}>
                        {user?.name.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{user?.name || 'مستخدم'}</p>
                    <span className="text-xs text-gray-500">{formatTime(item.timestamp)}</span>
                  </div>
                  <p className="text-sm mt-1">{item.action}</p>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
      
      {activeTab === 'chat' && (
        <div className="p-3 border-t">
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Input 
              placeholder="اكتب رسالتك..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>إرسال</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeCollaboration;
