import { useState, useRef, useEffect } from 'react';
import Background from './components/Background';
import ChatHeader from './components/ChatHeader';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import Settings from './components/Settings';
import WelcomeScreen from './components/WelcomeScreen';
import { Message, ChatSettings } from './types';
import { sendMessageToOpenAI } from './utils/openai';

const DEFAULT_SETTINGS: ChatSettings = {
  apiKey: '',
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt: 'You are a helpful AI assistant. Be concise, accurate, and friendly in your responses.',
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<ChatSettings>(() => {
    const saved = localStorage.getItem('neurochat-settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  useEffect(() => {
    localStorage.setItem('neurochat-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const handleSuggestionClick = (event: CustomEvent) => {
      handleSendMessage(event.detail);
    };

    window.addEventListener('suggestion-click', handleSuggestionClick as EventListener);
    return () => {
      window.removeEventListener('suggestion-click', handleSuggestionClick as EventListener);
    };
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!settings.apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingMessage('');

    const controller = new AbortController();
    setAbortController(controller);

    try {
      let assistantContent = '';
      
      await sendMessageToOpenAI(
        [...messages, userMessage],
        settings,
        (chunk: string) => {
          assistantContent += chunk;
          setStreamingMessage(assistantContent);
        }
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingMessage('');
    } catch (error) {
      if (error instanceof Error && error.message.includes('aborted')) {
        // Request was aborted
        if (streamingMessage) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: streamingMessage,
            timestamp: Date.now(),
          };
          setMessages(prev => [...prev, assistantMessage]);
        }
        setStreamingMessage('');
      } else {
        console.error('Error sending message:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setStreamingMessage('');
  };

  const handleExportChat = () => {
    const chatData = {
      messages,
      exportedAt: new Date().toISOString(),
      model: settings.model,
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `neurochat-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const hasMessages = messages.length > 0 || streamingMessage;

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Background />
      
      <div className="relative z-10 flex flex-col h-screen">
        <ChatHeader
          onOpenSettings={() => setIsSettingsOpen(true)}
          onClearChat={handleClearChat}
          onExportChat={handleExportChat}
          messages={messages}
          model={settings.model}
        />

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto"
        >
          {!hasMessages ? (
            <WelcomeScreen
              onOpenSettings={() => setIsSettingsOpen(true)}
              hasApiKey={!!settings.apiKey}
            />
          ) : (
            <div className="p-6 max-w-6xl mx-auto">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {streamingMessage && (
                <MessageBubble
                  message={{
                    id: 'streaming',
                    role: 'assistant',
                    content: streamingMessage,
                    timestamp: Date.now(),
                  }}
                  isStreaming={true}
                />
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onStop={abortController ? handleStopGeneration : undefined}
        />
      </div>

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}

export default App;