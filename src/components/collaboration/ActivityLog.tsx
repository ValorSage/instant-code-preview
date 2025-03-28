
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ActivityItem {
  id: string;
  username: string;
  action: string;
  timestamp: string;
  fileId?: string;
  fileName?: string;
}

interface ActivityLogProps {
  activities: ActivityItem[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">نشاط التعاون</h3>
        <Badge variant="outline" className="text-xs">
          {activities.length} عمليات
        </Badge>
      </div>
      
      <ScrollArea className="h-[200px] rounded-md border">
        <div className="p-2 space-y-2">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div 
                key={activity.id} 
                className="text-xs p-2 bg-muted/40 rounded-md"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{activity.username}</span>
                  <span className="text-muted-foreground">{activity.timestamp}</span>
                </div>
                <p className="mt-1">
                  {activity.action}
                  {activity.fileName && (
                    <Badge variant="outline" className="text-[10px] mr-1 ml-1">
                      {activity.fileName}
                    </Badge>
                  )}
                </p>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground text-center py-3">
              لا يوجد نشاط حالياً
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActivityLog;
