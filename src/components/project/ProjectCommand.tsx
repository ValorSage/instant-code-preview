
import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, FolderPlus } from 'lucide-react';
import { Project } from '@/contexts/ProjectContext';

interface ProjectCommandProps {
  projects: Project[];
  selectedProjectId: string | undefined;
  onSelectProject: (projectId: string) => void;
  onCreateNewProject: () => void;
}

const ProjectCommand: React.FC<ProjectCommandProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateNewProject
}) => {
  return (
    <Command>
      <CommandInput placeholder="ابحث عن مشروع..." className="h-9" />
      <CommandList>
        <CommandEmpty>لا توجد مشاريع مطابقة.</CommandEmpty>
        <CommandGroup heading="المشاريع المتاحة">
          {projects.map((project) => (
            <CommandItem
              key={project.id}
              onSelect={() => onSelectProject(project.id)}
              className="flex items-center"
            >
              <Check
                className={`mr-2 h-4 w-4 ${
                  project.id === selectedProjectId
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
              <span className="flex-1 truncate">{project.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup>
          <CommandItem onSelect={onCreateNewProject}>
            <FolderPlus className="mr-2 h-4 w-4" />
            <span>إنشاء مشروع جديد</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default ProjectCommand;
