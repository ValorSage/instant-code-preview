
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useMockCollaborationData = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  
  // Mock data for demonstration
  useEffect(() => {
    // In a real app, you would fetch messages from Supabase
    setMessages([
      {
        id: '1',
        content: 'مرحباً بالجميع في مشروعنا الجديد!',
        sender: {
          id: '1',
          name: 'علي محمد',
          avatar: '',
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isCurrentUser: true,
      },
      {
        id: '2',
        content: 'أهلاً! أنا متحمس للعمل على هذا المشروع معكم.',
        sender: {
          id: '2',
          name: 'سارة أحمد',
          avatar: '',
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isCurrentUser: false,
      },
      {
        id: '3',
        content: 'هل يمكننا البدء بالعمل على الصفحة الرئيسية؟',
        sender: {
          id: '2',
          name: 'سارة أحمد',
          avatar: '',
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
        isCurrentUser: false,
      },
      {
        id: '4',
        content: 'نعم، سأبدأ بإعداد هيكل الصفحة وسأشاركه معكم قريباً.',
        sender: {
          id: '1',
          name: 'علي محمد',
          avatar: '',
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
        isCurrentUser: true,
      },
    ]);
    
    setActivities([
      {
        id: '1',
        username: 'علي محمد',
        action: 'أنشأ ملف جديد',
        timestamp: 'قبل 2 ساعة',
        fileId: '123',
        fileName: 'index.html',
      },
      {
        id: '2',
        username: 'سارة أحمد',
        action: 'عدل الملف',
        timestamp: 'قبل 30 دقيقة',
        fileId: '124',
        fileName: 'style.css',
      },
      {
        id: '3',
        username: 'محمد علي',
        action: 'حذف ملف',
        timestamp: 'قبل 25 دقيقة',
        fileId: '125',
        fileName: 'old.js',
      },
      {
        id: '4',
        username: 'علي محمد',
        action: 'أنشأ مجلد جديد',
        timestamp: 'قبل 20 دقيقة',
        fileId: '126',
        fileName: 'components',
      },
    ]);
  }, []);

  return {
    messages,
    setMessages,
    activities,
    setActivities,
    user
  };
};
