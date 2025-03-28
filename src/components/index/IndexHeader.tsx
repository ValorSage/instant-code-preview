
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Folders, 
  BookOpen, 
  Beaker
} from 'lucide-react';
import { useProjects } from '@/contexts/ProjectContext';

const IndexHeader = ({
  handleProjectManagementOpen
}: {
  handleProjectManagementOpen: () => void
}) => {
  const { currentProject } = useProjects();
  
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        {currentProject ? (
          <Badge variant="outline" className="text-xs px-3 py-1 h-7">
            {currentProject.name}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs px-3 py-1 h-7 bg-muted text-muted-foreground">
            لا يوجد مشروع
          </Badge>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleProjectManagementOpen}
          className="h-7 gap-1 text-xs"
        >
          <Folders className="h-3.5 w-3.5" />
          <span>إدارة المشاريع</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          className="h-7 gap-1 text-xs"
        >
          <Link to="/projects">
            <BookOpen className="h-3.5 w-3.5" />
            <span>كل المشاريع</span>
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          className="h-7 gap-1 text-xs"
        >
          <Link to="/simulation">
            <Beaker className="h-3.5 w-3.5" />
            <span>بيئة المحاكاة</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default IndexHeader;
