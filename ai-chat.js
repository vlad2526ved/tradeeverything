function createSourceBadge(source) {
  const el = document.createElement("div");
  el.className = "source-badge";

  if (source === "web_search") {
    el.classList.add("source-web");
    el.innerText = "🌐 Source web";
  } else if (source === "knowledge_base") {
    el.classList.add("source-local");
    el.innerText = "📚 Base locale";
  } else {
    el.classList.add("source-ai");
    el.innerText = "🧠 Réponse IA";
  }

  return el;
}

function addAiMessage(text, sender = "ai", meta = {}) {
  const messages = document.getElementById("aiMessages");
  if (!messages) return;

  const bubble = document.createElement("div");
  bubble.className = sender === "user" ? "chat-bubble user" : "chat-bubble ai";

  if (sender === "ai" && meta.source) {
    bubble.appendChild(createSourceBadge(meta.source));
  }

  const content = document.createElement("div");
  content.innerText = text;
  bubble.appendChild(content);

  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

function createAiChart(data, label) {
  const messages = document.getElementById("aiMessages");
  if (!messages || typeof Chart === "undefined") return;

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble ai";

  const badge = createSourceBadge("ai_generated");
  badge.innerText = "📈 Graphique IA";
  bubble.appendChild(badge);

  const canvas = document.createElement("canvas");
  canvas.height = 180;
  bubble.appendChild(canvas);

  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;

  new Chart(canvas, {
    type: "line",
    data: {
      labels: data.map((_, i) => `T${i + 1}`),
      datasets: [{
        label,
        data,
        tension: 0.35,
        borderColor: "#ffd700",
        backgroundColor: "rgba(255,215,0,0.12)",
        fill: true,
        pointBackgroundColor: "#ffd700",
        pointBorderColor: "#ffd700"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "#fff" }
        }
      },
      scales: {
        x: {
          ticks: { color: "#ccc" },
          grid: { color: "rgba(255,255,255,0.08)" }
        },
        y: {
          ticks: { color: "#ccc" },
          grid: { color: "rgba(255,255,255,0.08)" }
        }
      }
    }
  });
}

function isWeakLocalAnswer(text) {
  if (!text) return true;

  const weakPatterns = [
    "je peux répondre à des questions de trading",
    "pose-moi une question précise",
    "je peux te répondre précisément",
    "je peux analyser ton portefeuille",
    "je peux expliquer des mots comme"
  ];

  const normalized = text.toLowerCase();
  return weakPatterns.some(pattern => normalized.includes(pattern));
}

async function askBackendAi(text, portfolio = null) {
  const response = await fetch("https://tradeeverything-ai-backend.onrender.com/ask-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: text, portfolio })
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    throw new Error("Réponse backend illisible.");
  }

  if (!response.ok || !data.ok) {
    throw new Error(data?.error || "Erreur backend inconnue");
  }

  return data;
}

function buildSimpleTrendForText(text) {
  const lower = text.toLowerCase();

  if (lower.includes("apple") || lower.includes("aapl")) {
    return { data: [240, 244, 247, 251, 255], label: "Tendance Apple simulée" };
  }

  if (lower.includes("tesla") || lower.includes("tsla")) {
    return { data: [390, 384, 381, 378, 380], label: "Tendance Tesla simulée" };
  }

  if (lower.includes("nvidia") || lower.includes("nvda")) {
    return { data: [168, 170, 172, 175, 176], label: "Tendance Nvidia simulée" };
  }

  return { data: [100, 108, 105, 115, 120], label: "Tendance simulée" };
}

async function sendAiMessage() {
  const input = document.getElementById("aiInput");
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  addAiMessage(text, "user");
  input.value = "";

  try {
    let localResponse = "";

    if (typeof aiRespond === "function") {
      localResponse = aiRespond(text);
    }

    if (localResponse && !isWeakLocalAnswer(localResponse)) {
      addAiMessage(localResponse, "ai", { source: "knowledge_base" });

      if (
        text.toLowerCase().includes("graphique") ||
        text.toLowerCase().includes("tendance") ||
        text.toLowerCase().includes("courbe")
      ) {
        const trend = buildSimpleTrendForText(text);
        createAiChart(trend.data, trend.label);
      }

      return;
    }

    // Récupérer le portfolio depuis portfolio-storage.js si disponible
    let portfolio = null;
    if (typeof getPortfolioSnapshot === "function") {
      portfolio = getPortfolioSnapshot();
    }

    const backendData = await askBackendAi(text, portfolio);
    addAiMessage(backendData.answer, "ai", {
      source: backendData.source || "ai_generated"
    });

    if (
      text.toLowerCase().includes("graphique") ||
      text.toLowerCase().includes("tendance") ||
      text.toLowerCase().includes("courbe")
    ) {
      const trend = buildSimpleTrendForText(text);
      createAiChart(trend.data, trend.label);
    }
  } catch (error) {
    console.error("Erreur IA :", error);
    addAiMessage(`Erreur backend : ${error.message}`, "ai", {
      source: "ai_generated"
    });
  }
}

function fillAiPrompt(text) {
  const input = document.getElementById("aiInput");
  if (!input) return;

  input.value = text;
  sendAiMessage();
}

function renderHomeAiSummary() {
  const summaryBox = document.getElementById("aiHomeSummary");
  if (!summaryBox) return;

  try {
    if (typeof aiGetHomeSummaryData !== "function") {
      summaryBox.innerHTML = `<div class="ai-empty">Résumé IA indisponible pour le moment.</div>`;
      return;
    }

    const data = aiGetHomeSummaryData();

    if (!data || !Array.isArray(data.analyses)) {
      summaryBox.innerHTML = `<div class="ai-empty">Résumé IA indisponible pour le moment.</div>`;
      return;
    }

    const totalProfitClass = data.totalProfit >= 0 ? "positive" : "negative";
    const totalProfitText = `${data.totalProfit >= 0 ? "+" : ""}${data.totalProfit.toFixed(2)} $`;

    let holdingsHtml = "";

    if (data.analyses.length === 0) {
      holdingsHtml = `
        <div class="ai-empty">
          Aucune action détenue pour le moment. Tu peux déjà me demander quoi surveiller, quoi acheter, ou comparer deux actions.
        </div>
      `;
    } else {
      holdingsHtml = data.analyses.map(analysis => {
        const holding = analysis.holding;
        if (!holding) return "";

        const pnl = (holding.currentPrice - holding.averageBuyPrice) * holding.quantity;
        const pnlClass = pnl >= 0 ? "positive" : "negative";
        const signalClass = typeof aiGetSignalClass === "function"
          ? aiGetSignalClass(analysis.signalData.signal)
          : "signal-neutral";

        return `
          <div class="holding-ai-card">
            <div class="holding-ai-top">
              <div>
                <div class="holding-ai-title">${analysis.company.name} (${analysis.company.symbol})</div>
                <div class="holding-ai-subtitle">${holding.quantity} action(s) · prix moyen ${holding.averageBuyPrice.toFixed(2)} $</div>
              </div>
              <div class="signal-pill ${signalClass}">
                <span class="signal-dot"></span>
                ${analysis.signalData.signal}
              </div>
            </div>

            <div class="holding-ai-metrics">
              <div>Valeur : <strong>${(holding.quantity * holding.currentPrice).toFixed(2)} $</strong></div>
              <div>P/L : <strong class="${pnlClass}">${pnl.toFixed(2)} $</strong></div>
              <div>Confiance IA : <strong>${analysis.signalData.confidence}%</strong></div>
            </div>

            <div class="holding-ai-comment">
              ${analysis.signalData.explanation}
            </div>

            <div class="holding-ai-actions">
              <button class="quick-btn" onclick="fillAiPrompt('Que penses-tu de ${analysis.company.name} ?')">Analyse</button>
              <button class="quick-btn" onclick="fillAiPrompt('Pourquoi pour ${analysis.company.name} ?')">Pourquoi ?</button>
              <button class="quick-btn" onclick="fillAiPrompt('Donne-moi les chiffres pour ${analysis.company.name}')">Les chiffres</button>
            </div>
          </div>
        `;
      }).join("");
    }

    const bestOpportunityHtml = data.bestOpportunity
      ? `
        <div class="summary-mini-card">
          <div class="summary-mini-label">Opportunité à surveiller</div>
          <div class="summary-mini-value">${data.bestOpportunity.company.name} (${data.bestOpportunity.company.symbol})</div>
          <div class="summary-mini-text">${data.bestOpportunity.signalData.explanation}</div>
        </div>
      `
      : `
        <div class="summary-mini-card">
          <div class="summary-mini-label">Opportunité à surveiller</div>
          <div class="summary-mini-text">Aucune opportunité claire détectée pour l’instant.</div>
        </div>
      `;

    const riskiestHtml = data.riskiestHolding
      ? `
        <div class="summary-mini-card danger">
          <div class="summary-mini-label">Action la plus risquée</div>
          <div class="summary-mini-value">${data.riskiestHolding.company.name} (${data.riskiestHolding.company.symbol})</div>
          <div class="summary-mini-text">${data.riskiestHolding.signalData.explanation}</div>
        </div>
      `
      : `
        <div class="summary-mini-card danger">
          <div class="summary-mini-label">Action la plus risquée</div>
          <div class="summary-mini-text">Aucune position ouverte pour le moment.</div>
        </div>
      `;

    summaryBox.innerHTML = `
      <div class="ai-summary-header">
        <div>
          <h3>📊 Résumé IA du portefeuille</h3>
          <p>Vue rapide de tes positions, des signaux actuels et des éléments à surveiller.</p>
        </div>
        <button class="ai-send-btn" onclick="fillAiPrompt('Analyse mon portefeuille')">Résumé dans le chat</button>
      </div>

      <div class="summary-stats-grid">
        <div class="summary-stat-card">
          <div class="summary-stat-label">Cash disponible</div>
          <div class="summary-stat-value">${data.cash.toFixed(2)} $</div>
        </div>

        <div class="summary-stat-card">
          <div class="summary-stat-label">Valeur investie</div>
          <div class="summary-stat-value">${data.investedValue.toFixed(2)} $</div>
        </div>

        <div class="summary-stat-card">
          <div class="summary-stat-label">Valeur totale</div>
          <div class="summary-stat-value">${data.totalValue.toFixed(2)} $</div>
        </div>

        <div class="summary-stat-card">
          <div class="summary-stat-label">Gain / Perte global</div>
          <div class="summary-stat-value ${totalProfitClass}">${totalProfitText}</div>
        </div>
      </div>

      <div class="summary-mini-grid">
        ${bestOpportunityHtml}
        ${riskiestHtml}
      </div>

      <div class="holdings-ai-grid">
        ${holdingsHtml}
      </div>
    `;
  } catch (error) {
    console.error("Erreur résumé IA :", error);
    summaryBox.innerHTML = `<div class="ai-empty">Le résumé IA n’a pas pu se charger pour le moment.</div>`;
  }
}

function initAiChat() {
  try {
    addAiMessage(
      "Bonjour. Je suis ton assistant boursier. Je peux analyser ton portefeuille, comparer deux actions, expliquer des notions de trading et répondre plus précisément à tes questions.",
      "ai",
      { source: "knowledge_base" }
    );

    const input = document.getElementById("aiInput");
    if (input) {
      input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          sendAiMessage();
        }
      });
    }

    renderHomeAiSummary();
  } catch (error) {
    console.error("Erreur initAiChat :", error);
  }
}

window.initAiChat = initAiChat;
window.sendAiMessage = sendAiMessage;
window.fillAiPrompt = fillAiPrompt;