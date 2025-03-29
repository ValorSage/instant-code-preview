
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface OutputDisplayProps {
  output: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle>نتائج التنفيذ</CardTitle>
        <CardDescription>مخرجات تنفيذ الكود في بيئة المحاكاة</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="border rounded-md overflow-hidden h-full min-h-[300px]">
          <pre className="w-full h-full p-4 font-mono text-sm bg-muted/50 overflow-auto whitespace-pre-wrap">
            {output || 'لم يتم تنفيذ أي كود بعد.'}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutputDisplay;
