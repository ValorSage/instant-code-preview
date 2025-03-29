
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
