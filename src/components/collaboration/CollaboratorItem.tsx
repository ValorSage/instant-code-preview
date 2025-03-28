
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/userUtils';

interface CollaboratorItemProps {
  collaborator: {
    id: string;
    name: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'idle';
    lastActive?: Date;
    role?: string;
  };
}

const CollaboratorItem: React.FC<CollaboratorItemProps> = ({ collaborator }) => {
  const getStatusColor = (status?: 'online' | 'offline' | 'idle') => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };
  
  const statusColor = getStatusColor(collaborator.status);
  
  return (
    <div className="flex items-center justify-between py-2 px-1 hover:bg-muted rounded-md transition-colors group">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <div className="relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getInitials(collaborator.name)}
            </AvatarFallback>
          </Avatar>
          <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ${statusColor} border-2 border-background`} />
        </div>
        
        <div className="space-y-0.5">
          <p className="text-sm font-medium leading-none">{collaborator.name}</p>
          <p className="text-xs text-muted-foreground">
            {collaborator.role || 'متعاون'}
          </p>
        </div>
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Add action buttons if needed */}
      </div>
    </div>
  );
};

export default CollaboratorItem;
