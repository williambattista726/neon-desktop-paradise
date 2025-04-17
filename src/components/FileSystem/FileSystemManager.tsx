
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Folder, File, FileText, FileImage, FileArchive, ChevronRight, ChevronDown } from 'lucide-react';

interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size?: number;
  created: string;
  modified: string;
  parentId: string | null;
  content?: string;
}

const getInitialFileSystem = (): FileSystemItem[] => {
  return [
    {
      id: 'root',
      name: 'Root',
      type: 'folder',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      parentId: null
    },
    {
      id: 'documents',
      name: 'Documents',
      type: 'folder',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      parentId: 'root'
    },
    {
      id: 'pictures',
      name: 'Pictures',
      type: 'folder',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      parentId: 'root'
    },
    {
      id: 'welcome',
      name: 'welcome.txt',
      type: 'file',
      mimeType: 'text/plain',
      size: 256,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      parentId: 'root',
      content: 'Welcome to NeonOS! This is your personal file system.'
    },
    {
      id: 'readme',
      name: 'readme.md',
      type: 'file',
      mimeType: 'text/markdown',
      size: 512,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      parentId: 'documents',
      content: '# NeonOS\n\nA futuristic operating system simulation.'
    }
  ];
};

const FileSystemManager: React.FC = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileSystemItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Load files from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedFiles = localStorage.getItem(`neon_os_files_${user.id}`);
      if (savedFiles) {
        try {
          setFiles(JSON.parse(savedFiles));
        } catch (error) {
          console.error('Error loading files:', error);
          setFiles(getInitialFileSystem());
        }
      } else {
        // First time user, initialize with default files
        const initialFiles = getInitialFileSystem();
        setFiles(initialFiles);
        localStorage.setItem(`neon_os_files_${user.id}`, JSON.stringify(initialFiles));
      }
    }
  }, [user]);

  // Save files to localStorage when changed
  useEffect(() => {
    if (user && files.length > 0) {
      localStorage.setItem(`neon_os_files_${user.id}`, JSON.stringify(files));
    }
  }, [files, user]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const navigateToFolder = (folderId: string) => {
    // Build path array
    const path = [folderId];
    let currentItem = files.find(f => f.id === folderId);
    
    while (currentItem && currentItem.parentId) {
      path.unshift(currentItem.parentId);
      currentItem = files.find(f => f.id === currentItem!.parentId);
    }
    
    setCurrentPath(path);
    
    // Expand all folders in the path
    setExpandedFolders(prev => {
      const next = new Set(prev);
      path.forEach(id => next.add(id));
      return next;
    });
  };

  const getCurrentFolderItems = () => {
    const currentFolderId = currentPath[currentPath.length - 1];
    return files.filter(item => item.parentId === currentFolderId);
  };

  const openFile = (file: FileSystemItem) => {
    setSelectedItem(file.id);
    toast({
      title: `Opening ${file.name}`,
      description: file.content || 'This file is empty'
    });
  };

  const renderFileIcon = (file: FileSystemItem) => {
    if (file.type === 'folder') return <Folder className="text-neon-red" size={18} />;
    
    if (file.mimeType) {
      if (file.mimeType.startsWith('image/')) return <FileImage size={18} />;
      if (file.mimeType.includes('zip') || file.mimeType.includes('tar') || file.mimeType.includes('rar')) return <FileArchive size={18} />;
    }
    
    return <FileText size={18} />;
  };

  const renderFileTree = (parentId: string | null, depth = 0) => {
    const folderItems = files.filter(item => item.parentId === parentId);
    
    if (folderItems.length === 0) return null;
    
    return (
      <ul className={`pl-${depth > 0 ? 4 : 0}`}>
        {folderItems.map(item => (
          <li key={item.id} className="py-1">
            {item.type === 'folder' ? (
              <div>
                <button 
                  onClick={() => toggleFolder(item.id)}
                  className="flex items-center hover:bg-neon-red/10 rounded px-1 py-0.5 w-full text-left"
                >
                  {expandedFolders.has(item.id) ? (
                    <ChevronDown size={16} className="mr-1" />
                  ) : (
                    <ChevronRight size={16} className="mr-1" />
                  )}
                  <Folder size={18} className="text-neon-red mr-2" />
                  <span className="text-gray-200">{item.name}</span>
                </button>
                {expandedFolders.has(item.id) && renderFileTree(item.id, depth + 1)}
              </div>
            ) : (
              <button 
                onClick={() => openFile(item)}
                className={`flex items-center hover:bg-neon-red/10 rounded px-1 py-0.5 ml-6 w-full text-left ${selectedItem === item.id ? 'bg-neon-red/20' : ''}`}
              >
                {renderFileIcon(item)}
                <span className="ml-2 text-gray-200">{item.name}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center border-b border-neon-red/20 p-3 bg-neon-darker">
        <FileText className="text-neon-red mr-2" size={20} />
        <h2 className="text-white font-medium">File Manager</h2>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-neon-red/20 bg-neon-dark p-3 overflow-y-auto">
          <h3 className="text-gray-400 text-xs uppercase mb-2">File System</h3>
          {renderFileTree(null)}
        </div>
        
        {/* Main content */}
        <div className="flex-1 bg-neon-darker p-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getCurrentFolderItems().map(item => (
              <div 
                key={item.id}
                onClick={() => item.type === 'folder' ? navigateToFolder(item.id) : openFile(item)}
                className={`p-3 rounded border border-neon-red/20 hover:bg-neon-red/10 cursor-pointer transition-colors ${selectedItem === item.id ? 'bg-neon-red/20' : 'bg-neon-dark'}`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center mb-2">
                    {item.type === 'folder' ? (
                      <Folder className="text-neon-red" size={36} />
                    ) : (
                      renderFileIcon(item)
                    )}
                  </div>
                  <span className="text-white text-sm text-center truncate w-full">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSystemManager;
