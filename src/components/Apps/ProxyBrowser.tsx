
import React, { useState, useEffect, useRef } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCw, X, BookmarkIcon, Search } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProxyBrowserProps {
  defaultUrl?: string;
}

const ProxyBrowser: React.FC<ProxyBrowserProps> = ({ defaultUrl = 'https://www.bing.com/' }) => {
  // Configuration for Ultraviolet
  const uvPrefix = '/uv/service/';
  const uvHostname = 'https://tomp.app';
  
  const [url, setUrl] = useState(defaultUrl);
  const [inputUrl, setInputUrl] = useState(defaultUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([defaultUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [proxyReady, setProxyReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load the initial URL through proxy
    setIsLoading(true);
    
    // Check if proxy is ready
    const timer = setTimeout(() => {
      setProxyReady(true);
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let processedUrl = inputUrl.trim();
    
    // Add https:// if no protocol specified
    if (!/^https?:\/\//.test(processedUrl)) {
      processedUrl = `https://${processedUrl}`;
    }
    
    setUrl(processedUrl);
    
    // Add to history if it's a new URL
    if (history[historyIndex] !== processedUrl) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(processedUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    
    setIsLoading(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Use Bing search for the query
    const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`;
    setUrl(searchUrl);
    setInputUrl(searchUrl);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(searchUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setIsLoading(true);
    setShowSearch(false);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setUrl(history[historyIndex - 1]);
      setInputUrl(history[historyIndex - 1]);
      setIsLoading(true);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setUrl(history[historyIndex + 1]);
      setInputUrl(history[historyIndex + 1]);
      setIsLoading(true);
    }
  };

  const refresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = getProxyUrl(url);
    }
  };

  const clearUrl = () => {
    setInputUrl('');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    // Focus the search input when shown
    if (!showSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const getProxyUrl = (targetUrl: string) => {
    // Format for Ultraviolet proxy
    return `${uvHostname}${uvPrefix}${encodeURIComponent(targetUrl)}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Browser toolbar */}
      <div className="flex items-center px-2 py-2 border-b border-neon-red/20 bg-neon-darker">
        <div className="flex space-x-1 mr-2">
          <button 
            onClick={goBack}
            disabled={historyIndex <= 0}
            className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-neon-red/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Back"
          >
            <ArrowLeft size={16} className="text-gray-300" />
          </button>
          <button 
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-neon-red/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Forward"
          >
            <ArrowRight size={16} className="text-gray-300" />
          </button>
          <button 
            onClick={refresh}
            className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-neon-red/20"
            title="Refresh"
          >
            <RotateCw size={16} className={`text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <form onSubmit={handleUrlSubmit} className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Globe size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full rounded-full py-1.5 pl-9 pr-9 bg-neon-dark border border-neon-red/30 text-sm text-white focus:outline-none focus:border-neon-red/60"
          />
          {inputUrl && (
            <button 
              type="button"
              onClick={clearUrl}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X size={14} className="text-gray-400 hover:text-white" />
            </button>
          )}
        </form>
        
        <button 
          className="ml-2 w-8 h-8 flex justify-center items-center rounded-full hover:bg-neon-red/20"
          onClick={toggleSearch}
          title="Search"
        >
          <Search size={16} className="text-gray-300" />
        </button>
        
        <button 
          className="ml-2 w-8 h-8 flex justify-center items-center rounded-full hover:bg-neon-red/20"
          title="Bookmark"
        >
          <BookmarkIcon size={16} className="text-gray-300" />
        </button>
      </div>
      
      {/* Search bar */}
      {showSearch && (
        <div className="p-2 bg-neon-darker border-b border-neon-red/20">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the web..."
              className="flex-1 h-9 bg-neon-dark border-neon-red/30 text-white"
            />
            <Button 
              type="submit" 
              className="h-9 px-4 bg-neon-red hover:bg-neon-red/80 text-white"
            >
              Search
            </Button>
          </form>
        </div>
      )}
      
      {/* Browser content */}
      <div className="flex-1 bg-white">
        {!proxyReady ? (
          <div className="w-full h-full flex items-center justify-center bg-neon-dark">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-t-2 border-neon-red rounded-full mx-auto mb-4"></div>
              <p className="text-white">Loading proxy service...</p>
            </div>
          </div>
        ) : (
          <iframe 
            ref={iframeRef}
            src={getProxyUrl(url)}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            title="Proxy Browser"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  );
};

export default ProxyBrowser;
