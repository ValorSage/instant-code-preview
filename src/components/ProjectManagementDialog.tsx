
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProjectWorkspace from './ProjectWorkspace';

interface ProjectManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectManagementDialog: React.FC<ProjectManagementDialogProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إدارة المشاريع</DialogTitle>
          <DialogDescription>
            يمكنك إدارة المشاريع وربطها مع مساحات العمل المختلفة هنا.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ProjectWorkspace />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectManagementDialog;
