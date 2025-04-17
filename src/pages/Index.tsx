
import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Terminal as TerminalIcon, 
  Settings as SettingsIcon, 
  FileText, 
  Monitor, 
  Search as SearchIcon
} from 'lucide-react';
import Window from '../components/Desktop/Window';
import AppIcon from '../components/Desktop/AppIcon';
import Taskbar from '../components/Desktop/Taskbar';
import StartMenu from '../components/Desktop/StartMenu';
import ProxyBrowser from '../components/Apps/ProxyBrowser';
import Terminal from '../components/Apps/Terminal';
import Settings from '../components/Apps/Settings';
import FileSystemManager from '../components/FileSystem/FileSystemManager';
import SystemMonitor from '../components/Apps/SystemMonitor';
import AuthScreen from '../components/Auth/AuthScreen';
import { useAuth } from '../contexts/AuthContext';
import { UserDataProvider } from '../contexts/UserDataContext';

const generateId = () => Math.random().toString(36).substring(2, 9);

interface AppWindow {
  id: string;
  title: string;
  type: string;
  icon: React.ReactNode;
  isActive: boolean;
  isMinimized: boolean;
}

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredApps, setFilteredApps] = useState<{id: string, name: string, icon: React.ReactNode}[]>([]);

  const apps = {
    browser: {
      title: 'Proxy Browser',
      icon: <Globe size={22} />
    },
    terminal: {
      title: 'Terminal',
      icon: <TerminalIcon size={22} />
    },
    settings: {
      title: 'Settings',
      icon: <SettingsIcon size={22} />
    },
    files: {
      title: 'File Manager',
      icon: <FileText size={22} />
    },
    system: {
      title: 'System Monitor',
      icon: <Monitor size={22} />
    }
  };

  const allApps = [
    { id: 'browser', name: 'Proxy Browser', icon: <Globe size={22} /> },
    { id: 'terminal', name: 'Terminal', icon: <TerminalIcon size={22} /> },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon size={22} /> },
    { id: 'files', name: 'File Manager', icon: <FileText size={22} /> },
    { id: 'system', name: 'System Monitor', icon: <Monitor size={22} /> },
  ];

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredApps([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const matchedApps = allApps.filter(app => 
      app.name.toLowerCase().includes(query)
    );
    
    setFilteredApps(matchedApps);
  }, [searchQuery]);

  const launchApp = (appType: string) => {
    const existingAppIndex = windows.findIndex(window => window.type === appType && window.isMinimized);
    
    if (existingAppIndex !== -1) {
      const updatedWindows = [...windows];
      updatedWindows[existingAppIndex].isMinimized = false;
      updatedWindows[existingAppIndex].isActive = true;
      setWindows(updatedWindows);
      setActiveWindowId(updatedWindows[existingAppIndex].id);
    } else {
      const appConfig = apps[appType as keyof typeof apps];
      const newWindow: AppWindow = {
        id: generateId(),
        title: appConfig.title,
        type: appType,
        icon: appConfig.icon,
        isActive: true,
        isMinimized: false
      };
      
      const updatedWindows = windows.map(window => ({
        ...window,
        isActive: false
      }));
      
      setWindows([...updatedWindows, newWindow]);
      setActiveWindowId(newWindow.id);
    }
    
    setIsStartMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const closeWindow = (id: string) => {
    const filteredWindows = windows.filter(window => window.id !== id);
    setWindows(filteredWindows);
    
    if (activeWindowId === id && filteredWindows.length > 0) {
      const topWindow = filteredWindows[filteredWindows.length - 1];
      setActiveWindowId(topWindow.id);
      
      setWindows(windows => 
        windows.map(window => ({
          ...window,
          isActive: window.id === topWindow.id
        }))
      );
    } else if (filteredWindows.length === 0) {
      setActiveWindowId(null);
    }
  };

  const focusWindow = (id: string) => {
    if (activeWindowId === id) return;
    
    setActiveWindowId(id);
    setWindows(windows.map(window => ({
      ...window,
      isActive: window.id === id
    })));
  };

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(window => {
      if (window.id === id) {
        return {
          ...window,
          isMinimized: true,
          isActive: false
        };
      }
      return window;
    }));
    
    const visibleWindows = windows.filter(window => !window.isMinimized && window.id !== id);
    if (visibleWindows.length > 0) {
      const topWindow = visibleWindows[visibleWindows.length - 1];
      setActiveWindowId(topWindow.id);
      setWindows(prev => 
        prev.map(window => ({
          ...window,
          isActive: window.id === topWindow.id && window.id !== id
        }))
      );
    } else {
      setActiveWindowId(null);
    }
  };

  const restoreWindow = (id: string) => {
    setWindows(windows.map(window => {
      if (window.id === id) {
        return {
          ...window,
          isMinimized: false,
          isActive: true
        };
      }
      return {
        ...window,
        isActive: false
      };
    }));
    setActiveWindowId(id);
  };

  const toggleStartMenu = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
    if (isSearchOpen) {
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    setIsStartMenuOpen(false);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTaskbarAppClick = (id: string) => {
    const window = windows.find(w => w.id === id);
    if (!window) return;
    
    if (window.isMinimized) {
      restoreWindow(id);
    } else if (window.isActive) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const startMenu = document.getElementById('start-menu');
      const startButton = document.getElementById('start-button');
      const searchContainer = document.getElementById('search-container');
      
      if (
        isStartMenuOpen && 
        startMenu && 
        !startMenu.contains(e.target as Node) && 
        startButton && 
        !startButton.contains(e.target as Node)
      ) {
        setIsStartMenuOpen(false);
      }
      
      if (
        isSearchOpen &&
        searchContainer &&
        !searchContainer.contains(e.target as Node)
      ) {
        // Don't close search if clicking on search button in taskbar
        const searchButton = document.getElementById('search-button');
        if (searchButton && !searchButton.contains(e.target as Node)) {
          setIsSearchOpen(false);
          setSearchQuery('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStartMenuOpen, isSearchOpen]);

  const renderAppContent = (appType: string) => {
    switch (appType) {
      case 'browser':
        return <ProxyBrowser />;
      case 'terminal':
        return <Terminal />;
      case 'settings':
        return <Settings />;
      case 'files':
        return <FileSystemManager />;
      case 'system':
        return <SystemMonitor />;
      default:
        return <div className="p-4 text-white">App content not available</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="absolute inset-0 animated-bg" />
        <div className="animate-spin h-8 w-8 border-t-2 border-neon-red rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <UserDataProvider>
      <div className="w-screen h-screen overflow-hidden flex flex-col">
        <div className="absolute inset-0 animated-bg" />
        
        <div 
          id="desktop-area"
          className="flex-1 relative"
          onClick={() => {
            if (isStartMenuOpen) setIsStartMenuOpen(false);
            if (isSearchOpen) setIsSearchOpen(false);
          }}
        >
          <AppIcon 
            icon={<Globe size={28} />} 
            name="Proxy Browser" 
            onClick={() => launchApp('browser')}
            defaultPosition={{ x: 20, y: 20 }}
          />
          <AppIcon 
            icon={<TerminalIcon size={28} />} 
            name="Terminal" 
            onClick={() => launchApp('terminal')}
            defaultPosition={{ x: 20, y: 120 }}
          />
          <AppIcon 
            icon={<SettingsIcon size={28} />} 
            name="Settings" 
            onClick={() => launchApp('settings')}
            defaultPosition={{ x: 20, y: 220 }}
          />
          <AppIcon 
            icon={<FileText size={28} />} 
            name="File Manager" 
            onClick={() => launchApp('files')}
            defaultPosition={{ x: 20, y: 320 }}
          />
          <AppIcon 
            icon={<Monitor size={28} />}
            name="System Monitor" 
            onClick={() => launchApp('system')}
            defaultPosition={{ x: 20, y: 420 }}
          />
          
          {windows.map(window => (
            !window.isMinimized && (
              <Window
                key={window.id}
                title={window.title}
                icon={window.icon}
                isActive={window.isActive}
                onClose={() => closeWindow(window.id)}
                onFocus={() => focusWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                defaultPosition={{ 
                  x: 100 + (windows.indexOf(window) * 30) % 200, 
                  y: 100 + (windows.indexOf(window) * 30) % 150
                }}
              >
                {renderAppContent(window.type)}
              </Window>
            )
          ))}
          
          <StartMenu 
            isOpen={isStartMenuOpen}
            onClose={() => setIsStartMenuOpen(false)}
            onAppClick={launchApp}
          />
          
          {/* Search overlay */}
          {isSearchOpen && (
            <div 
              id="search-container"
              className="absolute top-10 left-1/2 transform -translate-x-1/2 w-96 rounded-lg glass-morphism border border-neon-red/20 overflow-hidden z-50 animate-fade-in"
            >
              <div className="p-3 bg-neon-darker">
                <div className="relative">
                  <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    placeholder="Search apps..."
                    className="w-full py-2 pl-9 pr-3 bg-neon-dark rounded-md border border-neon-red/30 text-sm text-white focus:outline-none focus:border-neon-red/60"
                    autoFocus
                  />
                </div>
              </div>
              
              {filteredApps.length > 0 && (
                <div className="bg-neon-dark max-h-80 overflow-y-auto p-2">
                  {filteredApps.map(app => (
                    <button
                      key={app.id}
                      onClick={() => launchApp(app.id)}
                      className="w-full flex items-center p-2 rounded-md hover:bg-neon-red/20 text-left"
                    >
                      {app.icon}
                      <span className="ml-3 text-sm text-white">{app.name}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {searchQuery && filteredApps.length === 0 && (
                <div className="bg-neon-dark p-4 text-center text-gray-400">
                  No apps found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
        
        <Taskbar
          runningApps={windows.map(window => ({
            id: window.id,
            title: window.title,
            icon: window.icon,
            isActive: window.isActive,
            isMinimized: window.isMinimized
          }))}
          onAppClick={handleTaskbarAppClick}
          onSearchClick={openSearch}
          onStartMenuClick={toggleStartMenu}
          isStartMenuOpen={isStartMenuOpen}
        />
      </div>
    </UserDataProvider>
  );
};

export default Index;
