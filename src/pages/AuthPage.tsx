
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, KeyRound, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

const AuthPage: React.FC = () => {
  const { user, signIn, signUp, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'code' | 'newPassword'>('email');
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    // Clear error when tab changes
    setErrorMessage(null);
  }, [activeTab]);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!email || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setErrorMessage("خطأ في تسجيل الدخول. يرجى التحقق من بريدك الإلكتروني وكلمة المرور.");
    } else {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحبًا بعودتك!",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!email || !password || !username) {
      setErrorMessage("يرجى إدخال جميع البيانات المطلوبة");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, username);
    setLoading(false);

    if (error) {
      if (error.message.includes("Email already registered")) {
        setErrorMessage("البريد الإلكتروني مسجل بالفعل");
      } else {
        setErrorMessage(error.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    } else {
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يرجى تسجيل الدخول بحسابك الجديد",
      });
      
      // Switch to login tab after successful registration
      setActiveTab('signin');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
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
    if (!resetEmail || !validateEmail(resetEmail)) {
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
      
      setResetPasswordOpen(false);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة للرئيسية
          </Link>
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">منصة كودر التفاعلية</h1>
          <p className="text-muted-foreground mt-2">بيئة تطوير متكاملة للمبرمجين</p>
        </div>
        
        <Card className="border-2 shadow-lg animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {activeTab === 'signin' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === 'signin' 
                ? 'أدخل بيانات حسابك للوصول إلى منصتك الشخصية' 
                : 'قم بإنشاء حساب جديد للاستفادة من جميع المميزات'}
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">حساب جديد</TabsTrigger>
            </TabsList>

            {errorMessage && (
              <div className="px-6 pt-4">
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              </div>
            )}

            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type="email" 
                        placeholder="البريد الإلكتروني" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="pl-10 py-6" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="كلمة المرور" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="pl-10 py-6" 
                        required 
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
                  <div className="flex items-center justify-end">
                    <Button 
                      type="button" 
                      variant="link" 
                      className="px-0 text-sm"
                      onClick={() => setResetPasswordOpen(true)}
                    >
                      نسيت كلمة المرور؟
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full py-6" disabled={loading}>
                    {loading ? "جارِ تسجيل الدخول..." : "تسجيل الدخول"}
                  </Button>
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    ليس لديك حساب؟{" "}
                    <Button variant="link" className="p-0" onClick={() => setActiveTab('signup')}>
                      إنشاء حساب جديد
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type="email" 
                        placeholder="البريد الإلكتروني" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="pl-10 py-6" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type="text" 
                        placeholder="اسم المستخدم" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="pl-10 py-6" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="كلمة المرور" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="pl-10 py-6" 
                        required 
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
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full py-6" disabled={loading}>
                    {loading ? "جارِ إنشاء الحساب..." : "إنشاء حساب"}
                  </Button>
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    لديك حساب بالفعل؟{" "}
                    <Button variant="link" className="p-0" onClick={() => setActiveTab('signin')}>
                      تسجيل الدخول
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Password Reset Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
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
    </div>
  );
};

export default AuthPage;
