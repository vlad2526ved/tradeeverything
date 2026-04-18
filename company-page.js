function formatMoney(value) {
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " $";
}

function formatInteger(value) {
  return value.toLocaleString("fr-FR");
}

function formatMarketCap(value) {
  if (value >= 1_000_000_000_000) {
    return (value / 1_000_000_000_000).toFixed(2) + " T$";
  }
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2) + " Md$";
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + " M$";
  }
  return formatInteger(value) + " $";
}

function getDayRangePercent(stock) {
  const range = stock.dayHigh - stock.dayLow;
  if (range <= 0) return 50;
  return ((stock.currentPrice - stock.dayLow) / range) * 100;
}

function getVolatilityScore(stock) {
  const intradayMove = ((stock.dayHigh - stock.dayLow) / stock.currentPrice) * 100;
  return Math.min(10, Math.max(1, intradayMove * 2.5));
}

function getMomentumScore(stock) {
  return Math.min(10, Math.max(1, Math.abs(stock.changePercent) * 2.5));
}

function getValuationScore(stock) {
  if (stock.pe <= 20) return 8.5;
  if (stock.pe <= 30) return 7;
  if (stock.pe <= 40) return 5.5;
  if (stock.pe <= 60) return 4;
  return 2;
}

function getProfitabilityScore(stock) {
  if (stock.eps >= 20) return 10;
  if (stock.eps >= 12) return 8.5;
  if (stock.eps >= 8) return 7;
  if (stock.eps >= 4) return 5.5;
  return 3;
}

function getSizeScore(stock) {
  if (stock.marketCap >= 3_000_000_000_000) return 10;
  if (stock.marketCap >= 2_000_000_000_000) return 9;
  if (stock.marketCap >= 1_000_000_000_000) return 8;
  if (stock.marketCap >= 500_000_000_000) return 7;
  return 5;
}

function getScoreLabel(score) {
  if (score >= 8.5) return "Excellent";
  if (score >= 7) return "Solide";
  if (score >= 5.5) return "Correct";
  if (score >= 4) return "Fragile";
  return "Faible";
}

function getScoreColorClass(score) {
  if (score >= 7) return "score-good";
  if (score >= 5) return "score-medium";
  return "score-bad";
}

function getProfileSummary(size, profitability, valuation, momentum, volatility) {
  if (size >= 8 && profitability >= 7 && volatility <= 5) {
    return "Profil plutôt robuste : grande entreprise, rentable, avec un comportement de marché relativement maîtrisé.";
  }

  if (momentum >= 7 && volatility >= 7) {
    return "Profil dynamique mais nerveux : le titre attire l’attention du marché, avec plus de potentiel de mouvement mais aussi plus de risque.";
  }

  if (valuation <= 4 && profitability >= 7) {
    return "Entreprise de qualité, mais valorisation tendue : le marché paie déjà cher sa solidité.";
  }

  if (profitability <= 4 && volatility >= 6) {
    return "Profil plus spéculatif : la qualité fondamentale paraît plus faible et le comportement boursier plus instable.";
  }

  return "Profil intermédiaire : le titre montre un mélange d’atouts et de points de vigilance à surveiller.";
}

function renderDetailedScoreCard(title, description, explanation, score) {
  const percent = Math.max(0, Math.min(100, score * 10));
  const colorClass = getScoreColorClass(score);
  const label = getScoreLabel(score);

  return `
    <div class="score-card ${colorClass}">
      <div class="score-card-top">
        <div>
          <h3>${title}</h3>
          <div class="score-badge ${colorClass}">${label}</div>
        </div>
        <div class="score-big-value">${score.toFixed(1)}/10</div>
      </div>

      <p class="score-desc">${description}</p>
      <p class="score-explain">${explanation}</p>

      <div class="score-progress">
        <div class="score-progress-fill ${colorClass}" style="width:${percent}%;"></div>
      </div>
    </div>
  `;
}

function renderCompanyInfo(symbol) {
  const company = COMPANY_DATA[symbol];
  const stock = company.stock;
  const business = company.business;

  const changeClass = stock.changePercent >= 0 ? "positive" : "negative";
  const changeSign = stock.changePercent >= 0 ? "+" : "";

  document.getElementById("companyTitle").innerHTML =
    `${company.emoji} ${company.name} (${company.symbol})`;

  document.getElementById("price").innerText = formatMoney(stock.currentPrice);
  document.getElementById("price").className =
    `price-box ${stock.changePercent >= 0 ? "positive" : "negative"}`;

  document.getElementById("change").innerText =
    `${changeSign}${stock.changeValue.toFixed(2)} $ (${changeSign}${stock.changePercent.toFixed(2)}%)`;

  document.getElementById("change").className = `change ${changeClass}`;

  const dayPosition = getDayRangePercent(stock);

  document.getElementById("companyInfo").innerHTML = `
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Prix actuel</div>
        <div class="metric-value">${formatMoney(stock.currentPrice)}</div>
      </div>

      <div class="metric-card">
        <div class="metric-label">Variation du jour</div>
        <div class="metric-value ${changeClass}">
          ${changeSign}${stock.changePercent.toFixed(2)}%
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-label">Ouverture</div>
        <div class="metric-value">${formatMoney(stock.open)}</div>
      </div>

      <div class="metric-card">
        <div class="metric-label">Volume</div>
        <div class="metric-value">${formatInteger(stock.volume)}</div>
      </div>

      <div class="metric-card">
        <div class="metric-label">Market Cap</div>
        <div class="metric-value">${formatMarketCap(stock.marketCap)}</div>
      </div>

      <div class="metric-card">
        <div class="metric-label">P/E</div>
        <div class="metric-value">${stock.pe.toFixed(2)}</div>
      </div>

      <div class="metric-card">
        <div class="metric-label">EPS</div>
        <div class="metric-value">${stock.eps.toFixed(2)}</div>
      </div>

      <div class="metric-card">
        <div class="metric-label">Fourchette du jour</div>
        <div class="metric-value">${formatMoney(stock.dayLow)} → ${formatMoney(stock.dayHigh)}</div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-card">
        <h3>Lecture boursière</h3>
        <p><strong>Secteur :</strong> ${business.sector}</p>
        <p><strong>Industrie :</strong> ${business.industry}</p>
        <p><strong>Siège :</strong> ${business.headquarters}</p>
        <p><strong>Performance jour :</strong> <span class="${changeClass}">
          ${changeSign}${stock.changeValue.toFixed(2)} $ (${changeSign}${stock.changePercent.toFixed(2)}%)
        </span></p>
      </div>

      <div class="info-card">
        <h3>Position dans la séance</h3>
        <p>Le prix actuel est placé dans la fourchette entre le plus bas et le plus haut du jour.</p>
        <div class="range-box">
          <div class="range-labels">
            <span>${formatMoney(stock.dayLow)}</span>
            <span>${formatMoney(stock.dayHigh)}</span>
          </div>
          <div class="range-bar">
            <div class="range-fill" style="width:${dayPosition}%;"></div>
            <div class="range-marker" style="left:calc(${dayPosition}% - 7px);"></div>
          </div>
          <div class="range-current">Prix actuel : ${formatMoney(stock.currentPrice)}</div>
        </div>
      </div>

      <div class="info-card">
        <h3>Interprétation rapide</h3>
        <p><strong>P/E :</strong> donne une idée de la valorisation du titre.</p>
        <p><strong>EPS :</strong> bénéfice par action.</p>
        <p><strong>Volume :</strong> intensité des échanges.</p>
        <p><strong>Range du jour :</strong> niveau de mouvement intraday.</p>
      </div>

      <div class="info-card">
        <h3>Résumé investisseur</h3>
        <p>Cette page met l’accent sur les métriques de marché les plus utiles pour lire rapidement une action : prix, variation, taille, valorisation, rentabilité et activité du jour.</p>
      </div>
    </div>
  `;
}

function renderRadarChart(symbol) {
  const company = COMPANY_DATA[symbol];
  const stock = company.stock;

  const ctx = document.getElementById("radarChart");

  new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Taille", "Rentabilité", "Valorisation", "Momentum", "Volatilité"],
      datasets: [{
        label: company.name,
        data: [
          getSizeScore(stock),
          getProfitabilityScore(stock),
          getValuationScore(stock),
          getMomentumScore(stock),
          getVolatilityScore(stock)
        ],
        borderColor: "#ffd700",
        backgroundColor: "rgba(255,215,0,0.15)",
        borderWidth: 2,
        pointBackgroundColor: "#ffd700"
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            color: "#ccc",
            backdropColor: "transparent"
          },
          grid: {
            color: "rgba(255,255,255,0.1)"
          },
          angleLines: {
            color: "rgba(255,255,255,0.1)"
          },
          pointLabels: {
            color: "#fff"
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: "#fff"
          }
        }
      }
    }
  });
}

function renderBarChart(symbol) {
  const company = COMPANY_DATA[symbol];
  const stock = company.stock;

  const ctx = document.getElementById("barChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Prix", "Ouverture", "Plus haut", "Plus bas", "EPS"],
      datasets: [{
        label: company.symbol,
        data: [
          stock.currentPrice,
          stock.open,
          stock.dayHigh,
          stock.dayLow,
          stock.eps
        ],
        backgroundColor: [
          "rgba(255,215,0,0.75)",
          "rgba(0,191,255,0.75)",
          "rgba(0,255,136,0.75)",
          "rgba(255,77,77,0.75)",
          "rgba(186,85,211,0.75)"
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: { color: "#fff" },
          grid: { color: "rgba(255,255,255,0.08)" }
        },
        y: {
          ticks: { color: "#fff" },
          grid: { color: "rgba(255,255,255,0.08)" }
        }
      },
      plugins: {
        legend: {
          labels: { color: "#fff" }
        }
      }
    }
  });
}

function renderMiniPriceStructureChart(symbol) {
  const company = COMPANY_DATA[symbol];
  const stock = company.stock;
  const ctx = document.getElementById("structureChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Plus bas", "Ouverture", "Actuel", "Plus haut"],
      datasets: [{
        label: "Structure séance",
        data: [stock.dayLow, stock.open, stock.currentPrice, stock.dayHigh],
        borderColor: "#00ff88",
        backgroundColor: "rgba(0,255,136,0.15)",
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: { color: "#fff" },
          grid: { color: "rgba(255,255,255,0.08)" }
        },
        y: {
          ticks: { color: "#fff" },
          grid: { color: "rgba(255,255,255,0.08)" }
        }
      },
      plugins: {
        legend: {
          labels: { color: "#fff" }
        }
      }
    }
  });
}

function renderScoreDetails(symbol) {
  const company = COMPANY_DATA[symbol];
  const stock = company.stock;

  const size = getSizeScore(stock);
  const profitability = getProfitabilityScore(stock);
  const valuation = getValuationScore(stock);
  const momentum = getMomentumScore(stock);
  const volatility = getVolatilityScore(stock);

  const quality = Number(((size + profitability) / 2).toFixed(1));
  const risk = Number(((volatility + (10 - valuation)) / 2).toFixed(1));
  const summary = getProfileSummary(size, profitability, valuation, momentum, volatility);

  document.getElementById("scoreDetails").innerHTML = `
    <div class="analysis-hero">
      <div class="analysis-hero-left">
        <div class="analysis-kicker">Analyse avancée du profil boursier</div>
        <h3 class="analysis-title">Comment lire cette action rapidement</h3>
        <p class="analysis-summary">${summary}</p>
      </div>

      <div class="analysis-hero-right">
        <div class="analysis-mini-card">
          <span>Qualité globale</span>
          <strong>${quality}/10</strong>
        </div>
        <div class="analysis-mini-card danger">
          <span>Risque global</span>
          <strong>${risk}/10</strong>
        </div>
      </div>
    </div>

    <div class="score-grid">
      ${renderDetailedScoreCard(
        "Taille",
        "Puissance boursière de l’entreprise.",
        "Cette note dépend surtout de la capitalisation. Plus elle est élevée, plus l’entreprise pèse lourd sur le marché et inspire souvent une impression de solidité.",
        size
      )}

      ${renderDetailedScoreCard(
        "Rentabilité",
        "Capacité à gagner de l’argent.",
        "Cette lecture s’appuie ici sur l’EPS. Une note élevée suggère qu’une entreprise génère davantage de bénéfice par action, ce qui renforce sa qualité fondamentale.",
        profitability
      )}

      ${renderDetailedScoreCard(
        "Valorisation",
        "Niveau de prix de l’action par rapport à ses bénéfices.",
        "Cette note repose sur le P/E. Une note élevée signifie généralement une valorisation plus raisonnable, tandis qu’une note basse peut indiquer un titre déjà très cher.",
        valuation
      )}

      ${renderDetailedScoreCard(
        "Momentum",
        "Force du mouvement actuel du titre.",
        "Cette note mesure à quel point l’action bouge en ce moment. Un momentum élevé peut attirer l’intérêt du marché, mais aussi signaler une phase plus agitée.",
        momentum
      )}

      ${renderDetailedScoreCard(
        "Volatilité",
        "Niveau de nervosité du titre.",
        "Cette note s’appuie sur l’amplitude de la séance. Plus elle est élevée, plus le titre est remuant, ce qui peut être intéressant mais aussi plus risqué.",
        volatility
      )}

      ${renderDetailedScoreCard(
        "Qualité globale",
        "Synthèse entre taille et rentabilité.",
        "Cette note résume la puissance boursière et la qualité bénéficiaire de l’entreprise. Elle donne une lecture rapide de la robustesse générale du dossier.",
        quality
      )}

      ${renderDetailedScoreCard(
        "Risque global",
        "Lecture simplifiée du niveau de risque.",
        "Cette note combine la volatilité et la tension de valorisation. Plus elle monte, plus il faut surveiller le comportement du titre avec prudence.",
        risk
      )}
    </div>

    <div class="analysis-footer">
      <div class="analysis-footer-card">
        <h4>Comment utiliser cette section</h4>
        <p>Lis d’abord la qualité globale et le risque global, puis regarde si le momentum et la volatilité confirment un titre calme, solide, ou plus spéculatif.</p>
      </div>

      <div class="analysis-footer-card">
        <h4>Lecture pratique</h4>
        <p>Une action peut être excellente mais chère. Une autre peut être moins chère mais plus fragile. Le but ici est de comprendre le profil du titre, pas seulement son prix.</p>
      </div>
    </div>
  `;
}

function initTradingView(symbol) {
  const company = COMPANY_DATA[symbol];

  new TradingView.widget({
    width: "100%",
    height: 500,
    symbol: company.tradingViewSymbol,
    interval: "D",
    theme: "dark",
    style: "1",
    locale: "fr",
    toolbar_bg: "#111",
    enable_publishing: false,
    container_id: "tradingview_chart"
  });
}

function renderCompanyPage(symbol) {
  renderCompanyInfo(symbol);
  initTradingView(symbol);
  renderRadarChart(symbol);
  renderBarChart(symbol);
  renderMiniPriceStructureChart(symbol);
  renderScoreDetails(symbol);
}