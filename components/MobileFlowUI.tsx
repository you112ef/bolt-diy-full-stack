"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function MobileFlowUI() {
  const [activeView, setActiveView] = useState("flows");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <div className="w-full h-screen flex flex-col bg-white text-black dark:bg-zinc-950 dark:text-white overflow-hidden">
      {/* Header */}
      <header className="p-3 text-center font-semibold text-base border-b border-zinc-200 dark:border-zinc-800">
        yousef-n8n-flows
      </header>

      {/* Flow Canvas */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden relative">
        <div className="min-w-[600px] h-full p-3 flex gap-3">
          {/* Sample nodes */}
          <button
            onClick={() => setSelectedNode("Node 1")}
            className="w-24 h-16 bg-blue-500 text-white text-xs rounded-lg shadow-md flex items-center justify-center hover:bg-blue-600 transition"
          >
            Node 1
          </button>
          <button
            onClick={() => setSelectedNode("Node 2")}
            className="w-24 h-16 bg-green-500 text-white text-xs rounded-lg shadow-md flex items-center justify-center hover:bg-green-600 transition"
          >
            Node 2
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="h-12 border-t border-zinc-200 dark:border-zinc-800 flex justify-around items-center bg-white dark:bg-zinc-900">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setActiveView("home")}
          className="text-xs px-2 py-1"
        >
          الرئيسية
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setActiveView("flows")}
          className="text-xs px-2 py-1"
        >
          الفلوات
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setActiveView("settings")}
          className="text-xs px-2 py-1"
        >
          الإعدادات
        </Button>
      </nav>

      {/* Node Drawer */}
      <Sheet open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <SheetContent side="bottom" className="h-[40%] p-4">
          <h2 className="font-semibold text-base mb-3">
            تحرير العقدة: {selectedNode}
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            إعدادات خاصة بالعقدة تظهر هنا...
          </p>
        </SheetContent>
      </Sheet>
    </div>
  );
}
