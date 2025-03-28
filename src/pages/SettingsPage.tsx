import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { Code, Save, Globe, Files, Paintbrush } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import DirectionToggle from '@/components/DirectionToggle';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const SettingsPage = () => {
  const [direction, setDirection] = useState<'ltr' | 'rtl'>(document.documentElement.dir as 'ltr' | 'rtl');
  const [theme, setTheme] = useState('system');
  const [fontSize, setFontSize] = useState('14');
  const [tabSize, setTabSize] = useState('2');
  const [wordWrap, setWordWrap] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  
  const handleSaveSettings = () => {
    // محاكاة حفظ الإعدادات
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تطبيق الإعدادات الجديدة بنجاح",
      duration: 2000,
    });
  };
  
  const handleDirectionChange = (newDirection: 'ltr' | 'rtl') => {
    setDirection(newDirection);
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const fontSizes = ['12', '14', '16', '18', '20', '24'];
  const tabSizes = ['2', '4', '8'];
  const languageOptions = [
    { value: 'ar', label: 'العربية' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' },
  ];

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
            <h1 className="text-2xl font-bold">الإعدادات</h1>
            <p className="text-muted-foreground">خصص بيئة التطوير حسب احتياجاتك</p>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <DirectionToggle 
              direction={direction}
              onChange={handleDirectionChange}
            />
            
            <Button asChild variant="outline">
              <Link to="/">
                <Code className="mr-2 h-4 w-4" />
                العودة للمحرر
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="editor">
          <TabsList className="mb-4">
            <TabsTrigger value="editor">المحرر</TabsTrigger>
            <TabsTrigger value="appearance">المظهر</TabsTrigger>
            <TabsTrigger value="language">اللغة</TabsTrigger>
            <TabsTrigger value="collaboration">التعاون</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات المحرر</CardTitle>
                <CardDescription>تخصيص إعدادات محرر الكود</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="fontSize">حجم الخط</Label>
                      <Select value={fontSize} onValueChange={setFontSize}>
                        <SelectTrigger id="fontSize">
                          <SelectValue placeholder="اختر حجم الخط" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontSizes.map(size => (
                            <SelectItem key={size} value={size}>{size}px</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="tabSize">حجم التبويب</Label>
                      <Select value={tabSize} onValueChange={setTabSize}>
                        <SelectTrigger id="tabSize">
                          <SelectValue placeholder="اختر حجم التبويب" />
                        </SelectTrigger>
                        <SelectContent>
                          {tabSizes.map(size => (
                            <SelectItem key={size} value={size}>{size} مسافات</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="wordWrap">التفاف النص</Label>
                      <Switch 
                        id="wordWrap" 
                        checked={wordWrap} 
                        onCheckedChange={setWordWrap}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoSave">حفظ تلقائي</Label>
                      <Switch 
                        id="autoSave" 
                        checked={autoSave} 
                        onCheckedChange={setAutoSave}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="minimap">خريطة المصغرة</Label>
                      <Switch 
                        id="minimap" 
                        checked={false} 
                        onCheckedChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    حفظ الإعدادات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات المظهر</CardTitle>
                <CardDescription>تخصيص مظهر وسمة المحرر</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>السمة</Label>
                  <ThemeSwitcher 
                    isDarkMode={isDarkMode} 
                    onToggle={toggleDarkMode} 
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="direction">اتجاه الواجهة</Label>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button 
                        variant={direction === 'rtl' ? "secondary" : "outline"} 
                        size="sm"
                        onClick={() => handleDirectionChange('rtl')}
                      >
                        RTL - يمين لليسار
                      </Button>
                      <Button 
                        variant={direction === 'ltr' ? "secondary" : "outline"} 
                        size="sm"
                        onClick={() => handleDirectionChange('ltr')}
                      >
                        LTR - يسار لليمين
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="accentColor">لون التمييز</Label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {['#4f46e5', '#059669', '#db2777', '#ea580c', '#8b5cf6'].map((color, index) => (
                        <Button 
                          key={index}
                          variant="outline" 
                          className="h-10 w-full rounded-md p-0 overflow-hidden"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    <Paintbrush className="mr-2 h-4 w-4" />
                    تطبيق
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات اللغة</CardTitle>
                <CardDescription>تخصيص لغة الواجهة واللغات المدعومة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="interfaceLanguage">لغة الواجهة</Label>
                    <Select defaultValue={direction === 'rtl' ? 'ar' : 'en'}>
                      <SelectTrigger id="interfaceLanguage">
                        <SelectValue placeholder="اختر لغة الواجهة" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label>لغات البرمجة المفضلة</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'Java'].map((lang, index) => (
                        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Switch id={`lang-${index}`} defaultChecked={index < 3} />
                          <Label htmlFor={`lang-${index}`}>{lang}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    <Globe className="mr-2 h-4 w-4" />
                    حفظ إعدادات اللغة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="collaboration">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات التعاون</CardTitle>
                <CardDescription>إعدادات العمل الجماعي والتعاون في الوقت الحقيقي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="realtime">تعاو�� في الوقت الحقيقي</Label>
                      <Switch id="realtime" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cursors">إظهار مؤشرات المتعاونين</Label>
                      <Switch id="cursors" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">إشعارات التغييرات</Label>
                      <Switch id="notifications" defaultChecked />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="defaultPermission">صلاحيات افتراضية للمدعوين</Label>
                    <Select defaultValue="read">
                      <SelectTrigger id="defaultPermission" className="mt-2">
                        <SelectValue placeholder="اختر الصلاحيات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read">قراءة فقط</SelectItem>
                        <SelectItem value="readwrite">قراءة وكتابة</SelectItem>
                        <SelectItem value="admin">مسؤول</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="mt-4">
                      <Label htmlFor="shareLink">رابط المشاركة</Label>
                      <div className="flex mt-2">
                        <Input id="shareLink" value="https://ako.js/shared/proj1234" readOnly className="rounded-r-none" />
                        <Button variant="secondary" className="rounded-l-none">
                          نسخ
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    <Files className="mr-2 h-4 w-4" />
                    حفظ إعدادات التعاون
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SettingsPage;
