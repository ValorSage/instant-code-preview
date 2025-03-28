
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users, Link2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CollaborationHeaderProps {
  projectId?: string;
  projectName?: string;
  onInviteClick: () => void;
}

const CollaborationHeader: React.FC<CollaborationHeaderProps> = ({
  projectId,
  projectName,
  onInviteClick
}) => {
  const handleShareLink = () => {
    if (!projectId) {
      toast({
        title: "خطأ في المشاركة",
        description: "لا يمكن مشاركة رابط المشروع لأنه غير محدد",
        variant: "destructive",
      });
      return;
    }
    
    // Create a shareable link
    const shareableLink = `${window.location.origin}/projects/shared/${projectId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        toast({
          title: "تم نسخ الرابط",
          description: "تم نسخ رابط المشاركة إلى الحافظة",
        });
      })
      .catch(() => {
        toast({
          title: "فشل النسخ",
          description: "لم نتمكن من نسخ الرابط إلى الحافظة",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="font-semibold text-lg">التعاون في الوقت الفعلي</h2>
        </div>
        
        <Button size="sm" variant="ghost" onClick={handleShareLink}>
          <Link2 className="h-4 w-4 mr-2" />
          <span>مشاركة رابط</span>
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">المشروع الحالي:</span>
          <span className="text-sm font-medium mr-1">{projectName || "لا يوجد مشروع"}</span>
        </div>
        
        <Button size="sm" onClick={onInviteClick}>
          <Plus className="h-4 w-4 mr-2" />
          <span>دعوة متعاون</span>
        </Button>
      </div>
    </div>
  );
};

export default CollaborationHeader;
