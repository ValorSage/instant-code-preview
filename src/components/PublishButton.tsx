
import React, { useState } from 'react';
import { ButtonImproved } from '@/components/ui/button-improved';
import { Globe } from 'lucide-react';
import { useProjects } from '@/contexts/ProjectContext';
import PublishProjectDialog from '@/components/publishing/PublishProjectDialog';
import { toast } from '@/hooks/use-toast';

interface PublishButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'neon' | 'glass';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xl';
  className?: string;
}

const PublishButton: React.FC<PublishButtonProps> = ({ 
  variant = 'neon',
  size = 'default',
  className = ''
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentProject } = useProjects();
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    
    // إضافة تأثير الضغط على الزر باستخدام toast notification
    toast({
      title: "جاري تجهيز واجهة النشر",
      description: "يتم الآن تحضير خيارات النشر لمشروعك",
      duration: 2000,
    });
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  // توفير قيم افتراضية في حالة كان currentProject فارغاً
  const projectName = currentProject?.name || 'مشروع بدون اسم';
  const projectId = currentProject?.id || 'temp-id';
  
  return (
    <>
      <ButtonImproved
        variant={variant}
        size={size}
        className={`hover-lift ${className}`}
        onClick={handleOpenDialog}
        hasAnimation={true}
      >
        {size === 'icon' ? (
          <Globe className="h-4 w-4" />
        ) : (
          <>
            <Globe className="h-4 w-4 mr-2" />
            <span>نشر المشروع</span>
          </>
        )}
      </ButtonImproved>
      
      <PublishProjectDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        projectName={projectName}
        projectId={projectId}
      />
    </>
  );
};

export default PublishButton;
