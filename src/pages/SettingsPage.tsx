
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { useEditor } from '@/hooks/use-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Save, Upload } from 'lucide-react';
import { getInitials } from '@/utils/userUtils';

const SettingsPage = () => {
  const { user, profile, signOut } = useAuth();
  const editor = useEditor();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setAvatarUrl(profile.avatarUrl || '');
      setLoading(false);
    }
  }, [profile]);
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    setUploadingAvatar(true);
    
    try {
      // In a real implementation, upload to Supabase Storage
      // For demo, simulate upload with a timeout
      setTimeout(() => {
        // Mock avatar URL
        const mockUrl = URL.createObjectURL(file);
        setAvatarUrl(mockUrl);
        
        toast({
          title: "تم تغيير الصورة الشخصية",
          description: "تم تحديث صورتك الشخصية بنجاح",
        });
        
        setUploadingAvatar(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "خطأ في تحميل الصورة",
        description: "حدث خطأ أثناء تحميل الصورة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      setUploadingAvatar(false);
    }
  };
  
  const handleUpdateProfile = async () => {
    if (!username) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المستخدم",
        variant: "destructive",
      });
      return;
    }
    
    setSaving(true);
    
    try {
      // In a real implementation, update profile in Supabase
      // For demo, simulate update with a timeout
      setTimeout(() => {
        toast({
          title: "تم تحديث الملف الشخصي",
          description: "تم تحديث معلومات حسابك بنجاح",
        });
        
        setSaving(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "خطأ في تحديث الملف الشخصي",
        description: "حدث خطأ أثناء تحديث المعلومات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      setSaving(false);
    }
  };
  
  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال جميع حقول كلمة المرور",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور الجديدة غير متطابقة",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "خطأ",
        description: "يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }
    
    setSaving(true);
    
    try {
      // In a real implementation, update password in Supabase
      // For demo, simulate update with a timeout
      setTimeout(() => {
        toast({
          title: "تم تغيير كلمة المرور",
          description: "تم تغيير كلمة المرور بنجاح",
        });
        
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSaving(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "خطأ في تغيير كلمة المرور",
        description: "حدث خطأ أثناء تغيير كلمة المرور. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      setSaving(false);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          html={editor.html} 
          css={editor.css} 
          js={editor.js}
          script={editor.script}
          isDarkMode={editor.isDarkMode}
          toggleDarkMode={editor.toggleDarkMode}
          onSave={editor.handleSave}
        />
        <div className="container mx-auto py-8 flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        html={editor.html} 
        css={editor.css} 
        js={editor.js}
        script={editor.script}
        isDarkMode={editor.isDarkMode}
        toggleDarkMode={editor.toggleDarkMode}
        onSave={editor.handleSave}
      />
      
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">الإعدادات</h1>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
              <TabsTrigger value="security">الأمان</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الملف الشخصي</CardTitle>
                  <CardDescription>
                    قم بتحديث معلومات حسابك وصورتك الشخصية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex flex-col items-center">
                      <Avatar className="w-24 h-24 border-2">
                        <AvatarImage src={avatarUrl} alt={username} />
                        <AvatarFallback className="text-xl bg-primary/10 text-primary">
                          {getInitials(username)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="mt-4">
                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                          <div className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition">
                            <Upload className="h-4 w-4" />
                            <span>{uploadingAvatar ? "جارِ التحميل..." : "تغيير الصورة"}</span>
                          </div>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                            disabled={uploadingAvatar}
                          />
                        </Label>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ''}
                          readOnly
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                          لا يمكن تغيير البريد الإلكتروني
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username">اسم المستخدم</Label>
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="اسم المستخدم"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate('/')}>
                    إلغاء
                  </Button>
                  <Button onClick={handleUpdateProfile} disabled={saving}>
                    {saving ? (
                      <>جارِ الحفظ...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        حفظ التغييرات
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>الأمان</CardTitle>
                  <CardDescription>
                    قم بتغيير كلمة المرور وإعدادات الأمان الأخرى
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">تغيير كلمة المرور</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="old-password">كلمة المرور الحالية</Label>
                        <div className="relative">
                          <Input
                            id="old-password"
                            type={showOldPassword ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="كلمة المرور الحالية"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                          >
                            {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="كلمة المرور الجديدة"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="تأكيد كلمة المرور الجديدة"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">تسجيل الخروج من جميع الأجهزة</h3>
                    <p className="text-muted-foreground">
                      سيؤدي هذا إلى تسجيل خروجك من جميع الأجهزة التي قمت بتسجيل الدخول إليها، بما في ذلك هذا الجهاز.
                    </p>
                    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleLogout}>
                      تسجيل الخروج من جميع الأجهزة
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handlePasswordChange} disabled={saving}>
                    {saving ? "جارِ تغيير كلمة المرور..." : "تغيير كلمة المرور"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
