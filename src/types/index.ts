
import type { Database } from '@/integrations/supabase/types';

// Type definitions using the auto-generated Supabase types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectFile = Database['public']['Tables']['project_files']['Row'];
export type Collaborator = Database['public']['Tables']['collaborators']['Row'];
export type Simulator = Database['public']['Tables']['simulators']['Row'];
export type ExecutionLog = Database['public']['Tables']['execution_logs']['Row'];

// Additional type definitions for our application
export interface AuthUser {
  id: string;
  email?: string;
  username?: string;
  avatarUrl?: string;
}

export interface AuthSession {
  user: AuthUser | null;
  isLoading: boolean;
}

// Project context interface 
export interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  linkedProjects: Record<string, string>;
  addProject: (project: Project) => void;
  removeProject: (projectId: string) => void;
  setCurrentProject: (projectId: string) => void;
  linkProjectToScreen: (screenId: string, projectId: string) => void;
  unlinkProjectFromScreen: (screenId: string) => void;
}
