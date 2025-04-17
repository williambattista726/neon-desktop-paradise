
import React, { useState } from 'react';
import { Menu, Search, UserCircle2, ClockIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 h-14 glassmorphic-taskbar flex items-center justify-between z-50",
      className
    )}>
      {/* Start button */}
      <div className="flex items-center h-full">
        <button 
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
          <UserCircle2 size={18} className="text-gray-300" />
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
