
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Project } from '@/contexts/ProjectContext';
import { toast } from '@/hooks/use-toast';

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Project) => void;
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({ 
  isOpen, 
  onClose, 
  onCreateProject 
}) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

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

    onCreateProject(newProject);
    setNewProjectName('');
    setNewProjectDescription('');
    onClose();
    
    toast({
      title: "تم إنشاء المشروع",
      description: `تم إنشاء مشروع جديد: ${newProjectName}`,
      duration: 2000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="button" onClick={handleCreateProject}>
            إنشاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
