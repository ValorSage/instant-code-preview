
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { CardContent, CardFooter } from '@/components/ui/card';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  errorMessage: string | null;
  loading: boolean;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  setResetPasswordOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  errorMessage,
  loading,
  handleSignIn,
  setResetPasswordOpen,
  setActiveTab
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSignIn}>
      <CardContent className="space-y-4 pt-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

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
  );
};

export default LoginForm;
