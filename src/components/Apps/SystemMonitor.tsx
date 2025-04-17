
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, HardDrive, Memory, Thermometer, Activity, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SystemMonitorProps {}

const SystemMonitor: React.FC<SystemMonitorProps> = () => {
  const [cpuUsage, setCpuUsage] = useState<{ time: string; value: number }[]>([]);
  const [memoryUsage, setMemoryUsage] = useState<{ time: string; value: number }[]>([]);
  
  // Simulate changing data
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      // Generate random values
      const newCpuValue = Math.floor(Math.random() * 40) + 10; // 10-50%
      const newMemValue = Math.floor(Math.random() * 30) + 40; // 40-70%
      
      setCpuUsage(prev => {
        const newData = [...prev, { time: timeLabel, value: newCpuValue }];
        if (newData.length > 20) newData.shift();
        return newData;
      });
      
      setMemoryUsage(prev => {
        const newData = [...prev, { time: timeLabel, value: newMemValue }];
        if (newData.length > 20) newData.shift();
        return newData;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="h-full overflow-auto bg-neon-dark p-6">
      <h2 className="text-xl font-semibold text-white mb-6">System Monitor</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-neon-darker border-neon-red/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center text-gray-200">
              <Cpu size={16} className="text-neon-red mr-2" />
              CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {cpuUsage.length > 0 ? cpuUsage[cpuUsage.length - 1].value : 0}%
            </div>
            <p className="text-xs text-gray-400">4 cores @ 3.2GHz</p>
          </CardContent>
        </Card>
        
        <Card className="bg-neon-darker border-neon-red/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center text-gray-200">
              <Memory size={16} className="text-neon-red mr-2" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {memoryUsage.length > 0 ? memoryUsage[memoryUsage.length - 1].value : 0}%
            </div>
            <p className="text-xs text-gray-400">8GB DDR4 RAM</p>
          </CardContent>
        </Card>
        
        <Card className="bg-neon-darker border-neon-red/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center text-gray-200">
              <HardDrive size={16} className="text-neon-red mr-2" />
              Disk Space
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              68<span className="text-lg">%</span>
            </div>
            <p className="text-xs text-gray-400">476GB free of 512GB</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-neon-darker border-neon-red/20">
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center text-gray-200">
              <Activity size={16} className="text-neon-red mr-2" />
              CPU History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cpuUsage} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="value" stroke="#ea384c" strokeWidth={2} dot={false} />
                  <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#666" 
                    tick={{ fill: '#999', fontSize: 10 }} 
                    tickLine={{ stroke: '#666' }}
                  />
                  <YAxis 
                    stroke="#666" 
                    tick={{ fill: '#999', fontSize: 10 }} 
                    tickLine={{ stroke: '#666' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0F1015', 
                      border: '1px solid rgba(234, 56, 76, 0.3)',
                      borderRadius: '4px'
                    }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#ea384c' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-neon-darker border-neon-red/20">
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center text-gray-200">
              <BarChart3 size={16} className="text-neon-red mr-2" />
              Memory History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={memoryUsage} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="value" stroke="#1EAEDB" strokeWidth={2} dot={false} />
                  <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#666" 
                    tick={{ fill: '#999', fontSize: 10 }} 
                    tickLine={{ stroke: '#666' }}
                  />
                  <YAxis 
                    stroke="#666" 
                    tick={{ fill: '#999', fontSize: 10 }} 
                    tickLine={{ stroke: '#666' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0F1015', 
                      border: '1px solid rgba(30, 174, 219, 0.3)',
                      borderRadius: '4px'
                    }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#1EAEDB' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemMonitor;
