
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AppIconProps {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
  defaultPosition?: { x: number; y: number };
  className?: string;
}

const AppIcon: React.FC<AppIconProps> = ({
  icon,
  name,
  onClick,
  defaultPosition = { x: 20, y: 20 },
  className
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const onDoubleClick = () => {
    onClick();
  };

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const desktopArea = document.getElementById('desktop-area');
        if (desktopArea) {
          const desktopRect = desktopArea.getBoundingClientRect();
          const iconWidth = iconRef.current?.offsetWidth || 80;
          const iconHeight = iconRef.current?.offsetHeight || 90;
          
          // Calculate boundaries within the desktop area
          const maxX = desktopRect.width - iconWidth;
          const maxY = desktopRect.height - iconHeight;
          
          // Calculate new position
          const newX = Math.max(0, Math.min(e.clientX - dragOffset.x - desktopRect.left, maxX));
          const newY = Math.max(0, Math.min(e.clientY - dragOffset.y - desktopRect.top, maxY));
          
          setPosition({ x: newX, y: newY });
        }
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, dragOffset, position]);

  return (
    <div
      ref={iconRef}
      className={cn(
        "absolute w-20 h-22 flex flex-col items-center justify-center select-none",
        isDragging ? "z-50" : "z-10",
        className
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'transform 0.1s ease'
      }}
      onMouseDown={onDragStart}
      onDoubleClick={onDoubleClick}
    >
      <div className="w-14 h-14 flex items-center justify-center rounded-xl glass-morphism hover:bg-neon-red/10 hover:animate-pulse-glow cursor-pointer">
        <div className="text-white opacity-90">
          {icon}
        </div>
      </div>
      <div className="mt-1 px-1 py-0.5 text-xs text-center text-white rounded bg-black/30 backdrop-blur-xs">
        <span className="truncate whitespace-nowrap">{name}</span>
      </div>
    </div>
  );
};

export default AppIcon;
