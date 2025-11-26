// src/components/ai/AIChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../../services/aiService';
import { Send, X, Bot } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Try to get AI response
      const response = await aiService.askBloomGuide({
        question: input.trim(),
        context: 'general'
      });
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // If AI service fails, show unavailable message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'AI features are currently unavailable. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase().replace(' ', '');
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-bloomPink to-bloomYellow text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300"
          aria-label="Open AI Chat"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200/50 backdrop-blur-sm">
          {/* Header */}
          <div className="bg-white p-4 rounded-t-2xl border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-bloomPink text-sm">BloomGuide AI Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/30">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                {/* Message Bubble */}
                <div
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-gradient-to-r from-bloomPink to-bloomYellow text-white rounded-br-md'
                        : 'bg-white text-gray-700 border border-gray-200 rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
                
                {/* Timestamp */}
                <div
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} px-2`}
                >
                  <span className="text-xs text-gray-500 font-medium">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-start space-y-2">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-white border border-gray-200 rounded-bl-md shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            {/* Input Field */}
            <div className="relative mb-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about motherhood..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-bloomPink/20 focus:border-bloomPink text-sm placeholder-gray-500"
                rows={2}
                disabled={isLoading}
                style={{ minHeight: '60px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute bottom-3 right-3 bg-gradient-to-r from-bloomPink to-bloomYellow text-white p-2 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              AI responses may not always be accurate. Consult professionals for medical advice.
            </p>
          </div>
        </div>
      )}
    </>
  );
}