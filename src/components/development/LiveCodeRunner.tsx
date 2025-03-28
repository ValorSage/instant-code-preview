
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, StopCircle, RotateCcw, Code, Terminal, Info, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface LiveCodeRunnerProps {
  code: string;
  language: string;
  onCodeRun?: (result: string) => void;
  readOnly?: boolean;
}

const LiveCodeRunner: React.FC<LiveCodeRunnerProps> = ({
  code,
  language,
  onCodeRun,
  readOnly = false
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'console' | 'issues'>('console');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [memoryUsage, setMemoryUsage] = useState<string | null>(null);
  const [issues, setIssues] = useState<{ type: 'error' | 'warning' | 'info'; message: string }[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('');
    setIssues([]);
    setExecutionTime(null);
    setMemoryUsage(null);
    
    const startTime = performance.now();
    
    // محاكاة تأخير تنفيذ الكود
    setTimeout(() => {
      try {
        let result = '';
        
        // محاكاة تنفيذ كود بلغات مختلفة
        switch (language.toLowerCase()) {
          case 'javascript':
          case 'js':
            // محاكاة تنفيذ كود جافاسكريبت
            result = simulateJavaScriptExecution(code);
            break;
          case 'python':
            // محاكاة تنفيذ كود بايثون
            result = simulatePythonExecution(code);
            break;
          case 'html':
            // محاكاة عرض HTML
            result = 'HTML rendered in preview window.';
            break;
          case 'css':
            // محاكاة تطبيق CSS
            result = 'CSS applied to elements.';
            break;
          default:
            result = `Execution for ${language} is not supported yet.`;
            setIssues([{ type: 'info', message: `تنفيذ لغة ${language} غير متاح بعد.` }]);
        }
        
        // حساب وقت التنفيذ
        const endTime = performance.now();
        setExecutionTime(endTime - startTime);
        
        // محاكاة استخدام الذاكرة
        setMemoryUsage(`${Math.round(Math.random() * 50) + 10} MB`);
        
        setOutput(result);
        
        if (onCodeRun) {
          onCodeRun(result);
        }
        
        toast({
          title: "تم تنفيذ الكود بنجاح",
          description: `استغرق التنفيذ ${(endTime - startTime).toFixed(2)} مللي ثانية`,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء تنفيذ الكود';
        setOutput(`خطأ: ${errorMessage}`);
        setIssues([{ type: 'error', message: errorMessage }]);
        
        toast({
          title: "خطأ في تنفيذ الكود",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsRunning(false);
      }
    }, 1000); // تأخير محاكاة التنفيذ
  };

  const simulateJavaScriptExecution = (jsCode: string): string => {
    // محاكاة طباعة إلى وحدة التحكم
    const consoleOutput: string[] = [];
    
    // محاكاة وظيفة console.log
    const mockConsole = {
      log: (...args: any[]) => {
        consoleOutput.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' '));
      },
      error: (...args: any[]) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        consoleOutput.push(`Error: ${message}`);
        setIssues(prev => [...prev, { type: 'error', message }]);
      },
      warn: (...args: any[]) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        consoleOutput.push(`Warning: ${message}`);
        setIssues(prev => [...prev, { type: 'warning', message }]);
      }
    };
    
    // تحليل الكود وإضافة محاكاة بسيطة للتحذيرات والأخطاء
    if (jsCode.includes('console.error')) {
      setIssues(prev => [...prev, { 
        type: 'warning', 
        message: 'استخدام console.error قد يشير إلى خطأ في تطبيقك' 
      }]);
    }
    
    // محاكاة عدم إعلان المتغيرات
    if (/[a-zA-Z_$][a-zA-Z0-9_$]* = /.test(jsCode) && !jsCode.includes('let') && !jsCode.includes('const') && !jsCode.includes('var')) {
      setIssues(prev => [...prev, { 
        type: 'warning', 
        message: 'استخدم let أو const أو var عند إعلان المتغيرات' 
      }]);
    }
    
    // محاكاة فقط - في الواقع سيكون هذا تنفيذًا فعليًا للكود
    // في بيئة آمنة أو باستخدام مُفسّر مثل eval ولكن بشكل آمن
    
    // إضافة بعض المخرجات الافتراضية للمحاكاة
    mockConsole.log('بدء تنفيذ الكود...');
    
    if (jsCode.includes('for') || jsCode.includes('while')) {
      mockConsole.log('جاري تنفيذ الحلقات التكرارية...');
      for (let i = 0; i < 3; i++) {
        mockConsole.log(`الدورة رقم ${i + 1}`);
      }
    }
    
    if (jsCode.includes('function')) {
      mockConsole.log('تم تعريف دالة');
      mockConsole.log('استدعاء الدالة...');
      mockConsole.log('نتيجة الدالة: 42');
    }
    
    mockConsole.log('انتهى تنفيذ الكود');
    
    return consoleOutput.join('\n');
  };

  const simulatePythonExecution = (pythonCode: string): string => {
    // محاكاة تنفيذ كود بايثون - مشابه للمحاكاة السابقة
    const output: string[] = [];
    
    output.push('Python 3.9.0');
    output.push('>>> بدء تنفيذ البرنامج');
    
    if (pythonCode.includes('print')) {
      output.push('Hello, World!');
    }
    
    if (pythonCode.includes('def ')) {
      output.push('تم تعريف دالة');
      output.push('استدعاء الدالة...');
      output.push('نتيجة الدالة: 42');
    }
    
    if (pythonCode.includes('for ') || pythonCode.includes('while ')) {
      output.push('جاري تنفيذ الحلقات التكرارية...');
      for (let i = 0; i < 3; i++) {
        output.push(`الدورة رقم ${i + 1}`);
      }
    }
    
    if (pythonCode.includes('import ')) {
      output.push('تم استيراد المكتبات');
    }
    
    output.push('>>> انتهى تنفيذ البرنامج');
    
    return output.join('\n');
  };

  const resetOutput = () => {
    setOutput('');
    setIssues([]);
    setExecutionTime(null);
    setMemoryUsage(null);
    
    toast({
      title: "تم مسح المخرجات",
      description: "تم إعادة تعيين وحدة التحكم ومسح جميع المخرجات",
    });
  };

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      <CardHeader className="py-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <Code className="h-5 w-5 mr-2" />
            منفذ الأكواد
            <Badge variant="outline" className="ml-2 text-xs">
              {language.toUpperCase()}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={resetOutput}
              disabled={isRunning || !output}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              <span className="text-xs">مسح</span>
            </Button>
            
            <Button
              variant={isRunning ? "secondary" : "default"}
              size="sm"
              onClick={isRunning ? () => {} : handleRunCode}
              disabled={isRunning || readOnly}
            >
              {isRunning ? (
                <>
                  <StopCircle className="h-4 w-4 mr-1 animate-pulse" />
                  <span className="text-xs">جارٍ التنفيذ...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  <span className="text-xs">تشغيل</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="console" value={activeTab} onValueChange={setActiveTab as any} className="flex flex-col flex-1">
          <div className="border-b px-4">
            <TabsList className="h-9">
              <TabsTrigger value="console" className="text-xs relative">
                <Terminal className="h-3.5 w-3.5 mr-1" />
                وحدة التحكم
                {output && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 h-2 w-2 bg-green-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="issues" className="text-xs relative">
                <Info className="h-3.5 w-3.5 mr-1" />
                المشاكل
                {issues.length > 0 && (
                  <Badge variant="outline" className="h-4 ml-1 text-[10px] py-0 px-1.5">
                    {issues.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="console" className="flex-1 p-0 m-0 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="font-mono text-sm p-4 whitespace-pre-wrap" ref={outputRef}>
                {output ? output : (
                  <div className="text-muted-foreground text-center py-8">
                    اضغط على "تشغيل" لعرض نتيجة تنفيذ الكود هنا
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {(executionTime !== null || memoryUsage !== null) && (
              <div className="p-2 border-t text-xs text-muted-foreground flex justify-between items-center">
                {executionTime !== null && (
                  <div>وقت التنفيذ: {executionTime.toFixed(2)} مللي ثانية</div>
                )}
                {memoryUsage !== null && (
                  <div>استخدام الذاكرة: {memoryUsage}</div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="issues" className="flex-1 p-0 m-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                {issues.length > 0 ? (
                  <div className="space-y-2">
                    {issues.map((issue, index) => (
                      <div 
                        key={index} 
                        className={`p-2 rounded-md text-sm flex items-start ${
                          issue.type === 'error' 
                            ? 'bg-destructive/10 text-destructive' 
                            : issue.type === 'warning' 
                              ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' 
                              : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                        }`}
                      >
                        {issue.type === 'error' ? (
                          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                        ) : issue.type === 'warning' ? (
                          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                        )}
                        <span>{issue.message}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد مشاكل أو تحذيرات
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default LiveCodeRunner;
