
import React from 'react';
import { Search, User, Settings, Power, FileText, Monitor, Terminal, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppMenuItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  action: () => void;
}

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAppClick: (appId: string) => void;
  className?: string;
}

const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onAppClick,
  className
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const appItems: AppMenuItem[] = [
    {
      id: 'browser',
      name: 'Proxy Browser',
      icon: <Globe size={22} className="text-neon-red" />,
      action: () => onAppClick('browser')
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: <Terminal size={22} className="text-neon-red" />,
      action: () => onAppClick('terminal')
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings size={22} className="text-neon-red" />,
      action: () => onAppClick('settings')
    },
    {
      id: 'files',
      name: 'File Manager',
      icon: <FileText size={22} className="text-neon-red" />,
      action: () => onAppClick('files')
    },
    {
      id: 'system',
      name: 'System Monitor',
      icon: <Monitor size={22} className="text-neon-red" />,
      action: () => onAppClick('system')
    }
  ];

  const filteredApps = searchQuery
    ? appItems.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : appItems;

  // Close start menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const startMenu = document.getElementById('start-menu');
      const startButton = document.getElementById('start-button');
      
      if (
        isOpen && 
        startMenu && 
        !startMenu.contains(target) && 
        startButton && 
        !startButton.contains(target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      id="start-menu"
      className={cn(
        "fixed bottom-14 left-0 w-80 glass-morphism rounded-t-lg rounded-r-lg overflow-hidden shadow-lg shadow-neon-red/20 animate-fadeIn",
        className
      )}
    >
      <div className="p-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps..."
            className="w-full py-2 pl-9 pr-3 bg-neon-darker rounded-md border border-neon-red/20 text-sm text-white focus:outline-none focus:border-neon-red/40"
          />
        </div>
      </div>

      <div className="px-3 pb-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Apps</h3>
        <div className="space-y-1">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                app.action();
                onClose();
              }}
              className="w-full flex items-center p-2 rounded-md hover:bg-neon-red/20 text-left"
            >
              {app.icon}
              <span className="ml-3 text-sm text-white">{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 border-t border-neon-red/20 p-3">
        <div className="flex items-center justify-between">
          <button className="flex items-center text-white hover:text-neon-red">
            <User size={18} className="mr-2" />
            <span className="text-sm">User</span>
          </button>
          <button className="flex items-center text-white hover:text-neon-red">
            <Power size={18} className="mr-2" />
            <span className="text-sm">Power</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
