
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

interface UserPreferences {
  wallpaper: string;
  theme: string;
  iconsArrangement: { id: string; position: { x: number; y: number } }[];
  brightness: number;
  volume: number;
  darkMode: boolean;
  animations: boolean;
  notificationSounds: boolean;
  autoUpdate: boolean;
}

interface AppSettings {
  [key: string]: any;
}

interface UserDataContextType {
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  getAppSettings: (appId: string) => any;
  updateAppSettings: (appId: string, settings: any) => void;
  resetData: () => void;
}

const defaultPreferences: UserPreferences = {
  wallpaper: 'default',
  theme: 'neon-red',
  iconsArrangement: [],
  brightness: 100,
  volume: 75,
  darkMode: true,
  animations: true,
  notificationSounds: true,
  autoUpdate: true
};

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [appSettings, setAppSettings] = useState<AppSettings>({});

  // Load user data from localStorage when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    } else {
      // Reset to defaults if not authenticated
      setPreferences(defaultPreferences);
      setAppSettings({});
    }
  }, [isAuthenticated, user]);

  const loadUserData = () => {
    if (!user) return;
    
    try {
      // Load preferences
      const storedPrefs = localStorage.getItem(`neon_os_prefs_${user.id}`);
      if (storedPrefs) {
        setPreferences(JSON.parse(storedPrefs));
      }
      
      // Load app settings
      const storedSettings = localStorage.getItem(`neon_os_app_settings_${user.id}`);
      if (storedSettings) {
        setAppSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = () => {
    if (!user) return;
    
    try {
      localStorage.setItem(`neon_os_prefs_${user.id}`, JSON.stringify(preferences));
      localStorage.setItem(`neon_os_app_settings_${user.id}`, JSON.stringify(appSettings));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPrefs };
      // Save to localStorage
      if (user) {
        localStorage.setItem(`neon_os_prefs_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const getAppSettings = (appId: string) => {
    return appSettings[appId] || {};
  };

  const updateAppSettings = (appId: string, settings: any) => {
    setAppSettings(prev => {
      const updated = { 
        ...prev, 
        [appId]: { ...(prev[appId] || {}), ...settings } 
      };
      
      // Save to localStorage
      if (user) {
        localStorage.setItem(`neon_os_app_settings_${user.id}`, JSON.stringify(updated));
      }
      
      return updated;
    });
  };

  const resetData = () => {
    setPreferences(defaultPreferences);
    setAppSettings({});
    
    if (user) {
      localStorage.removeItem(`neon_os_prefs_${user.id}`);
      localStorage.removeItem(`neon_os_app_settings_${user.id}`);
    }
  };

  // Save data when unmounting
  useEffect(() => {
    return () => {
      if (user) {
        saveUserData();
      }
    };
  }, [preferences, appSettings, user]);

  return (
    <UserDataContext.Provider value={{
      preferences,
      updatePreferences,
      getAppSettings,
      updateAppSettings,
      resetData
    }}>
      {children}
    </UserDataContext.Provider>
  );
};
