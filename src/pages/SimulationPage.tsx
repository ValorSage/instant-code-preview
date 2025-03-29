
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import CodeEditor from '@/components/simulation/CodeEditor';
import OutputDisplay from '@/components/simulation/OutputDisplay';
import EnvironmentSelector from '@/components/simulation/EnvironmentSelector';
import LanguageSelector from '@/components/simulation/LanguageSelector';
import Head from '@/components/Head';
import { useAuth } from '@/contexts/AuthContext';

// Definir estructura de datos para lenguajes y entornos
const languages = [
  { id: 'javascript', name: 'JavaScript', icon: 'JS' },
  { id: 'typescript', name: 'TypeScript', icon: 'TS' },
  { id: 'python', name: 'Python', icon: 'PY' },
  { id: 'java', name: 'Java', icon: 'JV' },
  { id: 'cpp', name: 'C++', icon: 'C++' },
  { id: 'csharp', name: 'C#', icon: 'C#' },
  { id: 'html', name: 'HTML', icon: 'HT' },
  { id: 'css', name: 'CSS', icon: 'CS' },
];

const environmentGroups = [
  {
    id: 'language',
    name: 'لغات البرمجة',
    environments: [
      { id: 'javascript', name: 'JavaScript', icon: 'JS' },
      { id: 'typescript', name: 'TypeScript', icon: 'TS' },
      { id: 'python', name: 'Python', icon: 'PY' },
      { id: 'java', name: 'Java', icon: 'JV' },
      { id: 'cpp', name: 'C++', icon: 'C++' },
      { id: 'csharp', name: 'C#', icon: 'C#' },
      { id: 'php', name: 'PHP', icon: 'PHP' },
      { id: 'go', name: 'Go', icon: 'GO' },
    ],
  },
  {
    id: 'frameworks',
    name: 'أطر العمل',
    environments: [
      { id: 'react', name: 'React', icon: 'Re' },
      { id: 'vue', name: 'Vue.js', icon: 'Vue' },
      { id: 'angular', name: 'Angular', icon: 'Ang' },
      { id: 'nodejs', name: 'Node.js', icon: 'Node' },
      { id: 'express', name: 'Express', icon: 'Exp' },
      { id: 'django', name: 'Django', icon: 'Dj' },
      { id: 'spring', name: 'Spring', icon: 'Sp' },
      { id: 'flask', name: 'Flask', icon: 'Fk' },
    ],
  },
  {
    id: 'games',
    name: 'الألعاب',
    environments: [
      { id: 'unity', name: 'Unity', icon: 'Unity' },
      { id: 'unreal', name: 'Unreal Engine', icon: 'UE' },
      { id: 'phaser', name: 'Phaser.js', icon: 'Phs' },
      { id: 'threejs', name: 'Three.js', icon: 'Three' },
      { id: 'godot', name: 'Godot', icon: 'Gdot' },
      { id: 'pixi', name: 'PixiJS', icon: 'Pixi' },
      { id: 'playcanvas', name: 'PlayCanvas', icon: 'PC' },
      { id: 'babylon', name: 'Babylon.js', icon: 'Bbl' },
    ],
  },
];

// Códigos de ejemplo para diferentes lenguajes
const getExampleCode = (languageId: string): string => {
  switch (languageId) {
    case 'python':
      return '# أكتب الكود هنا\nprint("مرحباً بالعالم")';
    case 'java':
      return '// أكتب الكود هنا\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("مرحباً بالعالم");\n  }\n}';
    case 'cpp':
      return '// أكتب الكود هنا\n#include <iostream>\n\nint main() {\n  std::cout << "مرحباً بالعالم" << std::endl;\n  return 0;\n}';
    case 'csharp':
      return '// أكتب الكود هنا\nusing System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("مرحباً بالعالم");\n  }\n}';
    case 'html':
      return '<!-- أكتب الكود هنا -->\n<!DOCTYPE html>\n<html>\n<head>\n  <title>مرحباً بالعالم</title>\n</head>\n<body>\n  <h1>مرحباً بالعالم</h1>\n</body>\n</html>';
    case 'css':
      return '/* أكتب الكود هنا */\nbody {\n  font-family: Arial, sans-serif;\n  background-color: #f0f0f0;\n  color: #333;\n  text-align: center;\n}\n\nh1 {\n  color: #0077cc;\n}';
    case 'typescript':
      return '// أكتب الكود هنا\ninterface Person {\n  name: string;\n  age: number;\n}\n\nfunction greet(person: Person): string {\n  return `مرحباً ${person.name}، عمرك ${person.age} سنة!`;\n}\n\nconst user: Person = {\n  name: "أحمد",\n  age: 30\n};\n\nconsole.log(greet(user));';
    default:
      return '// أكتب الكود هنا\nconsole.log("مرحباً بالعالم");';
  }
};

// Simulación de resultados para diferentes lenguajes
const simulateOutput = (code: string, languageId: string): string => {
  // Aquí se simularía una ejecución real del código
  // Para fines de demostración, devolveremos resultados predefinidos
  
  if (code.includes('error') || code.includes('خطأ')) {
    switch (languageId) {
      case 'python':
        return 'Traceback (most recent call last):\n  File "<stdin>", line 1\nSyntaxError: invalid syntax';
      case 'java':
        return 'Main.java:3: error: \';\' expected\n    System.out.println("مرحباً بالعالم")\n                                       ^\n1 error';
      default:
        return 'Error: Something went wrong in your code.';
    }
  }
  
  if (languageId === 'javascript' || languageId === 'typescript') {
    if (code.includes('fetch') || code.includes('axios')) {
      return '{ "data": ["Item 1", "Item 2", "Item 3"], "status": "success" }';
    }
    return 'مرحباً بالعالم\n[Function executed successfully with no errors]';
  } else if (languageId === 'python') {
    return 'مرحباً بالعالم\n[Program executed with Python 3.9.5]';
  } else if (languageId === 'java') {
    return 'مرحباً بالعالم\n[Compiled and executed with JDK 17]';
  } else if (languageId === 'html') {
    return '[HTML rendered successfully in virtual browser]';
  } else if (languageId === 'css') {
    return '[Styles applied to the document]';
  } else {
    return 'مرحباً بالعالم\n[Code executed successfully]';
  }
};

const SimulationPage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedEnvironment, setSelectedEnvironment] = useState('javascript');
  const [code, setCode] = useState<string>(getExampleCode('javascript'));
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [savedCodes, setSavedCodes] = useState<Record<string, string>>({});
  const { user } = useAuth();

  useEffect(() => {
    // Cargar códigos guardados del localStorage
    const savedLanguageCodes = localStorage.getItem('simulator-saved-codes');
    if (savedLanguageCodes) {
      try {
        setSavedCodes(JSON.parse(savedLanguageCodes));
      } catch (error) {
        console.error('Error parsing saved codes:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Cuando cambie el lenguaje seleccionado, cargar el código guardado o el código de ejemplo
    if (savedCodes[selectedLanguage]) {
      setCode(savedCodes[selectedLanguage]);
    } else {
      setCode(getExampleCode(selectedLanguage));
    }
    setOutput(''); // Limpiar la salida al cambiar de lenguaje
  }, [selectedLanguage, savedCodes]);

  const handleLanguageChange = (langId: string) => {
    setSelectedLanguage(langId);
    setSelectedEnvironment(langId);
  };

  const handleEnvironmentSelect = (envId: string) => {
    setSelectedEnvironment(envId);
    
    // Si el entorno seleccionado es un lenguaje, actualizar también el lenguaje seleccionado
    const languageIds = languages.map(lang => lang.id);
    if (languageIds.includes(envId)) {
      setSelectedLanguage(envId);
    }
    
    toast({
      title: "تم تغيير بيئة التشغيل",
      description: `تم اختيار بيئة ${environmentGroups.flatMap(g => g.environments).find(e => e.id === envId)?.name || envId}`,
      duration: 2000,
    });
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('جارٍ تشغيل المحاكاة...');
    
    // Simular un retraso en la ejecución para hacerla más realista
    setTimeout(() => {
      const result = simulateOutput(code, selectedLanguage);
      setOutput(result);
      setIsRunning(false);
      
      toast({
        title: "اكتمل التنفيذ",
        description: "تم تنفيذ الكود في بيئة المحاكاة",
        duration: 2000,
      });
    }, 1500);
  };
  
  const handleResetCode = () => {
    const confirmReset = window.confirm('هل أنت متأكد من إعادة تعيين الكود؟ سيتم فقدان التغييرات غير المحفوظة.');
    if (confirmReset) {
      setCode(getExampleCode(selectedLanguage));
      setOutput('');
      
      toast({
        title: "تم إعادة التعيين",
        description: "تم مسح الكود ونتائج التنفيذ",
        duration: 2000,
      });
    }
  };
  
  const handleSaveCode = () => {
    // Guardar el código actual para el lenguaje seleccionado
    const newSavedCodes = { ...savedCodes, [selectedLanguage]: code };
    setSavedCodes(newSavedCodes);
    
    // Guardar en localStorage
    localStorage.setItem('simulator-saved-codes', JSON.stringify(newSavedCodes));
    
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الكود بنجاح",
      duration: 2000,
    });
  };

  // Encontrar el nombre del lenguaje seleccionado
  const selectedLanguageName = languages.find(lang => lang.id === selectedLanguage)?.name || selectedLanguage;

  return (
    <>
      <Head 
        title="بيئة المحاكاة | منصة كودر التفاعلية" 
        description="محاكاة وتنفيذ الأكواد البرمجية بمختلف اللغات"
      />
      
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
                languages={languages}
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
            <div className="lg:col-span-3">
              <CodeEditor 
                code={code}
                setCode={setCode}
                languageName={selectedLanguageName}
                onRun={handleRunCode}
                onReset={handleResetCode}
                onSave={handleSaveCode}
                isRunning={isRunning}
              />
            </div>
            
            <div className="lg:col-span-2">
              <OutputDisplay output={output} />
            </div>
          </div>
          
          <div className="mt-6">
            <EnvironmentSelector 
              groups={environmentGroups}
              selectedEnvironment={selectedEnvironment}
              onSelect={handleEnvironmentSelect}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default SimulationPage;
