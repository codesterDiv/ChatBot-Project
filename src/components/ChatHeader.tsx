import React from 'react';
import { Settings, Download, Trash2, Zap } from 'lucide-react';
import { Message } from '../types';

interface ChatHeaderProps {
  onOpenSettings: () => void;
  onClearChat: () => void;
  onExportChat: () => void;
  messages: Message[];
  model: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onOpenSettings, 
  onClearChat, 
  onExportChat, 
  messages, 
  model 
}) => {
  return (
    <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-md p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Zap className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">NeuroChat AI</h1>
              <p className="text-gray-400 text-sm">
                {model} • {messages.length} messages
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <button
                onClick={onExportChat}
                className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
                title="Export chat"
              >
                <Download size={18} />
              </button>
              <button
                onClick={onClearChat}
                className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                title="Clear chat"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
          <button
            onClick={onOpenSettings}
            className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;