import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AIAgent,
  AIMessage,
  AIProvider,
  AppSettings,
  EditorTab,
  FileNode,
  Project,
  TerminalSession,
} from '../types';
import { 
  callAIProvider, 
  DEFAULT_AI_PROVIDERS, 
  buildAIContext,
  AIProviderConfig 
} from '../lib/ai-providers';

interface AppState {
  // AI Agent
  agent: AIAgent;
  providers: AIProvider[];
  isAgentThinking: boolean;
  
  // Files and Editor
  currentProject: Project | null;
  openTabs: EditorTab[];
  activeTabId: string | null;
  fileTree: FileNode[];
  
  // Terminal
  terminals: TerminalSession[];
  activeTerminalId: string | null;
  
  // UI State
  settings: AppSettings;
  sidebarOpen: boolean;
  terminalOpen: boolean;
  aiChatOpen: boolean;
  
  // Actions
  setProvider: (providerName: string) => void;
  addProvider: (provider: AIProvider) => void;
  updateProviderConfig: (providerName: string, config: Partial<AIProvider>) => void;
  askAgent: (prompt: string, context?: any) => Promise<string>;
  addToMemory: (message: AIMessage) => void;
  clearMemory: () => void;
  
  // File actions
  openFile: (file: FileNode) => void;
  closeTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  saveFile: (tabId: string) => void;
  createFile: (name: string, path: string, content?: string) => void;
  deleteFile: (path: string) => void;
  
  // Project actions
  createProject: (name: string, template?: string) => void;
  openProject: (project: Project) => void;
  saveProject: () => void;
  
  // Terminal actions
  createTerminal: (name?: string) => void;
  closeTerminal: (terminalId: string) => void;
  executeCommand: (terminalId: string, command: string) => Promise<void>;
  
  // UI actions
  toggleSidebar: () => void;
  toggleTerminal: () => void;
  toggleAIChat: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const defaultAgent: AIAgent = {
  provider: null,
  memory: [],
  currentFile: null,
  lastCommand: null,
  context: '',
};

const defaultSettings: AppSettings = {
  theme: 'dark',
  language: 'en',
  aiProvider: 'gpt-4',
  fontSize: 14,
  autoSave: true,
  vim: false,
  deployments: [],
  github: {},
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      agent: defaultAgent,
      providers: DEFAULT_AI_PROVIDERS,
      isAgentThinking: false,
      
      currentProject: null,
      openTabs: [],
      activeTabId: null,
      fileTree: [],
      
      terminals: [],
      activeTerminalId: null,
      
      settings: defaultSettings,
      sidebarOpen: true,
      terminalOpen: false,
      aiChatOpen: false,
      
      // AI Actions
      setProvider: (providerName: string) => {
        set((state) => ({
          agent: {
            ...state.agent,
            provider: providerName,
            memory: [],
          },
        }));
      },
      
      addProvider: (provider: AIProvider) => {
        set((state) => ({
          providers: [...state.providers, provider],
        }));
      },
      
      updateProviderConfig: (providerName: string, config: Partial<AIProvider>) => {
        set((state) => ({
          providers: state.providers.map(provider =>
            provider.name === providerName
              ? { ...provider, ...config }
              : provider
          ),
        }));
      },
      
      askAgent: async (prompt: string, context?: any) => {
        const state = get();
        
        if (!state.agent.provider) {
          throw new Error('لم يتم اختيار مقدم خدمة الذكاء الاصطناعي');
        }
        
        set({ isAgentThinking: true });
        
        try {
          // Build context from current state
          const activeTab = state.openTabs.find(tab => tab.id === state.activeTabId);
          const projectFiles = state.fileTree.map(file => file.path);
          const recentCommands = state.agent.memory
            .filter(msg => msg.role === 'user')
            .slice(-5)
            .map(msg => msg.content);
          
          const aiContext = buildAIContext(
            activeTab?.path,
            context?.selectedText,
            projectFiles,
            recentCommands
          );
          
          const fullPrompt = `${aiContext}\n\nطلب المستخدم: ${prompt}`;
          
          // Get provider configuration
          const provider = state.providers.find(p => p.name === state.agent.provider);
          if (!provider) {
            throw new Error(`Provider ${state.agent.provider} not found`);
          }
          
          const providerConfig: AIProviderConfig = {
            name: provider.name,
            apiKey: provider.apiKey,
            endpoint: provider.endpoint,
            model: provider.model,
            maxTokens: 2000,
            temperature: 0.7
          };
          
          // Call the actual AI provider
          const response = await callAIProvider(
            state.agent.provider,
            fullPrompt,
            providerConfig,
            state.agent.memory.slice(-10) // Last 10 messages for context
          );
          
          // Add to memory
          const userMessage: AIMessage = {
            role: 'user',
            content: prompt,
            timestamp: Date.now(),
            metadata: context,
          };
          
          const aiMessage: AIMessage = {
            role: 'assistant',
            content: response.content,
            timestamp: Date.now(),
            metadata: {
              model: response.model,
              usage: response.usage
            }
          };
          
          set((state) => ({
            agent: {
              ...state.agent,
              memory: [...state.agent.memory, userMessage, aiMessage],
              lastCommand: prompt,
              context: aiContext
            },
          }));
          
          return response.content;
        } catch (error) {
          console.error('AI Agent Error:', error);
          
          // Add error message to memory
          const errorMessage: AIMessage = {
            role: 'assistant',
            content: `عذراً، حدث خطأ أثناء معالجة طلبك: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
            timestamp: Date.now(),
            metadata: { error: true }
          };
          
          set((state) => ({
            agent: {
              ...state.agent,
              memory: [...state.agent.memory, errorMessage],
            },
          }));
          
          throw error;
        } finally {
          set({ isAgentThinking: false });
        }
      },
      
      addToMemory: (message: AIMessage) => {
        set((state) => ({
          agent: {
            ...state.agent,
            memory: [...state.agent.memory, message],
          },
        }));
      },
      
      clearMemory: () => {
        set((state) => ({
          agent: {
            ...state.agent,
            memory: [],
          },
        }));
      },
      
      // File actions
      openFile: (file: FileNode) => {
        const state = get();
        const existingTab = state.openTabs.find(tab => tab.path === file.path);
        
        if (existingTab) {
          set({ activeTabId: existingTab.id });
          return;
        }
        
        const newTab: EditorTab = {
          id: `tab-${Date.now()}`,
          name: file.name,
          content: file.content || '',
          language: getLanguageFromFile(file.name),
          path: file.path,
          isModified: false,
          isActive: true,
        };
        
        set((state) => ({
          openTabs: [...state.openTabs, newTab],
          activeTabId: newTab.id,
          agent: {
            ...state.agent,
            currentFile: file.path,
          },
        }));
      },
      
      closeTab: (tabId: string) => {
        set((state) => {
          const newTabs = state.openTabs.filter(tab => tab.id !== tabId);
          const wasActive = state.activeTabId === tabId;
          
          return {
            openTabs: newTabs,
            activeTabId: wasActive && newTabs.length > 0 ? newTabs[0].id : null,
          };
        });
      },
      
      updateTabContent: (tabId: string, content: string) => {
        set((state) => ({
          openTabs: state.openTabs.map(tab =>
            tab.id === tabId
              ? { ...tab, content, isModified: true }
              : tab
          ),
        }));
      },
      
      saveFile: (tabId: string) => {
        set((state) => ({
          openTabs: state.openTabs.map(tab =>
            tab.id === tabId
              ? { ...tab, isModified: false }
              : tab
          ),
        }));
      },
      
      createFile: (name: string, path: string, content = '') => {
        const newFile: FileNode = {
          id: `file-${Date.now()}`,
          name,
          type: 'file',
          path,
          content,
          language: getLanguageFromFile(name),
          lastModified: Date.now(),
        };
        
        set((state) => ({
          fileTree: [...state.fileTree, newFile],
        }));
      },
      
      deleteFile: (path: string) => {
        set((state) => ({
          fileTree: state.fileTree.filter(file => file.path !== path),
          openTabs: state.openTabs.filter(tab => tab.path !== path),
        }));
      },
      
      // Project actions
      createProject: (name: string, template?: string) => {
        const newProject: Project = {
          id: `project-${Date.now()}`,
          name,
          files: getTemplateFiles(template),
          createdAt: Date.now(),
          lastModified: Date.now(),
        };
        
        set({
          currentProject: newProject,
          fileTree: newProject.files,
          openTabs: [],
          activeTabId: null,
        });
      },
      
      openProject: (project: Project) => {
        set({
          currentProject: project,
          fileTree: project.files,
          openTabs: [],
          activeTabId: null,
        });
      },
      
      saveProject: () => {
        const state = get();
        if (state.currentProject) {
          set((state) => ({
            currentProject: {
              ...state.currentProject!,
              files: state.fileTree,
              lastModified: Date.now(),
            },
          }));
        }
      },
      
      // Terminal actions
      createTerminal: (name?: string) => {
        const newTerminal: TerminalSession = {
          id: `terminal-${Date.now()}`,
          name: name || `Terminal ${get().terminals.length + 1}`,
          isActive: true,
          history: [],
          workingDirectory: '/',
        };
        
        set((state) => ({
          terminals: [...state.terminals, newTerminal],
          activeTerminalId: newTerminal.id,
          terminalOpen: true,
        }));
      },
      
      closeTerminal: (terminalId: string) => {
        set((state) => ({
          terminals: state.terminals.filter(t => t.id !== terminalId),
          activeTerminalId: state.activeTerminalId === terminalId 
            ? state.terminals.length > 1 
              ? state.terminals.find(t => t.id !== terminalId)?.id || null 
              : null
            : state.activeTerminalId,
        }));
      },
      
      executeCommand: async (terminalId: string, command: string) => {
        // Mock terminal execution - in real app would use WebContainer
        const output = await mockTerminalCommand(command);
        
        set((state) => ({
          terminals: state.terminals.map(terminal =>
            terminal.id === terminalId
              ? {
                  ...terminal,
                  history: [
                    ...terminal.history,
                    {
                      id: `cmd-${Date.now()}`,
                      command,
                      output,
                      timestamp: Date.now(),
                      exitCode: 0,
                    },
                  ],
                }
              : terminal
          ),
        }));
      },
      
      // UI actions
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },
      
      toggleTerminal: () => {
        set((state) => ({ terminalOpen: !state.terminalOpen }));
      },
      
      toggleAIChat: () => {
        set((state) => ({ aiChatOpen: !state.aiChatOpen }));
      },
      
      updateSettings: (newSettings: Partial<AppSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    {
      name: 'yousef-ss-storage',
      partialize: (state) => ({
        settings: state.settings,
        providers: state.providers,
      }),
    }
  )
);

// Helper functions for backward compatibility
async function getCurrentFileContext(): Promise<string> {
  const state = useAppStore.getState();
  const activeTab = state.openTabs.find(tab => tab.id === state.activeTabId);
  
  if (!activeTab) {
    return 'No file currently open';
  }
  
  return `File: ${activeTab.path}\nContent:\n${activeTab.content}`;
}

function getLanguageFromFile(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const languageMap: { [key: string]: string } = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    md: 'markdown',
    yml: 'yaml',
    yaml: 'yaml',
  };
  
  return languageMap[ext || ''] || 'plaintext';
}

function getTemplateFiles(template?: string): FileNode[] {
  // Return template files based on template type
  const baseFiles: FileNode[] = [
    {
      id: 'readme',
      name: 'README.md',
      type: 'file',
      path: '/README.md',
      content: '# New Project\n\nWelcome to your new project!',
    },
  ];
  
  return baseFiles;
}

async function mockTerminalCommand(command: string): Promise<string> {
  // Mock terminal commands
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (command.startsWith('ls')) {
    return 'index.js\npackage.json\nREADME.md';
  }
  
  if (command.startsWith('npm')) {
    return 'npm command executed successfully';
  }
  
  return `Command executed: ${command}`;
}