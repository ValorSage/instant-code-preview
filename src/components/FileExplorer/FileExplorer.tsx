
import React, { useState } from 'react';
import { Folder, File, Plus, PlusCircle, FolderPlus, FileCode, FilePlus, Trash2, Edit, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface FileType {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileType[];
  language?: string;
  dateCreated: Date;
  dateModified: Date;
}

interface FileExplorerProps {
  files: FileType[];
  onFileSelect: (file: FileType) => void;
  onFileCreate: (file: FileType, parentId?: string) => void;
  onFileDelete: (fileId: string) => void;
  onFileRename: (fileId: string, newName: string) => void;
  selectedFileId: string | null;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  selectedFileId
}) => {
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({});
  const [newItemDialog, setNewItemDialog] = useState<{ isOpen: boolean; type: 'file' | 'folder'; parentId?: string }>({
    isOpen: false,
    type: 'file'
  });
  const [newItemName, setNewItemName] = useState('');
  const [newItemLanguage, setNewItemLanguage] = useState('html');
  
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleCreateNewItem = () => {
    if (!newItemName.trim()) return;
    
    const newId = `${newItemDialog.type}-${Date.now()}`;
    const newFile: FileType = {
      id: newId,
      name: newItemName,
      type: newItemDialog.type,
      dateCreated: new Date(),
      dateModified: new Date(),
      content: newItemDialog.type === 'file' ? '' : undefined,
      children: newItemDialog.type === 'folder' ? [] : undefined,
      language: newItemDialog.type === 'file' ? newItemLanguage : undefined
    };
    
    onFileCreate(newFile, newItemDialog.parentId);
    setNewItemDialog({ isOpen: false, type: 'file' });
    setNewItemName('');
  };

  const renderFileIcon = (file: FileType) => {
    if (file.type === 'folder') {
      return expandedFolders[file.id] ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />;
    }
    
    switch (file.language) {
      case 'html':
        return <FileCode className="w-4 h-4 mr-1 text-orange-500" />;
      case 'css':
        return <FileCode className="w-4 h-4 mr-1 text-blue-500" />;
      case 'js':
      case 'javascript':
        return <FileCode className="w-4 h-4 mr-1 text-yellow-500" />;
      case 'ts':
      case 'typescript':
        return <FileCode className="w-4 h-4 mr-1 text-blue-600" />;
      case 'python':
        return <FileCode className="w-4 h-4 mr-1 text-green-500" />;
      case 'java':
        return <FileCode className="w-4 h-4 mr-1 text-red-500" />;
      case 'cpp':
      case 'c++':
        return <FileCode className="w-4 h-4 mr-1 text-purple-500" />;
      case 'go':
        return <FileCode className="w-4 h-4 mr-1 text-cyan-500" />;
      case 'rust':
        return <FileCode className="w-4 h-4 mr-1 text-orange-600" />;
      case 'php':
        return <FileCode className="w-4 h-4 mr-1 text-indigo-500" />;
      case 'ruby':
        return <FileCode className="w-4 h-4 mr-1 text-red-600" />;
      default:
        return <File className="w-4 h-4 mr-1" />;
    }
  };

  const renderFileItem = (file: FileType, depth = 0) => {
    const isSelected = selectedFileId === file.id;
    const isExpanded = expandedFolders[file.id];
    
    return (
      <div key={file.id}>
        <div 
          className={`flex items-center py-1 px-2 text-sm rounded-sm cursor-pointer hover:bg-secondary/50 ${
            isSelected ? 'bg-secondary text-primary' : ''
          }`}
          style={{ paddingLeft: `${(depth * 12) + 8}px` }}
          onClick={() => {
            if (file.type === 'folder') {
              toggleFolder(file.id);
            } else {
              onFileSelect(file);
            }
          }}
        >
          <div className="flex items-center flex-grow overflow-hidden">
            {renderFileIcon(file)}
            <span className="truncate">{file.name}</span>
          </div>
          
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle rename logic
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rename</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileDelete(file.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {file.type === 'folder' && isExpanded && file.children && (
          <div className="mt-1">
            {file.children.map(childFile => renderFileItem(childFile, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-explorer border-r border-border h-full bg-card">
      <div className="p-2 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-medium">Files</h3>
        
        <div className="flex items-center space-x-1">
          <Dialog
            open={newItemDialog.isOpen}
            onOpenChange={(open) => {
              if (!open) {
                setNewItemDialog(prev => ({ ...prev, isOpen: false }));
                setNewItemName('');
              }
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => setNewItemDialog({ isOpen: true, type: 'file' })}
                  >
                    <FilePlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>New File</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => setNewItemDialog({ isOpen: true, type: 'folder' })}
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>New Folder</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {newItemDialog.type === 'file' ? 'Create New File' : 'Create New Folder'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right text-sm">
                    Name
                  </label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={newItemDialog.type === 'file' ? 'example.js' : 'New Folder'}
                  />
                </div>
                
                {newItemDialog.type === 'file' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="language" className="text-right text-sm">
                      Language
                    </label>
                    <select
                      id="language"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newItemLanguage}
                      onChange={(e) => setNewItemLanguage(e.target.value)}
                    >
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="csharp">C#</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                      <option value="ruby">Ruby</option>
                      <option value="php">PHP</option>
                      <option value="swift">Swift</option>
                      <option value="kotlin">Kotlin</option>
                      <option value="lua">Lua</option>
                      <option value="sql">SQL</option>
                    </select>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleCreateNewItem}
                  disabled={!newItemName.trim()}
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100%-40px)]">
        <div className="p-2">
          {files.map(file => renderFileItem(file))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FileExplorer;
