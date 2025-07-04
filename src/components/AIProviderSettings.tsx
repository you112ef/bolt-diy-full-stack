import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AIProvider } from '../types';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

interface AIProviderSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIProviderSettings: React.FC<AIProviderSettingsProps> = ({ isOpen, onClose }) => {
  const { providers, updateProviderConfig, agent } = useAppStore();
  const [localProviders, setLocalProviders] = useState<AIProvider[]>(providers);
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  const handleSave = () => {
    localProviders.forEach(provider => {
      updateProviderConfig(provider.name, provider);
    });
    onClose();
  };

  const updateProvider = (index: number, updates: Partial<AIProvider>) => {
    const newProviders = [...localProviders];
    newProviders[index] = { ...newProviders[index], ...updates };
    setLocalProviders(newProviders);
  };

  const providerCategories = [
    {
      name: 'OpenAI',
      providers: localProviders.filter(p => p.name.includes('gpt'))
    },
    {
      name: 'Anthropic',
      providers: localProviders.filter(p => p.name.includes('claude'))
    },
    {
      name: 'DeepSeek',
      providers: localProviders.filter(p => p.name.includes('deepseek'))
    },
    {
      name: 'Google',
      providers: localProviders.filter(p => p.name.includes('gemini'))
    },
    {
      name: 'Local (Ollama)',
      providers: localProviders.filter(p => p.name.includes('ollama'))
    }
  ];

  const currentCategory = providerCategories[activeTab];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">إعدادات مقدمي خدمات الذكاء الاصطناعي</h2>
          <Button variant="ghost" size="xs" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="flex h-[60vh]">
          {/* Categories Sidebar */}
          <div className="w-64 border-r border-border bg-muted/30">
            <div className="p-4">
              <h3 className="text-sm font-medium mb-3">الفئات</h3>
              <div className="space-y-1">
                {providerCategories.map((category, index) => (
                  <button
                    key={category.name}
                    onClick={() => setActiveTab(index)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                      activeTab === index
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {category.name}
                    <span className="ml-2 text-xs opacity-60">
                      ({category.providers.length})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Provider Settings */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">{currentCategory.name}</h3>
              
              {currentCategory.providers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <div className="text-4xl mb-2">🤖</div>
                  <p>لا توجد نماذج في هذه الفئة</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {currentCategory.providers.map((provider, index) => {
                    const globalIndex = localProviders.findIndex(p => p.name === provider.name);
                    return (
                      <div key={provider.name} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium">{provider.name.toUpperCase()}</h4>
                            <p className="text-sm text-muted-foreground">{provider.model}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {agent.provider === provider.name && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                نشط
                              </span>
                            )}
                            {provider.apiKey && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                تم التكوين
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              مفتاح API
                            </label>
                            <input
                              type="password"
                              value={provider.apiKey || ''}
                              onChange={(e) => updateProvider(globalIndex, { apiKey: e.target.value })}
                              placeholder="أدخل مفتاح API..."
                              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              النموذج
                            </label>
                            <input
                              type="text"
                              value={provider.model || ''}
                              onChange={(e) => updateProvider(globalIndex, { model: e.target.value })}
                              placeholder="اسم النموذج..."
                              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>

                          {provider.name.includes('ollama') && (
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-2">
                                نقطة النهاية (Endpoint)
                              </label>
                              <input
                                type="text"
                                value={provider.endpoint || 'http://localhost:11434'}
                                onChange={(e) => updateProvider(globalIndex, { endpoint: e.target.value })}
                                placeholder="http://localhost:11434"
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                          )}
                        </div>

                        <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
                          <p className="font-medium mb-1">إرشادات الحصول على مفتاح API:</p>
                          {provider.name.includes('gpt') && (
                            <p>احصل على مفتاح من: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI Platform</a></p>
                          )}
                          {provider.name.includes('claude') && (
                            <p>احصل على مفتاح من: <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Anthropic Console</a></p>
                          )}
                          {provider.name.includes('deepseek') && (
                            <p>احصل على مفتاح من: <a href="https://platform.deepseek.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DeepSeek Platform</a></p>
                          )}
                          {provider.name.includes('gemini') && (
                            <p>احصل على مفتاح من: <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a></p>
                          )}
                          {provider.name.includes('ollama') && (
                            <p>تأكد من تشغيل Ollama محلياً على المنفذ 11434</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            سيتم حفظ مفاتيح API محلياً في متصفحك فقط
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              حفظ الإعدادات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};