
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ResetPasswordDialog from '@/components/auth/ResetPasswordDialog';
import Head from '@/components/Head';

const AuthPage: React.FC = () => {
  const { user, signIn, signUp, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  
  useEffect(() => {
    // تنظيف رسالة الخطأ عند تغيير التبويب
    setErrorMessage(null);
  }, [activeTab]);

  // إعادة توجيه إذا كان المستخدم مسجل الدخول بالفعل
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
      if (error.message.includes("Email not confirmed")) {
        setErrorMessage("لم يتم تأكيد البريد الإلكتروني بعد. يرجى التحقق من بريدك الإلكتروني");
      } else if (error.message.includes("Invalid login credentials")) {
        setErrorMessage("بيانات تسجيل الدخول غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور");
      } else {
        setErrorMessage(error.message || "خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى");
      }
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
        setErrorMessage("البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد إلكتروني آخر");
      } else {
        setErrorMessage(error.message || "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى");
      }
    } else {
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك.",
        duration: 8000,
      });
      
      // الانتقال إلى تبويب تسجيل الدخول بعد التسجيل الناجح
      setActiveTab('signin');
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
    <>
      <Head 
        title="تسجيل الدخول | منصة كودر التفاعلية"
        description="تسجيل الدخول أو إنشاء حساب جديد في منصة كودر التفاعلية"
      />
      
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 to-black p-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(82,63,165,0.2)_0,rgba(15,12,25,0.8)_100%)]"></div>
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        </div>
        
        <div className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="sm" asChild className="text-white hover:text-primary hover:bg-white/5">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للرئيسية
            </Link>
          </Button>
        </div>
        
        <div className="w-full max-w-md z-10">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white">منصة كودر التفاعلية</h1>
            <p className="text-white/70 mt-2">بيئة تطوير متكاملة للمبرمجين</p>
          </div>
          
          <Card className="backdrop-blur-lg bg-black/30 border-purple-500/20 shadow-2xl animate-fade-in">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-white">
                {activeTab === 'signin' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </CardTitle>
              <CardDescription className="text-center text-white/70">
                {activeTab === 'signin' 
                  ? 'أدخل بيانات حسابك للوصول إلى منصتك الشخصية' 
                  : 'قم بإنشاء حساب جديد للاستفادة من جميع المميزات'}
              </CardDescription>
            </CardHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full bg-gray-800/50">
                <TabsTrigger value="signin" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">حساب جديد</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <LoginForm 
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  errorMessage={errorMessage}
                  loading={loading}
                  handleSignIn={handleSignIn}
                  setResetPasswordOpen={setResetPasswordOpen}
                  setActiveTab={setActiveTab}
                />
              </TabsContent>

              <TabsContent value="signup">
                <SignupForm 
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  username={username}
                  setUsername={setUsername}
                  errorMessage={errorMessage}
                  loading={loading}
                  handleSignUp={handleSignUp}
                  setActiveTab={setActiveTab}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <ResetPasswordDialog 
          open={resetPasswordOpen} 
          onOpenChange={setResetPasswordOpen} 
        />
      </div>
    </>
  );
};

export default AuthPage;
