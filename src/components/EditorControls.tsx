
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Code2, Plus, FolderOpen, Save, Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EditorControlsProps {
  onRun: () => void;
  onReset: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddFile?: () => void;
  onSaveAll?: () => void;
  onExport?: () => void;
}

const EditorControls: React.FC<EditorControlsProps> = ({
  onRun,
  onReset,
  activeTab,
  setActiveTab,
  onAddFile,
  onSaveAll,
  onExport
}) => {
  const isMobile = useIsMobile();
  
  // Main editor tabs
  const tabs = [
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'js', label: 'JavaScript' },
    { id: 'script', label: 'Script' }
  ];
  
  // Additional language tabs
  const additionalLanguages = [
    { id: 'python', label: 'Python' },
    { id: 'cpp', label: 'C++' },
    { id: 'csharp', label: 'C#' },
    { id: 'java', label: 'Java' },
    { id: 'go', label: 'Go' },
    { id: 'rust', label: 'Rust' },
    { id: 'php', label: 'PHP' },
    { id: 'ruby', label: 'Ruby' },
    { id: 'swift', label: 'Swift' },
    { id: 'kotlin', label: 'Kotlin' },
    { id: 'lua', label: 'Lua' },
    { id: 'sql', label: 'SQL' }
  ];
  
  // Check if active tab is one of the additional languages
  const isAdditionalLanguage = additionalLanguages.some(lang => lang.id === activeTab);
  const activeLanguageTab = isAdditionalLanguage 
    ? additionalLanguages.find(lang => lang.id === activeTab) 
    : null;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full p-2 border-b bg-secondary/40 backdrop-blur-sm border-border">
      <div className="flex flex-wrap mb-2 md:mb-0">
        {/* Main tabs */}
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
                <span>{tab.label}</span>
              </div>
            ) : (
              tab.label
            )}
          </button>
        ))}
        
        {/* Active additional language tab, if any */}
        {activeLanguageTab && (
          <button
            className="px-3 py-1.5 text-sm font-medium rounded-md transition-all mr-1 mb-1 md:mb-0 bg-primary text-primary-foreground shadow-sm"
            onClick={() => setActiveTab(activeLanguageTab.id)}
          >
            {activeLanguageTab.label}
          </button>
        )}
        
        {/* Dropdown for additional languages */}
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-1 text-sm h-8"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    {!isMobile && "Languages"}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>More Languages</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Programming Languages</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {additionalLanguages.map((lang) => (
              <DropdownMenuItem
                key={lang.id}
                onClick={() => setActiveTab(lang.id)}
                className="cursor-pointer"
              >
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* File operations */}
        {onAddFile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddFile}
                  className="text-sm"
                >
                  <FolderOpen className="w-3.5 h-3.5 mr-1" />
                  {!isMobile && "Files"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Manage Files</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* Save all */}
        {onSaveAll && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSaveAll}
                  className="text-sm"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  {!isMobile && "Save All"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save All Files</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* Export project */}
        {onExport && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  className="text-sm"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  {!isMobile && "Export"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export Project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="text-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                {!isMobile && "Reset"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                onClick={onRun}
                className="bg-editor-accent hover:bg-editor-accent/90 text-white"
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                {!isMobile && "Run"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Run Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default EditorControls;
