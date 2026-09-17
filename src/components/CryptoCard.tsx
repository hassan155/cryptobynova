import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Info, ShieldCheck } from 'lucide-react';
import Sparkline from './Sparkline';
import type { CryptoData } from '../hooks/useCryptoPrices';
import type { ReactNode } from 'react';

interface CryptoCardProps {
  crypto: CryptoData;
  index: number;
  viewMode?: 'grid' | 'table';
  onSelect?: (crypto: CryptoData) => void;
}

function formatNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

function formatPrice(price: number): string {
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (price >= 1) {
    return `$${price.toFixed(2)}`;
  }
  return `$${price.toFixed(4)}`;
}

export default function CryptoCard({
  crypto,
  index,
  viewMode = 'grid',
  onSelect,
}: CryptoCardProps): ReactNode {
  const [showDetails, setShowDetails] = useState(false);
  const isPositive24h = (crypto.price_change_percentage_24h ?? 0) >= 0;
  const isPositive7d = (crypto.price_change_percentage_7d_in_currency ?? 0) >= 0;
  const sparklineData = crypto.sparkline_in_7d?.price || [];

  if (viewMode === 'table') {
    return (
      <tr
        onClick={() => onSelect?.(crypto)}
        className="group border-b border-[#1e222d] hover:bg-[#181c27] cursor-pointer transition-colors"
      >
        <td className="py-3.5 px-4 text-xs font-mono text-gray-400">#{index + 1}</td>
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-3">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-7 h-7 rounded-full bg-[#1e222d] p-0.5"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://assets.coingecko.com/coins/images/1/small/bitcoin.png';
              }}
            />
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-white text-sm">
                <span>{crypto.name}</span>
                <span className="text-[11px] font-mono text-gray-400 uppercase bg-[#202534] px-1.5 py-0.5 rounded">
                  {crypto.symbol}
                </span>
              </div>
            </div>
          </div>
        </td>
        <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-white">
          {formatPrice(crypto.current_price)}
        </td>
        <td className="py-3.5 px-4 text-right font-mono text-xs">
          <span
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-semibold ${
              isPositive24h ? 'text-[#089981] bg-[#089981]/15' : 'text-[#f23645] bg-[#f23645]/15'
            }`}
          >
            {isPositive24h ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive24h ? '+' : ''}
            {(crypto.price_change_percentage_24h ?? 0).toFixed(2)}%
          </span>
        </td>
        <td className="py-3.5 px-4 text-right font-mono text-xs hidden md:table-cell">
          <span
            className={`inline-flex items-center gap-0.5 ${
              isPositive7d ? 'text-[#089981]' : 'text-[#f23645]'
            }`}
          >
            {isPositive7d ? '+' : ''}
            {(crypto.price_change_percentage_7d_in_currency ?? 0).toFixed(2)}%
          </span>
        </td>
        <td className="py-3.5 px-4 text-right font-mono text-xs text-gray-300 hidden sm:table-cell">
          {formatNumber(crypto.market_cap)}
        </td>
        <td className="py-3.5 px-4 text-right font-mono text-xs text-gray-400 hidden lg:table-cell">
          {formatNumber(crypto.total_volume)}
        </td>
        <td className="py-3.5 px-4 text-right hidden sm:table-cell">
          <div className="inline-block">
            <Sparkline data={sparklineData} width={100} height={32} positive={isPositive7d} />
          </div>
        </td>
      </tr>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className="group relative bg-[#131722] border border-[#232733] hover:border-[#363a45] rounded-xl p-4 transition-all duration-200 hover:shadow-xl hover:shadow-black/50"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="w-8 h-8 rounded-full bg-[#1e222d] p-0.5"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://assets.coingecko.com/coins/images/1/small/bitcoin.png';
            }}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-white text-sm group-hover:text-[#2962ff] transition-colors">
                {crypto.name}
              </h3>
              <span className="text-[10px] font-mono text-gray-400 uppercase bg-[#1f2433] px-1.5 py-0.5 rounded">
                {crypto.symbol}
              </span>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">Rank #{index + 1}</span>
          </div>
        </div>

        {/* 24h Change Badge */}
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono font-bold ${
            isPositive24h
              ? 'bg-[#089981]/15 text-[#089981] border border-[#089981]/30'
              : 'bg-[#f23645]/15 text-[#f23645] border border-[#f23645]/30'
          }`}
        >
          {isPositive24h ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {isPositive24h ? '+' : ''}
          {(crypto.price_change_percentage_24h ?? 0).toFixed(2)}%
        </span>
      </div>

      {/* Main Price & Sparkline */}
      <div className="grid grid-cols-2 items-end justify-between py-2 border-y border-[#1e222d] my-3">
        <div>
          <div className="text-[11px] text-gray-400 uppercase tracking-wider font-mono">Live Price</div>
          <div className="text-xl font-bold font-mono text-white tracking-tight">
            {formatPrice(crypto.current_price)}
          </div>
        </div>
        <div className="flex justify-end">
          <Sparkline data={sparklineData} width={110} height={36} positive={isPositive7d} />
        </div>
      </div>

      {/* Key Stats Breakdown (Clear & Easy to read) */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
        <div className="bg-[#181c27] p-2 rounded-lg border border-[#202534]">
          <span className="text-[10px] text-gray-400 block mb-0.5">Market Cap</span>
          <span className="text-gray-200 font-semibold">{formatNumber(crypto.market_cap)}</span>
        </div>
        <div className="bg-[#181c27] p-2 rounded-lg border border-[#202534]">
          <span className="text-[10px] text-gray-400 block mb-0.5">24h Volume</span>
          <span className="text-gray-200 font-semibold">{formatNumber(crypto.total_volume)}</span>
        </div>
      </div>

      {/* 7D Trend pill & quick insight */}
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>7d Trend:</span>
          <span className={`font-mono font-bold ${isPositive7d ? 'text-[#089981]' : 'text-[#f23645]'}`}>
            {isPositive7d ? 'Bullish ↑' : 'Bearish ↓'} ({(crypto.price_change_percentage_7d_in_currency ?? 0).toFixed(1)}%)
          </span>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-400 hover:text-white transition-colors"
          title="Explain this token"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2.5 p-2.5 bg-[#181c27] rounded-lg border border-[#2a2f40] text-[11px] text-gray-300 leading-relaxed"
        >
          <div className="flex items-center gap-1 text-[#2962ff] font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Quick Guide:
          </div>
          {crypto.name} ({crypto.symbol.toUpperCase()}) is currently trading at {formatPrice(crypto.current_price)}. 
          {isPositive24h ? ' Momentum is positive over 24h.' : ' Pullback observed today.'}
        </motion.div>
      )}
    </motion.div>
  );
}
