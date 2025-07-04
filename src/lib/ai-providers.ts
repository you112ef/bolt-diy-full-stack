import { AIProvider, AIMessage } from '../types';

export interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model?: string;
}

export interface AIProviderConfig {
  name: string;
  apiKey?: string;
  endpoint?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

// OpenAI GPT-4 Integration
export async function callOpenAI(
  prompt: string, 
  config: AIProviderConfig,
  messages: AIMessage[] = []
): Promise<AIResponse> {
  const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is required. Please set it in settings or environment variables.');
  }

  const conversationMessages = [
    {
      role: 'system',
      content: 'You are an intelligent coding assistant. You help developers by explaining code, fixing errors, generating documentation, and providing coding suggestions. Always provide clear, accurate, and helpful responses.'
    },
    ...messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    {
      role: 'user',
      content: prompt
    }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4',
        messages: conversationMessages,
        max_tokens: config.maxTokens || 2000,
        temperature: config.temperature || 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0]?.message?.content || 'No response generated',
      usage: data.usage,
      model: data.model
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to call OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Anthropic Claude Integration
export async function callAnthropic(
  prompt: string, 
  config: AIProviderConfig,
  messages: AIMessage[] = []
): Promise<AIResponse> {
  const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('Anthropic API key is required. Please set it in settings or environment variables.');
  }

  // Convert messages to Claude format
  const conversationText = messages.map(msg => 
    `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
  ).join('\n\n');
  
  const fullPrompt = conversationText ? 
    `${conversationText}\n\nHuman: ${prompt}\n\nAssistant:` : 
    `Human: ${prompt}\n\nAssistant:`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model || 'claude-3-sonnet-20240229',
        max_tokens: config.maxTokens || 2000,
        temperature: config.temperature || 0.7,
        messages: [
          {
            role: 'user',
            content: fullPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    return {
      content: data.content[0]?.text || 'No response generated',
      usage: data.usage,
      model: data.model
    };
  } catch (error) {
    console.error('Anthropic API Error:', error);
    throw new Error(`Failed to call Anthropic: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// DeepSeek Integration
export async function callDeepSeek(
  prompt: string, 
  config: AIProviderConfig,
  messages: AIMessage[] = []
): Promise<AIResponse> {
  const apiKey = config.apiKey || process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    throw new Error('DeepSeek API key is required. Please set it in settings or environment variables.');
  }

  const conversationMessages = [
    {
      role: 'system',
      content: 'You are DeepSeek Coder, an AI coding assistant specialized in programming tasks. You excel at code analysis, debugging, optimization, and generating high-quality code.'
    },
    ...messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    {
      role: 'user',
      content: prompt
    }
  ];

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'deepseek-coder',
        messages: conversationMessages,
        max_tokens: config.maxTokens || 2000,
        temperature: config.temperature || 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`DeepSeek API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0]?.message?.content || 'No response generated',
      usage: data.usage,
      model: data.model
    };
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    throw new Error(`Failed to call DeepSeek: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Google Gemini Integration
export async function callGemini(
  prompt: string, 
  config: AIProviderConfig,
  messages: AIMessage[] = []
): Promise<AIResponse> {
  const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is required. Please set it in settings or environment variables.');
  }

  // Convert messages to Gemini format
  const conversationParts = messages.map(msg => ({
    text: `${msg.role === 'user' ? 'User' : 'Model'}: ${msg.content}`
  }));
  
  conversationParts.push({ text: `User: ${prompt}` });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-pro'}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: conversationParts
        }],
        generationConfig: {
          temperature: config.temperature || 0.7,
          maxOutputTokens: config.maxTokens || 2000
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    return {
      content: data.candidates[0]?.content?.parts[0]?.text || 'No response generated',
      model: config.model || 'gemini-pro'
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Failed to call Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Ollama Integration (للنماذج المحلية)
export async function callOllama(
  prompt: string, 
  config: AIProviderConfig,
  messages: AIMessage[] = []
): Promise<AIResponse> {
  const endpoint = config.endpoint || process.env.OLLAMA_API_BASE_URL || 'http://localhost:11434';
  
  const conversationMessages = [
    ...messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    {
      role: 'user',
      content: prompt
    }
  ];

  try {
    const response = await fetch(`${endpoint}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model || 'llama2',
        messages: conversationMessages,
        stream: false,
        options: {
          temperature: config.temperature || 0.7,
          num_predict: config.maxTokens || 2000
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API Error: ${error}`);
    }

    const data = await response.json();
    
    return {
      content: data.message?.content || 'No response generated',
      model: data.model
    };
  } catch (error) {
    console.error('Ollama API Error:', error);
    throw new Error(`Failed to call Ollama: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Main AI Provider Router
export async function callAIProvider(
  providerName: string,
  prompt: string,
  config: AIProviderConfig,
  messages: AIMessage[] = []
): Promise<AIResponse> {
  switch (providerName.toLowerCase()) {
    case 'gpt-4':
    case 'openai':
      return callOpenAI(prompt, config, messages);
    
    case 'claude':
    case 'anthropic':
      return callAnthropic(prompt, config, messages);
    
    case 'deepseek':
    case 'deepseek-coder':
      return callDeepSeek(prompt, config, messages);
    
    case 'gemini':
    case 'gemini-pro':
      return callGemini(prompt, config, messages);
    
    case 'ollama':
    case 'llama2':
    case 'codellama':
      return callOllama(prompt, config, messages);
    
    default:
      throw new Error(`Unknown AI provider: ${providerName}`);
  }
}

// Predefined AI Providers
export const DEFAULT_AI_PROVIDERS: AIProvider[] = [
  {
    name: 'gpt-4',
    model: 'gpt-4',
    endpoint: 'https://api.openai.com/v1/chat/completions'
  },
  {
    name: 'gpt-3.5-turbo',
    model: 'gpt-3.5-turbo',
    endpoint: 'https://api.openai.com/v1/chat/completions'
  },
  {
    name: 'claude',
    model: 'claude-3-sonnet-20240229',
    endpoint: 'https://api.anthropic.com/v1/messages'
  },
  {
    name: 'claude-haiku',
    model: 'claude-3-haiku-20240307',
    endpoint: 'https://api.anthropic.com/v1/messages'
  },
  {
    name: 'deepseek-coder',
    model: 'deepseek-coder',
    endpoint: 'https://api.deepseek.com/v1/chat/completions'
  },
  {
    name: 'gemini-pro',
    model: 'gemini-pro',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta'
  },
  {
    name: 'ollama-llama2',
    model: 'llama2',
    endpoint: 'http://localhost:11434'
  },
  {
    name: 'ollama-codellama',
    model: 'codellama',
    endpoint: 'http://localhost:11434'
  }
];

// AI Command Templates
export const AI_COMMANDS = {
  EXPLAIN_FILE: 'قم بشرح هذا الملف والغرض منه وكيفية عمله:',
  FIX_ERROR: 'يوجد خطأ في هذا الكود، قم بإصلاحه وشرح المشكلة:',
  ADD_DOCUMENTATION: 'قم بإضافة التوثيق والتعليقات لهذا الكود:',
  OPTIMIZE_CODE: 'قم بتحسين وتطوير هذا الكود:',
  GENERATE_TESTS: 'قم بإنشاء اختبارات للكود التالي:',
  CODE_REVIEW: 'قم بمراجعة هذا الكود وتقديم اقتراحات للتحسين:',
  EXPLAIN_CONCEPT: 'اشرح هذا المفهوم البرمجي:',
  CREATE_COMPONENT: 'قم بإنشاء مكون بناءً على هذه المتطلبات:',
  DEBUG_ISSUE: 'ساعدني في تتبع وإصلاح هذه المشكلة:',
  REFACTOR_CODE: 'قم بإعادة هيكلة هذا الكود لجعله أفضل:'
};

// Utility function to get context for AI
export function buildAIContext(
  currentFile?: string,
  selectedText?: string,
  projectStructure?: string[],
  recentCommands?: string[]
): string {
  let context = 'السياق الحالي:\n\n';
  
  if (currentFile) {
    context += `الملف الحالي: ${currentFile}\n\n`;
  }
  
  if (selectedText) {
    context += `النص المحدد:\n\`\`\`\n${selectedText}\n\`\`\`\n\n`;
  }
  
  if (projectStructure && projectStructure.length > 0) {
    context += `هيكل المشروع:\n${projectStructure.join('\n')}\n\n`;
  }
  
  if (recentCommands && recentCommands.length > 0) {
    context += `الأوامر الأخيرة:\n${recentCommands.join('\n')}\n\n`;
  }
  
  return context;
}