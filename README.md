# CryptoTracker by NOVA

A Progressive Web App (PWA) for tracking live cryptocurrency prices with an AI-powered chat assistant. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Live Prices** — Tracks 50 top cryptocurrencies from CoinGecko (free, no API key)
- **AI Chat Assistant** — VS Code-style sidebar powered by Pollinations AI (free, no API key)
- **PWA Support** — Installable on mobile and desktop, works offline with cached data
- **Smart Fallbacks** — Demo data loads instantly; live API updates in the background
- **Responsive Design** — Works on mobile, tablet, and desktop

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React

## APIs Used

| Service | Purpose | Key Required |
|---------|---------|-------------|
| [CoinGecko](https://www.coingecko.com) | Live crypto prices | No |
| [Pollinations AI](https://pollinations.ai) | AI chat responses | No |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## PWA Installation

### Chrome / Edge (Desktop)
1. Open the app in your browser
2. Click the install icon in the address bar
3. The app will appear as a standalone window

### Safari (iOS)
1. Open the app in Safari
2. Tap Share → "Add to Home Screen"
3. The app will appear like a native app

### Chrome (Android)
1. Open the app in Chrome
2. Tap the menu → "Add to Home Screen"
3. The app will install with an icon

## Project Structure

```
src/
  components/
    CryptoCard.tsx      # Individual coin card with sparkline
    ChatSidebar.tsx     # VS Code-style AI chat sidebar
    Sparkline.tsx       # Mini price chart
  hooks/
    useCryptoPrices.ts  # CoinGecko API + mock fallback
    useAIChat.ts        # Pollinations AI + keyword fallback
  animations.ts         # Framer Motion variants
  tokens.ts             # Design system tokens
  App.tsx               # Main app
public/
  sw.js                 # Service worker for offline
  manifest.json         # PWA manifest
  icon.svg              # App icon
```

## License

MIT
