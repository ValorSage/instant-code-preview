
import React, { useState, useEffect } from 'react';
import { Users, User, MessageSquare, GitPullRequest, History, PenTool, Link, UserPlus, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useProjects } from '@/contexts/ProjectContext';

interface CollaboratorType {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  color: string;
  status: 'online' | 'offline' | 'away';
  lastActive?: string;
  currentFile?: string;
}

interface CommentType {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userColor: string;
  content: string;
  timestamp: string;
  fileId?: string;
  position?: { line: number; column: number };
}

interface CollaborationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Initial mock data for collaborators
const mockCollaborators: CollaboratorType[] = [
  { id: 'u1', name: 'سارة أحمد', color: '#4f46e5', status: 'online', currentFile: 'index.html' },
  { id: 'u2', name: 'محمد علي', color: '#059669', status: 'online', currentFile: 'styles.css' },
  { id: 'u3', name: 'فاطمة حسن', color: '#d946ef', status: 'away', lastActive: '5 دقائق مضت' },
  { id: 'u4', name: 'أحمد خالد', color: '#f97316', status: 'offline', lastActive: 'منذ ساعة' },
];

const mockComments: CommentType[] = [
  { 
    id: 'c1', 
    userId: 'u1', 
    userName: 'سارة أحمد', 
    userColor: '#4f46e5', 
    content: 'يجب أن نضيف خاصية التنسيق التلقائي للكود',
    timestamp: 'منذ 5 دقائق',
    fileId: 'f1',
    position: { line: 15, column: 10 }
  },
  { 
    id: 'c2', 
    userId: 'u2', 
    userName: 'محمد علي', 
    userColor: '#059669', 
    content: 'أتفق، سأعمل على ذلك اليوم',
    timestamp: 'منذ 3 دقائق',
    fileId: 'f1',
    position: { line: 15, column: 10 }
  },
];

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('users');
  const [comments, setComments] = useState<CommentType[]>(mockComments);
  const [collaborators, setCollaborators] = useState<CollaboratorType[]>(mockCollaborators);
  const [newComment, setNewComment] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { currentProject } = useProjects();
  
  useEffect(() => {
    if (isOpen) {
      // Simulate checking for real online collaborators
      // In a real implementation, this would connect to a WebSocket or other real-time service
      setIsConnecting(true);
      
      const timer = setTimeout(() => {
        setIsConnecting(false);
        
        // In a real implementation, this would come from the server
        toast({
          title: "تم الاتصال بخادم التعاون",
          description: currentProject 
            ? `متصل بمشروع: ${currentProject.name}`
            : "لم يتم ربط أي مشروع بهذه الشاشة",
          duration: 3000,
        });
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentProject]);
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const newCommentObj: CommentType = {
      id: `c${comments.length + 1}`,
      userId: 'current-user', // In a real app, this would be the current user's ID
      userName: 'أنت',
      userColor: '#0ea5e9',
      content: newComment,
      timestamp: 'الآن',
      fileId: 'current-file', // In a real app, this would be the current file ID
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
    
    // In a real implementation, this would send the comment to the server
    toast({
      title: "تم إرسال التعليق",
      description: "تم إرسال تعليقك إلى المتعاونين",
      duration: 2000,
    });
  };
  
  const handleInviteCollaborator = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    
    // Generate a random color for the new collaborator
    const colors = ['#4f46e5', '#059669', '#d946ef', '#f97316', '#0ea5e9'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Create a new collaborator based on the email
    const newCollaborator: CollaboratorType = {
      id: `u${collaborators.length + 1}`,
      name: inviteEmail.split('@')[0], // Use the part before @ as the name
      email: inviteEmail,
      color: randomColor,
      status: 'offline', // New collaborators start as offline until they join
    };
    
    setCollaborators([...collaborators, newCollaborator]);
    setInviteEmail('');
    setInviteDialogOpen(false);
    
    // In a real implementation, this would send an invitation email
    toast({
      title: "تمت الدعوة",
      description: `تم إرسال دعوة إلى ${inviteEmail}`,
      duration: 3000,
    });
  };
  
  const handleRemoveCollaborator = (collaboratorId: string) => {
    const updatedCollaborators = collaborators.filter(c => c.id !== collaboratorId);
    setCollaborators(updatedCollaborators);
    
    toast({
      title: "تم إزالة المتعاون",
      description: "تم إزالة المتعاون من المشروع",
      duration: 2000,
    });
  };
  
  const handleShareProject = () => {
    // In a real implementation, this would generate a shareable link
    
    // Simulate copying a link to clipboard
    const dummyLink = `https://akojs.app/project/${Date.now().toString(36)}`;
    navigator.clipboard.writeText(dummyLink).then(() => {
      toast({
        title: "تم نسخ الرابط",
        description: "تم نسخ رابط المشاركة إلى الحافظة",
        duration: 3000,
      });
    });
  };
  
  return (
    <div className={`collaboration-panel fixed inset-y-0 right-0 w-80 bg-background border-l border-border transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-medium flex items-center">
            <Users className="ml-2 h-5 w-5" />
            التعاون
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            &times;
          </Button>
        </div>
        
        {currentProject ? (
          <div className="bg-muted/30 p-2 border-b border-border flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium">{currentProject.name}</span>
              <Badge variant="outline" className="ml-2 h-5 text-xs">
                {isConnecting ? 'جاري الاتصال...' : 'متصل'}
              </Badge>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleShareProject} className="h-7 w-7 p-0">
                    <Link className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>مشاركة رابط المشروع</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <div className="bg-muted/30 p-2 border-b border-border">
            <p className="text-sm text-muted-foreground">لم يتم ربط أي مشروع</p>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 p-1 mx-4 mt-2">
            <TabsTrigger value="users" className="text-xs py-1">
              <User className="h-3.5 w-3.5 ml-1" />
              المستخدمون
            </TabsTrigger>
            <TabsTrigger value="comments" className="text-xs py-1">
              <MessageSquare className="h-3.5 w-3.5 ml-1" />
              التعليقات
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs py-1">
              <History className="h-3.5 w-3.5 ml-1" />
              التاريخ
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="users" className="h-full overflow-hidden p-0 m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">متصل الآن</h4>
                    {collaborators.filter(c => c.status === 'online').map(collaborator => (
                      <div key={collaborator.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors mb-2">
                        <div className="flex items-center">
                          <div className="relative">
                            <Avatar className="h-8 w-8 border-2" style={{ borderColor: collaborator.color }}>
                              <AvatarFallback style={{ backgroundColor: `${collaborator.color}30`, color: collaborator.color }}>
                                {collaborator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"></span>
                          </div>
                          <div className="mr-3 overflow-hidden">
                            <p className="text-sm font-medium">{collaborator.name}</p>
                            {collaborator.currentFile && (
                              <p className="text-xs text-muted-foreground truncate">{collaborator.currentFile}</p>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveCollaborator(collaborator.id)}
                          className="h-7 w-7 p-0 opacity-30 hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">غير متصل</h4>
                    {collaborators.filter(c => c.status !== 'online').map(collaborator => (
                      <div key={collaborator.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors mb-2">
                        <div className="flex items-center">
                          <div className="relative">
                            <Avatar className="h-8 w-8 border-2 opacity-70" style={{ borderColor: `${collaborator.color}80` }}>
                              <AvatarFallback style={{ backgroundColor: `${collaborator.color}20`, color: `${collaborator.color}90` }}>
                                {collaborator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-gray-400 border-2 border-background"></span>
                          </div>
                          <div className="mr-3">
                            <p className="text-sm font-medium text-muted-foreground">{collaborator.name}</p>
                            {collaborator.lastActive && (
                              <p className="text-xs text-muted-foreground">{collaborator.lastActive}</p>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveCollaborator(collaborator.id)}
                          className="h-7 w-7 p-0 opacity-30 hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="w-full text-xs flex items-center" variant="outline">
                          <UserPlus className="h-3.5 w-3.5 ml-1.5" />
                          دعوة متعاونين
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>دعوة متعاونين للمشروع</DialogTitle>
                          <DialogDescription>
                            أدخل البريد الإلكتروني للشخص الذي تريد دعوته للتعاون في هذا المشروع.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="collaborator-email">البريد الإلكتروني</Label>
                            <Input
                              id="collaborator-email"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              placeholder="example@domain.com"
                              type="email"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                            إلغاء
                          </Button>
                          <Button onClick={handleInviteCollaborator}>
                            إرسال الدعوة
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button size="sm" className="w-full text-xs mt-2" variant="default">
                      <Link className="h-3.5 w-3.5 ml-1.5" />
                      إنشاء رابط للمشاركة
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="comments" className="h-full overflow-hidden p-0 m-0 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="bg-muted/40 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <Avatar className="h-6 w-6 border-2" style={{ borderColor: comment.userColor }}>
                          <AvatarFallback style={{ backgroundColor: `${comment.userColor}30`, color: comment.userColor }}>
                            {comment.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="mr-2 text-sm font-medium">{comment.userName}</span>
                        <span className="mr-auto text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      {comment.fileId && comment.position && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="bg-muted/60 px-1.5 py-0.5 rounded">
                            السطر {comment.position.line}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t border-border">
                <div className="flex">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 h-9 rounded-r-md border border-l-0 border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none"
                    placeholder="أضف تعليقًا..."
                  />
                  <Button 
                    onClick={handleAddComment}
                    className="h-9 rounded-r-none" 
                    size="sm"
                  >
                    إرسال
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="h-full overflow-hidden p-0 m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  <div className="border-r-2 border-border pr-4 relative">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -right-[7px] top-0"></div>
                    <p className="text-xs text-muted-foreground mb-1">منذ 10 دقائق</p>
                    <p className="text-sm">قامت <span className="font-medium">سارة أحمد</span> بتعديل ملف <span className="font-medium">index.html</span></p>
                  </div>
                  
                  <div className="border-r-2 border-border pr-4 relative">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -right-[7px] top-0"></div>
                    <p className="text-xs text-muted-foreground mb-1">منذ 15 دقيقة</p>
                    <p className="text-sm">قام <span className="font-medium">محمد علي</span> بإنشاء ملف <span className="font-medium">utils.js</span></p>
                  </div>
                  
                  <div className="border-r-2 border-border pr-4 relative">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -right-[7px] top-0"></div>
                    <p className="text-xs text-muted-foreground mb-1">منذ 25 دقيقة</p>
                    <p className="text-sm">قام <span className="font-medium">أحمد خالد</span> بحذف ملف <span className="font-medium">test.js</span></p>
                  </div>
                  
                  <div className="border-r-2 border-border pr-4 relative">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -right-[7px] top-0"></div>
                    <p className="text-xs text-muted-foreground mb-1">منذ 30 دقيقة</p>
                    <p className="text-sm">انضمت <span className="font-medium">فاطمة حسن</span> إلى المشروع</p>
                  </div>
                  
                  <div className="pt-4">
                    <Button size="sm" className="w-full text-xs" variant="outline">
                      <History className="h-3.5 w-3.5 ml-1.5" />
                      عرض المزيد من التاريخ
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default CollaborationPanel;
