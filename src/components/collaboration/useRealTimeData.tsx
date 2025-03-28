
import { useState, useEffect } from 'react';

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'idle';
  lastActive?: Date;
  role?: string;
}

interface Activity {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  timestamp: Date;
  details?: string;
}

export const useRealTimeData = (projectId?: string) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    
    // In a real app, you would fetch data from Supabase or another real-time database
    const loadMockData = () => {
      const mockCollaborators: Collaborator[] = [
        {
          id: '1',
          name: 'أحمد محمد',
          status: 'online',
          role: 'مالك',
          lastActive: new Date()
        },
        {
          id: '2',
          name: 'سارة أحمد',
          status: 'online',
          role: 'محرر',
          lastActive: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
        },
        {
          id: '3',
          name: 'محمد علي',
          status: 'idle',
          role: 'مشاهد',
          lastActive: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
        },
        {
          id: '4',
          name: 'فاطمة حسن',
          status: 'offline',
          lastActive: new Date(Date.now() - 120 * 60 * 1000) // 2 hours ago
        }
      ];
      
      const mockActivities: Activity[] = [
        {
          id: '1',
          user: { id: '1', name: 'أحمد محمد' },
          action: 'أنشأ ملف',
          target: 'index.html',
          timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
        },
        {
          id: '2',
          user: { id: '2', name: 'سارة أحمد' },
          action: 'عدل ملف',
          target: 'style.css',
          timestamp: new Date(Date.now() - 25 * 60 * 1000) // 25 minutes ago
        },
        {
          id: '3',
          user: { id: '1', name: 'أحمد محمد' },
          action: 'حذف ملف',
          target: 'old-script.js',
          timestamp: new Date(Date.now() - 20 * 60 * 1000) // 20 minutes ago
        },
        {
          id: '4',
          user: { id: '3', name: 'محمد علي' },
          action: 'انضم للمشروع',
          timestamp: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
        },
        {
          id: '5',
          user: { id: '2', name: 'سارة أحمد' },
          action: 'أنشأ مجلد',
          target: 'components',
          timestamp: new Date(Date.now() - 90 * 60 * 1000) // 1.5 hours ago
        }
      ];
      
      setCollaborators(mockCollaborators);
      setActivities(mockActivities);
      setLoading(false);
    };
    
    // Simulate network delay
    const timer = setTimeout(loadMockData, 1000);
    
    return () => clearTimeout(timer);
  }, [projectId]);
  
  return {
    collaborators,
    activities,
    loading
  };
};
