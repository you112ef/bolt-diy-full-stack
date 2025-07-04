import React, { useEffect, useRef } from 'react';
import { Editor, OnMount } from '@monaco-editor/react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

interface CodeEditorProps {
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ className }) => {
  const editorRef = useRef<any>(null);
  const { openTabs, activeTabId, updateTabContent, settings } = useAppStore();
  
  const activeTab = openTabs.find(tab => tab.id === activeTabId);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor
    editor.updateOptions({
      fontSize: settings.fontSize,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      theme: settings.theme === 'dark' ? 'vs-dark' : 'vs-light',
    });

    // Add AI completion command
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      const selection = editor.getSelection();
      const selectedText = editor.getModel()?.getValueInRange(selection || { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 });
      
      if (selectedText) {
        // Trigger AI completion for selected text
        useAppStore.getState().askAgent(`Explain this code: ${selectedText}`);
      }
    });

    // Add auto-save
    if (settings.autoSave) {
      editor.onDidChangeModelContent(() => {
        setTimeout(() => {
          if (activeTab && activeTab.id) {
            useAppStore.getState().saveFile(activeTab.id);
          }
        }, 1000);
      });
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeTab && value !== undefined) {
      updateTabContent(activeTab.id, value);
    }
  };

  if (!activeTab) {
    return (
      <div className={cn(
        "flex items-center justify-center h-full bg-background text-muted-foreground",
        className
      )}>
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium mb-2">No file open</h3>
          <p className="text-sm">Create a new file or open an existing one to start coding</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full", className)}>
      <Editor
        height="100%"
        language={activeTab.language}
        value={activeTab.content}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={settings.theme === 'dark' ? 'vs-dark' : 'vs-light'}
        options={{
          fontSize: settings.fontSize,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          contextmenu: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};