
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Play, RefreshCw, Save } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  languageName: string;
  onRun: () => void;
  onReset: () => void;
  onSave: () => void;
  isRunning: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  languageName,
  onRun,
  onReset,
  onSave,
  isRunning
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle>محرر الكود</CardTitle>
        <CardDescription>أكتب الكود بلغة {languageName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="border rounded-md overflow-hidden flex-1">
          <textarea
            className="w-full h-full p-4 font-mono text-sm bg-muted/50 focus:outline-none resize-none min-h-[300px]"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            dir="ltr"
          />
        </div>
        
        <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-4">
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            إعادة تعيين
          </Button>
          <Button variant="outline" onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            حفظ
          </Button>
          <Button onClick={onRun} disabled={isRunning}>
            <Play className="mr-2 h-4 w-4" />
            تشغيل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeEditor;
