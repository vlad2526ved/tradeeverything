const COMPANY_DATA = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple",
    emoji: "🍏",
    tradingViewSymbol: "NASDAQ:AAPL",
    stock: {
      currentPrice: 255.88,
      changeValue: 2.09,
      changePercent: 0.82,
      open: 254.13,
      dayHigh: 256.10,
      dayLow: 253.37,
      volume: 25214619,
      marketCap: 4049151330400,
      pe: 34.38,
      eps: 7.90
    },
    business: {
      sector: "Technologie / Hardware",
      industry: "Smartphones, ordinateurs, services",
      headquarters: "Cupertino, Californie, États-Unis"
    }
  },

  AMZN: {
    symbol: "AMZN",
    name: "Amazon",
    emoji: "📦",
    tradingViewSymbol: "NASDAQ:AMZN",
    stock: {
      currentPrice: 211.50,
      changeValue: 3.23,
      changePercent: 1.55,
      open: 210.50,
      dayHigh: 213.53,
      dayLow: 208.28,
      volume: 34602721,
      marketCap: 2341694749138,
      pe: 30.62,
      eps: 7.08
    },
    business: {
      sector: "E-commerce / Cloud",
      industry: "Commerce en ligne, logistique, cloud computing",
      headquarters: "Seattle, Washington, États-Unis"
    }
  },

  GOOGL: {
    symbol: "GOOGL",
    name: "Google",
    emoji: "🔎",
    tradingViewSymbol: "NASDAQ:GOOGL",
    stock: {
      currentPrice: 297.55,
      changeValue: 9.99,
      changePercent: 3.47,
      open: 290.80,
      dayHigh: 300.50,
      dayLow: 287.93,
      volume: 28804975,
      marketCap: 2938129663400,
      pe: 23.65,
      eps: 10.13
    },
    business: {
      sector: "Internet / IA",
      industry: "Recherche, publicité, cloud, intelligence artificielle",
      headquarters: "Mountain View, Californie, États-Unis"
    }
  },

  META: {
    symbol: "META",
    name: "Meta",
    emoji: "∞",
    tradingViewSymbol: "NASDAQ:META",
    stock: {
      currentPrice: 581.24,
      changeValue: 9.11,
      changePercent: 1.59,
      open: 580.49,
      dayHigh: 592.46,
      dayLow: 574.14,
      volume: 19450751,
      marketCap: 1843362939738,
      pe: 31.50,
      eps: 22.58
    },
    business: {
      sector: "Réseaux sociaux / IA",
      industry: "Publicité, réseaux sociaux, réalité virtuelle",
      headquarters: "Menlo Park, Californie, États-Unis"
    }
  },

  NVDA: {
    symbol: "NVDA",
    name: "Nvidia",
    emoji: "🟢",
    tradingViewSymbol: "NASDAQ:NVDA",
    stock: {
      currentPrice: 176.14,
      changeValue: 1.74,
      changePercent: 1.00,
      open: 176.00,
      dayHigh: 177.37,
      dayLow: 174.82,
      volume: 132081637,
      marketCap: 4526118000000,
      pe: 45.63,
      eps: 4.08
    },
    business: {
      sector: "Semi-conducteurs / IA",
      industry: "GPU, data centers, intelligence artificielle",
      headquarters: "Santa Clara, Californie, États-Unis"
    }
  },

  TSLA: {
    symbol: "TSLA",
    name: "Tesla",
    emoji: "⚡",
    tradingViewSymbol: "NASDAQ:TSLA",
    stock: {
      currentPrice: 380.64,
      changeValue: 8.89,
      changePercent: 2.39,
      open: 378.69,
      dayHigh: 383.09,
      dayLow: 374.18,
      volume: 48949233,
      marketCap: 1434421629916,
      pe: 282.26,
      eps: 1.45
    },
    business: {
      sector: "Automobile / Énergie",
      industry: "Véhicules électriques, batteries, énergie",
      headquarters: "Austin, Texas, États-Unis"
    }
  },

  MSFT: {
    symbol: "MSFT",
    name: "Microsoft",
    emoji: "🪟",
    tradingViewSymbol: "NASDAQ:MSFT",
    stock: {
      currentPrice: 369.22,
      changeValue: -0.95,
      changePercent: -0.26,
      open: 373.26,
      dayHigh: 376.55,
      dayLow: 368.53,
      volume: 21572655,
      marketCap: 3594446481511,
      pe: 30.14,
      eps: 15.99
    },
    business: {
      sector: "Logiciels / Cloud / IA",
      industry: "Logiciels, cloud, productivité, IA",
      headquarters: "Redmond, Washington, États-Unis"
    }
  }
};

// Compatible navigateur + Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = COMPANY_DATA;
}
if (typeof window !== "undefined") {
  window.COMPANY_DATA = COMPANY_DATA;
}