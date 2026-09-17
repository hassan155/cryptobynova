import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  MessageSquare,
  X,
  Bot,
  User,
  Trash2,
  ChevronLeft,
  Loader2,
} from 'lucide-react';
import { tokens } from '../tokens';
import { fadeLeft, fadeRight } from '../animations';
import type { ReactNode } from 'react';
import type { ChatMessage } from '../hooks/useAIChat';

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
}

export default function ChatSidebar({
  isOpen,
  onToggle,
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
}: ChatSidebarProps): ReactNode {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const suggestions = [
    'What are the risks of investing in Bitcoin?',
    'Tell me about Ethereum',
    'Analyze the crypto market today',
    'What is market cap and why does it matter?',
    'Risks of memecoins',
  ];

  return (
    <>
      {/* Toggle button - always visible */}
      <button
        onClick={onToggle}
        className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-lg transition-all hover:scale-105"
        style={{
          backgroundColor: tokens.color.primary,
          color: tokens.color.onPrimary,
        }}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
        <span className="text-sm font-medium hidden sm:inline">
          {isOpen ? 'Close AI' : 'Ask AI'}
        </span>
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="fixed right-0 top-0 h-full z-40 flex flex-col vscode-sidebar"
            style={{
              width: 'min(420px, 100vw)',
              backgroundColor: tokens.color.surface,
              borderLeft: `1px solid ${tokens.color.border}`,
              boxShadow: `-${tokens.shadow.lg.split(' ')[1]} 0 24px ${tokens.color.text}14`,
            }}
          >
            {/* Header - VS Code style */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                backgroundColor: tokens.color.muted,
                borderBottom: `1px solid ${tokens.color.border}`,
              }}
            >
              <div className="flex items-center gap-2">
                <ChevronLeft
                  size={18}
                  className="cursor-pointer hover:opacity-70"
                  onClick={onToggle}
                  style={{ color: tokens.color.mutedForeground }}
                />
                <Bot size={18} style={{ color: tokens.color.primary }} />
                <span
                  className="text-sm font-semibold"
                  style={{ color: tokens.color.cardForeground, fontFamily: tokens.font.heading }}
                >
                  Crypto AI Assistant
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={onClearChat}
                  className="p-1.5 rounded-md transition-colors hover:opacity-70"
                  style={{ color: tokens.color.mutedForeground }}
                  title="Clear chat"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={onToggle}
                  className="p-1.5 rounded-md transition-colors hover:opacity-70"
                  style={{ color: tokens.color.mutedForeground }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto chat-scroll px-4 py-3 space-y-4">
              {messages.length === 1 && (
                <div className="space-y-2 mt-2">
                  <p
                    className="text-xs uppercase tracking-wider font-medium mb-3"
                    style={{ color: tokens.color.mutedForeground }}
                  >
                    Suggested questions
                  </p>
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => onSendMessage(suggestion)}
                      className="w-full text-left text-sm px-3 py-2.5 rounded-lg transition-all hover:opacity-80"
                      style={{
                        backgroundColor: tokens.color.muted,
                        color: tokens.color.cardForeground,
                        border: `1px solid ${tokens.color.border}`,
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  variants={fadeRight}
                  initial="hidden"
                  animate="show"
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor:
                        msg.role === 'assistant'
                          ? tokens.color.primary
                          : tokens.color.accent,
                      color:
                        msg.role === 'assistant'
                          ? tokens.color.onPrimary
                          : tokens.color.onAccent,
                    }}
                  >
                    {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-tr-sm'
                        : 'rounded-tl-sm'
                    }`}
                    style={{
                      backgroundColor:
                        msg.role === 'assistant'
                          ? tokens.color.muted
                          : tokens.color.primary,
                      color:
                        msg.role === 'assistant'
                          ? tokens.color.cardForeground
                          : tokens.color.onPrimary,
                    }}
                  >
                    {msg.content ? (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        <span style={{ color: tokens.color.mutedForeground }}>
                          Thinking...
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="px-4 py-3"
              style={{
                borderTop: `1px solid ${tokens.color.border}`,
                backgroundColor: tokens.color.muted,
              }}
            >
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about any crypto..."
                  className="flex-1 rounded-lg px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2"
                  style={{
                    backgroundColor: tokens.color.surface,
                    color: tokens.color.cardForeground,
                    border: `1px solid ${tokens.color.border}`,
                    fontFamily: tokens.font.body,
                  }}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="rounded-lg px-3.5 py-2.5 transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: tokens.color.primary,
                    color: tokens.color.onPrimary,
                  }}
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
