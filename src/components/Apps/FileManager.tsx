
import React, { useState } from 'react';
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown, 
  Home, 
  Laptop, 
  HardDrive,
  FilePlus2,
  FolderPlus,
  Search,
  Grid2X2,
  List
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  children?: FileItem[];
}

interface FileManagerProps {}

const FileManager: React.FC<FileManagerProps> = () => {
  const [activeFolder, setActiveFolder] = useState('home');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['home']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const fileStructure: FileItem[] = [
    {
      id: 'home',
      name: 'Home',
      type: 'folder',
      modified: '2023-04-01',
      children: [
        {
          id: 'documents',
          name: 'Documents',
          type: 'folder',
          modified: '2023-04-01',
          children: [
            {
              id: 'project-notes',
              name: 'Project Notes.txt',
              type: 'file',
              size: '12 KB',
              modified: '2023-04-01'
            },
            {
              id: 'resume',
              name: 'Resume.pdf',
              type: 'file',
              size: '245 KB',
              modified: '2023-03-28'
            }
          ]
        },
        {
          id: 'downloads',
          name: 'Downloads',
          type: 'folder',
          modified: '2023-03-30',
          children: [
            {
              id: 'software',
              name: 'NeonOS_Update.exe',
              type: 'file',
              size: '1.2 GB',
              modified: '2023-03-30'
            },
            {
              id: 'movie',
              name: 'Movie.mp4',
              type: 'file',
              size: '2.8 GB',
              modified: '2023-03-25'
            }
          ]
        },
        {
          id: 'pictures',
          name: 'Pictures',
          type: 'folder',
          modified: '2023-03-22',
          children: [
            {
              id: 'vacation',
              name: 'Vacation.jpg',
              type: 'file',
              size: '3.5 MB',
              modified: '2023-03-22'
            },
            {
              id: 'profile',
              name: 'Profile.png',
              type: 'file',
              size: '1.8 MB',
              modified: '2023-02-28'
            }
          ]
        },
        {
          id: 'readme',
          name: 'README.md',
          type: 'file',
          size: '2 KB',
          modified: '2023-03-15'
        }
      ]
    }
  ];
  
  const toggleFolder = (folderId: string) => {
    if (expandedFolders.includes(folderId)) {
      setExpandedFolders(expandedFolders.filter(id => id !== folderId));
    } else {
      setExpandedFolders([...expandedFolders, folderId]);
    }
  };
  
  // Recursively find a folder by its ID
  const findFolderById = (folders: FileItem[], id: string): FileItem | undefined => {
    for (const folder of folders) {
      if (folder.id === id) return folder;
      if (folder.children) {
        const found = findFolderById(folder.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };
  
  // Get the current active folder content
  const activeFolderContent = findFolderById(fileStructure, activeFolder)?.children || [];
  
  // Filter content based on search query
  const filteredContent = searchQuery
    ? activeFolderContent.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeFolderContent;
  
  // Recursive function to render the folder tree
  const renderFolder = (folder: FileItem, depth = 0) => {
    const isExpanded = expandedFolders.includes(folder.id);
    const isActive = activeFolder === folder.id;
    
    return (
      <div key={folder.id} className="select-none">
        <div 
          className={`flex items-center py-1 px-2 rounded hover:bg-neon-red/10 cursor-pointer ${isActive ? 'bg-neon-red/20 text-white' : 'text-gray-300'}`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            setActiveFolder(folder.id);
            if (!isExpanded && folder.children && folder.children.length > 0) {
              toggleFolder(folder.id);
            }
          }}
        >
          {folder.children && folder.children.length > 0 ? (
            <button 
              className="mr-1 w-5 h-5 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-5 h-5" />
          )}
          <Folder size={16} className={`mr-2 ${isActive ? 'text-neon-red' : 'text-gray-400'}`} />
          <span className="truncate">{folder.name}</span>
        </div>
        
        {isExpanded && folder.children && folder.children.length > 0 && (
          <div>
            {folder.children
              .filter(child => child.type === 'folder')
              .map(child => renderFolder(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="h-full flex flex-col bg-neon-dark">
      {/* Toolbar */}
      <div className="bg-neon-darker p-2 border-b border-neon-red/20 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <button className="p-1 rounded hover:bg-neon-red/10">
            <FilePlus2 size={18} className="text-gray-300" />
          </button>
          <button className="p-1 rounded hover:bg-neon-red/10">
            <FolderPlus size={18} className="text-gray-300" />
          </button>
        </div>
        
        <div className="relative flex-1 max-w-md mx-4">
          <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full py-1 pl-8 pr-3 bg-neon-dark rounded border border-neon-red/20 text-sm text-white focus:outline-none focus:border-neon-red/40"
          />
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            className={`p-1 rounded ${viewMode === 'grid' ? 'bg-neon-red/20' : 'hover:bg-neon-red/10'}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid2X2 size={18} className={viewMode === 'grid' ? 'text-neon-red' : 'text-gray-300'} />
          </button>
          <button 
            className={`p-1 rounded ${viewMode === 'list' ? 'bg-neon-red/20' : 'hover:bg-neon-red/10'}`}
            onClick={() => setViewMode('list')}
          >
            <List size={18} className={viewMode === 'list' ? 'text-neon-red' : 'text-gray-300'} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-52 bg-neon-darker border-r border-neon-red/20 flex flex-col">
          <div className="p-2">
            <div className="text-xs font-medium uppercase text-gray-400 px-2 py-1">Locations</div>
            <div className="space-y-1">
              <div className="flex items-center py-1 px-2 rounded hover:bg-neon-red/10 cursor-pointer text-gray-300">
                <Home size={16} className="mr-2 text-gray-400" />
                <span>Home</span>
              </div>
              <div className="flex items-center py-1 px-2 rounded hover:bg-neon-red/10 cursor-pointer text-gray-300">
                <Laptop size={16} className="mr-2 text-gray-400" />
                <span>Desktop</span>
              </div>
              <div className="flex items-center py-1 px-2 rounded hover:bg-neon-red/10 cursor-pointer text-gray-300">
                <HardDrive size={16} className="mr-2 text-gray-400" />
                <span>System</span>
              </div>
            </div>
          </div>
          
          <div className="p-2 flex-1 overflow-y-auto">
            <div className="text-xs font-medium uppercase text-gray-400 px-2 py-1">Folders</div>
            {fileStructure.map(folder => renderFolder(folder))}
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredContent.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>No files found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredContent.map(item => (
                <div 
                  key={item.id}
                  className="p-2 flex flex-col items-center justify-center rounded hover:bg-neon-red/10 cursor-pointer"
                >
                  {item.type === 'folder' ? (
                    <Folder size={40} className="text-neon-red mb-2" />
                  ) : (
                    <File size={40} className="text-gray-300 mb-2" />
                  )}
                  <div className="text-center">
                    <div className="text-sm text-white truncate w-full max-w-[120px]">{item.name}</div>
                    {item.type === 'file' && (
                      <div className="text-xs text-gray-500">{item.size}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md overflow-hidden border border-neon-red/20">
              <table className="min-w-full divide-y divide-neon-red/20">
                <thead className="bg-neon-darker">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Modified</th>
                  </tr>
                </thead>
                <tbody className="bg-neon-black divide-y divide-neon-red/10">
                  {filteredContent.map(item => (
                    <tr key={item.id} className="hover:bg-neon-red/10 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.type === 'folder' ? (
                            <Folder size={16} className="text-neon-red mr-2" />
                          ) : (
                            <File size={16} className="text-gray-400 mr-2" />
                          )}
                          <span className="text-sm text-white">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {item.type === 'folder' ? '—' : item.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {item.modified}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManager;
