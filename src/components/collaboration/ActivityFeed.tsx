
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileEdit, Trash, FolderPlus, FilePlus } from 'lucide-react';

interface ActivityItem {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  timestamp: Date | string;
  details?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'edit':
      case 'modified':
      case 'updated':
        return <FileEdit className="h-4 w-4 text-blue-500" />;
      case 'delete':
      case 'removed':
        return <Trash className="h-4 w-4 text-red-500" />;
      case 'create folder':
      case 'added folder':
        return <FolderPlus className="h-4 w-4 text-green-500" />;
      case 'create file':
      case 'added file':
        return <FilePlus className="h-4 w-4 text-green-500" />;
      default:
        return <FileEdit className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const formatTime = (timestamp: Date | string) => {
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    // Less than a minute
    if (diff < 60 * 1000) {
      return 'الآن';
    }
    
    // Less than an hour
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `قبل ${minutes} دقيقة`;
    }
    
    // Less than a day
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `قبل ${hours} ساعة`;
    }
    
    // More than a day
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `قبل ${days} يوم`;
  };
  
  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full">
        <h3 className="text-sm font-medium mb-3">آخر النشاطات</h3>
        
        <ScrollArea className="h-[calc(100%-2rem)]">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                لا توجد أنشطة حتى الآن
              </p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="mt-0.5">
                    {getActivityIcon(activity.action)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        <span>{activity.user.name}</span>
                        <span className="text-muted-foreground font-normal"> {activity.action}</span>
                        {activity.target && (
                          <span className="font-medium"> {activity.target}</span>
                        )}
                      </p>
                      
                      <span className="text-xs text-muted-foreground">
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>
                    
                    {activity.details && (
                      <p className="text-xs text-muted-foreground">
                        {activity.details}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
