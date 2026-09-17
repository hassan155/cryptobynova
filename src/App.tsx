import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { tokens } from './tokens';
import { stagger, fadeUp } from './animations';
import { useCryptoPrices } from './hooks/useCryptoPrices';
import { useAIChat } from './hooks/useAIChat';
import CryptoCard from './components/CryptoCard';
import ChatSidebar from './components/ChatSidebar';
import type { ReactNode } from 'react';

export default function App(): ReactNode {
  const [searchQuery, setSearchQuery] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const { data, loading, error, lastUpdated, usingFallback, refetch } = useCryptoPrices();
  const { messages, isLoading: chatLoading, sendMessage, clearChat } = useAIChat();

  const filteredData = data.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topGainer = data.length > 0
    ? data.reduce((max, c) =>
        (c.price_change_percentage_24h ?? 0) > (max.price_change_percentage_24h ?? 0) ? c : max
      )
    : null;

  const topLoser = data.length > 0
    ? data.reduce((min, c) =>
        (c.price_change_percentage_24h ?? 0) < (min.price_change_percentage_24h ?? 0) ? c : min
      )
    : null;

  const totalMarketCap = data.reduce((sum, c) => sum + (c.market_cap || 0), 0);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: tokens.color.background,
        color: tokens.color.text,
        fontFamily: tokens.font.body,
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30"
        style={{
          backgroundColor: `${tokens.color.surface}F0`,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${tokens.color.border}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: tokens.color.primary }}
              >
                <Activity size={20} style={{ color: tokens.color.onPrimary }} />
              </div>
              <h1
                className="text-xl font-bold hidden sm:block"
                style={{ color: tokens.color.cardForeground, fontFamily: tokens.font.heading }}
              >
                CryptoTracker
              </h1>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4">
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{
                  backgroundColor: tokens.color.muted,
                  border: `1px solid ${tokens.color.border}`,
                }}
              >
                <Search size={16} style={{ color: tokens.color.mutedForeground }} />
                <input
                  type="text"
                  placeholder="Search coins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: tokens.color.cardForeground, fontFamily: tokens.font.body }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {usingFallback && (
                <span
                  className="hidden md:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${tokens.color.accent}20`,
                    color: tokens.color.onAccent,
                  }}
                >
                  Demo Data
                </span>
              )}
              {lastUpdated && (
                <div className="hidden md:flex items-center gap-1.5 text-xs" style={{ color: tokens.color.mutedForeground }}>
                  <Clock size={12} />
                  <span>
                    {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              )}
              <button
                onClick={refetch}
                disabled={loading}
                className="p-2 rounded-lg transition-all hover:opacity-80 disabled:opacity-40"
                style={{
                  backgroundColor: tokens.color.muted,
                  color: tokens.color.mutedForeground,
                }}
                title="Refresh prices"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Market Overview Stats */}
        {data.length > 0 && (
          <motion.div
            variants={stagger(0.05, 0.08)}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <motion.div
              variants={fadeUp}
              className="rounded-xl p-4"
              style={{
                backgroundColor: tokens.color.surface,
                border: `1px solid ${tokens.color.border}`,
              }}
            >
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: tokens.color.mutedForeground }}>
                Total Market Cap
              </p>
              <p className="text-lg font-bold" style={{ color: tokens.color.cardForeground, fontFamily: tokens.font.heading }}>
                ${(totalMarketCap / 1e12).toFixed(2)}T
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-xl p-4"
              style={{
                backgroundColor: tokens.color.surface,
                border: `1px solid ${tokens.color.border}`,
              }}
            >
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: tokens.color.mutedForeground }}>
                Coins Tracked
              </p>
              <p className="text-lg font-bold" style={{ color: tokens.color.cardForeground, fontFamily: tokens.font.heading }}>
                {data.length}
              </p>
            </motion.div>

            {topGainer && (
              <motion.div
                variants={fadeUp}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: tokens.color.surface,
                  border: `1px solid ${tokens.color.border}`,
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={14} style={{ color: tokens.color.primary }} />
                  <p className="text-xs uppercase tracking-wider" style={{ color: tokens.color.mutedForeground }}>
                    Top Gainer (24h)
                  </p>
                </div>
                <p className="text-sm font-semibold" style={{ color: tokens.color.cardForeground, fontFamily: tokens.font.heading }}>
                  {topGainer.symbol.toUpperCase()}
                </p>
                <p className="text-sm font-bold" style={{ color: tokens.color.primary }}>
                  +{(topGainer.price_change_percentage_24h ?? 0).toFixed(2)}%
                </p>
              </motion.div>
            )}

            {topLoser && (
              <motion.div
                variants={fadeUp}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: tokens.color.surface,
                  border: `1px solid ${tokens.color.border}`,
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingDown size={14} style={{ color: tokens.color.destructive }} />
                  <p className="text-xs uppercase tracking-wider" style={{ color: tokens.color.mutedForeground }}>
                    Top Loser (24h)
                  </p>
                </div>
                <p className="text-sm font-semibold" style={{ color: tokens.color.cardForeground, fontFamily: tokens.font.heading }}>
                  {topLoser.symbol.toUpperCase()}
                </p>
                <p className="text-sm font-bold" style={{ color: tokens.color.destructive }}>
                  {(topLoser.price_change_percentage_24h ?? 0).toFixed(2)}%
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="rounded-xl p-4 mb-6 flex items-center gap-3"
            style={{
              backgroundColor: `${tokens.color.destructive}15`,
              border: `1px solid ${tokens.color.destructive}40`,
            }}
          >
            <AlertCircle size={20} style={{ color: tokens.color.destructive }} />
            <p className="text-sm" style={{ color: tokens.color.destructive }}>
              {error}. Prices will retry automatically.
            </p>
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {loading && data.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-5 animate-pulse"
                style={{
                  backgroundColor: tokens.color.surface,
                  border: `1px solid ${tokens.color.border}`,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full" style={{ backgroundColor: tokens.color.muted }} />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 rounded w-24" style={{ backgroundColor: tokens.color.muted }} />
                    <div className="h-3 rounded w-12" style={{ backgroundColor: tokens.color.muted }} />
                  </div>
                </div>
                <div className="h-8 rounded w-32 mb-4" style={{ backgroundColor: tokens.color.muted }} />
                <div className="h-16 rounded w-full" style={{ backgroundColor: tokens.color.muted }} />
              </div>
            ))}
          </div>
        )}

        {/* Crypto Grid */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredData.map((crypto, index) => (
              <CryptoCard key={crypto.id} crypto={crypto} index={index} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-20">
              <Search size={48} className="mx-auto mb-4" style={{ color: tokens.color.mutedForeground }} />
              <p className="text-lg font-medium" style={{ color: tokens.color.mutedForeground }}>
                No coins match "{searchQuery}"
              </p>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer
        className="py-4 px-4 sm:px-6 lg:px-8"
        style={{
          borderTop: `1px solid ${tokens.color.border}`,
          backgroundColor: tokens.color.surface,
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: tokens.color.mutedForeground }}>
            Data provided by{' '}
            <a
              href="https://www.coingecko.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 hover:underline"
              style={{ color: tokens.color.primary }}
            >
              CoinGecko <ExternalLink size={10} />
            </a>
            . Prices refresh every 60 seconds.
          </p>
          <p className="text-xs" style={{ color: tokens.color.mutedForeground }}>
            AI powered by{' '}
            <a
              href="https://pollinations.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 hover:underline"
              style={{ color: tokens.color.primary }}
            >
              Pollinations <ExternalLink size={10} />
            </a>
          </p>
        </div>
      </footer>

      {/* AI Chat Sidebar */}
      <ChatSidebar
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        messages={messages}
        isLoading={chatLoading}
        onSendMessage={sendMessage}
        onClearChat={clearChat}
      />
    </div>
  );
}
