
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
      avatar?: string;
    };
    timestamp: Date;
    isCurrentUser: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formattedTime = format(message.timestamp, 'p', { locale: arSA });
  
  return (
    <div className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!message.isCurrentUser && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
          <AvatarFallback>
            {message.sender.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%] ${message.isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3 shadow-sm`}>
        {!message.isCurrentUser && (
          <div className="font-medium text-xs mb-1">{message.sender.name}</div>
        )}
        <p className="text-sm break-words">{message.content}</p>
        <div className={`text-xs mt-1 ${message.isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
          {formattedTime}
        </div>
      </div>
      
      {message.isCurrentUser && (
        <Avatar className="h-8 w-8 ml-2">
          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
          <AvatarFallback>
            {message.sender.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
