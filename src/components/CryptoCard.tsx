import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { tokens } from '../tokens';
import { fadeUp } from '../animations';
import Sparkline from './Sparkline';
import type { CryptoData } from '../hooks/useCryptoPrices';
import type { ReactNode } from 'react';

interface CryptoCardProps {
  crypto: CryptoData;
  index: number;
}

function formatNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

function formatPrice(price: number): string {
  if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${price.toFixed(6)}`;
}

export default function CryptoCard({ crypto, index }: CryptoCardProps): ReactNode {
  const isPositive24h = (crypto.price_change_percentage_24h ?? 0) >= 0;
  const isPositive7d = (crypto.price_change_percentage_7d_in_currency ?? 0) >= 0;
  const sparklineData = crypto.sparkline_in_7d?.price ?? [];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-xl p-5 transition-shadow hover:shadow-xl cursor-pointer"
      style={{
        backgroundColor: tokens.color.surface,
        border: `1px solid ${tokens.color.border}`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={crypto.image}
            alt={`${crypto.name} logo`}
            width={40}
            height={40}
            className="rounded-full"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div>
            <h3 className="font-semibold text-base" style={{ color: tokens.color.cardForeground, fontFamily: tokens.font.heading }}>
              {crypto.name}
            </h3>
            <span className="text-xs uppercase tracking-wider" style={{ color: tokens.color.mutedForeground }}>
              {crypto.symbol}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg" style={{ color: tokens.color.cardForeground, fontFamily: tokens.font.heading }}>
            {formatPrice(crypto.current_price)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isPositive24h ? (
            <TrendingUp size={16} style={{ color: tokens.color.primary }} />
          ) : (
            <TrendingDown size={16} style={{ color: tokens.color.destructive }} />
          )}
          <span
            className="text-sm font-medium"
            style={{ color: isPositive24h ? tokens.color.primary : tokens.color.destructive }}
          >
            {(crypto.price_change_percentage_24h ?? 0).toFixed(2)}%
          </span>
          <span className="text-xs" style={{ color: tokens.color.mutedForeground }}>
            24h
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isPositive7d ? (
            <TrendingUp size={16} style={{ color: tokens.color.primary }} />
          ) : (
            <TrendingDown size={16} style={{ color: tokens.color.destructive }} />
          )}
          <span
            className="text-sm font-medium"
            style={{ color: isPositive7d ? tokens.color.primary : tokens.color.destructive }}
          >
            {(crypto.price_change_percentage_7d_in_currency ?? 0).toFixed(2)}%
          </span>
          <span className="text-xs" style={{ color: tokens.color.mutedForeground }}>
            7d
          </span>
        </div>
      </div>

      {sparklineData.length > 0 && (
        <div className="mb-4 flex justify-center">
          <Sparkline
            data={sparklineData}
            width={200}
            height={50}
            positive={isPositive7d}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 pt-3" style={{ borderTop: `1px solid ${tokens.color.border}` }}>
        <div className="flex items-center gap-2">
          <DollarSign size={14} style={{ color: tokens.color.mutedForeground }} />
          <div>
            <p className="text-xs" style={{ color: tokens.color.mutedForeground }}>Market Cap</p>
            <p className="text-sm font-semibold" style={{ color: tokens.color.cardForeground }}>
              {formatNumber(crypto.market_cap)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 size={14} style={{ color: tokens.color.mutedForeground }} />
          <div>
            <p className="text-xs" style={{ color: tokens.color.mutedForeground }}>Volume (24h)</p>
            <p className="text-sm font-semibold" style={{ color: tokens.color.cardForeground }}>
              {formatNumber(crypto.total_volume)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
