function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function normalizeScore(value, min = 0, max = 10) {
  return Math.max(min, Math.min(max, value));
}

function getHolding(portfolio, symbol) {
  if (!portfolio || !portfolio.holdings) return null;
  return portfolio.holdings[symbol] || null;
}

function computeScores(company) {
  if (!company || !company.stock) return null;

  const stock = company.stock;

  const size =
    stock.marketCap >= 3_000_000_000_000 ? 10 :
    stock.marketCap >= 2_000_000_000_000 ? 9 :
    stock.marketCap >= 1_000_000_000_000 ? 8 :
    stock.marketCap >= 500_000_000_000 ? 7 : 5;

  const profitability =
    stock.eps >= 20 ? 10 :
    stock.eps >= 12 ? 8.5 :
    stock.eps >= 8 ? 7 :
    stock.eps >= 4 ? 5.5 : 3;

  const valuation =
    stock.pe <= 20 ? 8.5 :
    stock.pe <= 30 ? 7 :
    stock.pe <= 40 ? 5.5 :
    stock.pe <= 60 ? 4 : 2;

  const momentum = normalizeScore(Math.abs(stock.changePercent) * 2.5, 1, 10);
  const intradayMove = ((stock.dayHigh - stock.dayLow) / stock.currentPrice) * 100;
  const volatility = normalizeScore(intradayMove * 2.5, 1, 10);

  const quality = Number(((size + profitability) / 2).toFixed(1));
  const risk = Number(((volatility + (10 - valuation)) / 2).toFixed(1));

  return {
    size,
    profitability,
    valuation,
    momentum,
    volatility,
    quality,
    risk
  };
}

function getPortfolioWeight(portfolio, symbol, companyData) {
  const holding = getHolding(portfolio, symbol);
  if (!holding) return 0;

  let investedTotal = 0;

  for (const key of Object.keys(portfolio.holdings || {})) {
    const h = portfolio.holdings[key];
    const company = companyData[key];
    if (!company) continue;
    investedTotal += h.quantity * company.stock.currentPrice;
  }

  if (investedTotal <= 0) return 0;

  const company = companyData[symbol];
  const value = holding.quantity * company.stock.currentPrice;
  return (value / investedTotal) * 100;
}

function getSignal(company, portfolio, companyData) {
  const scores = computeScores(company);
  const holding = getHolding(portfolio, company.symbol);
  const cash = Number(portfolio?.cash || 0);

  if (!scores) {
    return {
      signal: "Inconnu",
      confidence: 0,
      explanation: "Je ne trouve pas les données nécessaires pour analyser cette action."
    };
  }

  let signal = "Attendre";
  let confidence = 55;
  let explanation = "";

  if (!holding) {
    if (scores.quality >= 8 && scores.valuation >= 6 && scores.risk <= 5 && cash >= company.stock.currentPrice) {
      signal = "Acheter";
      confidence = 80;
      explanation = "Le titre réunit de bons fondamentaux, une valorisation encore acceptable et un risque plutôt maîtrisé.";
    } else if (scores.quality >= 7 && scores.valuation >= 5) {
      signal = "Surveiller achat";
      confidence = 70;
      explanation = "Le dossier est intéressant, mais je préférerais encore un meilleur timing d’entrée.";
    } else if (scores.risk >= 7 && scores.valuation <= 4) {
      signal = "Ne rien faire";
      confidence = 74;
      explanation = "Le titre me paraît soit trop nerveux, soit déjà trop tendu pour un achat prudent.";
    } else {
      signal = "Attendre";
      confidence = 62;
      explanation = "Le signal reste partagé : il y a des qualités, mais pas encore un avantage suffisamment net pour acheter maintenant.";
    }
  } else {
    const pnlPercent = ((company.stock.currentPrice - holding.averageBuyPrice) / holding.averageBuyPrice) * 100;
    const weight = getPortfolioWeight(portfolio, company.symbol, companyData);

    if (scores.risk >= 7 && pnlPercent > 6) {
      signal = "Vendre";
      confidence = 78;
      explanation = "Le risque me paraît élevé alors que la position est déjà gagnante, donc une prise de bénéfices peut se défendre.";
    } else if (scores.risk >= 7 || weight >= 35) {
      signal = "Surveiller vente";
      confidence = 72;
      explanation = "La ligne mérite une vraie surveillance, soit à cause de son risque, soit parce qu’elle pèse trop lourd dans le portefeuille.";
    } else if (scores.quality >= 8 && scores.risk <= 5) {
      signal = "Attendre";
      confidence = 76;
      explanation = "Le titre reste plutôt solide, donc je ne vois pas de raison urgente d’alléger maintenant.";
    } else {
      signal = "Ne rien faire";
      confidence = 60;
      explanation = "Je ne vois pas de signal d’action immédiate suffisamment fort à ce stade.";
    }
  }

  return { signal, confidence, explanation };
}

function buildConclusion(company, signalData, holdingExists) {
  if (signalData.signal === "Acheter") {
    return `Conclusion : ${company.name} peut se tenter à l’achat de façon réfléchie si tu cherches un dossier plutôt cohérent.`;
  }
  if (signalData.signal === "Vendre") {
    return `Conclusion : la vente peut se défendre ici si ton objectif est de sécuriser ta position.`;
  }
  if (signalData.signal === "Surveiller achat") {
    return `Conclusion : je garderais ${company.name} sur ma liste de surveillance plutôt que d’acheter immédiatement.`;
  }
  if (signalData.signal === "Surveiller vente") {
    return `Conclusion : je garderais cette ligne sous surveillance active avant de prendre une décision plus forte.`;
  }
  if (signalData.signal === "Attendre") {
    return holdingExists
      ? `Conclusion : je serais plutôt patient sur ${company.name} pour le moment.`
      : `Conclusion : ${company.name} a des qualités, mais pas encore un signal assez net pour acheter tout de suite.`;
  }
  return `Conclusion : à ce stade, je privilégierais la prudence sur ${company.name}.`;
}

function analyzeSingleStock(company, portfolio, companyData) {
  const holding = getHolding(portfolio, company.symbol);
  const scores = computeScores(company);
  const signalData = getSignal(company, portfolio, companyData);

  const stock = company.stock;
  const lines = [];

  lines.push(`${company.name} (${company.symbol})`);
  lines.push(`Mon avis actuel : ${signalData.signal}`);
  lines.push(`Niveau de confiance : ${signalData.confidence}%`);
  lines.push("");
  lines.push("Analyse chiffrée :");
  lines.push(`- Prix actuel : ${stock.currentPrice.toFixed(2)} $`);
  lines.push(`- Variation du jour : ${stock.changeValue >= 0 ? "+" : ""}${stock.changeValue.toFixed(2)} $ (${stock.changePercent >= 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%)`);
  lines.push(`- Plus haut / plus bas : ${stock.dayHigh.toFixed(2)} $ / ${stock.dayLow.toFixed(2)} $`);
  lines.push(`- P/E : ${stock.pe.toFixed(2)}`);
  lines.push(`- EPS : ${stock.eps.toFixed(2)}`);
  lines.push(`- Volume : ${Number(stock.volume).toLocaleString("fr-FR")}`);
  lines.push("");
  lines.push("Lecture des scores :");
  lines.push(`- Qualité globale : ${scores.quality}/10`);
  lines.push(`- Risque global : ${scores.risk}/10`);
  lines.push(`- Rentabilité : ${scores.profitability}/10`);
  lines.push(`- Valorisation : ${scores.valuation}/10`);
  lines.push(`- Momentum : ${scores.momentum.toFixed(1)}/10`);
  lines.push(`- Volatilité : ${scores.volatility.toFixed(1)}/10`);
  lines.push("");
  lines.push(`Pourquoi : ${signalData.explanation}`);

  if (holding) {
    const pnl = (stock.currentPrice - holding.averageBuyPrice) * holding.quantity;
    const pnlPct = ((stock.currentPrice - holding.averageBuyPrice) / holding.averageBuyPrice) * 100;
    lines.push("");
    lines.push("Ta position :");
    lines.push(`- Quantité : ${holding.quantity}`);
    lines.push(`- Prix moyen : ${holding.averageBuyPrice.toFixed(2)} $`);
    lines.push(`- Gain / perte latent(e) : ${pnl.toFixed(2)} $ (${pnlPct.toFixed(2)}%)`);
  }

  lines.push("");
  lines.push(buildConclusion(company, signalData, !!holding));

  return lines.join("\n");
}

function extractSymbolsFromText(text, companyData) {
  const normalized = normalizeText(text);
  const found = [];

  for (const symbol of Object.keys(companyData || {})) {
    const company = companyData[symbol];
    const name = normalizeText(company.name);

    if (normalized.includes(normalizeText(symbol)) || normalized.includes(name)) {
      found.push(symbol);
    }
  }

  return found;
}

function compareTwoStocks(companyA, companyB, portfolio, companyData) {
  const scoresA = computeScores(companyA);
  const scoresB = computeScores(companyB);

  let chosen = companyA;
  let other = companyB;

  const scoreA = scoresA.quality + scoresA.valuation - scoresA.risk;
  const scoreB = scoresB.quality + scoresB.valuation - scoresB.risk;

  if (scoreB > scoreA) {
    chosen = companyB;
    other = companyA;
  }

  return [
    `${companyA.name} (${companyA.symbol}) vs ${companyB.name} (${companyB.symbol})`,
    "",
    `Comparaison rapide :`,
    `- Qualité : ${companyA.name} ${scoresA.quality}/10 | ${companyB.name} ${scoresB.quality}/10`,
    `- Risque : ${companyA.name} ${scoresA.risk}/10 | ${companyB.name} ${scoresB.risk}/10`,
    `- Rentabilité : ${companyA.name} ${scoresA.profitability}/10 | ${companyB.name} ${scoresB.profitability}/10`,
    `- Valorisation : ${companyA.name} ${scoresA.valuation}/10 | ${companyB.name} ${scoresB.valuation}/10`,
    `- Momentum : ${companyA.name} ${scoresA.momentum.toFixed(1)}/10 | ${companyB.name} ${scoresB.momentum.toFixed(1)}/10`,
    "",
    `Si je devais choisir maintenant, je pencherais plutôt vers ${chosen.name}.`,
    `Conclusion : ${chosen.name} me paraît offrir un compromis plus cohérent que ${other.name} dans ce contexte.`
  ].join("\n");
}

function glossaryAnswer(text) {
  const normalized = normalizeText(text);

  const glossary = [
    {
      keys: ["momentum"],
      answer: "Le momentum mesure la force du mouvement actuel d’une action. Plus il est élevé, plus le titre bouge fortement en ce moment.\nConclusion : c’est utile pour voir si une action accélère ou non."
    },
    {
      keys: ["optimiste"],
      answer: "Le scénario optimiste est mon scénario le plus favorable. Il suppose que les conditions restent bonnes et que l’action évolue dans un sens positif.\nConclusion : ce n’est pas une certitude, c’est une hypothèse favorable."
    },
    {
      keys: ["prudent"],
      answer: "Le scénario prudent est mon scénario le plus défensif. Il imagine un cas moins favorable pour rester conservateur.\nConclusion : c’est le scénario où je reste le plus prudent."
    },
    {
      keys: ["neutre"],
      answer: "Le scénario neutre est mon scénario central. Il ne suppose ni très forte hausse ni forte dégradation.\nConclusion : c’est mon scénario le plus équilibré."
    },
    {
      keys: ["volatilite", "volatile"],
      answer: "La volatilité mesure à quel point le prix d’une action varie. Une action très volatile monte et descend plus brutalement.\nConclusion : plus la volatilité est élevée, plus il faut accepter des mouvements brusques."
    },
    {
      keys: ["p/e", "pe ratio", "price earnings"],
      answer: "Le P/E compare le prix de l’action à ses bénéfices. Plus il est élevé, plus le marché paie cher les bénéfices de l’entreprise.\nConclusion : c’est utile pour juger si une action paraît déjà chère ou non."
    },
    {
      keys: ["eps", "benefice par action"],
      answer: "L’EPS indique combien l’entreprise gagne pour chaque action.\nConclusion : un EPS plus élevé est généralement un point positif sur le plan fondamental."
    }
  ];

  const isDefinitionQuestion = [
    "cest quoi",
    "c est quoi",
    "que veut dire",
    "ca veut dire",
    "explique",
    "definition",
    "signifie quoi"
  ].some(trigger => normalized.includes(trigger));

  if (!isDefinitionQuestion && !normalized.endsWith("?")) return null;

  for (const item of glossary) {
    if (item.keys.some(k => normalized.includes(k))) {
      return item.answer;
    }
  }

  return null;
}

async function webFallbackAnswer(message) {
  const q = String(message || "").trim();
  if (!q) return null;

  try {
    const url = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "TradeEverythingAI/1.0"
      }
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.extract) return null;

    return `${data.extract}\nConclusion : j’ai structuré cette réponse à partir d’une source web documentaire.`;
  } catch {
    return null;
  }
}

async function answerQuestion(message, portfolio, companyData) {
  const glossary = glossaryAnswer(message);
  if (glossary) return glossary;

  const symbols = extractSymbolsFromText(message, companyData);
  const normalized = normalizeText(message);

  if (
    normalized.includes("analyse mon portefeuille") ||
    normalized.includes("resume mon portefeuille") ||
    normalized.includes("résume mon portefeuille")
  ) {
    const holdings = Object.values(portfolio?.holdings || {});
    if (!holdings.length) {
      return "Ton portefeuille est vide pour l’instant.\nConclusion : commence par surveiller les dossiers qui te paraissent les plus solides.";
    }

    const lines = [
      "Voici ma lecture rapide de ton portefeuille :",
      `- Cash disponible : ${Number(portfolio.cash || 0).toFixed(2)} $`,
      `- Nombre de lignes : ${holdings.length}`
    ];

    for (const holding of holdings) {
      const company = companyData[holding.symbol];
      if (!company) continue;
      const signalData = getSignal(company, portfolio, companyData);
      lines.push(`- ${company.name} (${company.symbol}) : ${signalData.signal} (${signalData.confidence}%) — ${signalData.explanation}`);
    }

    lines.push("Conclusion : surveille surtout les lignes les plus risquées ou trop lourdes dans ton portefeuille.");
    return lines.join("\n");
  }

  if (symbols.length >= 2) {
    return compareTwoStocks(companyData[symbols[0]], companyData[symbols[1]], portfolio, companyData);
  }

  if (symbols.length === 1) {
    return analyzeSingleStock(companyData[symbols[0]], portfolio, companyData);
  }

  const fallback = await webFallbackAnswer(message);
  if (fallback) return fallback;

  return "Je n’ai pas trouvé de réponse suffisamment fiable pour cette question.\nConclusion : reformule-la ou pose-la sur une action précise, un terme de trading, ou ton portefeuille.";
}

module.exports = {
  answerQuestion
};