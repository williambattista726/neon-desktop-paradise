
import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  className?: string;
}

const Window: React.FC<WindowProps> = ({
  title,
  children,
  icon,
  isActive,
  onClose,
  onFocus,
  onMinimize,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 800, height: 500 },
  maxWidth = window.innerWidth - 100,
  maxHeight = window.innerHeight - 100,
  minWidth = 300,
  minHeight = 200,
  className
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Handle window dragging
  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    onFocus();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Handle window resizing
  const onResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    onFocus();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - size.width));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - size.height));
        setPosition({ x: newX, y: newY });
      }

      if (isResizing && resizeDirection) {
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - position.x));
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY - position.y));
        }
        if (resizeDirection.includes('w')) {
          const deltaX = e.clientX - (position.x);
          newWidth = Math.max(minWidth, Math.min(maxWidth, size.width - deltaX));
          newX = Math.min(position.x + deltaX, position.x + size.width - minWidth);
        }
        if (resizeDirection.includes('n')) {
          const deltaY = e.clientY - (position.y);
          newHeight = Math.max(minHeight, Math.min(maxHeight, size.height - deltaY));
          newY = Math.min(position.y + deltaY, position.y + size.height - minHeight);
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position, size, resizeDirection, maxWidth, maxHeight, minWidth, minHeight]);

  // Move window to front when clicked
  const handleWindowClick = () => {
    if (!isActive) {
      onFocus();
    }
  };

  return (
    <div 
      ref={windowRef}
      className={cn(
        "absolute window-glass rounded-lg overflow-hidden flex flex-col",
        isActive ? "shadow-lg shadow-neon-red/20 z-50" : "z-40 opacity-95",
        className
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transition: isDragging || isResizing ? 'none' : 'opacity 0.2s ease'
      }}
      onClick={handleWindowClick}
    >
      {/* Window title bar */}
      <div 
        className="h-10 px-3 flex items-center justify-between bg-neon-darker border-b border-neon-red/30 draggable-handle"
        onMouseDown={onDragStart}
      >
        <div className="flex items-center space-x-2 text-sm">
          {icon && <div className="text-neon-red">{icon}</div>}
          <span className="font-medium text-gray-200 truncate">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onMinimize} 
            className="h-5 w-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-neon-red/20 rounded-sm"
          >
            <Minimize size={14} />
          </button>
          <button 
            className="h-5 w-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-neon-red/20 rounded-sm"
          >
            <Maximize size={14} />
          </button>
          <button 
            onClick={onClose} 
            className="h-5 w-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-neon-red/70 rounded-sm"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Window content */}
      <div className="flex-1 overflow-auto bg-neon-darker/70">
        {children}
      </div>

      {/* Resize handles */}
      <div className="absolute right-0 bottom-0 w-4 h-4 cursor-se-resize" onMouseDown={(e) => onResizeStart(e, 'se')}></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize" onMouseDown={(e) => onResizeStart(e, 's')}></div>
      <div className="absolute top-0 bottom-0 right-0 w-1 cursor-e-resize" onMouseDown={(e) => onResizeStart(e, 'e')}></div>
      <div className="absolute top-0 left-0 bottom-0 w-1 cursor-w-resize" onMouseDown={(e) => onResizeStart(e, 'w')}></div>
      <div className="absolute top-0 left-0 right-0 h-1 cursor-n-resize" onMouseDown={(e) => onResizeStart(e, 'n')}></div>
      <div className="absolute left-0 bottom-0 w-4 h-4 cursor-sw-resize" onMouseDown={(e) => onResizeStart(e, 'sw')}></div>
      <div className="absolute right-0 top-0 w-4 h-4 cursor-ne-resize" onMouseDown={(e) => onResizeStart(e, 'ne')}></div>
      <div className="absolute left-0 top-0 w-4 h-4 cursor-nw-resize" onMouseDown={(e) => onResizeStart(e, 'nw')}></div>
    </div>
  );
};

export default Window;
