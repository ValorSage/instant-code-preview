
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ActivityLog from './ActivityLog';

interface CollaborationTabsProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  messages: any[];
  activities: any[];
  onSendMessage: (content: string) => void;
  onSendFile: (file: File) => void;
}

const CollaborationTabs: React.FC<CollaborationTabsProps> = ({
  activeTab,
  setActiveTab,
  messages,
  activities,
  onSendMessage,
  onSendFile
}) => {
  return (
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
            onSendMessage={onSendMessage} 
            onSendFile={onSendFile} 
          />
        </div>
      </TabsContent>
      
      <TabsContent value="activity" className="flex-1 p-4 pt-2">
        <ActivityLog activities={activities} />
      </TabsContent>
    </Tabs>
  );
};

export default CollaborationTabs;
