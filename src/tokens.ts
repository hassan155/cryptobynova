export const tokens = {
  color: {
    white: "#FFFFFF",
    black: "#000000",
    primary: "#2962FF", // TradingView electric blue
    onPrimary: "#FFFFFF",
    secondary: "#089981", // TradingView bullish green
    onSecondary: "#FFFFFF",
    accent: "#F23645", // TradingView bearish red
    onAccent: "#FFFFFF",
    background: "#0C0D14", // Deep rich trading canvas
    text: "#E0E3EB",
    surface: "#131722", // TradingView tool & card surface
    cardForeground: "#E0E3EB",
    muted: "#1E222D",
    mutedForeground: "#787B86",
    border: "#2A2E39",
    ring: "#2962FF",
    destructive: "#F23645",
    onDestructive: "#FFFFFF",
    bullish: "#089981",
    bullishBg: "rgba(8, 153, 129, 0.12)",
    bearish: "#F23645",
    bearishBg: "rgba(242, 54, 69, 0.12)",
  },
  font: {
    heading: "'Plus Jakarta Sans', sans-serif",
    body: "'Plus Jakarta Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  spacing: {
    section: "py-6 sm:py-8",
    container: "max-w-7xl mx-auto px-3 sm:px-6 lg:px-8",
    card: "p-4 sm:p-5",
    gap: "gap-4 sm:gap-6",
  },
  radius: {
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
  },
  shadow: {
    sm: "0 1px 3px rgba(0,0,0,0.4)",
    md: "0 4px 12px rgba(0,0,0,0.5)",
    lg: "0 8px 24px rgba(0,0,0,0.6)",
    hover: "0 12px 32px rgba(0,0,0,0.7)",
  },
  selection: {
    background: "#2962FF",
    text: "#FFFFFF",
  },
} as const;
