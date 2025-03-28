
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Code, RefreshCw, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import LanguageSelector from '@/components/LanguageSelector';

const SimulationPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('// أكتب الكود هنا\nconsole.log("مرحباً بالعالم");');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('جارٍ تشغيل المحاكاة...');
    
    // محاكاة تشغيل الكود
    setTimeout(() => {
      setIsRunning(false);
      
      // محاكاة نتائج مختلفة حسب اللغة المحددة
      let simulationOutput = '';
      
      if (selectedLanguage === 'javascript' || selectedLanguage === 'typescript') {
        simulationOutput = 'مرحباً بالعالم\nتم تنفيذ الكود بنجاح.';
      } else if (selectedLanguage === 'python') {
        simulationOutput = 'مرحباً بالعالم\nProcess finished with exit code 0';
      } else if (selectedLanguage === 'java') {
        simulationOutput = 'مرحباً بالعالم\nCompilation successful.\nExecution finished.';
      } else {
        simulationOutput = 'تم تنفيذ الكود بنجاح.';
      }
      
      setOutput(simulationOutput);
      
      toast({
        title: "اكتمل التنفيذ",
        description: "تم تنفيذ الكود في بيئة المحاكاة بنجاح",
        duration: 2000,
      });
    }, 2000);
  };
  
  const handleReset = () => {
    setCode('// أكتب الكود هنا\nconsole.log("مرحباً بالعالم");');
    setOutput('');
    
    toast({
      title: "تم إعادة التعيين",
      description: "تم مسح الكود ونتائج التنفيذ",
      duration: 2000,
    });
  };
  
  const handleSave = () => {
    // محاكاة حفظ الكود
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الكود بنجاح",
      duration: 2000,
    });
  };
  
  const handleLanguageChange = (langId: string) => {
    setSelectedLanguage(langId);
    
    // تعديل نموذج الكود حسب اللغة المحددة
    if (langId === 'python') {
      setCode('# أكتب الكود هنا\nprint("مرحباً بالعالم")');
    } else if (langId === 'java') {
      setCode('// أكتب الكود هنا\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("مرحباً بالعالم");\n  }\n}');
    } else if (langId === 'cpp') {
      setCode('// أكتب الكود هنا\n#include <iostream>\n\nint main() {\n  std::cout << "مرحباً بالعالم" << std::endl;\n  return 0;\n}');
    } else {
      setCode('// أكتب الكود هنا\nconsole.log("مرحباً بالعالم");');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        html="" 
        css="" 
        js=""
        script=""
        isDarkMode={false}
        toggleDarkMode={() => {}}
        onSave={() => {}}
      />
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">بيئة المحاكاة</h1>
            <p className="text-muted-foreground">تشغيل الأكواد في بيئات آمنة ومعزولة</p>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageSelect={handleLanguageChange}
            />
            <Button asChild variant="outline">
              <Link to="/">
                <Code className="mr-2 h-4 w-4" />
                العودة للمحرر
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle>محرر الكود</CardTitle>
              <CardDescription>أكتب الكود بلغة {languages.find(l => l.id === selectedLanguage)?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <textarea
                  className="w-full h-80 p-4 font-mono text-sm bg-muted/50 focus:outline-none resize-none"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-4">
                <Button variant="outline" onClick={handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  إعادة تعيين
                </Button>
                <Button variant="outline" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  حفظ
                </Button>
                <Button onClick={handleRunCode} disabled={isRunning}>
                  <Play className="mr-2 h-4 w-4" />
                  تشغيل
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>نتائج التنفيذ</CardTitle>
              <CardDescription>مخرجات تنفيذ الكود في بيئة المحاكاة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <pre className="w-full h-80 p-4 font-mono text-sm bg-muted/50 overflow-auto whitespace-pre-wrap">
                  {output || 'لم يتم تنفيذ أي كود بعد.'}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>بيئات المحاكاة المتاحة</CardTitle>
              <CardDescription>اختر من بين بيئات المحاكاة المتعددة لتشغيل الكود</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="language">
                <TabsList className="mb-4">
                  <TabsTrigger value="language">لغات البرمجة</TabsTrigger>
                  <TabsTrigger value="frameworks">أطر العمل</TabsTrigger>
                  <TabsTrigger value="games">الألعاب</TabsTrigger>
                </TabsList>
                
                <TabsContent value="language">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {languages.map(lang => (
                      <Button 
                        key={lang.id}
                        variant={selectedLanguage === lang.id ? "secondary" : "outline"}
                        className="h-20 flex flex-col items-center justify-center"
                        onClick={() => handleLanguageChange(lang.id)}
                      >
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center mb-2 text-xs font-bold">
                          {lang.icon}
                        </div>
                        <span>{lang.name}</span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="frameworks">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center mb-2 text-xs font-bold">
                        React
                      </div>
                      <span>React</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center mb-2 text-xs font-bold">
                        Vue
                      </div>
                      <span>Vue.js</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center mb-2 text-xs font-bold">
                        Ang
                      </div>
                      <span>Angular</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center mb-2 text-xs font-bold">
                        Node
                      </div>
                      <span>Node.js</span>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="games">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center mb-2 text-xs font-bold">
                        Unity
                      </div>
                      <span>Unity</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center mb-2 text-xs font-bold">
                        UE
                      </div>
                      <span>Unreal Engine</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center mb-2 text-xs font-bold">
                        Phaser
                      </div>
                      <span>Phaser.js</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center mb-2 text-xs font-bold">
                        Three
                      </div>
                      <span>Three.js</span>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

// نعرف المتغير languages هنا ليكون متاحًا ضمن الكومبوننت
const languages = [
  { id: 'javascript', name: 'JavaScript', icon: 'js' },
  { id: 'typescript', name: 'TypeScript', icon: 'ts' },
  { id: 'python', name: 'Python', icon: 'py' },
  { id: 'java', name: 'Java', icon: 'java' },
  { id: 'cpp', name: 'C++', icon: 'cpp' },
  { id: 'csharp', name: 'C#', icon: 'cs' },
  { id: 'html', name: 'HTML', icon: 'html' },
  { id: 'css', name: 'CSS', icon: 'css' },
];

export default SimulationPage;
