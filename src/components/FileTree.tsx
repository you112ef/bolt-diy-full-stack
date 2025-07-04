import React, { useState } from 'react';
import { FileNode } from '../types';
import { useAppStore } from '../store/useAppStore';
import { getFileIcon, cn } from '../lib/utils';

interface FileTreeProps {
  className?: string;
}

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  onToggle: (nodeId: string) => void;
  onSelect: (node: FileNode) => void;
  selectedPath?: string;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  node,
  level,
  onToggle,
  onSelect,
  selectedPath,
}) => {
  const isSelected = node.path === selectedPath;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 px-2 hover:bg-accent cursor-pointer text-sm transition-colors",
          isSelected && "bg-primary/20 text-primary",
          "file-tree-item"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (node.type === 'folder') {
            onToggle(node.id);
          } else {
            onSelect(node);
          }
        }}
      >
        {node.type === 'folder' && (
          <span className="mr-1 text-xs">
            {node.isOpen ? '📂' : '📁'}
          </span>
        )}
        {node.type === 'file' && (
          <span className="mr-2 text-xs">{getFileIcon(node.name)}</span>
        )}
        <span className="truncate">{node.name}</span>
        {node.type === 'file' && node.isModified && (
          <span className="ml-auto text-primary">●</span>
        )}
      </div>
      
      {node.type === 'folder' && node.isOpen && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onSelect={onSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({ className }) => {
  const { fileTree, openFile, activeTabId, openTabs } = useAppStore();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const activeTab = openTabs.find(tab => tab.id === activeTabId);

  const handleToggle = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleSelect = (node: FileNode) => {
    openFile(node);
  };

  const processNodes = (nodes: FileNode[]): FileNode[] => {
    return nodes.map(node => ({
      ...node,
      isOpen: expandedNodes.has(node.id),
    }));
  };

  if (fileTree.length === 0) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        <div className="text-4xl mb-2">📁</div>
        <p className="text-sm">No files in project</p>
        <p className="text-xs mt-1">Create a new file or import a project</p>
      </div>
    );
  }

  return (
    <div className={cn("h-full overflow-auto", className)}>
      <div className="p-2">
        {processNodes(fileTree).map((node) => (
          <FileTreeItem
            key={node.id}
            node={node}
            level={0}
            onToggle={handleToggle}
            onSelect={handleSelect}
            selectedPath={activeTab?.path}
          />
        ))}
      </div>
    </div>
  );
};