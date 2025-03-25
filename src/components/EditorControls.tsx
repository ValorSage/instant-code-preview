
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Code2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EditorControlsProps {
  onRun: () => void;
  onReset: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const EditorControls: React.FC<EditorControlsProps> = ({
  onRun,
  onReset,
  activeTab,
  setActiveTab
}) => {
  const isMobile = useIsMobile();
  const tabs = [
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'js', label: 'JavaScript' },
    { id: 'script', label: 'Script' }  // إضافة تبويب جديد للسكربت
  ];

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full p-2 border-b bg-secondary/40 backdrop-blur-sm border-border">
      <div className="flex flex-wrap mb-2 md:mb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all mr-1 mb-1 md:mb-0
              ${activeTab === tab.id 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:bg-secondary/80'
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.id === 'script' ? (
              <div className="flex items-center">
                <Code2 className="w-3.5 h-3.5 mr-1" />
                {!isMobile && <span>{tab.label}</span>}
              </div>
            ) : (
              tab.label
            )}
          </button>
        ))}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="text-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          {!isMobile && "Reset"}
        </Button>
        
        <Button
          size="sm"
          onClick={onRun}
          className="bg-editor-accent hover:bg-editor-accent/90 text-white"
        >
          <Play className="w-3.5 h-3.5 mr-1" />
          {!isMobile && "Run"}
        </Button>
      </div>
    </div>
  );
};

export default EditorControls;
