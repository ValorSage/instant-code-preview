
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link2Off } from 'lucide-react';
import { useProjects } from '@/contexts/ProjectContext';
import { toast } from '@/hooks/use-toast';
import ProjectCommand from './project/ProjectCommand';
import CreateProjectDialog from './project/CreateProjectDialog';

interface ProjectSelectorProps {
  screenId: string;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ screenId }) => {
  const { 
    projects, 
    currentProject, 
    linkedProjects, 
    addProject, 
    linkProjectToScreen,
    unlinkProjectFromScreen,
    setCurrentProject 
  } = useProjects();
  
  const [open, setOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  const currentProjectForScreen = projects.find(
    (p) => p.id === linkedProjects[screenId]
  );

  const handleSelectProject = (projectId: string) => {
    linkProjectToScreen(screenId, projectId);
    setCurrentProject(projectId);
    setOpen(false);
    
    toast({
      title: "تم ربط المشروع",
      description: "تم ربط المشروع بالشاشة الحالية",
      duration: 2000,
    });
  };

  const handleCreateProject = (newProject) => {
    addProject(newProject);
  };

  const handleUnlinkProject = () => {
    unlinkProjectFromScreen(screenId);
    
    toast({
      title: "تم فصل المشروع",
      description: "تم فصل المشروع عن الشاشة الحالية",
      duration: 2000,
    });
  };

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="justify-between min-w-[200px] text-start"
            size="sm"
          >
            {currentProjectForScreen ? (
              <span className="truncate">{currentProjectForScreen.name}</span>
            ) : (
              <span className="text-muted-foreground">اختر مشروع...</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start" sideOffset={5}>
          <ProjectCommand 
            projects={projects}
            selectedProjectId={linkedProjects[screenId]}
            onSelectProject={handleSelectProject}
            onCreateNewProject={() => {
              setOpen(false);
              setNewProjectOpen(true);
            }}
          />
        </PopoverContent>
      </Popover>

      {currentProjectForScreen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleUnlinkProject}
          title="فصل المشروع عن الشاشة"
        >
          <Link2Off className="h-4 w-4" />
        </Button>
      )}

      <CreateProjectDialog 
        isOpen={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default ProjectSelector;
