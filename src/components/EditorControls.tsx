
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';

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
  const tabs = [
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'js', label: 'JavaScript' }
  ];

  return (
    <div className="flex items-center justify-between w-full p-2 border-b bg-secondary/40 backdrop-blur-sm border-border">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all mr-1
              ${activeTab === tab.id 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:bg-secondary/80'
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
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
          Reset
        </Button>
        
        <Button
          size="sm"
          onClick={onRun}
          className="bg-editor-accent hover:bg-editor-accent/90 text-white"
        >
          <Play className="w-3.5 h-3.5 mr-1" />
          Run
        </Button>
      </div>
    </div>
  );
};

export default EditorControls;
