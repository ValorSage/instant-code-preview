
import React, { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, User, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  username: string;
  setUsername: (username: string) => void;
  errorMessage: string | null;
  loading: boolean;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
  setActiveTab: (tab: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  errorMessage,
  loading,
  handleSignUp,
  setActiveTab
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSignUp}>
      <CardContent className="space-y-4 pt-4">
        {errorMessage && (
          <Alert variant="destructive" className="border-red-600/40 bg-red-900/20">
            <AlertDescription className="text-white">{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
            <Input 
              type="email" 
              placeholder="البريد الإلكتروني" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="pl-10 py-6 bg-black/30 text-white border-purple-500/20 focus:border-purple-500/50" 
              required 
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
            <Input 
              type="text" 
              placeholder="اسم المستخدم" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="pl-10 py-6 bg-black/30 text-white border-purple-500/20 focus:border-purple-500/50" 
              required 
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="كلمة المرور" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="pl-10 py-6 bg-black/30 text-white border-purple-500/20 focus:border-purple-500/50" 
              required 
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
          <p className="text-xs text-white/60 pr-2">
            يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button 
          type="submit" 
          className={cn(
            buttonVariants({ variant: 'default' }),
            "w-full py-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg"
          )} 
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جارِ إنشاء الحساب...
            </span>
          ) : (
            <span className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              إنشاء حساب
            </span>
          )}
        </Button>
        <div className="mt-4 text-center text-sm text-white/70">
          لديك حساب بالفعل؟{" "}
          <Button variant="link" className="p-0 text-purple-400 hover:text-purple-300" onClick={() => setActiveTab('signin')}>
            تسجيل الدخول
          </Button>
        </div>
      </CardFooter>
    </form>
  );
};

export default SignupForm;
