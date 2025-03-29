
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
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const generateVerificationCode = () => {
    // توليد رمز عشوائي بين 9-15 رقمًا
    const codeLength = Math.floor(Math.random() * 7) + 9; // 9 إلى 15
    let code = '';
    for (let i = 0; i < codeLength; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  };

  const handleResetPassword = async () => {
    setErrorMessage(null);
    
    if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      setErrorMessage("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    
    setLoading(true);
    
    try {
      // توليد رمز التحقق
      const code = generateVerificationCode();
      setGeneratedCode(code);
      
      // في تطبيق حقيقي، سيتم إرسال الرمز عبر البريد الإلكتروني
      // لأغراض العرض، سنظهره في رسالة منبثقة
      toast({
        title: "تم إرسال رمز التحقق",
        description: `تم إرسال رمز التحقق إلى بريدك الإلكتروني: ${resetEmail}. لأغراض الاختبار، الرمز هو: ${code}`,
        duration: 8000,
      });
      
      setResetStep('code');
    } catch (error) {
      setErrorMessage("لم نتمكن من إرسال رمز التحقق. يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };
  
  const verifyResetCode = () => {
    setErrorMessage(null);
    
    if (!resetCode) {
      setErrorMessage("يرجى إدخال رمز التحقق");
      return;
    }
    
    if (resetCode === generatedCode) {
      setResetStep('newPassword');
    } else {
      setErrorMessage("الرمز الذي أدخلته غير صحيح. يرجى التحقق من رمز التحقق وإعادة المحاولة");
    }
  };
  
  const completePasswordReset = async () => {
    setErrorMessage(null);
    
    if (!newPassword) {
      setErrorMessage("يرجى إدخال كلمة المرور الجديدة");
      return;
    }
    
    if (newPassword.length < 6) {
      setErrorMessage("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
      return;
    }
    
    setLoading(true);
    
    try {
      // في تطبيق حقيقي، سنستخدم Supabase لإعادة تعيين كلمة المرور
      // لأغراض العرض، سنظهر رسالة نجاح فقط
      setTimeout(() => {
        toast({
          title: "تم تغيير كلمة المرور",
          description: "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة",
          duration: 5000,
        });
        
        onOpenChange(false);
        setResetStep('email');
        setResetEmail('');
        setResetCode('');
        setNewPassword('');
        setGeneratedCode('');
        setErrorMessage(null);
        setLoading(false);
      }, 1500);
    } catch (error) {
      setErrorMessage("لم نتمكن من تغيير كلمة المرور. يرجى المحاولة مرة أخرى");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setResetStep('email');
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
      setGeneratedCode('');
      setErrorMessage(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-900/90 backdrop-blur-lg border-purple-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-white">استعادة كلمة المرور</DialogTitle>
          <DialogDescription className="text-center text-white/70">
            {resetStep === 'email' && 'أدخل بريدك الإلكتروني لاستلام رمز التحقق'}
            {resetStep === 'code' && 'أدخل رمز التحقق الذي تم إرساله إلى بريدك الإلكتروني'}
            {resetStep === 'newPassword' && 'أدخل كلمة المرور الجديدة'}
          </DialogDescription>
        </DialogHeader>
        
        {errorMessage && (
          <Alert variant="destructive" className="border-red-600/40 bg-red-900/20">
            <AlertDescription className="text-white">{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        {resetStep === 'email' && (
          <>
            <div className="space-y-4 py-4">
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
                <Input 
                  type="email" 
                  placeholder="البريد الإلكتروني" 
                  value={resetEmail} 
                  onChange={(e) => setResetEmail(e.target.value)} 
                  className="pl-10 py-6 bg-black/30 text-white border-purple-500/20 focus:border-purple-500/50" 
                />
              </div>
              <p className="text-sm text-white/70 pr-2">
                سيتم إرسال رمز التحقق إلى بريدك الإلكتروني. يرجى التحقق من البريد الوارد والرسائل غير المرغوبة.
              </p>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                onClick={handleResetPassword} 
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جارِ الإرسال...
                  </span>
                ) : (
                  "إرسال رمز التحقق"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
        
        {resetStep === 'code' && (
          <>
            <div className="space-y-4 py-4">
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
                <Input 
                  type="text" 
                  placeholder="رمز التحقق" 
                  value={resetCode} 
                  onChange={(e) => setResetCode(e.target.value)} 
                  className="pl-10 py-6 bg-black/30 text-white border-purple-500/20 focus:border-purple-500/50" 
                />
              </div>
              <p className="text-sm text-white/70 pr-2">
                أدخل رمز التحقق المكون من {generatedCode.length} أرقام الذي تم إرساله إلى بريدك الإلكتروني.
              </p>
            </div>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setResetStep('email')}
                className="w-full sm:w-auto order-2 sm:order-1 border-purple-500/20 text-white hover:bg-purple-500/10"
              >
                رجوع
              </Button>
              <Button 
                type="button" 
                onClick={verifyResetCode} 
                className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg"
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
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="كلمة المرور الجديدة" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="pl-10 py-6 bg-black/30 text-white border-purple-500/20 focus:border-purple-500/50" 
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1.5 text-white/60 hover:text-white hover:bg-transparent" 
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
              <p className="text-sm text-white/70 pr-2">
                أدخل كلمة مرور جديدة تحتوي على 6 أحرف على الأقل.
              </p>
            </div>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setResetStep('code')}
                className="w-full sm:w-auto order-2 sm:order-1 border-purple-500/20 text-white hover:bg-purple-500/10"
              >
                رجوع
              </Button>
              <Button 
                type="button" 
                onClick={completePasswordReset} 
                className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جارِ التغيير...
                  </span>
                ) : (
                  "تغيير كلمة المرور"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
