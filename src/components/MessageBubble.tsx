import React from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreaming }) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const MarkdownComponents = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (!inline && language) {
        return (
          <div className="relative group">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
              <span className="text-gray-300 text-sm font-medium">{language}</span>
              <button
                onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded opacity-0 group-hover:opacity-100"
                title="Copy code"
              >
                <Copy size={14} />
              </button>
            </div>
            <SyntaxHighlighter
              style={oneDark}
              language={language}
              PreTag="div"
              customStyle={{
                margin: 0,
                borderRadius: '0 0 8px 8px',
                background: '#1e1e1e',
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        );
      }
      
      return (
        <code 
          className="bg-gray-700/50 text-cyan-300 px-2 py-1 rounded text-sm font-mono" 
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }: any) => (
      <h1 className="text-2xl font-bold text-white mb-4 border-b border-gray-600 pb-2">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl font-bold text-white mb-3 mt-6">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-semibold text-white mb-2 mt-4">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="text-gray-100 mb-4 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside text-gray-100 mb-4 space-y-1">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside text-gray-100 mb-4 space-y-1">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="text-gray-100 ml-4">
        {children}
      </li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-cyan-400 pl-4 py-2 bg-gray-800/30 rounded-r-lg mb-4 italic text-gray-200">
        {children}
      </blockquote>
    ),
    a: ({ href, children }: any) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
      >
        {children}
      </a>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-600 rounded-lg overflow-hidden">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-gray-700">
        {children}
      </thead>
    ),
    tbody: ({ children }: any) => (
      <tbody className="bg-gray-800/50">
        {children}
      </tbody>
    ),
    tr: ({ children }: any) => (
      <tr className="border-b border-gray-600">
        {children}
      </tr>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-2 text-left text-white font-semibold">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-2 text-gray-100">
        {children}
      </td>
    ),
    strong: ({ children }: any) => (
      <strong className="font-bold text-white">
        {children}
      </strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-200">
        {children}
      </em>
    ),
  };

  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30' 
          : 'bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30'
      }`}>
        {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
      </div>
      
      <div className={`flex-1 max-w-4xl ${isUser ? 'text-right' : ''}`}>
        <div className={`group relative inline-block max-w-full ${
          isUser 
            ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 ml-auto' 
            : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-cyan-500/20'
        } backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg`}>
          
          {isUser ? (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-purple-100">
              {message.content}
              {isStreaming && (
                <span className="inline-block w-2 h-5 bg-cyan-400 ml-1 animate-pulse" />
              )}
            </pre>
          ) : (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown components={MarkdownComponents}>
                {message.content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-2 h-5 bg-cyan-400 ml-1 animate-pulse" />
              )}
            </div>
          )}
          
          {!isStreaming && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-700/50 rounded-lg"
              title="Copy message"
            >
              {copied ? (
                <Check size={14} className="text-green-400" />
              ) : (
                <Copy size={14} className="text-gray-400 hover:text-white" />
              )}
            </button>
          )}
        </div>
        
        <div className={`text-xs text-gray-500 mt-2 ${isUser ? 'text-right' : ''}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;