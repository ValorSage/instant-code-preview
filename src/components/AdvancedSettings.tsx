
import React, { useState, useEffect } from 'react';
import { Settings, Save, Monitor, Smartphone, Moon, Sun, Check, X, Globe, Code, FileJson, Github, GitBranch } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface AdvancedSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  autoSaveEnabled: boolean;
  onToggleAutoSave: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  isOpen,
  onClose,
  autoSaveEnabled,
  onToggleAutoSave,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [indentSize, setIndentSize] = useState('2');
  const [fontSize, setFontSize] = useState('14');
  const [fontFamily, setFontFamily] = useState('monospace');
  const [wordWrap, setWordWrap] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [minimap, setMinimap] = useState(false);
  const [bracketPairs, setBracketPairs] = useState(true);
  const [formatOnSave, setFormatOnSave] = useState(true);
  const [language, setLanguage] = useState('ar');
  
  const handleSaveSettings = () => {
    // Save settings to localStorage or a database in a real application
    localStorage.setItem('akojs-settings', JSON.stringify({
      indentSize,
      fontSize,
      fontFamily,
      wordWrap,
      lineNumbers,
      minimap,
      bracketPairs,
      formatOnSave,
      language
    }));
    
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات المحرر بنجاح.",
      duration: 3000,
    });
    
    onClose();
  };
  
  const handleResetSettings = () => {
    setIndentSize('2');
    setFontSize('14');
    setFontFamily('monospace');
    setWordWrap(true);
    setLineNumbers(true);
    setMinimap(false);
    setBracketPairs(true);
    setFormatOnSave(true);
    setLanguage('ar');
    
    toast({
      title: "تم إعادة تعيين الإعدادات",
      description: "تم إعادة تعيين إعدادات المحرر إلى الافتراضية.",
      duration: 3000,
    });
  };
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('akojs-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setIndentSize(parsedSettings.indentSize || '2');
        setFontSize(parsedSettings.fontSize || '14');
        setFontFamily(parsedSettings.fontFamily || 'monospace');
        setWordWrap(parsedSettings.wordWrap !== undefined ? parsedSettings.wordWrap : true);
        setLineNumbers(parsedSettings.lineNumbers !== undefined ? parsedSettings.lineNumbers : true);
        setMinimap(parsedSettings.minimap !== undefined ? parsedSettings.minimap : false);
        setBracketPairs(parsedSettings.bracketPairs !== undefined ? parsedSettings.bracketPairs : true);
        setFormatOnSave(parsedSettings.formatOnSave !== undefined ? parsedSettings.formatOnSave : true);
        setLanguage(parsedSettings.language || 'ar');
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
  }, []);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-xl">
            <Settings className="mr-2 h-5 w-5" />
            إعدادات متقدمة
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="editor" className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="editor" className="text-sm">المحرر</TabsTrigger>
            <TabsTrigger value="appearance" className="text-sm">المظهر</TabsTrigger>
            <TabsTrigger value="integration" className="text-sm">التكامل</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="autosave">الحفظ التلقائي</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">حفظ التغييرات تلقائيًا</span>
                  <Switch 
                    id="autosave" 
                    checked={autoSaveEnabled} 
                    onCheckedChange={onToggleAutoSave} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="formatOnSave">التنسيق عند الحفظ</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">تنسيق الكود تلقائيًا عند الحفظ</span>
                  <Switch 
                    id="formatOnSave" 
                    checked={formatOnSave} 
                    onCheckedChange={setFormatOnSave} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="indentSize">حجم المسافة البادئة</Label>
                <Select value={indentSize} onValueChange={setIndentSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="حجم المسافة البادئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 مسافات</SelectItem>
                    <SelectItem value="4">4 مسافات</SelectItem>
                    <SelectItem value="8">8 مسافات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fontFamily">نوع الخط</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger>
                    <SelectValue placeholder="نوع الخط" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monospace">Monospace</SelectItem>
                    <SelectItem value="fira-code">Fira Code</SelectItem>
                    <SelectItem value="source-code-pro">Source Code Pro</SelectItem>
                    <SelectItem value="jetbrains-mono">JetBrains Mono</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">خيارات عرض المحرر</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wordWrap">التفاف النص</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">عرض النص في سطر واحد</span>
                    <Switch 
                      id="wordWrap" 
                      checked={wordWrap} 
                      onCheckedChange={setWordWrap} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lineNumbers">أرقام الأسطر</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">عرض أرقام الأسطر</span>
                    <Switch 
                      id="lineNumbers" 
                      checked={lineNumbers} 
                      onCheckedChange={setLineNumbers} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minimap">الخريطة المصغرة</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">عرض خريطة مصغرة للكود</span>
                    <Switch 
                      id="minimap" 
                      checked={minimap} 
                      onCheckedChange={setMinimap} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bracketPairs">تمييز الأقواس</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">تمييز الأقواس المتطابقة</span>
                    <Switch 
                      id="bracketPairs" 
                      checked={bracketPairs} 
                      onCheckedChange={setBracketPairs} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">المظهر</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">السمة</Label>
                  <div className="flex items-center space-x-4">
                    <div 
                      className={`flex flex-col items-center p-2 rounded-lg cursor-pointer border-2 ${!isDarkMode ? 'border-primary' : 'border-transparent'}`}
                      onClick={() => isDarkMode && onToggleDarkMode()}
                    >
                      <Sun className="h-6 w-6 mb-1" />
                      <span className="text-xs">فاتح</span>
                    </div>
                    <div 
                      className={`flex flex-col items-center p-2 rounded-lg cursor-pointer border-2 ${isDarkMode ? 'border-primary' : 'border-transparent'}`}
                      onClick={() => !isDarkMode && onToggleDarkMode()}
                    >
                      <Moon className="h-6 w-6 mb-1" />
                      <span className="text-xs">داكن</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fontSize">حجم الخط</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="حجم الخط" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12px</SelectItem>
                      <SelectItem value="14">14px</SelectItem>
                      <SelectItem value="16">16px</SelectItem>
                      <SelectItem value="18">18px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">اللغة والمنطقة</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">لغة الواجهة</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="لغة الواجهة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          العربية
                        </div>
                      </SelectItem>
                      <SelectItem value="en">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          English
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="integration" className="p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">تكامل Git</h3>
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center mb-4">
                  <Github className="h-6 w-6 mr-2" />
                  <h4 className="text-sm font-medium">GitHub</h4>
                  <Button variant="outline" size="sm" className="ml-auto text-xs">
                    ربط الحساب
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  قم بربط حسابك على GitHub للتمكن من مزامنة المشاريع والعمل بشكل تعاوني مع فريقك.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <GitBranch className="h-3.5 w-3.5 mr-1.5" />
                    استيراد مستودع
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <FileJson className="h-3.5 w-3.5 mr-1.5" />
                    تصدير كمستودع
                  </Button>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">واجهات البرمجة (APIs)</h3>
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center mb-4">
                  <Code className="h-6 w-6 mr-2" />
                  <h4 className="text-sm font-medium">مفاتيح واجهات البرمجة</h4>
                  <Button variant="outline" size="sm" className="ml-auto text-xs">
                    إضافة مفتاح
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  قم بإدارة مفاتيح واجهات البرمجة الخاصة بك للتكامل مع خدمات خارجية مثل تحليل الصور، الذكاء الاصطناعي، وغيرها.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4 flex justify-between">
          <Button variant="outline" onClick={handleResetSettings}>
            <X className="h-4 w-4 mr-2" />
            إعادة تعيين
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>إلغاء</Button>
            <Button onClick={handleSaveSettings}>
              <Check className="h-4 w-4 mr-2" />
              حفظ الإعدادات
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSettings;
