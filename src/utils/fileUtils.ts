
import { FileType } from '@/components/FileExplorer/FileExplorer';

// Generate a unique ID
export const generateFileId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Default file templates
export const getDefaultFileContent = (language: string): string => {
  switch (language) {
    case 'html':
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My HTML Document</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>This is a new HTML file.</p>
</body>
</html>`;
    
    case 'css':
      return `/* CSS Styles */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  color: #333;
}

h1 {
  color: #0066cc;
}`;
    
    case 'javascript':
    case 'js':
      return `// JavaScript code
function greet() {
  console.log("Hello, world!");
}

// Call the function
greet();`;
    
    case 'typescript':
    case 'ts':
      return `// TypeScript code
function greet(name: string): void {
  console.log(\`Hello, \${name}!\`);
}

// Call the function
greet("World");`;
    
    case 'python':
      return `# Python code
def greet(name):
    """Simple greeting function"""
    return f"Hello, {name}!"

# Call the function
print(greet("World"))`;
    
    case 'java':
      return `// Java code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;
    
    case 'cpp':
    case 'c++':
      return `// C++ code
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`;
    
    case 'csharp':
    case 'c#':
      return `// C# code
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`;
    
    case 'go':
      return `// Go code
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`;
    
    case 'rust':
      return `// Rust code
fn main() {
    println!("Hello, World!");
}`;
    
    case 'php':
      return `<?php
// PHP code
function greet($name) {
    return "Hello, " . $name . "!";
}

echo greet("World");
?>`;
    
    case 'ruby':
      return `# Ruby code
def greet(name)
  "Hello, #{name}!"
end

puts greet("World")`;
    
    case 'swift':
      return `// Swift code
import Foundation

func greet(name: String) -> String {
    return "Hello, \\(name)!"
}

print(greet(name: "World"))`;
    
    case 'kotlin':
      return `// Kotlin code
fun main() {
    println("Hello, World!")
}`;
    
    case 'lua':
      return `-- Lua code
function greet(name)
    return "Hello, " .. name .. "!"
end

print(greet("World"))`;
    
    case 'sql':
      return `-- SQL query
SELECT * FROM users WHERE age > 18 ORDER BY name;`;
    
    default:
      return '// New file';
  }
};

// Create a new file
export const createNewFile = (name: string, language: string): FileType => {
  return {
    id: generateFileId(),
    name,
    type: 'file',
    content: getDefaultFileContent(language),
    language,
    dateCreated: new Date(),
    dateModified: new Date()
  };
};

// Create a new folder
export const createNewFolder = (name: string): FileType => {
  return {
    id: generateFileId(),
    name,
    type: 'folder',
    children: [],
    dateCreated: new Date(),
    dateModified: new Date()
  };
};

// Find a file or folder by ID
export const findFileById = (files: FileType[], id: string): FileType | null => {
  for (const file of files) {
    if (file.id === id) {
      return file;
    }
    
    if (file.type === 'folder' && file.children) {
      const found = findFileById(file.children, id);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
};

// Add a file or folder to the tree
export const addFileToTree = (files: FileType[], newFile: FileType, parentId?: string): FileType[] => {
  // If no parentId is provided, add to root
  if (!parentId) {
    return [...files, newFile];
  }
  
  return files.map(file => {
    if (file.id === parentId && file.type === 'folder') {
      return {
        ...file,
        children: [...(file.children || []), newFile],
        dateModified: new Date()
      };
    }
    
    if (file.type === 'folder' && file.children) {
      return {
        ...file,
        children: addFileToTree(file.children, newFile, parentId)
      };
    }
    
    return file;
  });
};

// Delete a file or folder from the tree
export const deleteFileFromTree = (files: FileType[], id: string): FileType[] => {
  return files.filter(file => {
    if (file.id === id) {
      return false;
    }
    
    if (file.type === 'folder' && file.children) {
      file.children = deleteFileFromTree(file.children, id);
    }
    
    return true;
  });
};

// Rename a file or folder
export const renameFile = (files: FileType[], id: string, newName: string): FileType[] => {
  return files.map(file => {
    if (file.id === id) {
      return {
        ...file,
        name: newName,
        dateModified: new Date()
      };
    }
    
    if (file.type === 'folder' && file.children) {
      return {
        ...file,
        children: renameFile(file.children, id, newName)
      };
    }
    
    return file;
  });
};

// Update file content
export const updateFileContent = (files: FileType[], id: string, content: string): FileType[] => {
  return files.map(file => {
    if (file.id === id) {
      return {
        ...file,
        content,
        dateModified: new Date()
      };
    }
    
    if (file.type === 'folder' && file.children) {
      return {
        ...file,
        children: updateFileContent(file.children, id, content)
      };
    }
    
    return file;
  });
};

// Save files to localStorage
export const saveFilesToLocalStorage = (files: FileType[]): void => {
  try {
    localStorage.setItem('akojs-files', JSON.stringify(files));
  } catch (error) {
    console.error('Failed to save files to localStorage:', error);
  }
};

// Load files from localStorage
export const loadFilesFromLocalStorage = (): FileType[] => {
  try {
    const saved = localStorage.getItem('akojs-files');
    if (saved) {
      const files = JSON.parse(saved);
      // Convert string dates back to Date objects
      return restoreDates(files);
    }
  } catch (error) {
    console.error('Failed to load files from localStorage:', error);
  }
  
  return getDefaultFiles();
};

// Helper to restore Date objects after JSON parsing
const restoreDates = (files: FileType[]): FileType[] => {
  return files.map(file => {
    return {
      ...file,
      dateCreated: new Date(file.dateCreated),
      dateModified: new Date(file.dateModified),
      children: file.type === 'folder' && file.children ? restoreDates(file.children) : undefined
    };
  });
};

// Get default files when no saved files exist
export const getDefaultFiles = (): FileType[] => {
  const now = new Date();
  
  return [
    {
      id: 'default-html',
      name: 'index.html',
      type: 'file',
      content: getDefaultFileContent('html'),
      language: 'html',
      dateCreated: now,
      dateModified: now
    },
    {
      id: 'default-css',
      name: 'styles.css',
      type: 'file',
      content: getDefaultFileContent('css'),
      language: 'css',
      dateCreated: now,
      dateModified: now
    },
    {
      id: 'default-js',
      name: 'script.js',
      type: 'file',
      content: getDefaultFileContent('javascript'),
      language: 'javascript',
      dateCreated: now,
      dateModified: now
    },
    {
      id: 'examples-folder',
      name: 'Examples',
      type: 'folder',
      children: [
        {
          id: 'example-python',
          name: 'example.py',
          type: 'file',
          content: getDefaultFileContent('python'),
          language: 'python',
          dateCreated: now,
          dateModified: now
        },
        {
          id: 'example-cpp',
          name: 'example.cpp',
          type: 'file',
          content: getDefaultFileContent('cpp'),
          language: 'cpp',
          dateCreated: now,
          dateModified: now
        }
      ],
      dateCreated: now,
      dateModified: now
    }
  ];
};

// Get file extension from language
export const getFileExtension = (language: string): string => {
  switch (language) {
    case 'html': return '.html';
    case 'css': return '.css';
    case 'javascript': return '.js';
    case 'typescript': return '.ts';
    case 'python': return '.py';
    case 'java': return '.java';
    case 'cpp': return '.cpp';
    case 'csharp': return '.cs';
    case 'go': return '.go';
    case 'rust': return '.rs';
    case 'php': return '.php';
    case 'ruby': return '.rb';
    case 'swift': return '.swift';
    case 'kotlin': return '.kt';
    case 'lua': return '.lua';
    case 'sql': return '.sql';
    default: return '.txt';
  }
};

// Get language from file extension
export const getLanguageFromExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  switch (ext) {
    case 'html': return 'html';
    case 'css': return 'css';
    case 'js': return 'javascript';
    case 'ts': return 'typescript';
    case 'py': return 'python';
    case 'java': return 'java';
    case 'cpp': case 'cc': case 'cxx': return 'cpp';
    case 'cs': return 'csharp';
    case 'go': return 'go';
    case 'rs': return 'rust';
    case 'php': return 'php';
    case 'rb': return 'ruby';
    case 'swift': return 'swift';
    case 'kt': return 'kotlin';
    case 'lua': return 'lua';
    case 'sql': return 'sql';
    default: return 'text';
  }
};
