
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProjects } from '@/contexts/ProjectContext';
import CollaborationHeader from './CollaborationHeader';
import CollaboratorsList from './CollaboratorsList';
import ActivityLog from './ActivityLog';
import InviteDialog from './InviteDialog';
import { useAuth } from '@/contexts/AuthContext';

interface RealTimeCollaborationProps {
  projectId?: string;
}

const RealTimeCollaboration: React.FC<RealTimeCollaborationProps> = ({ projectId }) => {
  const { currentProject } = useProjects();
  const { user } = useAuth();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  
  // Mock data for demonstration
  const [collaborators, setCollaborators] = useState([
    {
      id: '1',
      name: 'علي محمد',
      avatar: '',
      status: 'online',
      role: 'owner',
      lastActive: 'الآن',
    },
    {
      id: '2',
      name: 'سارة أحمد',
      avatar: '',
      status: 'online',
      role: 'editor',
      lastActive: 'قبل 5 دقائق',
    },
    {
      id: '3',
      name: 'محمد علي',
      avatar: '',
      status: 'away',
      role: 'editor',
      lastActive: 'قبل 15 دقيقة',
    },
  ] as any[]);
  
  const [activities, setActivities] = useState([
    {
      id: '1',
      username: 'علي محمد',
      action: 'أنشأ ملف جديد',
      timestamp: 'قبل 2 دقيقة',
      fileId: '123',
      fileName: 'index.html',
    },
    {
      id: '2',
      username: 'سارة أحمد',
      action: 'عدل الملف',
      timestamp: 'قبل 5 دقائق',
      fileId: '124',
      fileName: 'style.css',
    },
    {
      id: '3',
      username: 'محمد علي',
      action: 'حذف ملف',
      timestamp: 'قبل 10 دقائق',
      fileId: '125',
      fileName: 'old.js',
    },
  ] as any[]);
  
  // Simulate fetching collaborators and activities when project changes
  useEffect(() => {
    if (projectId) {
      // Here you would fetch real data from your Supabase database
      console.log('Fetching collaborators and activities for project:', projectId);
      
      // For demo purposes, we're just using the mock data
      // In a real implementation, you would fetch the data from Supabase
    }
  }, [projectId]);
  
  const handleInviteClick = () => {
    setInviteDialogOpen(true);
  };
  
  const handleInviteClose = () => {
    setInviteDialogOpen(false);
  };
  
  return (
    <Card className="h-full overflow-hidden">
      <div className="p-4 min-h-0 flex flex-col h-full">
        <CollaborationHeader
          projectId={projectId}
          projectName={currentProject?.name}
          onInviteClick={handleInviteClick}
        />
        
        <Separator className="my-4" />
        
        <ScrollArea className="flex-grow">
          <div className="space-y-6 pr-3">
            <CollaboratorsList 
              collaborators={collaborators} 
              currentUserId={user?.id || '1'} 
            />
            
            <ActivityLog activities={activities} />
          </div>
        </ScrollArea>
      </div>
      
      <InviteDialog 
        isOpen={inviteDialogOpen} 
        onClose={handleInviteClose} 
        projectId={projectId}
        projectName={currentProject?.name}
      />
    </Card>
  );
};

export default RealTimeCollaboration;
