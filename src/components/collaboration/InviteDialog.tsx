
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface InviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
}

const InviteDialog: React.FC<InviteDialogProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [isSending, setIsSending] = useState(false);
  
  const handleInvite = async () => {
    if (!email) {
      toast({
        title: "البريد الإلكتروني مطلوب",
        description: "يرجى إدخال البريد الإلكتروني للشخص الذي تريد دعوته",
        variant: "destructive",
      });
      return;
    }
    
    if (!projectId) {
      toast({
        title: "لا يمكن إرسال الدعوة",
        description: "لا يوجد مشروع محدد حالياً",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Here you would send the invitation to your Supabase backend
      // For demo purposes, we'll just simulate a successful invitation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم إرسال الدعوة",
        description: `تم إرسال دعوة إلى ${email} للتعاون على المشروع`,
      });
      
      setEmail('');
      onClose();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "فشل إرسال الدعوة",
        description: "حدث خطأ أثناء إرسال الدعوة. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>دعوة متعاون جديد</DialogTitle>
          <DialogDescription>
            {projectName 
              ? `أرسل دعوة لشخص للتعاون معك على مشروع "${projectName}"`
              : "أرسل دعوة لشخص للتعاون معك على هذا المشروع"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">الدور</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="حدد دور المتعاون" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>أدوار المتعاونين</SelectLabel>
                  <SelectItem value="editor">محرر (تعديل كامل)</SelectItem>
                  <SelectItem value="viewer">مشاهد (قراءة فقط)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              المحررون يمكنهم تعديل الملفات. المشاهدون يمكنهم عرض الملفات فقط.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button onClick={handleInvite} disabled={isSending}>
            {isSending ? "جاري الإرسال..." : "إرسال الدعوة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;
