
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ProjectSelector from './ProjectSelector';
import { useProjects } from '@/contexts/ProjectContext';
import { toast } from '@/hooks/use-toast';

const ProjectWorkspace: React.FC = () => {
  const { linkedProjects, linkProjectToScreen } = useProjects();
  const [activeTab, setActiveTab] = React.useState<string>('workspace-1');
  const [workspaces, setWorkspaces] = React.useState<string[]>(['workspace-1']);

  const handleAddWorkspace = () => {
    const newWorkspaceId = `workspace-${workspaces.length + 1}`;
    setWorkspaces([...workspaces, newWorkspaceId]);
    setActiveTab(newWorkspaceId);
    
    // Link with the same project as the current workspace if available
    const currentLinkedProject = linkedProjects[activeTab];
    if (currentLinkedProject) {
      linkProjectToScreen(newWorkspaceId, currentLinkedProject);
    }
    
    toast({
      title: "مساحة عمل جديدة",
      description: "تم إضافة مساحة عمل جديدة",
      duration: 2000,
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">مساحات العمل</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddWorkspace}
          className="h-8 gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>إضافة مساحة</span>
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-2">
          {workspaces.map((workspace) => (
            <TabsTrigger key={workspace} value={workspace} className="text-xs">
              {workspace.replace('workspace-', 'مساحة ')}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {workspaces.map((workspace) => (
          <TabsContent key={workspace} value={workspace} className="mt-0">
            <div className="p-2 border rounded-md">
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 block">المشروع المرتبط:</label>
                <ProjectSelector screenId={workspace} />
              </div>
              
              <div className="text-sm text-muted-foreground">
                {linkedProjects[workspace] ? (
                  <p>تم ربط هذه المساحة بالمشروع. يمكنك العمل عليه الآن.</p>
                ) : (
                  <p>لم يتم ربط أي مشروع بهذه المساحة بعد.</p>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProjectWorkspace;
