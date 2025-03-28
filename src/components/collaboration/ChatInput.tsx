
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendFile?: (file: File) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage,
  onSendFile
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    onSendMessage(message);
    setMessage('');
    setIsSubmitting(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onSendFile) {
      onSendFile(e.target.files[0]);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        placeholder="اكتب رسالتك هنا..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[60px] resize-none pr-20 pt-3"
      />
      <div className="absolute bottom-1 right-2 flex items-center space-x-1 rtl:space-x-reverse">
        {onSendFile && (
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8" 
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Paperclip className="h-4 w-4" />
            <input 
              id="file-upload" 
              type="file" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </Button>
        )}
        <Button 
          type="submit" 
          size="icon" 
          disabled={!message.trim() || isSubmitting} 
          className="h-8 w-8"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
