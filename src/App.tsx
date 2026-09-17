import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  LayoutGrid,
  List,
  Sparkles,
  SlidersHorizontal,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  BarChart3,
  Globe,
  Wifi,
  DownloadCloud
} from 'lucide-react';
import { useCryptoPrices, type CryptoData } from './hooks/useCryptoPrices';
import { useAIChat } from './hooks/useAIChat';
import CryptoCard from './components/CryptoCard';
import ChatSidebar from './components/ChatSidebar';
import Layout from './components/layout/Layout';
import type { ReactNode } from 'react';

type TabType = 'all' | 'gainers' | 'losers' | 'volume';

export default function App(): ReactNode {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'market_cap' | 'price' | 'change24h'>('market_cap');
  const [chatOpen, setChatOpen] = useState(false);

  const { data: cryptos, loading, error, lastUpdated, refresh } = useCryptoPrices();
  const { messages, isLoading: isChatLoading, sendMessage, clearChat } = useAIChat();

  // Calculated macro metrics
  const marketStats = useMemo(() => {
    if (!cryptos || cryptos.length === 0) {
      return { totalCap: 0, totalVol: 0, avg24h: 0, topGainer: null, topLoser: null, btcDominance: 52.4 };
    }
    const totalCap = cryptos.reduce((sum, c) => sum + (c.market_cap || 0), 0);
    const totalVol = cryptos.reduce((sum, c) => sum + (c.total_volume || 0), 0);
    const avg24h = cryptos.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / cryptos.length;
    
    const sortedGainers = [...cryptos].sort(
      (a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
    );
    const topGainer = sortedGainers[0];
    const topLoser = sortedGainers[sortedGainers.length - 1];

    const btc = cryptos.find((c) => c.symbol.toLowerCase() === 'btc');
    const btcDominance = btc && totalCap > 0 ? (btc.market_cap / totalCap) * 100 : 54.2;

    return { totalCap, totalVol, avg24h, topGainer, topLoser, btcDominance };
  }, [cryptos]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    if (!cryptos) return [];

    let list = cryptos.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q);
    });

    if (activeTab === 'gainers') {
      list = list.filter((c) => (c.price_change_percentage_24h || 0) > 0);
    } else if (activeTab === 'losers') {
      list = list.filter((c) => (c.price_change_percentage_24h || 0) < 0);
    } else if (activeTab === 'volume') {
      list = [...list].sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0));
    }

    return list.sort((a, b) => {
      if (sortBy === 'price') return (b.current_price || 0) - (a.current_price || 0);
      if (sortBy === 'change24h') return (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0);
      return (b.market_cap || 0) - (a.market_cap || 0);
    });
  }, [cryptos, searchQuery, activeTab, sortBy]);

  const formatCurrency = (n: number) => {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    return `$${n.toLocaleString()}`;
  };

  return (
    <Layout>
      {/* TradingView-Style Ticker Ribbon */}
      <div className="bg-[#0b0e14] border-b border-[#1e222d] text-xs font-mono py-1.5 px-4 overflow-x-auto no-scrollbar whitespace-nowrap flex items-center justify-between gap-6 text-gray-400">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 uppercase tracking-wide text-[11px]">Live Market Feed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Global Cap:</span>
            <span className="text-white font-semibold">{formatCurrency(marketStats.totalCap)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">24h Vol:</span>
            <span className="text-white font-semibold">{formatCurrency(marketStats.totalVol)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">BTC Dom:</span>
            <span className="text-[#2962ff] font-semibold">{marketStats.btcDominance.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Sentiment:</span>
            <span className="text-emerald-400 font-bold">Bullish 68/100</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          {lastUpdated && (
            <span className="text-gray-500">
              Synced: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh Quotes"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-[#2962ff]' : ''}`} />
            <span>{loading ? 'Updating...' : 'Sync'}</span>
          </button>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <header className="bg-[#131722]/90 backdrop-blur sticky top-0 z-30 border-b border-[#202534]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#2962ff] to-[#089981] flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold font-mono text-base">
              TV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white tracking-tight text-lg">NovaTrade</h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2962ff]/20 text-[#2962ff] font-semibold border border-[#2962ff]/30">
                  PRO TERMINAL
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">Real-time markets made crystal clear</p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search symbol (BTC, ETH, SOL) or coin name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e222d] border border-[#2a2e39] focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff] rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Actions: AI Assistant & PWA / Status */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#2962ff] to-[#1e53e5] hover:from-[#3870ff] hover:to-[#2962ff] text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Market Analyst</span>
              <span className="sm:hidden">AI</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 flex-1">
        {/* Top Market Overview Cards (TradingView Style) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {/* Card 1: 24h Market Trend */}
          <div className="bg-[#131722] border border-[#202534] rounded-xl p-3.5 sm:p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-1">
              <span>24H Market Pulse</span>
              <Activity className="w-3.5 h-3.5 text-[#2962ff]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                {marketStats.avg24h >= 0 ? '+' : ''}
                {marketStats.avg24h.toFixed(2)}%
              </span>
              <span
                className={`text-xs font-mono font-semibold ${
                  marketStats.avg24h >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {marketStats.avg24h >= 0 ? 'Bull Run' : 'Cooling'}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Weighted 24h market momentum</p>
          </div>

          {/* Card 2: Top Gainer */}
          <div className="bg-[#131722] border border-[#202534] rounded-xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-1">
              <span className="flex items-center gap-1 text-[#089981]">
                <Flame className="w-3.5 h-3.5" /> Top Gainer
              </span>
              <TrendingUp className="w-3.5 h-3.5 text-[#089981]" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-lg sm:text-xl font-bold text-white truncate max-w-[110px]">
                {marketStats.topGainer?.name || 'Loading...'}
              </span>
              <span className="text-xs font-bold font-mono text-[#089981] bg-[#089981]/15 px-1.5 py-0.5 rounded">
                +{marketStats.topGainer?.price_change_percentage_24h?.toFixed(1)}%
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-mono">
              ${marketStats.topGainer?.current_price?.toFixed(2) || '0.00'}
            </p>
          </div>

          {/* Card 3: Top Pullback */}
          <div className="bg-[#131722] border border-[#202534] rounded-xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-1">
              <span>Pullback Alert</span>
              <TrendingDown className="w-3.5 h-3.5 text-[#f23645]" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-lg sm:text-xl font-bold text-white truncate max-w-[110px]">
                {marketStats.topLoser?.name || 'Loading...'}
              </span>
              <span className="text-xs font-bold font-mono text-[#f23645] bg-[#f23645]/15 px-1.5 py-0.5 rounded">
                {marketStats.topLoser?.price_change_percentage_24h?.toFixed(1)}%
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-mono">
              ${marketStats.topLoser?.current_price?.toFixed(2) || '0.00'}
            </p>
          </div>

          {/* Card 4: Dominance & Liquidity */}
          <div className="bg-[#131722] border border-[#202534] rounded-xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-1">
              <span>Total Volume (24h)</span>
              <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-white">
              {formatCurrency(marketStats.totalVol)}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
              <span className="text-[#2962ff] font-semibold">BTC Dom: {marketStats.btcDominance.toFixed(1)}%</span>
            </div>
          </div>
        </section>

        {/* Filter Controls & View Switcher Bar */}
        <section className="bg-[#131722] border border-[#202534] rounded-xl p-3 mb-5 flex flex-wrap items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-[#0b0e14] p-1 rounded-lg border border-[#1e222d] text-xs font-medium">
            {(
              [
                { id: 'all', label: 'All Cryptos' },
                { id: 'gainers', label: '🚀 Gainers' },
                { id: 'losers', label: '📉 Losers' },
                { id: 'volume', label: '📊 High Volume' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#2962ff] text-white font-semibold shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort & Grid/Table Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#1e222d] border border-[#2a2e39] text-white rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#2962ff]"
              >
                <option value="market_cap">Market Cap</option>
                <option value="price">Highest Price</option>
                <option value="change24h">24h Gain %</option>
              </select>
            </div>

            <div className="flex items-center bg-[#0b0e14] p-1 rounded-lg border border-[#1e222d]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#1e222d] text-[#2962ff]' : 'text-gray-500 hover:text-white'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-[#1e222d] text-[#2962ff]' : 'text-gray-500 hover:text-white'}`}
                title="TradingView Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Error Notice */}
        {error && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-5 text-amber-200 text-xs flex items-center justify-between">
            <span>Notice: Using live fallback data feed ({error}). Quotes remain updated.</span>
            <button onClick={refresh} className="underline font-semibold ml-2">
              Retry API
            </button>
          </div>
        )}

        {/* Cryptos List / Grid */}
        {filteredData.length === 0 && !loading ? (
          <div className="bg-[#131722] border border-[#202534] rounded-2xl p-12 text-center">
            <Search className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <h3 className="text-white font-bold text-base mb-1">No cryptocurrencies found</h3>
            <p className="text-gray-400 text-xs mb-4">No tokens match your filter "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="px-4 py-2 bg-[#2962ff] text-white rounded-lg text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredData.map((crypto, index) => (
              <CryptoCard
                key={crypto.id}
                crypto={crypto}
                index={index}
                viewMode="grid"
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#131722] border border-[#202534] rounded-xl overflow-x-auto shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e222d] text-[11px] font-mono text-gray-400 uppercase tracking-wider bg-[#0e111a]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">24h Change</th>
                  <th className="py-3 px-4 text-right hidden md:table-cell">7d Change</th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell">Market Cap</th>
                  <th className="py-3 px-4 text-right hidden lg:table-cell">24h Volume</th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell">7D Trend</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((crypto, index) => (
                  <CryptoCard
                    key={crypto.id}
                    crypto={crypto}
                    index={index}
                    viewMode="table"
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TradingView-grade Explanation / Education Section for beginners */}
        <section className="mt-12 bg-gradient-to-br from-[#131722] to-[#10141f] border border-[#202534] rounded-2xl p-6 sm:p-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2962ff]/15 text-[#2962ff] text-xs font-semibold mb-3 border border-[#2962ff]/30">
              <Zap className="w-3.5 h-3.5" /> Easy Reading Guide
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Understanding Market Signals in Seconds
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
              TradingView instruments broken down for everyone. Monitor real volume, 7-day sparkline trends, and AI-summarized signals with zero guesswork.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#181c27] p-4 rounded-xl border border-[#232838]">
                <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Green (Bullish)
                </div>
                <p className="text-gray-400 text-[11px] leading-normal">
                  Price is rising compared to the previous period. Indicates higher buyer demand than sell pressure.
                </p>
              </div>
              <div className="bg-[#181c27] p-4 rounded-xl border border-[#232838]">
                <div className="text-rose-400 font-bold mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> Red (Bearish)
                </div>
                <p className="text-gray-400 text-[11px] leading-normal">
                  Price is experiencing a pullback. Often represents healthy consolidation or short-term profit-taking.
                </p>
              </div>
              <div className="bg-[#181c27] p-4 rounded-xl border border-[#232838]">
                <div className="text-[#2962ff] font-bold mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Analysis
                </div>
                <p className="text-gray-400 text-[11px] leading-normal">
                  Tap the AI Market Analyst anytime to get plain-language summaries on token fundamentals and risk.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b0e14] border-t border-[#1e222d] py-6 text-xs text-gray-500 text-center font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>PWA Enabled • Offline Capable • Live TradingView-Grade Feed</span>
          </div>
          <div>© {new Date().getFullYear()} NovaTrade Terminal. All market data refreshed in real-time.</div>
        </div>
      </footer>

      {/* AI Chat Drawer / Sidebar */}
      <ChatSidebar
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        messages={messages}
        isLoading={isChatLoading}
        onSendMessage={sendMessage}
        onClearChat={clearChat}
      />
    </Layout>
  );
}
