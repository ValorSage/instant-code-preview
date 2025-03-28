
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  role: 'owner' | 'editor' | 'viewer';
  lastActive?: string;
}

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  currentUserId: string;
}

const CollaboratorsList: React.FC<CollaboratorsListProps> = ({ 
  collaborators,
  currentUserId
}) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm">المتعاونون النشطون</h3>
      <div className="space-y-2">
        {collaborators.length > 0 ? (
          collaborators.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-card hover:bg-accent/10 transition-colors">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{user.name}</span>
                    {user.id === currentUserId && (
                      <Badge variant="outline" className="text-[10px] h-4 mr-1.5">أنت</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${
                      user.status === 'online' ? 'bg-green-500' : 
                      user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-xs text-muted-foreground">
                      {user.status === 'online' ? 'متصل' : 
                       user.status === 'away' ? 'غير متواجد' : 'غير متصل'}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {user.role === 'owner' ? 'مالك' : 
                 user.role === 'editor' ? 'محرر' : 'مشاهد'}
              </Badge>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground text-center py-3">
            لا يوجد متعاونون نشطون حالياً
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaboratorsList;
