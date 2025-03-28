
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/userUtils';

interface CollaboratorStatus {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'idle';
  currentFile?: string;
  lastActive?: Date;
}

interface CollaborationStatusProps {
  collaborators: CollaboratorStatus[];
  projectName?: string;
  isConnected: boolean;
}

const CollaborationStatus: React.FC<CollaborationStatusProps> = ({
  collaborators,
  projectName,
  isConnected
}) => {
  const onlineCount = collaborators.filter(c => c.status === 'online').length;
  
  const formatTime = (date?: Date) => {
    if (!date) return '';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // أقل من دقيقة
    if (diff < 60000) {
      return 'منذ أقل من دقيقة';
    }
    
    // أقل من ساعة
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
    }
    
    // أقل من يوم
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
    }
    
    // عرض التاريخ
    return new Intl.DateTimeFormat('ar-SA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="border rounded-md p-3 bg-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <User className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">حالة التعاون</h3>
        </div>
        <Badge variant={isConnected ? "outline" : "secondary"} className={`text-xs ${isConnected ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : ''}`}>
          {isConnected ? 'متصل' : 'غير متصل'}
        </Badge>
      </div>
      
      {projectName && (
        <div className="bg-muted p-2 rounded-md text-sm mb-3 flex items-center justify-between">
          <span className="truncate">{projectName}</span>
          <Badge variant="outline" className="text-xs">
            {onlineCount} متصل
          </Badge>
        </div>
      )}
      
      <div className="space-y-2">
        {collaborators.length > 0 ? (
          collaborators.map(collaborator => (
            <TooltipProvider key={collaborator.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/70 transition-colors">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="relative">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                          <AvatarFallback className="text-xs">
                            {getInitials(collaborator.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span 
                          className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background ${
                            collaborator.status === 'online' 
                              ? 'bg-green-500' 
                              : collaborator.status === 'idle' 
                                ? 'bg-yellow-500' 
                                : 'bg-gray-400'
                          }`} 
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium leading-none">{collaborator.name}</div>
                        {collaborator.currentFile && collaborator.status === 'online' && (
                          <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[120px]">
                            {collaborator.currentFile}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {collaborator.status !== 'online' && collaborator.lastActive && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(collaborator.lastActive)}
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <div className="font-medium">{collaborator.name}</div>
                    <div className="text-xs mt-1">
                      {collaborator.status === 'online' 
                        ? 'متصل الآن' 
                        : collaborator.status === 'idle' 
                          ? 'غير نشط' 
                          : 'غير متصل'}
                    </div>
                    {collaborator.currentFile && collaborator.status === 'online' && (
                      <div className="text-xs mt-1">
                        يعمل على: {collaborator.currentFile}
                      </div>
                    )}
                    {collaborator.lastActive && collaborator.status !== 'online' && (
                      <div className="text-xs mt-1">
                        آخر نشاط: {formatTime(collaborator.lastActive)}
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))
        ) : (
          <div className="text-center p-4 text-sm text-muted-foreground">
            لا يوجد متعاونون حاليًا
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationStatus;
