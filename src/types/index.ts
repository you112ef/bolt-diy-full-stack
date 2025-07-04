export interface AIProvider {
  name: string;
  apiKey?: string;
  endpoint?: string;
  model?: string;
}

export interface AIAgent {
  provider: string | null;
  memory: AIMessage[];
  currentFile: string | null;
  lastCommand: string | null;
  context: string;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    command?: string;
    file?: string;
    type?: 'code' | 'explanation' | 'fix' | 'documentation';
    model?: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    error?: boolean;
    selectedText?: string;
    [key: string]: any; // Allow additional metadata properties
  };
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
  isSelected?: boolean;
  isModified?: boolean;
  language?: string;
  size?: number;
  lastModified?: number;
}

export interface EditorTab {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
  isModified: boolean;
  isActive: boolean;
}

export interface TerminalSession {
  id: string;
  name: string;
  isActive: boolean;
  history: TerminalCommand[];
  workingDirectory: string;
}

export interface TerminalCommand {
  id: string;
  command: string;
  output: string;
  timestamp: number;
  exitCode: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  files: FileNode[];
  entryPoint?: string;
  framework?: 'react' | 'vue' | 'angular' | 'vanilla' | 'node';
  createdAt: number;
  lastModified: number;
}

export interface DeploymentTarget {
  name: 'vercel' | 'netlify' | 'cloudflare';
  config: {
    apiKey?: string;
    projectId?: string;
    buildCommand?: string;
    outputDirectory?: string;
  };
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'ar';
  aiProvider: string;
  fontSize: number;
  autoSave: boolean;
  vim: boolean;
  deployments: DeploymentTarget[];
  github: {
    token?: string;
    username?: string;
  };
}

export interface Command {
  id: string;
  name: string;
  description: string;
  shortcut?: string;
  action: () => void | Promise<void>;
  category: 'file' | 'edit' | 'ai' | 'view' | 'terminal';
}

export interface AICommand {
  command: string;
  description: string;
  context: 'file' | 'project' | 'selection' | 'global';
  handler: (input: string, context?: any) => Promise<string>;
}