import React, { useState } from 'react';
import { X, Settings as SettingsIcon, Key, Cpu, Thermometer, Hash, FileText } from 'lucide-react';
import { ChatSettings, OpenAIModel } from '../types';
import { OPENAI_MODELS } from '../utils/openai';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState<ChatSettings>(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <SettingsIcon className="text-cyan-400" size={24} />
            <h2 className="text-2xl font-bold text-white">AI Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8">
          {/* API Key */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-cyan-400 font-medium">
              <Key size={18} />
              OpenAI API Key
            </label>
            <input
              type="password"
              value={localSettings.apiKey}
              onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
            <p className="text-gray-400 text-sm">Your API key is stored locally and never sent to our servers.</p>
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-cyan-400 font-medium">
              <Cpu size={18} />
              AI Model
            </label>
            <div className="space-y-2">
              {OPENAI_MODELS.map((model: OpenAIModel) => (
                <label key={model.id} className="flex items-start gap-3 p-3 bg-gray-800/30 border border-gray-700 rounded-lg hover:border-cyan-500/50 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="model"
                    value={model.id}
                    checked={localSettings.model === model.id}
                    onChange={(e) => setLocalSettings({ ...localSettings, model: e.target.value })}
                    className="mt-1 text-cyan-400 focus:ring-cyan-400"
                  />
                  <div>
                    <div className="text-white font-medium">{model.name}</div>
                    <div className="text-gray-400 text-sm">{model.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Temperature */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-cyan-400 font-medium">
              <Thermometer size={18} />
              Temperature: {localSettings.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={localSettings.temperature}
              onChange={(e) => setLocalSettings({ ...localSettings, temperature: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-gray-400 text-sm">
              <span>More Focused</span>
              <span>More Creative</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-cyan-400 font-medium">
              <Hash size={18} />
              Max Tokens
            </label>
            <input
              type="number"
              min="1"
              max="4096"
              value={localSettings.maxTokens}
              onChange={(e) => setLocalSettings({ ...localSettings, maxTokens: parseInt(e.target.value) })}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
          </div>

          {/* System Prompt */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-cyan-400 font-medium">
              <FileText size={18} />
              System Prompt
            </label>
            <textarea
              value={localSettings.systemPrompt}
              onChange={(e) => setLocalSettings({ ...localSettings, systemPrompt: e.target.value })}
              placeholder="You are a helpful AI assistant..."
              rows={4}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;