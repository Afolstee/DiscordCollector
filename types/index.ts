export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Watchlist {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  coins: WatchlistCoin[];
}

export interface WatchlistCoin {
  id: string;
  watchlistId: string;
  coinId: string;
  addedAt: Date;
}

export interface Portfolio {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  coins: PortfolioCoin[];
}

export interface PortfolioCoin {
  id: string;
  portfolioId: string;
  coinId: string;
  amount: number;
  buyPrice: number;
  buyDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoinData {
  id: string;
  coinId: string;
  name: string;
  symbol: string;
  slug: string;
  lastUpdated: Date;
}

export interface Cryptocurrency {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  num_market_pairs: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  date_added: string;
  tags: string[];
  platform: any;
  quote: {
    USD: {
      price: number;
      volume_24h: number;
      volume_change_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_60d: number;
      percent_change_90d: number;
      market_cap: number;
      market_cap_dominance: number;
      fully_diluted_market_cap: number;
      last_updated: string;
    };
  };
  urls?: {
    website?: string[];
    twitter?: string[];
    reddit?: string[];
    message_board?: string[];
    announcement?: string[];
    chat?: string[];
    explorer?: string[];
    source_code?: string[];
  };
  logo?: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChartData {
  name: string;
  value: number;
  timestamp: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercentage: number;
  coins: Array<{
    coinId: string;
    symbol: string;
    amount: number;
    currentPrice: number;
    buyPrice: number;
    currentValue: number;
    cost: number;
    gain: number;
    gainPercentage: number;
  }>;
}
