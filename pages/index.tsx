import React, { useEffect, useState } from 'react';
import { useAppStore } from '../src/store/useAppStore';
import { CodeEditor } from '../src/components/CodeEditor';
import { FileTree } from '../src/components/FileTree';
import { AIProviderSettings } from '../src/components/AIProviderSettings';
import { AICommands } from '../src/components/AICommands';
import { Button } from '../src/components/ui/Button';
import { cn } from '../src/lib/utils';

const Header = () => {
  const { agent, providers, setProvider, settings, toggleAIChat } = useAppStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showAICommands, setShowAICommands] = useState(false);

  return (
    <header className="h-12 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Yousef SS" className="h-8 w-auto" />
          <span className="font-semibold text-lg">Yousef SS</span>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={agent.provider || ''}
            onChange={(e) => setProvider(e.target.value)}
            className="h-8 px-2 text-xs bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select AI Model</option>
            {providers.map((provider) => (
              <option key={provider.name} value={provider.name}>
                {provider.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setShowAICommands(true)}
          className="responsive-button"
          disabled={!agent.provider}
        >
          ⚡ AI Commands
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={toggleAIChat}
          className="responsive-button"
        >
          🤖 AI Chat
        </Button>
        <Button variant="ghost" size="xs" className="responsive-button">
          🔗 Deploy
        </Button>
        <Button 
          variant="ghost" 
          size="xs" 
          className="responsive-button"
          onClick={() => setShowSettings(true)}
        >
          ⚙️ Settings
        </Button>
      </div>
      
      {/* AI Provider Settings Modal */}
      <AIProviderSettings 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      {/* AI Commands Modal */}
      <AICommands
        isOpen={showAICommands}
        onClose={() => setShowAICommands(false)}
      />
    </header>
  );
};

const Sidebar = () => {
  const { sidebarOpen, createFile, createProject } = useAppStore();

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 border-r border-border bg-background flex flex-col">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium text-sm">Explorer</h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => createFile('new-file.js', '/new-file.js')}
              title="New File"
            >
              📄
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => createProject('New Project')}
              title="New Project"
            >
              📁
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <FileTree />
      </div>
    </aside>
  );
};

const EditorTabs = () => {
  const { openTabs, activeTabId, closeTab } = useAppStore();

  if (openTabs.length === 0) return null;

  return (
    <div className="border-b border-border bg-background flex overflow-x-auto">
      {openTabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm border-r border-border cursor-pointer hover:bg-accent min-w-0",
            tab.id === activeTabId && "bg-accent text-accent-foreground"
          )}
        >
          <span className="truncate">{tab.name}</span>
          {tab.isModified && <span className="text-primary">●</span>}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            className="hover:bg-destructive hover:text-destructive-foreground rounded px-1"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

const AIChat = () => {
  const { aiChatOpen, agent, askAgent, isAgentThinking, toggleAIChat } = useAppStore();
  const [input, setInput] = useState('');

  if (!aiChatOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAgentThinking) return;

    try {
      await askAgent(input);
      setInput('');
    } catch (error) {
      console.error('AI error:', error);
    }
  };

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h3 className="font-medium text-sm">AI Assistant</h3>
        <Button variant="ghost" size="xs" onClick={toggleAIChat}>
          ×
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {agent.memory.map((message, index) => (
          <div
            key={index}
            className={cn(
              "p-2 rounded-lg text-sm",
              message.role === 'user'
                ? "bg-primary text-primary-foreground ml-4"
                : "bg-muted mr-4 ai-message"
            )}
          >
            {message.content}
          </div>
        ))}
        
        {isAgentThinking && (
          <div className="bg-muted mr-4 p-2 rounded-lg text-sm">
            <div className="flex items-center gap-2">
              <div className="animate-spin">🤔</div>
              Thinking...
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI anything..."
            className="flex-1 px-3 py-2 text-sm bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent responsive-input"
            disabled={isAgentThinking}
          />
          <Button
            type="submit"
            size="xs"
            disabled={!input.trim() || isAgentThinking}
            className="responsive-button"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

const Terminal = () => {
  const { terminalOpen, terminals, activeTerminalId, executeCommand, createTerminal } = useAppStore();
  const [command, setCommand] = useState('');

  if (!terminalOpen) return null;

  const activeTerminal = terminals.find(t => t.id === activeTerminalId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || !activeTerminal) return;

    await executeCommand(activeTerminal.id, command);
    setCommand('');
  };

  return (
    <div className="h-48 border-t border-border bg-background flex flex-col">
      <div className="p-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Terminal</span>
          {!activeTerminal && (
            <Button variant="ghost" size="xs" onClick={() => createTerminal()}>
              + New Terminal
            </Button>
          )}
        </div>
      </div>
      
      {activeTerminal && (
        <>
          <div className="flex-1 overflow-auto p-2 font-mono text-sm bg-black text-green-400">
            {activeTerminal.history.map((cmd) => (
              <div key={cmd.id} className="mb-2">
                <div className="text-blue-400">$ {cmd.command}</div>
                <div className="whitespace-pre-wrap">{cmd.output}</div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="p-2 border-t border-border">
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="text-primary">$</span>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Enter command..."
                className="flex-1 bg-transparent border-none outline-none text-foreground"
                autoComplete="off"
              />
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default function Home() {
  const { toggleSidebar, toggleTerminal, sidebarOpen, terminalOpen, aiChatOpen } = useAppStore();

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <EditorTabs />
          
          <div className="flex-1 flex">
            <div className="flex-1 flex flex-col">
              <CodeEditor className="flex-1" />
              <Terminal />
            </div>
            
            <AIChat />
          </div>
        </div>
      </div>
      
      {/* Mobile toggle buttons */}
      <div className="md:hidden fixed bottom-4 left-4 flex flex-col gap-2">
        <Button
          variant="default"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full shadow-lg"
        >
          📁
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={toggleTerminal}
          className="rounded-full shadow-lg"
        >
          💻
        </Button>
      </div>
    </div>
  );
}