import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, FolderPlus, Link2Off } from 'lucide-react';
import { useProjects, Project } from '@/contexts/ProjectContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

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
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

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

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المشروع",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      description: newProjectDescription.trim() || undefined,
      lastModified: new Date(),
      files: [], // Initial empty files
    };

    addProject(newProject);
    setNewProjectName('');
    setNewProjectDescription('');
    setNewProjectOpen(false);
    
    toast({
      title: "تم إنشاء المشروع",
      description: `تم إنشاء مشروع جديد: ${newProjectName}`,
      duration: 2000,
    });
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
          <Command>
            <CommandInput placeholder="ابحث عن مشروع..." className="h-9" />
            <CommandList>
              <CommandEmpty>لا توجد مشاريع مطابقة.</CommandEmpty>
              <CommandGroup heading="المشاريع المتاحة">
                {projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    onSelect={() => handleSelectProject(project.id)}
                    className="flex items-center"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        project.id === linkedProjects[screenId]
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    <span className="flex-1 truncate">{project.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setNewProjectOpen(true);
                    }}
                  >
                    <FolderPlus className="mr-2 h-4 w-4" />
                    <span>إنشاء مشروع جديد</span>
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
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

      <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إنشاء مشروع جديد</DialogTitle>
            <DialogDescription>
              أدخل تفاصيل المشروع الجديد الذي تريد إنشاءه.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">اسم المشروع</Label>
              <Input
                id="name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="أدخل اسم المشروع"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">وصف المشروع (اختياري)</Label>
              <Input
                id="description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="أدخل وصف المشروع"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNewProjectOpen(false)}>
              إلغاء
            </Button>
            <Button type="button" onClick={handleCreateProject}>
              إنشاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectSelector;
