import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const FALLBACK_RESPONSES: Record<string, string> = {
  'bitcoin': 'Bitcoin (BTC) is the first and most valuable cryptocurrency.\n\n**Risks:**\n- Extreme price volatility - can drop 50%+ in weeks\n- Regulatory uncertainty worldwide\n- Environmental concerns over proof-of-work mining\n- Concentration of ownership (whales can manipulate price)\n- Security risks: lost wallets = lost forever\n\n**Opportunities:**\n- Store of value ("digital gold") narrative\n- Institutional adoption growing\n- Limited supply (21M max) creates scarcity',
  'ethereum': 'Ethereum (ETH) is the leading smart contract platform.\n\n**Risks:**\n- High gas fees during network congestion\n- Competition from faster/cheaper Layer 1s (Solana, Avalanche)\n- Complexity of proof-of-stake transition risks\n- Smart contract bugs can drain funds\n- Scalability challenges until full sharding\n\n**Opportunities:**\n- Dominant DeFi and NFT ecosystem\n- ETH staking yields passive income\n- Layer 2 scaling solutions maturing',
  'solana': 'Solana (SOL) is a high-performance blockchain.\n\n**Risks:**\n- Network outages and instability history\n- Centralization concerns (validator hardware requirements)\n- Heavy VC backing creates sell pressure\n- Competition from Ethereum L2s\n- Smaller developer ecosystem\n\n**Opportunities:**\n- Extremely fast transactions (65,000 TPS)\n- Low fees attract retail users\n- Growing NFT and DeFi ecosystem',
};

function generateFallbackResponse(query: string): string {
  const lower = query.toLowerCase();

  // Check for known coins
  for (const [coin, response] of Object.entries(FALLBACK_RESPONSES)) {
    if (lower.includes(coin)) return response;
  }

  // Generic crypto response
  if (lower.includes('risk')) {
    return '**General Crypto Investment Risks:**\n\n1. **Volatility**: Prices can swing 10-50% in a single day\n2. **Regulatory Risk**: Governments may ban or heavily restrict crypto\n3. **Security**: Hacks, scams, and lost private keys are irreversible\n4. **Liquidity**: Smaller coins may be hard to sell at fair prices\n5. **Technology Risk**: Bugs, network failures, or obsolescence\n6. **Market Manipulation**: Pump-and-dump schemes are common\n7. **No Consumer Protection**: Unlike banks, crypto losses are rarely recoverable\n\n**Advice**: Never invest more than you can afford to lose. Diversify, use reputable exchanges, and store large amounts in hardware wallets.';
  }

  if (lower.includes('market') || lower.includes('today')) {
    return 'The cryptocurrency market is known for high volatility. Key factors affecting prices today include:\n\n- **Macroeconomic conditions**: Interest rates, inflation data\n- **ETF flows**: Bitcoin ETF inflows/outflows\n- **Regulatory news**: SEC decisions, country bans\n- **Network activity**: Transaction volume, active addresses\n- **Whale movements**: Large wallet transfers\n\nAlways check multiple sources and never make investment decisions based on a single data point.';
  }

  if (lower.includes('memecoin') || lower.includes('meme')) {
    return '**Memecoin Risks (DOGE, SHIB, etc.):**\n\n1. **No intrinsic value**: Usually no technology or utility\n2. **Extreme volatility**: 100%+ swings are common\n3. **Rug pulls**: Creators can dump and disappear\n4. **Hype-driven**: Prices based on social media trends\n5. **Liquidity traps**: You may not be able to exit at expected prices\n6. **Infinite supply**: Many have no cap, causing inflation\n\n**Rule of thumb**: Only put in what you are 100% okay losing completely.';
  }

  return 'That is an interesting question about cryptocurrency!\n\nIn general, when evaluating any crypto asset, consider:\n\n- **Market cap & volume** - Higher = more stable\n- **Team & development activity** - Active GitHub = healthy project\n- **Tokenomics** - Supply schedule, inflation, utility\n- **Community** - Strong communities drive adoption\n- **Competition** - What makes this project unique?\n- **Regulatory status** - Is it considered a security?\n\nFor specific coin analysis, mention the coin name and I can give detailed risk assessment.';
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am your crypto AI assistant. Ask me about any cryptocurrency, market risks, investment analysis, or anything crypto-related!",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const assistantId = generateId();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      },
    ]);

    abortRef.current = new AbortController();

    try {
      // Try Pollinations AI
      const prompt = `You are a crypto expert assistant. The user asks: "${content.trim()}"

Provide a concise but informative response. Include risks if relevant. Keep it under 200 words.`;

      const response = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai&seed=${Date.now()}`,
        {
          signal: abortRef.current.signal,
          headers: { 'Accept': 'text/plain' },
        }
      );

      if (!response.ok) {
        throw new Error(`AI service error: ${response.status}`);
      }

      const text = await response.text();

      if (text && text.trim().length > 10) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: text.trim() } : msg
          )
        );
      } else {
        throw new Error('Empty AI response');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;

      // Use fallback response generator
      const fallback = generateFallbackResponse(content.trim());
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: fallback }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, []);

  const clearChat = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I am your crypto AI assistant. Ask me about any cryptocurrency, market risks, investment analysis, or anything crypto-related!",
        timestamp: new Date(),
      },
    ]);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, sendMessage, clearChat };
}
