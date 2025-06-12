import React from 'react';
import { Zap, Key, MessageCircle, Settings, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onOpenSettings, hasApiKey }) => {
  const suggestions = [
    "Explain quantum computing in simple terms",
    "Write a creative story about AI in 2030",
    "Help me plan a healthy meal for this week",
    "Debug this JavaScript code for me",
    "Create a business plan outline",
    "Explain the latest developments in space exploration"
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Logo and Title */}
        <div className="mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/30">
            <Zap className="text-white" size={32} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            NeuroChat AI
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Experience the future of AI conversation with our advanced neural interface
          </p>
        </div>

        {!hasApiKey ? (
          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Key className="text-red-400" size={24} />
              <h3 className="text-xl font-semibold text-white">API Key Required</h3>
            </div>
            <p className="text-gray-300 mb-6">
              To start chatting, you'll need to configure your OpenAI API key. 
              Don't worry - it's stored securely in your browser and never sent to our servers.
            </p>
            <button
              onClick={onOpenSettings}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-red-500/25"
            >
              Configure API Key
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-800/30 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm hover:border-cyan-500/40 transition-all">
                <MessageCircle className="text-cyan-400 mb-4" size={32} />
                <h3 className="text-lg font-semibold text-white mb-2">Smart Conversations</h3>
                <p className="text-gray-400">Engage in natural, context-aware discussions with advanced AI models</p>
              </div>
              <div className="bg-gray-800/30 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/40 transition-all">
                <Settings className="text-purple-400 mb-4" size={32} />
                <h3 className="text-lg font-semibold text-white mb-2">Customizable</h3>
                <p className="text-gray-400">Adjust temperature, tokens, and system prompts to suit your needs</p>
              </div>
              <div className="bg-gray-800/30 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm hover:border-green-500/40 transition-all">
                <Sparkles className="text-green-400 mb-4" size={32} />
                <h3 className="text-lg font-semibold text-white mb-2">Multiple Models</h3>
                <p className="text-gray-400">Choose from GPT-4, GPT-3.5 Turbo, and more cutting-edge models</p>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Try asking me about:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/20 border border-gray-700/50 rounded-xl p-4 text-left hover:border-cyan-500/30 hover:bg-gray-800/30 transition-all cursor-pointer group"
                    onClick={() => {
                      const event = new CustomEvent('suggestion-click', { detail: suggestion });
                      window.dispatchEvent(event);
                    }}
                  >
                    <p className="text-gray-300 group-hover:text-white transition-colors">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;