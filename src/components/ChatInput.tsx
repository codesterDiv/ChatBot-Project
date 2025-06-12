import React, { useState, useRef } from 'react';
import { Send, Square } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onStop?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onStop }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '60px';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '60px';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  };

  return (
    <div className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-md p-6">
      <form onSubmit={handleSubmit} className="flex gap-4 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyPress}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            className="w-full bg-gray-800/50 border border-gray-600 rounded-2xl px-6 py-4 pr-12 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
            style={{ minHeight: '60px', maxHeight: '200px' }}
            disabled={isLoading}
          />
          
          <div className="absolute right-3 bottom-3 flex gap-2">
            {isLoading && onStop && (
              <button
                type="button"
                onClick={onStop}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"
                title="Stop generation"
              >
                <Square size={18} />
              </button>
            )}
            
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg shadow-cyan-500/25 disabled:shadow-none"
              title="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </form>
      
      <div className="flex items-center justify-center mt-3">
        <div className="text-xs text-gray-500 text-center">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
              AI is thinking...
            </span>
          ) : (
            'Enter to send • Shift+Enter for new line'
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;