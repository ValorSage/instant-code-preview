
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useProjects } from '@/contexts/ProjectContext';
import PublishProjectDialog from '@/components/publishing/PublishProjectDialog';

interface PublishButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const PublishButton: React.FC<PublishButtonProps> = ({ 
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentProject } = useProjects();
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleOpenDialog}
      >
        {size === 'icon' ? (
          <Globe className="h-4 w-4" />
        ) : (
          <>
            <Globe className="h-4 w-4 mr-2" />
            <span>نشر المشروع</span>
          </>
        )}
      </Button>
      
      <PublishProjectDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default PublishButton;
