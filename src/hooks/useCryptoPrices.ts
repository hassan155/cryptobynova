import { useState, useEffect, useCallback } from 'react';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  market_cap: number;
  total_volume: number;
  image: string;
  sparkline_in_7d?: { price: number[] };
}

// Fallback mock data when API fails or rate-limits
const MOCK_DATA: CryptoData[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 67234.12, price_change_percentage_24h: 2.34, price_change_percentage_7d_in_currency: 5.67, market_cap: 1320000000000, total_volume: 28400000000, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', sparkline_in_7d: { price: [62000, 63500, 62800, 65000, 64500, 66000, 67234] } },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3456.78, price_change_percentage_24h: -1.23, price_change_percentage_7d_in_currency: 3.45, market_cap: 415000000000, total_volume: 15200000000, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', sparkline_in_7d: { price: [3200, 3350, 3300, 3400, 3380, 3500, 3456] } },
  { id: 'tether', symbol: 'usdt', name: 'Tether', current_price: 1.0, price_change_percentage_24h: 0.01, price_change_percentage_7d_in_currency: 0.02, market_cap: 118000000000, total_volume: 45000000000, image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png', sparkline_in_7d: { price: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0] } },
  { id: 'binancecoin', symbol: 'bnb', name: 'BNB', current_price: 598.45, price_change_percentage_24h: 0.87, price_change_percentage_7d_in_currency: -2.1, market_cap: 87500000000, total_volume: 1200000000, image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png', sparkline_in_7d: { price: [580, 590, 585, 595, 592, 600, 598] } },
  { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 145.23, price_change_percentage_24h: 4.56, price_change_percentage_7d_in_currency: 12.3, market_cap: 67800000000, total_volume: 3200000000, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', sparkline_in_7d: { price: [120, 128, 125, 135, 132, 142, 145] } },
  { id: 'xrp', symbol: 'xrp', name: 'XRP', current_price: 0.6234, price_change_percentage_24h: -0.45, price_change_percentage_7d_in_currency: 1.23, market_cap: 34500000000, total_volume: 1200000000, image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', sparkline_in_7d: { price: [0.58, 0.60, 0.59, 0.62, 0.61, 0.63, 0.62] } },
  { id: 'usd-coin', symbol: 'usdc', name: 'USDC', current_price: 1.0, price_change_percentage_24h: 0.0, price_change_percentage_7d_in_currency: 0.01, market_cap: 34200000000, total_volume: 6800000000, image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png', sparkline_in_7d: { price: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0] } },
  { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.4567, price_change_percentage_24h: 1.89, price_change_percentage_7d_in_currency: -3.45, market_cap: 16200000000, total_volume: 450000000, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', sparkline_in_7d: { price: [0.48, 0.47, 0.46, 0.45, 0.455, 0.46, 0.456] } },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', current_price: 0.1234, price_change_percentage_24h: -2.34, price_change_percentage_7d_in_currency: -5.67, market_cap: 17800000000, total_volume: 890000000, image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', sparkline_in_7d: { price: [0.135, 0.132, 0.128, 0.125, 0.127, 0.124, 0.123] } },
  { id: 'tron', symbol: 'trx', name: 'TRON', current_price: 0.1567, price_change_percentage_24h: 0.56, price_change_percentage_7d_in_currency: 2.34, market_cap: 13600000000, total_volume: 320000000, image: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png', sparkline_in_7d: { price: [0.148, 0.15, 0.152, 0.151, 0.154, 0.153, 0.156] } },
  { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', current_price: 28.45, price_change_percentage_24h: 3.21, price_change_percentage_7d_in_currency: 8.9, market_cap: 11200000000, total_volume: 450000000, image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', sparkline_in_7d: { price: [24, 25.5, 25, 26.5, 26, 27.5, 28.45] } },
  { id: 'chainlink', symbol: 'link', name: 'Chainlink', current_price: 14.23, price_change_percentage_24h: -1.45, price_change_percentage_7d_in_currency: 4.56, market_cap: 8900000000, total_volume: 340000000, image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png', sparkline_in_7d: { price: [12.5, 13.2, 13.0, 13.8, 13.5, 14.0, 14.23] } },
];

export function useCryptoPrices() {
  const [data, setData] = useState<CryptoData[]>(MOCK_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [usingFallback, setUsingFallback] = useState(true);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h,7d',
        { headers: { 'Accept': 'application/json' } }
      );
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit reached. Using cached data.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      if (Array.isArray(json) && json.length > 0) {
        setData(json);
        setUsingFallback(false);
      }
      setLastUpdated(new Date());
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch prices';
      setError(msg);
      // Keep mock data as fallback - already set in initial state
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { data, loading, error, lastUpdated, usingFallback, refetch: fetchPrices };
}
