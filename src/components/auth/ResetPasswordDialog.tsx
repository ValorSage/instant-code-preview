
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Mail, KeyRound, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({ open, onOpenChange }) => {
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'code' | 'newPassword'>('email');
  const [generatedCode, setGeneratedCode] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  const generateVerificationCode = () => {
    // Generate a random code between 9-15 digits
    const codeLength = Math.floor(Math.random() * 7) + 9; // 9 to 15
    let code = '';
    for (let i = 0; i < codeLength; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate a verification code
      const code = generateVerificationCode();
      setGeneratedCode(code);
      
      // In a real app, this would send the code via email
      // For now, we'll just show it in a toast
      toast({
        title: "تم إرسال رمز التحقق",
        description: `رمز التحقق الخاص بك هو: ${code}`,
      });
      
      setResetStep('code');
      setResetSent(true);
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال رمز التحقق",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const verifyResetCode = () => {
    if (resetCode === generatedCode) {
      setResetStep('newPassword');
    } else {
      toast({
        title: "رمز خاطئ",
        description: "الرمز الذي أدخلته غير صحيح",
        variant: "destructive"
      });
    }
  };
  
  const completePasswordReset = async () => {
    if (newPassword.length < 6) {
      toast({
        title: "كلمة المرور قصيرة",
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, we would use Supabase's password reset
      // For now, we'll just show a success message
      toast({
        title: "تم تغيير كلمة المرور",
        description: "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة",
      });
      
      onOpenChange(false);
      setResetStep('email');
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
      setGeneratedCode('');
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تغيير كلمة المرور",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">استعادة كلمة المرور</DialogTitle>
          <DialogDescription className="text-center">
            {resetStep === 'email' && 'أدخل بريدك الإلكتروني لاستلام رمز التحقق'}
            {resetStep === 'code' && 'أدخل رمز التحقق الذي تم إرساله إلى بريدك الإلكتروني'}
            {resetStep === 'newPassword' && 'أدخل كلمة المرور الجديدة'}
          </DialogDescription>
        </DialogHeader>
        
        {resetStep === 'email' && (
          <>
            <div className="space-y-4 py-4">
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="البريد الإلكتروني" 
                  value={resetEmail} 
                  onChange={(e) => setResetEmail(e.target.value)} 
                  className="pl-10 py-6" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                onClick={handleResetPassword} 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "جارِ الإرسال..." : "إرسال رمز التحقق"}
              </Button>
            </DialogFooter>
          </>
        )}
        
        {resetStep === 'code' && (
          <>
            <div className="space-y-4 py-4">
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="رمز التحقق" 
                  value={resetCode} 
                  onChange={(e) => setResetCode(e.target.value)} 
                  className="pl-10 py-6" 
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setResetStep('email')}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                رجوع
              </Button>
              <Button 
                type="button" 
                onClick={verifyResetCode} 
                className="w-full sm:w-auto order-1 sm:order-2"
                disabled={loading}
              >
                تحقق من الرمز
              </Button>
            </DialogFooter>
          </>
        )}
        
        {resetStep === 'newPassword' && (
          <>
            <div className="space-y-4 py-4">
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="كلمة المرور الجديدة" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="pl-10 py-6" 
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1.5" 
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setResetStep('code')}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                رجوع
              </Button>
              <Button 
                type="button" 
                onClick={completePasswordReset} 
                className="w-full sm:w-auto order-1 sm:order-2"
                disabled={loading}
              >
                {loading ? "جارِ التغيير..." : "تغيير كلمة المرور"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
