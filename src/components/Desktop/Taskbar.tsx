
import React, { useState } from 'react';
import { Menu, Search, UserCircle2, ClockIcon, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface RunningApp {
  id: string;
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  isMinimized: boolean;
}

interface TaskbarProps {
  runningApps: RunningApp[];
  onAppClick: (id: string) => void;
  onSearchClick: () => void;
  onStartMenuClick: () => void;
  isStartMenuOpen: boolean;
  className?: string;
}

const Taskbar: React.FC<TaskbarProps> = ({
  runningApps,
  onAppClick,
  onSearchClick,
  onStartMenuClick,
  isStartMenuOpen,
  className
}) => {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Update clock every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Format time
  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 h-14 glassmorphic-taskbar flex items-center justify-between z-50",
      className
    )}>
      {/* Start button */}
      <div className="flex items-center h-full">
        <button 
          id="start-button"
          onClick={onStartMenuClick}
          className={cn(
            "h-full px-4 flex items-center justify-center text-white hover:bg-neon-red/20 transition-colors",
            isStartMenuOpen && "bg-neon-red/30 text-white"
          )}
        >
          <Menu size={22} className={isStartMenuOpen ? "text-white" : "text-neon-red"} />
        </button>

        {/* Search bar */}
        <div 
          id="search-button"
          className="mx-3 flex items-center h-8 px-3 rounded-md bg-neon-darker/90 border border-neon-red/20 hover:border-neon-red/40 cursor-pointer"
          onClick={onSearchClick}
        >
          <Search size={16} className="text-gray-400 mr-2" />
          <span className="text-sm text-gray-400">Search</span>
        </div>
      </div>

      {/* Running apps */}
      <div className="flex-1 h-full flex items-center justify-center overflow-x-auto px-2">
        <div className="flex items-center space-x-1">
          {runningApps.map(app => (
            <button
              key={app.id}
              onClick={() => onAppClick(app.id)}
              className={cn(
                "h-10 px-3 rounded flex items-center space-x-2 transition-all",
                app.isActive 
                  ? "bg-neon-red/30 text-white" 
                  : app.isMinimized 
                    ? "text-gray-400 hover:bg-neon-red/20" 
                    : "bg-neon-darker/60 hover:bg-neon-red/20 text-gray-200"
              )}
            >
              <span>{app.icon}</span>
              <span className="text-sm font-medium truncate max-w-[100px]">{app.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* System tray */}
      <div className="flex items-center h-full">
        <div className="flex items-center space-x-4 px-4 h-full">
          <div className="relative">
            <button 
              onClick={toggleUserMenu}
              className="text-gray-300 hover:text-white flex items-center focus:outline-none"
            >
              <UserCircle2 size={18} className="text-gray-300" />
              {user && (
                <span className="ml-2 text-sm">{user.username}</span>
              )}
            </button>
            
            {showUserMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 rounded-lg shadow-lg z-50 glass-morphism border border-neon-red/20">
                <div className="p-2">
                  <div className="py-2 px-4 border-b border-neon-red/20">
                    <p className="text-white text-sm font-semibold">{user?.username}</p>
                    <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-neon-red/20 rounded-md"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center text-gray-300">
            <ClockIcon size={16} className="mr-2" />
            <span className="text-sm font-medium">{formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
