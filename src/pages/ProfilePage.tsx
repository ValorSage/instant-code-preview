
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Home, User, Settings, Github, Mail, Code, Shield, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSaveProfile = () => {
    toast({
      title: "تم حفظ الملف الشخصي",
      description: "تم تحديث معلومات الملف الشخصي بنجاح",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        html="" 
        css="" 
        js=""
        script=""
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onSave={() => {}}
      />
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">الملف الشخصي</h1>
            <p className="text-muted-foreground">إدارة حسابك ومعلوماتك الشخصية</p>
          </div>
          
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180" />
              العودة للمحرر
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-4 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>المستخدم</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-medium text-lg">محمد أحمد</h3>
                  <p className="text-sm text-muted-foreground">مطور تطبيقات</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    الملف الشخصي
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/projects">
                    <Code className="h-4 w-4 mr-2" />
                    المشاريع
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    الإعدادات
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    الرئيسية
                  </Link>
                </Button>
              </nav>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Tabs defaultValue="general">
              <TabsList>
                <TabsTrigger value="general">معلومات عامة</TabsTrigger>
                <TabsTrigger value="account">الحساب</TabsTrigger>
                <TabsTrigger value="security">الأمان</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>المعلومات الشخصية</CardTitle>
                    <CardDescription>قم بتحديث معلوماتك الشخصية</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">الاسم</label>
                        <Input id="name" defaultValue="محمد أحمد" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium">اسم المستخدم</label>
                        <Input id="username" defaultValue="mohammed.dev" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
                        <Input id="email" type="email" defaultValue="mohammed@example.com" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">رقم الهاتف</label>
                        <Input id="phone" defaultValue="+966555555555" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="bio" className="text-sm font-medium">نبذة تعريفية</label>
                      <textarea 
                        id="bio" 
                        className="w-full min-h-[100px] border border-border rounded-md px-3 py-2 bg-background" 
                        defaultValue="مطور تطبيقات ويب متخصص في React و TypeScript. أعمل على تطوير تطبيقات ويب تفاعلية وسهلة الاستخدام."
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" className="mr-2">إلغاء</Button>
                    <Button onClick={handleSaveProfile}>حفظ التغييرات</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="account" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>تفاصيل الحساب</CardTitle>
                    <CardDescription>تحديث إعدادات حسابك</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">الاشتراك</label>
                      <div className="bg-primary/10 p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">الخطة المجانية</p>
                            <p className="text-sm text-muted-foreground">3 مشاريع، 10 ملفات لكل مشروع</p>
                          </div>
                          <Button variant="outline" size="sm">ترقية</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">التكامل مع الخدمات</label>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div className="flex items-center">
                            <Github className="h-5 w-5 mr-3" />
                            <div>
                              <p className="font-medium">GitHub</p>
                              <p className="text-sm text-muted-foreground">متصل كـ @mohammed</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">فصل</Button>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 mr-3" />
                            <div>
                              <p className="font-medium">Google</p>
                              <p className="text-sm text-muted-foreground">غير متصل</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">اتصال</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>الأمان</CardTitle>
                    <CardDescription>إدارة إعدادات الأمان لحسابك</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">تغيير كلمة المرور</label>
                      <div className="space-y-2">
                        <Input type="password" placeholder="كلمة المرور الحالية" />
                        <Input type="password" placeholder="كلمة المرور الجديدة" />
                        <Input type="password" placeholder="تأكيد كلمة المرور الجديدة" />
                      </div>
                      <Button size="sm" className="mt-2">تحديث كلمة المرور</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Shield className="h-5 w-5" />
                          <div>
                            <p className="font-medium">التوثيق الثنائي</p>
                            <p className="text-sm text-muted-foreground">تحسين أمان حسابك</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">تفعيل</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Eye className="h-5 w-5" />
                          <div>
                            <p className="font-medium">سجل النشاط</p>
                            <p className="text-sm text-muted-foreground">عرض سجل الدخول ونشاط الحساب</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">عرض</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
