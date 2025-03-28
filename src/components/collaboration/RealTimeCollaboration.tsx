
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import CollaboratorItem from './CollaboratorItem';
import ActivityFeed from './ActivityFeed';
import { useRealTimeData } from './useRealTimeData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RealTimeCollaborationProps {
  projectId?: string;
}

const RealTimeCollaboration: React.FC<RealTimeCollaborationProps> = ({ projectId }) => {
  const { collaborators, activities, loading } = useRealTimeData(projectId);
  
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">التعاون المباشر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-3/4 mt-4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">التعاون المباشر</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="collaborators" className="h-full">
          <div className="px-4 pt-0 pb-2">
            <TabsList className="w-full">
              <TabsTrigger value="collaborators" className="flex-1">المتعاونون</TabsTrigger>
              <TabsTrigger value="activity" className="flex-1">النشاط</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="collaborators" className="p-4 pt-0 h-[calc(100%-48px)]">
            <div className="space-y-1">
              {collaborators.map((collaborator) => (
                <CollaboratorItem key={collaborator.id} collaborator={collaborator} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="p-4 pt-0 h-[calc(100%-48px)]">
            <ActivityFeed activities={activities} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RealTimeCollaboration;
