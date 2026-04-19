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
  },

  NFLX: {
    symbol: "NFLX",
    name: "Netflix",
    emoji: "🎬",
    tradingViewSymbol: "NASDAQ:NFLX",
    stock: {
      currentPrice: 895.50,
      changeValue: 12.30,
      changePercent: 1.39,
      open: 885.00,
      dayHigh: 898.20,
      dayLow: 882.10,
      volume: 3245678,
      marketCap: 385000000000,
      pe: 45.20,
      eps: 19.82
    },
    business: {
      sector: "Divertissement / Streaming",
      industry: "Streaming vidéo, production de contenu",
      headquarters: "Los Gatos, Californie, États-Unis"
    }
  },

  DIS: {
    symbol: "DIS",
    name: "Disney",
    emoji: "🏰",
    tradingViewSymbol: "NYSE:DIS",
    stock: {
      currentPrice: 112.45,
      changeValue: -1.25,
      changePercent: -1.10,
      open: 113.50,
      dayHigh: 114.20,
      dayLow: 111.80,
      volume: 8765432,
      marketCap: 205000000000,
      pe: 38.50,
      eps: 2.92
    },
    business: {
      sector: "Divertissement / Médias",
      industry: "Parcs d'attractions, cinéma, streaming",
      headquarters: "Burbank, Californie, États-Unis"
    }
  },

  V: {
    symbol: "V",
    name: "Visa",
    emoji: "💳",
    tradingViewSymbol: "NYSE:V",
    stock: {
      currentPrice: 278.90,
      changeValue: 3.45,
      changePercent: 1.25,
      open: 276.00,
      dayHigh: 280.15,
      dayLow: 275.50,
      volume: 5432109,
      marketCap: 575000000000,
      pe: 32.10,
      eps: 8.69
    },
    business: {
      sector: "Finance / Paiements",
      industry: "Services de paiement électronique",
      headquarters: "San Francisco, Californie, États-Unis"
    }
  },

  MA: {
    symbol: "MA",
    name: "Mastercard",
    emoji: "💰",
    tradingViewSymbol: "NYSE:MA",
    stock: {
      currentPrice: 485.20,
      changeValue: 5.80,
      changePercent: 1.21,
      open: 480.50,
      dayHigh: 487.30,
      dayLow: 479.00,
      volume: 3210987,
      marketCap: 455000000000,
      pe: 35.80,
      eps: 13.55
    },
    business: {
      sector: "Finance / Paiements",
      industry: "Services de paiement électronique",
      headquarters: "Purchase, New York, États-Unis"
    }
  },

  KO: {
    symbol: "KO",
    name: "Coca-Cola",
    emoji: "🥤",
    tradingViewSymbol: "NYSE:KO",
    stock: {
      currentPrice: 62.35,
      changeValue: 0.45,
      changePercent: 0.73,
      open: 62.00,
      dayHigh: 62.80,
      dayLow: 61.75,
      volume: 12345678,
      marketCap: 269000000000,
      pe: 26.40,
      eps: 2.36
    },
    business: {
      sector: "Consommation / Boissons",
      industry: "Boissons non alcoolisées",
      headquarters: "Atlanta, Géorgie, États-Unis"
    }
  },

  PEP: {
    symbol: "PEP",
    name: "PepsiCo",
    emoji: "🥤",
    tradingViewSymbol: "NASDAQ:PEP",
    stock: {
      currentPrice: 158.70,
      changeValue: -0.80,
      changePercent: -0.50,
      open: 159.20,
      dayHigh: 160.10,
      dayLow: 158.00,
      volume: 4567890,
      marketCap: 218000000000,
      pe: 24.90,
      eps: 6.37
    },
    business: {
      sector: "Consommation / Alimentation",
      industry: "Boissons, snacks, alimentation",
      headquarters: "Purchase, New York, États-Unis"
    }
  },

  MCD: {
    symbol: "MCD",
    name: "McDonald's",
    emoji: "🍔",
    tradingViewSymbol: "NYSE:MCD",
    stock: {
      currentPrice: 295.80,
      changeValue: 2.10,
      changePercent: 0.71,
      open: 294.00,
      dayHigh: 297.50,
      dayLow: 293.20,
      volume: 2876543,
      marketCap: 215000000000,
      pe: 25.60,
      eps: 11.55
    },
    business: {
      sector: "Restauration / Fast-food",
      industry: "Restauration rapide",
      headquarters: "Chicago, Illinois, États-Unis"
    }
  },

  NKE: {
    symbol: "NKE",
    name: "Nike",
    emoji: "👟",
    tradingViewSymbol: "NYSE:NKE",
    stock: {
      currentPrice: 78.45,
      changeValue: -1.15,
      changePercent: -1.44,
      open: 79.50,
      dayHigh: 80.20,
      dayLow: 77.90,
      volume: 6543210,
      marketCap: 118000000000,
      pe: 28.30,
      eps: 2.77
    },
    business: {
      sector: "Textile / Sport",
      industry: "Chaussures, vêtements de sport",
      headquarters: "Beaverton, Oregon, États-Unis"
    }
  },

  INTC: {
    symbol: "INTC",
    name: "Intel",
    emoji: "💻",
    tradingViewSymbol: "NASDAQ:INTC",
    stock: {
      currentPrice: 21.85,
      changeValue: 0.35,
      changePercent: 1.63,
      open: 21.50,
      dayHigh: 22.10,
      dayLow: 21.30,
      volume: 45678901,
      marketCap: 92000000000,
      pe: -12.50,
      eps: -1.75
    },
    business: {
      sector: "Semi-conducteurs",
      industry: "Processeurs, puces électroniques",
      headquarters: "Santa Clara, Californie, États-Unis"
    }
  },

  AMD: {
    symbol: "AMD",
    name: "AMD",
    emoji: "🔴",
    tradingViewSymbol: "NASDAQ:AMD",
    stock: {
      currentPrice: 118.60,
      changeValue: 4.20,
      changePercent: 3.67,
      open: 115.00,
      dayHigh: 119.80,
      dayLow: 114.50,
      volume: 56789012,
      marketCap: 192000000000,
      pe: 52.30,
      eps: 2.27
    },
    business: {
      sector: "Semi-conducteurs",
      industry: "Processeurs, GPU, data centers",
      headquarters: "Santa Clara, Californie, États-Unis"
    }
  },

  QCOM: {
    symbol: "QCOM",
    name: "Qualcomm",
    emoji: "📱",
    tradingViewSymbol: "NASDAQ:QCOM",
    stock: {
      currentPrice: 168.90,
      changeValue: 2.75,
      changePercent: 1.65,
      open: 166.50,
      dayHigh: 170.20,
      dayLow: 165.80,
      volume: 7890123,
      marketCap: 188000000000,
      pe: 18.90,
      eps: 8.94
    },
    business: {
      sector: "Semi-conducteurs / Télécom",
      industry: "Puces mobiles, 5G, technologies sans fil",
      headquarters: "San Diego, Californie, États-Unis"
    }
  },

  CRM: {
    symbol: "CRM",
    name: "Salesforce",
    emoji: "☁️",
    tradingViewSymbol: "NYSE:CRM",
    stock: {
      currentPrice: 272.40,
      changeValue: -3.60,
      changePercent: -1.30,
      open: 275.50,
      dayHigh: 277.80,
      dayLow: 270.90,
      volume: 4321098,
      marketCap: 265000000000,
      pe: 48.20,
      eps: 5.65
    },
    business: {
      sector: "Logiciels / Cloud",
      industry: "CRM, logiciels d'entreprise, cloud",
      headquarters: "San Francisco, Californie, États-Unis"
    }
  },

  ORCL: {
    symbol: "ORCL",
    name: "Oracle",
    emoji: "🔶",
    tradingViewSymbol: "NYSE:ORCL",
    stock: {
      currentPrice: 138.25,
      changeValue: 1.85,
      changePercent: 1.36,
      open: 136.50,
      dayHigh: 139.40,
      dayLow: 135.90,
      volume: 6789012,
      marketCap: 378000000000,
      pe: 36.70,
      eps: 3.77
    },
    business: {
      sector: "Logiciels / Cloud",
      industry: "Bases de données, cloud, logiciels d'entreprise",
      headquarters: "Austin, Texas, États-Unis"
    }
  },

  IBM: {
    symbol: "IBM",
    name: "IBM",
    emoji: "🔵",
    tradingViewSymbol: "NYSE:IBM",
    stock: {
      currentPrice: 195.60,
      changeValue: 0.90,
      changePercent: 0.46,
      open: 194.80,
      dayHigh: 196.75,
      dayLow: 194.20,
      volume: 3456789,
      marketCap: 179000000000,
      pe: 22.80,
      eps: 8.58
    },
    business: {
      sector: "Technologie / Services IT",
      industry: "Services IT, cloud, IA, conseil",
      headquarters: "Armonk, New York, États-Unis"
    }
  },

  AVGO: {
    symbol: "AVGO",
    name: "Broadcom",
    emoji: "🔘",
    tradingViewSymbol: "NASDAQ:AVGO",
    stock: {
      currentPrice: 1685.30,
      changeValue: 25.40,
      changePercent: 1.53,
      open: 1665.00,
      dayHigh: 1692.50,
      dayLow: 1658.20,
      volume: 1234567,
      marketCap: 785000000000,
      pe: 58.40,
      eps: 28.86
    },
    business: {
      sector: "Semi-conducteurs",
      industry: "Puces, réseaux, logiciels d'infrastructure",
      headquarters: "Palo Alto, Californie, États-Unis"
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