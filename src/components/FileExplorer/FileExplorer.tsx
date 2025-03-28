
import React, { useState, useRef } from 'react';
import { Folder, File, Plus, PlusCircle, FolderPlus, FileCode, FilePlus, Trash2, Edit, ChevronRight, ChevronDown, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
  onFileMove?: (fileId: string, targetFolderId: string | null) => void;
  selectedFileId: string | null;
}

const ItemTypes = {
  FILE: 'file',
  FOLDER: 'folder',
};

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
  const [renamingFile, setRenamingFile] = useState<{ id: string; name: string } | null>(null);
  
  React.useEffect(() => {
    if (selectedFileId) {
      expandFoldersContainingFile(files, selectedFileId);
    }
  }, [selectedFileId, files]);

  const expandFoldersContainingFile = (files: FileType[], fileId: string, path: string[] = []) => {
    for (const file of files) {
      if (file.type === 'folder' && file.children) {
        if (file.children.some(child => child.id === fileId || 
            (child.type === 'folder' && child.children?.some(c => c.id === fileId)))) {
          setExpandedFolders(prev => ({
            ...prev,
            [file.id]: true
          }));
        }
        expandFoldersContainingFile(file.children, fileId, [...path, file.id]);
      }
    }
  };
  
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

  const handleStartRename = (fileId: string, fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingFile({ id: fileId, name: fileName });
  };

  const handleRename = () => {
    if (renamingFile && renamingFile.name.trim()) {
      onFileRename(renamingFile.id, renamingFile.name);
      setRenamingFile(null);
    }
  };

  const handleFileDrop = (sourceId: string, targetId: string) => {
    let sourceFile: FileType | null = null;
    let sourceParentId: string | undefined = undefined;
    
    const findFileAndParent = (items: FileType[], parentId?: string): boolean => {
      for (const item of items) {
        if (item.id === sourceId) {
          sourceFile = item;
          sourceParentId = parentId;
          return true;
        }
        
        if (item.type === 'folder' && item.children) {
          if (findFileAndParent(item.children, item.id)) {
            return true;
          }
        }
      }
      return false;
    };
    
    findFileAndParent(files);
    
    if (!sourceFile) {
      toast({
        title: "Error",
        description: "Source file not found",
        variant: "destructive",
      });
      return;
    }
    
    const fileCopy = { ...sourceFile };
    
    const newFiles = [...files];
    const removeFile = (items: FileType[], id: string): FileType[] => {
      return items.filter(item => {
        if (item.id === id) {
          return false;
        }
        
        if (item.type === 'folder' && item.children) {
          item.children = removeFile(item.children, id);
        }
        
        return true;
      });
    };
    
    const updatedFiles = removeFile(newFiles, sourceId);
    
    const addFileToFolder = (items: FileType[], targetId: string, file: FileType): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === targetId) {
          if (items[i].type === 'folder') {
            if (!items[i].children) {
              items[i].children = [];
            }
            items[i].children.push(file);
            items[i].dateModified = new Date();
            return true;
          }
          return false;
        }
        
        if (items[i].type === 'folder' && items[i].children) {
          if (addFileToFolder(items[i].children, targetId, file)) {
            return true;
          }
        }
      }
      
      return false;
    };
    
    if (addFileToFolder(updatedFiles, targetId, fileCopy)) {
      onFileCreate(fileCopy, targetId);
      onFileDelete(sourceId);
      
      toast({
        title: "File moved",
        description: `${fileCopy.name} moved successfully.`,
        duration: 2000,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to move file. Target is not a folder.",
        variant: "destructive",
      });
    }
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

  const DraggableFileItem = ({ file, depth, parentId }: { file: FileType, depth: number, parentId?: string }) => {
    const isSelected = selectedFileId === file.id;
    const isExpanded = expandedFolders[file.id];
    
    const [{ isDragging }, drag] = useDrag(() => ({
      type: file.type === 'folder' ? ItemTypes.FOLDER : ItemTypes.FILE,
      item: { id: file.id, type: file.type, parentId },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: [ItemTypes.FILE, ItemTypes.FOLDER],
      drop: (item: { id: string, type: string, parentId?: string }, monitor) => {
        if (item.id === file.id || item.parentId === file.id) return;
        
        handleFileDrop(item.id, file.id);
      },
      canDrop: (item, monitor) => {
        return file.type === 'folder' && item.id !== file.id && item.parentId !== file.id;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }));

    const itemRef = useRef(null);
    
    const attachRef = (el: HTMLDivElement) => {
      drag(el);
      if (file.type === 'folder') {
        drop(el);
      }
      itemRef.current = el;
    };

    return (
      <div
        ref={attachRef}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className={`
          ${isOver && canDrop ? 'bg-primary/20' : ''}
          group relative
        `}
      >
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
            {renamingFile && renamingFile.id === file.id ? (
              <Input
                value={renamingFile.name}
                onChange={(e) => setRenamingFile({ ...renamingFile, name: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRename();
                  } else if (e.key === 'Escape') {
                    setRenamingFile(null);
                  }
                }}
                onBlur={handleRename}
                autoFocus
                className="h-6 py-0 px-1 text-sm"
              />
            ) : (
              <span className="truncate">{file.name}</span>
            )}
          </div>
          
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            {file.type === 'folder' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewItemDialog({ isOpen: true, type: 'file', parentId: file.id });
                      }}
                    >
                      <FilePlus className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add File</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => handleStartRename(file.id, file.name, e)}
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
          <div className="mt-1 ml-2 pl-2 border-l border-border">
            {file.children.map(childFile => (
              <DraggableFileItem 
                key={childFile.id} 
                file={childFile} 
                depth={depth + 1} 
                parentId={file.id} 
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
            {files.map(file => (
              <DraggableFileItem key={file.id} file={file} depth={0} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </DndProvider>
  );
};

export default FileExplorer;

