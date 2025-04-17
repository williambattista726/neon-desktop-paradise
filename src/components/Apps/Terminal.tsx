
import React, { useState, useRef, useEffect } from 'react';

interface TerminalProps {}

interface TerminalCommand {
  input: string;
  output: string[];
  isError?: boolean;
}

const Terminal: React.FC<TerminalProps> = () => {
  const [prompt, setPrompt] = useState('user@neon-os:~$ ');
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<TerminalCommand[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
    // Add welcome message
    setCommandHistory([
      {
        input: '',
        output: [
          '╔═══════════════════════════════════════════╗',
          '║           NeonOS Terminal v1.0            ║',
          '║      Welcome to the Neon Experience       ║',
          '╚═══════════════════════════════════════════╝',
          '',
          'Type "help" to see available commands.',
          ''
        ]
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [commandHistory]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCommand.trim()) return;

    let output: string[] = [];
    let isError = false;

    const command = currentCommand.trim().toLowerCase();
    const args = command.split(' ').slice(1);

    // Process commands
    switch (command.split(' ')[0]) {
      case 'help':
        output = [
          'Available commands:',
          '  help              - Display this help message',
          '  clear             - Clear the terminal',
          '  echo [text]       - Display text',
          '  whoami            - Display current user',
          '  date              - Display current date and time',
          '  ls                - List directory contents',
          '  cat [file]        - Display file contents',
          '  uname -a          - Display system information',
          '  exit              - Exit terminal (just kidding, you can\'t)'
        ];
        break;
      case 'clear':
        setCommandHistory([]);
        setCurrentCommand('');
        return;
      case 'echo':
        output = [args.join(' ')];
        break;
      case 'whoami':
        output = ['user'];
        break;
      case 'date':
        output = [new Date().toString()];
        break;
      case 'ls':
        output = [
          'Desktop',
          'Documents',
          'Downloads',
          'Music',
          'Pictures',
          'Videos',
          'system.config',
          'readme.txt'
        ];
        break;
      case 'cat':
        if (args[0] === 'readme.txt') {
          output = [
            'This is a frontend-only operating system UI.',
            'It simulates a desktop environment but has no actual system access.',
            'Enjoy exploring the interface!'
          ];
        } else if (args[0] === 'system.config') {
          output = [
            '# NeonOS Configuration',
            'version=1.0',
            'theme=neon-red',
            'background=animated-gradient',
            'startup_apps=[]'
          ];
        } else {
          output = [`cat: ${args[0]}: No such file or directory`];
          isError = true;
        }
        break;
      case 'uname':
        if (args[0] === '-a') {
          output = ['NeonOS v1.0 build 2023.04.17 web-64 ReactJS TailwindCSS'];
        } else {
          output = ['NeonOS'];
        }
        break;
      case 'exit':
        output = ['Nice try, but you can\'t exit this terminal window.'];
        break;
      default:
        output = [`Command not found: ${command.split(' ')[0]}. Type 'help' for available commands.`];
        isError = true;
    }

    setCommandHistory([
      ...commandHistory,
      { 
        input: `${prompt}${currentCommand}`, 
        output,
        isError
      }
    ]);
    setCurrentCommand('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Navigate command history with up/down arrows
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commandsOnly = commandHistory
        .filter(cmd => cmd.input.startsWith(prompt))
        .map(cmd => cmd.input.substring(prompt.length));
      
      if (commandsOnly.length > 0) {
        const newIndex = historyIndex < commandsOnly.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandsOnly[commandsOnly.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const commandsOnly = commandHistory
          .filter(cmd => cmd.input.startsWith(prompt))
          .map(cmd => cmd.input.substring(prompt.length));
        
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandsOnly[commandsOnly.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  return (
    <div 
      ref={terminalRef}
      className="h-full w-full bg-black text-green-400 p-2 font-mono text-sm overflow-auto"
      onClick={focusInput}
    >
      {/* Previous commands and outputs */}
      {commandHistory.map((item, index) => (
        <div key={index}>
          {item.input && <div className="whitespace-pre-wrap">{item.input}</div>}
          {item.output.map((line, i) => (
            <div 
              key={i} 
              className={`whitespace-pre-wrap ${item.isError ? 'text-neon-red' : ''}`}
            >
              {line}
            </div>
          ))}
        </div>
      ))}
      
      {/* Current command input */}
      <form onSubmit={handleCommandSubmit} className="flex">
        <span className="whitespace-pre">{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono text-sm"
          autoFocus
        />
      </form>
    </div>
  );
};

export default Terminal;
