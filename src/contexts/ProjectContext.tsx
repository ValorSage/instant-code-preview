
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define project type
export interface Project {
  id: string;
  name: string;
  description?: string;
  lastModified: Date;
  files: any[]; // This will match your existing file structure
}

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  linkedProjects: Record<string, string>; // screenId -> projectId
  addProject: (project: Project) => void;
  removeProject: (projectId: string) => void;
  setCurrentProject: (projectId: string) => void;
  linkProjectToScreen: (screenId: string, projectId: string) => void;
  unlinkProjectFromScreen: (screenId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [linkedProjects, setLinkedProjects] = useState<Record<string, string>>({
    main: '', // Default screen
  });

  const addProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
    
    // If this is the first project, set it as current
    if (projects.length === 0) {
      setCurrentProjectState(project);
      setLinkedProjects({ main: project.id });
    }
  };

  const removeProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    
    // If current project is removed, set another as current
    if (currentProject?.id === projectId) {
      const newCurrent = projects.find((p) => p.id !== projectId);
      setCurrentProjectState(newCurrent || null);
    }
    
    // Remove any screen links to this project
    const newLinkedProjects = { ...linkedProjects };
    Object.keys(newLinkedProjects).forEach((screenId) => {
      if (newLinkedProjects[screenId] === projectId) {
        delete newLinkedProjects[screenId];
      }
    });
    setLinkedProjects(newLinkedProjects);
  };

  const setCurrentProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setCurrentProjectState(project);
    }
  };

  const linkProjectToScreen = (screenId: string, projectId: string) => {
    setLinkedProjects((prev) => ({
      ...prev,
      [screenId]: projectId,
    }));
  };

  const unlinkProjectFromScreen = (screenId: string) => {
    setLinkedProjects((prev) => {
      const newLinked = { ...prev };
      delete newLinked[screenId];
      return newLinked;
    });
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        linkedProjects,
        addProject,
        removeProject,
        setCurrentProject,
        linkProjectToScreen,
        unlinkProjectFromScreen,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
