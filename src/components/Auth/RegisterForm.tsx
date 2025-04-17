
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { UserCircle2, Lock, UserPlus } from 'lucide-react';

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const { register, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    await register(username, password);
  };

  return (
    <div className="p-6 max-w-sm mx-auto rounded-lg glass-morphism border border-neon-red/20">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-white">Create Account</h2>
        <p className="text-gray-400 text-sm mt-1">Sign up for your NeonOS experience</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <UserCircle2 className="absolute left-3 top-3 text-neon-red h-4 w-4" />
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 bg-neon-darker text-white border-neon-red/30 focus:border-neon-red"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-neon-red h-4 w-4" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-neon-darker text-white border-neon-red/30 focus:border-neon-red"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-neon-red h-4 w-4" />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 bg-neon-darker text-white border-neon-red/30 focus:border-neon-red"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-neon-red hover:bg-neon-red/80 text-white"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></span>
              Creating account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Register
            </span>
          )}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <button 
            onClick={onToggleForm} 
            className="text-neon-red hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
