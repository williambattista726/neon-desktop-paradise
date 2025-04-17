
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthScreen: React.FC = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  
  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 animated-bg z-[-1]" />
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            <span className="text-neon-red">Neon</span>OS
          </h1>
          <p className="text-gray-400">The next-gen operating system experience</p>
        </div>
        
        {isLoginForm ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <RegisterForm onToggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
