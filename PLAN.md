# CryptoTracker Plan

## Domain Tag
crypto tracker live code-style chatbot sidebar tracker should

## Selected Design System
Domain Tag: crypto tracker live code-style chatbot sidebar tracker should
Color Palette: Option 1 (Nature green + sun yellow — adapted for a dashboard/tool context)
Typography: Option 1 (Lora + Raleway)
Rationale: The warm green palette provides a calming, trustworthy feel for a financial tracker. Lora headings give authority, Raleway body ensures readability in dense data layouts.

## Pages
- / — Dashboard — single-page crypto tracker with live prices and AI chat sidebar

## Notes
This is a dashboard/tool application, not a marketing site. A single-page layout with a VS Code-style sidebar is the correct pattern. No multi-page marketing sections needed. The hero carries no imagery by design — this is a data dashboard.

## Architecture
- Main layout: VS Code-style split pane — collapsible right sidebar (AI chat), main content (crypto tracker)
- CoinGecko API (free, no key required) for live crypto prices
- Pollinations AI API (free, no key required) for the chatbot
- Custom components: CryptoCard, PriceChart, ChatSidebar, ChatMessage, SearchBar
