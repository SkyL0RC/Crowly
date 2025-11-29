import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { streamCrowResponse, handleCrowError } from '../../../services/crowAssistantService';

const CrowChatPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: 'Hello! I\'m Crow, your intelligent wallet assistant. I\'m here to help you with transactions, security tips, and crypto guidance. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef?.current) {
      inputRef?.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue?.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue?.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Create placeholder for assistant response
    const assistantMessageId = Date.now() + 1;
    const assistantMessage = {
      id: assistantMessageId,
      type: 'assistant',
      text: '',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      let accumulatedText = '';
      
      const updatedHistory = await streamCrowResponse(
        userMessage?.text,
        chatHistory,
        (chunk) => {
          accumulatedText += chunk;
          setMessages((prev) =>
            prev?.map((msg) =>
              msg?.id === assistantMessageId
                ? { ...msg, text: accumulatedText }
                : msg
            )
          );
        }
      );

      setChatHistory(updatedHistory);
    } catch (error) {
      const errorMessage = handleCrowError(error);
      setMessages((prev) =>
        prev?.map((msg) =>
          msg?.id === assistantMessageId
            ? { ...msg, text: errorMessage, isError: true }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: 'Send', text: 'How do I send USDT?', query: 'How do I send USDT to another wallet?' },
    { icon: 'Shield', text: 'Security tips', query: 'What are the most important security tips for managing my crypto wallet?' },
    { icon: 'DollarSign', text: 'Check gas fees', query: 'How can I check current gas fees and optimize my transaction costs?' },
    { icon: 'HelpCircle', text: 'Wallet help', query: 'Can you explain the basic features of this wallet?' },
  ];

  const handleQuickAction = (query) => {
    setInputValue(query);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Chat Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-background border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="relative border-b border-border bg-gradient-to-r from-surface to-background">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5"></div>
              <div className="relative p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-surface to-background border border-accent flex items-center justify-center animate-glow">
                      <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 5L25 15L35 20L25 25L20 35L15 25L5 20L15 15L20 5Z" fill="var(--color-accent)" opacity="0.2"/>
                        <path d="M20 5L25 15L35 20L25 25L20 35L15 25L5 20L15 15L20 5Z" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="bevel"/>
                        <circle cx="18" cy="16" r="2" fill="var(--color-accent)"/>
                        <circle cx="22" cy="16" r="2" fill="var(--color-accent)"/>
                      </svg>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-success animate-pulse"></div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Crow Assistant</h2>
                    <p className="text-xs text-muted-foreground">Always here to help</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-surface transition-colors"
                  aria-label="Close chat"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages?.map((message) => (
                <motion.div
                  key={message?.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message?.type === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {message?.type === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 5L25 15L35 20L25 25L20 35L15 25L5 20L15 15L20 5Z" fill="var(--color-accent)" opacity="0.5"/>
                      </svg>
                    </div>
                  )}
                  <div
                    className={`flex-1 max-w-[85%] p-3 rounded-lg ${
                      message?.type === 'user' ?'bg-accent text-white ml-auto'
                        : message?.isError
                        ? 'bg-error/10 border border-error/30 text-error' :'glass-card'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message?.text}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message?.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 5L25 15L35 20L25 25L20 35L15 25L5 20L15 15L20 5Z" fill="var(--color-accent)" opacity="0.5"/>
                    </svg>
                  </div>
                  <div className="glass-card p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages?.length === 1 && (
              <div className="px-4 pb-4">
                <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions?.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action?.query)}
                      className="glass-card p-3 text-left hover:border-accent transition-all group"
                    >
                      <Icon name={action?.icon} size={16} className="text-accent mb-1" />
                      <p className="text-xs text-foreground group-hover:text-accent transition-colors">{action?.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-border p-4 bg-surface/50">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e?.target?.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Crow anything..."
                  rows={1}
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-accent transition-colors"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue?.trim() || isLoading}
                  className="px-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Icon name="Send" size={18} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Powered by Gemini AI • Press Enter to send
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CrowChatPanel;