
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useUserData } from "@/contexts/UserDataContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Monitor, 
  Volume2, 
  Wifi, 
  UserCircle2, 
  Shield, 
  BellRing,
  Palette,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsProps {}

const Settings: React.FC<SettingsProps> = () => {
  const { user, logout } = useAuth();
  const { preferences, updatePreferences } = useUserData();
  
  // Local state to track changes before saving to context
  const [volume, setVolume] = useState(preferences.volume);
  const [brightness, setBrightness] = useState(preferences.brightness);
  const [notifications, setNotifications] = useState(preferences.notificationSounds);
  const [darkMode, setDarkMode] = useState(preferences.darkMode);
  const [animations, setAnimations] = useState(preferences.animations);
  const [autoUpdate, setAutoUpdate] = useState(preferences.autoUpdate);
  const [selectedTheme, setSelectedTheme] = useState(preferences.theme);
  
  // Update local state when preferences change
  useEffect(() => {
    setVolume(preferences.volume);
    setBrightness(preferences.brightness);
    setNotifications(preferences.notificationSounds);
    setDarkMode(preferences.darkMode);
    setAnimations(preferences.animations);
    setAutoUpdate(preferences.autoUpdate);
    setSelectedTheme(preferences.theme);
  }, [preferences]);
  
  // Handle theme selection
  const handleThemeChange = (themeColor: string) => {
    setSelectedTheme(themeColor);
    updatePreferences({ theme: themeColor });
    toast({
      title: "Theme Updated",
      description: `Theme color changed to ${themeColor}`,
    });
  };
  
  // Handle brightness change
  const handleBrightnessChange = (value: number[]) => {
    const newBrightness = value[0];
    setBrightness(newBrightness);
    updatePreferences({ brightness: newBrightness });
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    updatePreferences({ volume: newVolume });
  };
  
  // Handle toggle switches
  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    updatePreferences({ darkMode: checked });
    toast({
      title: checked ? "Dark Mode Enabled" : "Dark Mode Disabled",
    });
  };
  
  const handleAnimationsToggle = (checked: boolean) => {
    setAnimations(checked);
    updatePreferences({ animations: checked });
  };
  
  const handleNotificationsToggle = (checked: boolean) => {
    setNotifications(checked);
    updatePreferences({ notificationSounds: checked });
  };
  
  const handleAutoUpdateToggle = (checked: boolean) => {
    setAutoUpdate(checked);
    updatePreferences({ autoUpdate: checked });
  };
  
  return (
    <div className="h-full flex flex-col bg-neon-dark">
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="display" className="w-full">
          <div className="border-b border-neon-red/20">
            <div className="px-4 py-2">
              <h2 className="text-xl font-semibold text-white">Settings</h2>
            </div>
            <TabsList className="bg-transparent border-b border-neon-red/20 w-full justify-start rounded-none p-0">
              <TabsTrigger 
                value="display" 
                className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-neon-red rounded-none data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
              >
                <Monitor size={16} className="mr-2" />
                <span>Display</span>
              </TabsTrigger>
              <TabsTrigger 
                value="sound" 
                className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-neon-red rounded-none data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
              >
                <Volume2 size={16} className="mr-2" />
                <span>Sound</span>
              </TabsTrigger>
              <TabsTrigger 
                value="network" 
                className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-neon-red rounded-none data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
              >
                <Wifi size={16} className="mr-2" />
                <span>Network</span>
              </TabsTrigger>
              <TabsTrigger 
                value="personalization" 
                className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-neon-red rounded-none data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
              >
                <Palette size={16} className="mr-2" />
                <span>Personalization</span>
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-neon-red rounded-none data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
              >
                <UserCircle2 size={16} className="mr-2" />
                <span>Account</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="display" className="mt-0">
              <h3 className="text-lg font-medium text-white mb-4">Display Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm text-gray-300">Brightness</label>
                    <span className="text-sm text-gray-300">{brightness}%</span>
                  </div>
                  <Slider
                    value={[brightness]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleBrightnessChange}
                    className="[&>span]:bg-neon-red"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm text-gray-300">Dark Mode</label>
                    <p className="text-xs text-gray-500">Use dark theme system-wide</p>
                  </div>
                  <Switch 
                    checked={darkMode}
                    onCheckedChange={handleDarkModeToggle}
                    className="bg-gray-700 data-[state=checked]:bg-neon-red"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm text-gray-300">Animations</label>
                    <p className="text-xs text-gray-500">Enable interface animations</p>
                  </div>
                  <Switch 
                    checked={animations}
                    onCheckedChange={handleAnimationsToggle}
                    className="bg-gray-700 data-[state=checked]:bg-neon-red"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sound" className="mt-0">
              <h3 className="text-lg font-medium text-white mb-4">Sound Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm text-gray-300">Volume</label>
                    <span className="text-sm text-gray-300">{volume}%</span>
                  </div>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="[&>span]:bg-neon-red"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm text-gray-300">Notification Sounds</label>
                    <p className="text-xs text-gray-500">Play sounds for notifications</p>
                  </div>
                  <Switch 
                    checked={notifications}
                    onCheckedChange={handleNotificationsToggle}
                    className="bg-gray-700 data-[state=checked]:bg-neon-red"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="network" className="mt-0">
              <h3 className="text-lg font-medium text-white mb-4">Network Settings</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded bg-neon-darker/50 border border-neon-red/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">Home WiFi</h4>
                      <p className="text-xs text-gray-400">Connected</p>
                    </div>
                    <div className="text-neon-red">
                      <Wifi size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded bg-neon-darker/50 border border-neon-red/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">Guest Network</h4>
                      <p className="text-xs text-gray-400">Available</p>
                    </div>
                    <div className="text-gray-500">
                      <Wifi size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="personalization" className="mt-0">
              <h3 className="text-lg font-medium text-white mb-4">Personalization</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Theme Color</label>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleThemeChange('neon-red')}
                      className={`w-8 h-8 rounded-full bg-neon-red ${selectedTheme === 'neon-red' ? 'ring-2 ring-neon-red ring-offset-2 ring-offset-neon-darker' : ''}`}
                    ></button>
                    <button 
                      onClick={() => handleThemeChange('neon-blue')}
                      className={`w-8 h-8 rounded-full bg-neon-blue ${selectedTheme === 'neon-blue' ? 'ring-2 ring-neon-blue ring-offset-2 ring-offset-neon-darker' : ''}`}
                    ></button>
                    <button 
                      onClick={() => handleThemeChange('neon-purple')}
                      className={`w-8 h-8 rounded-full bg-neon-purple ${selectedTheme === 'neon-purple' ? 'ring-2 ring-neon-purple ring-offset-2 ring-offset-neon-darker' : ''}`}
                    ></button>
                    <button 
                      onClick={() => handleThemeChange('green')}
                      className={`w-8 h-8 rounded-full bg-green-500 ${selectedTheme === 'green' ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-neon-darker' : ''}`}
                    ></button>
                    <button 
                      onClick={() => handleThemeChange('orange')}
                      className={`w-8 h-8 rounded-full bg-orange-500 ${selectedTheme === 'orange' ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-neon-darker' : ''}`}
                    ></button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Background Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => updatePreferences({ wallpaper: 'animated' })}
                      className={`p-1 ${preferences.wallpaper === 'animated' ? 'border-2 border-neon-red' : 'border border-neon-red/30'} rounded overflow-hidden`}
                    >
                      <div className="h-16 rounded bg-gradient-to-br from-neon-dark to-neon-darker animate-background-flow"></div>
                    </button>
                    <button 
                      onClick={() => updatePreferences({ wallpaper: 'solid' })}
                      className={`p-1 ${preferences.wallpaper === 'solid' ? 'border-2 border-neon-red' : 'border border-neon-red/30'} rounded overflow-hidden`}
                    >
                      <div className="h-16 rounded bg-neon-dark"></div>
                    </button>
                    <button 
                      onClick={() => updatePreferences({ wallpaper: 'gradient' })}
                      className={`p-1 ${preferences.wallpaper === 'gradient' ? 'border-2 border-neon-red' : 'border border-neon-red/30'} rounded overflow-hidden`}
                    >
                      <div className="h-16 rounded bg-gradient-to-r from-neon-purple to-neon-red"></div>
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="account" className="mt-0">
              <h3 className="text-lg font-medium text-white mb-4">Account Settings</h3>
              
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <UserCircle2 size={64} className="text-neon-red" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{user?.username || 'User'}</h4>
                  <p className="text-sm text-gray-400">Administrator</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm text-gray-300">Auto Updates</label>
                    <p className="text-xs text-gray-500">Automatically install system updates</p>
                  </div>
                  <Switch 
                    checked={autoUpdate}
                    onCheckedChange={handleAutoUpdateToggle}
                    className="bg-gray-700 data-[state=checked]:bg-neon-red"
                  />
                </div>
                
                <div className="p-3 rounded bg-neon-red/10 border border-neon-red/30 flex items-center">
                  <Shield size={20} className="text-neon-red mr-3" />
                  <p className="text-sm text-gray-300">System is up to date and secure</p>
                </div>
                
                <Button 
                  onClick={logout} 
                  className="mt-6 w-full bg-neon-darker hover:bg-neon-red text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
