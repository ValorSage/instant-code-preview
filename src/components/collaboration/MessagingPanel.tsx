
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Paperclip, Image, File, X } from 'lucide-react';
import { getInitials } from '@/utils/userUtils';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  attachment?: {
    name: string;
    type: 'image' | 'file';
    url: string;
    size?: string;
  };
  isCurrentUser: boolean;
}

interface MessagingPanelProps {
  messages: Message[];
  onSendMessage: (content: string, attachment?: File) => void;
  onClearMessages?: () => void;
  title?: string;
  height?: string;
}

const MessagingPanel: React.FC<MessagingPanelProps> = ({
  messages,
  onSendMessage,
  onClearMessages,
  title = 'المحادثات',
  height = 'h-[400px]'
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && !attachment) return;
    
    onSendMessage(newMessage, attachment || undefined);
    setNewMessage('');
    setAttachment(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من حجم الملف (5MB كحد أقصى)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "الملف كبير جدًا",
          description: "الحد الأقصى لحجم الملف هو 5 ميجابايت",
          variant: "destructive",
        });
        return;
      }
      
      setAttachment(file);
    }
    
    // إعادة تعيين قيمة input الملفات حتى يمكن اختيار نفس الملف مرة أخرى
    if (e.target.value) {
      e.target.value = '';
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const isImage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'pdf':
        return <File className="h-4 w-4 text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="h-4 w-4 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <File className="h-4 w-4 text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <File className="h-4 w-4 text-orange-500" />;
      case 'zip':
      case 'rar':
        return <File className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`${height} flex flex-col overflow-hidden`}>
      <CardHeader className="py-3 px-4 border-b">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <CardContent className="p-4">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  {!message.isCurrentUser && (
                    <Avatar className="h-8 w-8 mt-1 mr-2">
                      <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                      <AvatarFallback>
                        {getInitials(message.senderName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.isCurrentUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {!message.isCurrentUser && (
                      <div className="font-medium text-xs mb-1">{message.senderName}</div>
                    )}
                    
                    {message.content && (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                    
                    {message.attachment && (
                      <div className="mt-2">
                        {message.attachment.type === 'image' ? (
                          <div className="rounded-md overflow-hidden">
                            <img 
                              src={message.attachment.url} 
                              alt={message.attachment.name}
                              className="max-w-full h-auto"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center bg-background/10 rounded p-2 text-xs">
                            {getFileIcon(message.attachment.name)}
                            <span className="mx-2 truncate">{message.attachment.name}</span>
                            {message.attachment.size && (
                              <span className="text-xs opacity-70">{message.attachment.size}</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className={`text-xs mt-1 ${
                      message.isCurrentUser 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  
                  {message.isCurrentUser && (
                    <Avatar className="h-8 w-8 mt-1 ml-2">
                      <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                      <AvatarFallback>
                        {getInitials(message.senderName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="text-muted-foreground">
                <p>لا توجد رسائل بعد.</p>
                <p className="text-sm mt-1">ابدأ محادثة جديدة!</p>
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>
      
      {attachment && (
        <div className="mx-4 my-2 p-2 bg-muted rounded-md flex items-center justify-between">
          <div className="flex items-center text-sm">
            {isImage(attachment.name) ? (
              <Image className="h-4 w-4 mr-2" />
            ) : (
              getFileIcon(attachment.name)
            )}
            <span className="truncate max-w-[150px] mx-2">{attachment.name}</span>
            <span className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={removeAttachment}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="p-3 border-t mt-auto">
        <div className="flex space-x-2 rtl:space-x-reverse">
          <Input
            placeholder="اكتب رسالتك..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleAttachmentClick}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>إرفاق ملف</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button onClick={handleSendMessage} disabled={!newMessage.trim() && !attachment}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MessagingPanel;
