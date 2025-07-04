import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Button } from './ui/Button';
import { AI_COMMANDS } from '../lib/ai-providers';
// Simple utility function
const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ');

interface AICommandsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText?: string;
}

export const AICommands: React.FC<AICommandsProps> = ({ isOpen, onClose, selectedText }) => {
  const { askAgent, isAgentThinking, agent, toggleAIChat } = useAppStore();
  const [selectedCommand, setSelectedCommand] = useState<string>('');

  if (!isOpen) return null;

  const handleExecuteCommand = async (command: string, template: string) => {
    if (!agent.provider) {
      alert('يرجى اختيار مقدم خدمة الذكاء الاصطناعي أولاً');
      return;
    }

    const context = selectedText ? { selectedText } : undefined;
    const fullPrompt = selectedText ? `${template}\n\n${selectedText}` : template;

    try {
      await askAgent(fullPrompt, context);
      toggleAIChat(); // Open AI chat to show the response
      onClose();
    } catch (error) {
      console.error('AI Command Error:', error);
      alert(`حدث خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  };

  const commands = [
    {
      id: 'explain',
      title: 'شرح الكود',
      description: 'اشرح كيفية عمل هذا الكود',
      icon: '💡',
      template: AI_COMMANDS.EXPLAIN_FILE,
      needsSelection: false
    },
    {
      id: 'fix',
      title: 'إصلاح الأخطاء',
      description: 'ابحث عن الأخطاء وقم بإصلاحها',
      icon: '🔧',
      template: AI_COMMANDS.FIX_ERROR,
      needsSelection: false
    },
    {
      id: 'document',
      title: 'إضافة التوثيق',
      description: 'أضف التعليقات والتوثيق',
      icon: '📝',
      template: AI_COMMANDS.ADD_DOCUMENTATION,
      needsSelection: false
    },
    {
      id: 'optimize',
      title: 'تحسين الكود',
      description: 'حسن الأداء وجودة الكود',
      icon: '⚡',
      template: AI_COMMANDS.OPTIMIZE_CODE,
      needsSelection: false
    },
    {
      id: 'test',
      title: 'إنشاء اختبارات',
      description: 'اكتب اختبارات للكود',
      icon: '🧪',
      template: AI_COMMANDS.GENERATE_TESTS,
      needsSelection: false
    },
    {
      id: 'review',
      title: 'مراجعة الكود',
      description: 'راجع الكود وقدم اقتراحات',
      icon: '👀',
      template: AI_COMMANDS.CODE_REVIEW,
      needsSelection: false
    },
    {
      id: 'refactor',
      title: 'إعادة الهيكلة',
      description: 'أعد هيكلة الكود لجعله أفضل',
      icon: '🔄',
      template: AI_COMMANDS.REFACTOR_CODE,
      needsSelection: false
    },
    {
      id: 'explain_concept',
      title: 'شرح المفهوم',
      description: 'اشرح مفهوم برمجي محدد',
      icon: '🎓',
      template: AI_COMMANDS.EXPLAIN_CONCEPT,
      needsSelection: true
    }
  ];

  const availableCommands = selectedText 
    ? commands 
    : commands.filter(cmd => !cmd.needsSelection);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold">الأوامر الذكية</h2>
            <p className="text-sm text-muted-foreground">
              {selectedText ? 'تطبيق على النص المحدد' : 'تطبيق على الملف الحالي'}
            </p>
          </div>
          <Button variant="ghost" size="xs" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-auto">
          {!agent.provider && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ يرجى اختيار مقدم خدمة الذكاء الاصطناعي من الرأس أولاً
              </p>
            </div>
          )}

          {selectedText && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">النص المحدد:</p>
              <pre className="text-xs bg-background p-2 rounded border overflow-auto max-h-20">
                {selectedText.length > 200 ? selectedText.slice(0, 200) + '...' : selectedText}
              </pre>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableCommands.map((command) => (
              <button
                key={command.id}
                onClick={() => handleExecuteCommand(command.id, command.template)}
                disabled={isAgentThinking || !agent.provider}
                className={cn(
                  "p-4 text-left border border-border rounded-lg transition-all hover:bg-accent hover:border-primary",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  selectedCommand === command.id && "bg-primary/10 border-primary"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{command.icon}</span>
                  <div>
                    <h3 className="font-medium text-sm">{command.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {command.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {isAgentThinking && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin">🤔</div>
                <p className="text-sm text-blue-800">
                  جاري معالجة طلبك...
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            اختصار سريع: Ctrl+J لشرح النص المحدد
          </div>
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
};