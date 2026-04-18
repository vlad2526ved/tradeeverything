const STORAGE_KEY = "tradeeverything_portfolio";

const DEFAULT_PORTFOLIO = {
  cash: 10000,
  holdings: {}, 
  transactions: []
};

/*
Structure holdings :
{
  "AAPL": {
    symbol: "AAPL",
    name: "Apple",
    quantity: 3,
    averageBuyPrice: 261.78,
    currentPrice: 261.78
  }
}
*/

function getPortfolio() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PORTFOLIO));
    return structuredClone(DEFAULT_PORTFOLIO);
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Erreur lecture localStorage :", error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PORTFOLIO));
    return structuredClone(DEFAULT_PORTFOLIO);
  }
}

function savePortfolio(portfolio) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
}

function resetPortfolio() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PORTFOLIO));
}

function buyStock(symbol, name, price, quantity = 1) {
  const portfolio = getPortfolio();
  const totalCost = price * quantity;

  if (portfolio.cash < totalCost) {
    return {
      success: false,
      message: "Fonds insuffisants."
    };
  }

  portfolio.cash -= totalCost;

  if (!portfolio.holdings[symbol]) {
    portfolio.holdings[symbol] = {
      symbol,
      name,
      quantity: 0,
      averageBuyPrice: 0,
      currentPrice: price
    };
  }

  const stock = portfolio.holdings[symbol];

  const oldTotalValue = stock.quantity * stock.averageBuyPrice;
  const newTotalValue = oldTotalValue + totalCost;
  const newQuantity = stock.quantity + quantity;

  stock.quantity = newQuantity;
  stock.averageBuyPrice = newTotalValue / newQuantity;
  stock.currentPrice = price;

  portfolio.transactions.push({
    type: "BUY",
    symbol,
    name,
    price,
    quantity,
    total: totalCost,
    date: new Date().toISOString()
  });

  savePortfolio(portfolio);

  return {
    success: true,
    message: `${quantity} action(s) ${symbol} achetée(s).`
  };
}

function sellStock(symbol, price, quantity = 1) {
  const portfolio = getPortfolio();
  const stock = portfolio.holdings[symbol];

  if (!stock) {
    return {
      success: false,
      message: "Cette action n'existe pas dans le portefeuille."
    };
  }

  if (stock.quantity < quantity) {
    return {
      success: false,
      message: "Quantité insuffisante."
    };
  }

  const totalGain = price * quantity;

  stock.quantity -= quantity;
  stock.currentPrice = price;
  portfolio.cash += totalGain;

  portfolio.transactions.push({
    type: "SELL",
    symbol,
    name: stock.name,
    price,
    quantity,
    total: totalGain,
    date: new Date().toISOString()
  });

  if (stock.quantity === 0) {
    delete portfolio.holdings[symbol];
  }

  savePortfolio(portfolio);

  return {
    success: true,
    message: `${quantity} action(s) ${symbol} vendue(s).`
  };
}

function updateStockPrice(symbol, price) {
  const portfolio = getPortfolio();

  if (portfolio.holdings[symbol]) {
    portfolio.holdings[symbol].currentPrice = price;
    savePortfolio(portfolio);
  }
}

function getPortfolioValue() {
  const portfolio = getPortfolio();

  let investedValue = 0;

  for (const symbol in portfolio.holdings) {
    const stock = portfolio.holdings[symbol];
    investedValue += stock.quantity * stock.currentPrice;
  }

  return portfolio.cash + investedValue;
}

function getInvestedValue() {
  const portfolio = getPortfolio();

  let investedValue = 0;

  for (const symbol in portfolio.holdings) {
    const stock = portfolio.holdings[symbol];
    investedValue += stock.quantity * stock.currentPrice;
  }

  return investedValue;
}

function getTotalProfitLoss() {
  const portfolio = getPortfolio();

  let totalCurrentValue = 0;
  let totalBuyValue = 0;

  for (const symbol in portfolio.holdings) {
    const stock = portfolio.holdings[symbol];
    totalCurrentValue += stock.quantity * stock.currentPrice;
    totalBuyValue += stock.quantity * stock.averageBuyPrice;
  }

  return totalCurrentValue - totalBuyValue;
}

// Export pour usage global (ai-chat.js)
function getPortfolioSnapshot() {
  return getPortfolio();
}

window.getPortfolio = getPortfolio;
window.getPortfolioSnapshot = getPortfolioSnapshot;
window.savePortfolio = savePortfolio;
window.buyStock = buyStock;
window.sellStock = sellStock;