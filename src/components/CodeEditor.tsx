import React, { useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
// Simple utility function
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

interface CodeEditorProps {
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ className }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { openTabs, activeTabId, updateTabContent, settings } = useAppStore();
  
  const activeTab = openTabs.find(tab => tab.id === activeTabId);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Ctrl+J for AI explanation
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        if (textareaRef.current) {
          const selectedText = textareaRef.current.value.substring(
            textareaRef.current.selectionStart,
            textareaRef.current.selectionEnd
          );
          if (selectedText) {
            useAppStore.getState().askAgent(`اشرح هذا الكود: ${selectedText}`);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeTab) {
      updateTabContent(activeTab.id, e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Basic tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      
      textarea.value = value.substring(0, start) + '  ' + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      
      if (activeTab) {
        updateTabContent(activeTab.id, textarea.value);
      }
    }
  };

  if (!activeTab) {
    return (
      <div className={cn(
        "flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400",
        className
      )}>
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium mb-2">لا يوجد ملف مفتوح</h3>
          <p className="text-sm">أنشئ ملف جديد أو افتح ملف موجود لبدء البرمجة</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full", className)}>
      <textarea
        ref={textareaRef}
        value={activeTab.content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full h-full p-4 font-mono text-sm resize-none border-none outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100",
          `text-[${settings.fontSize}px]`
        )}
        placeholder={`// ${activeTab.name} - اضغط Ctrl+J لشرح الكود المحدد`}
        style={{ fontSize: `${settings.fontSize}px` }}
      />
    </div>
  );
};