import axios from "axios";

const CMC_API_KEY = process.env.CMC_API_KEY;
const CMC_BASE_URL = "https://pro-api.coinmarketcap.com/v1";

export const cmcApi = axios.create({
  baseURL: CMC_BASE_URL,
  headers: {
    "X-CMC_PRO_API_KEY": CMC_API_KEY,
    Accept: "application/json",
  },
});

export interface CoinMarketCapResponse<T> {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
  data: T;
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

export interface CryptocurrencyListings {
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
}

export const coinMarketCapApi = {
  async getLatestListings(start = 1, limit = 100, convert = "USD") {
    const response = await cmcApi.get<
      CoinMarketCapResponse<CryptocurrencyListings[]>
    >("/cryptocurrency/listings/latest", {
      params: {
        start,
        limit,
        convert,
        sort: "market_cap",
        sort_dir: "desc",
      },
    });
    return response.data;
  },

  async getTrendingCryptocurrencies(start = 1, limit = 100, convert = "USD") {
    // Get trending cryptocurrencies based on 24h volume and price change
    const response = await cmcApi.get<
      CoinMarketCapResponse<CryptocurrencyListings[]>
    >("/cryptocurrency/listings/latest", {
      params: {
        start,
        limit,
        convert,
        sort: "percent_change_24h",
        sort_dir: "desc",
      },
    });

    // Filter trending data and get social media info
    const trendingData = response.data.data.slice(0, limit);
    
    // Get social media data for the trending cryptocurrencies
    const cryptoIds = trendingData.map((crypto) => crypto.id);
    let socialMediaData: { [key: number]: any } = {};

    if (cryptoIds.length > 0) {
      try {
        const infoResponse = await this.getCryptocurrencyInfo(cryptoIds);
        socialMediaData = infoResponse.data;
      } catch (error) {
        console.warn("Failed to fetch social media data for trending:", error);
      }
    }

    // Merge social media data with trending data
    const enrichedData = trendingData.map((crypto) => ({
      ...crypto,
      urls: socialMediaData[crypto.id]?.urls,
      logo: socialMediaData[crypto.id]?.logo,
      description: socialMediaData[crypto.id]?.description,
    }));

    return {
      ...response.data,
      data: enrichedData,
    };
  },

  async getCryptocurrencyQuotesBySymbol(symbol: string) {
    const response = await cmcApi.get<
      CoinMarketCapResponse<{ [key: string]: Cryptocurrency }>
    >("/cryptocurrency/quotes/latest", {
      params: {
        symbol,
        convert: "USD",
      },
    });
    return response.data;
  },

  async getCryptocurrencyQuotes(ids: number[]) {
    const response = await cmcApi.get<
      CoinMarketCapResponse<{ [key: string]: Cryptocurrency }>
    >("/cryptocurrency/quotes/latest", {
      params: {
        id: ids.join(","),
        convert: "USD",
      },
    });
    return response.data;
  },

  async getGlobalMetrics() {
    const response = await cmcApi.get<CoinMarketCapResponse<any>>(
      "/global-metrics/quotes/latest"
    );
    return response.data;
  },

  async getCryptocurrencyInfo(ids: number[]) {
    const response = await cmcApi.get<
      CoinMarketCapResponse<{ [key: string]: Cryptocurrency }>
    >("/cryptocurrency/info", {
      params: {
        id: ids.join(","),
      },
    });
    return response.data;
  },

  async getNewListings(start = 1, limit = 100, dateAdded = "2024-01-01") {
    // For now, get all listings and filter by date on the client side
    // This is because the date_added_min parameter might not work as expected
    const response = await cmcApi.get<
      CoinMarketCapResponse<CryptocurrencyListings[]>
    >("/cryptocurrency/listings/latest", {
      params: {
        start,
        limit: Math.min(limit * 3, 500), // Get more results to filter
        convert: "USD",
        sort: "date_added",
        sort_dir: "desc",
      },
    });

    // Filter by date on the client side
    const filteredData = response.data.data
      .filter((crypto) => {
        const cryptoDate = new Date(crypto.date_added);
        const filterDate = new Date(dateAdded);
        return cryptoDate >= filterDate;
      })
      .slice(0, limit);

    // Get social media data for the filtered cryptocurrencies
    const cryptoIds = filteredData.map((crypto) => crypto.id);
    let socialMediaData: { [key: number]: any } = {};

    if (cryptoIds.length > 0) {
      try {
        const infoResponse = await this.getCryptocurrencyInfo(cryptoIds);
        socialMediaData = infoResponse.data;
      } catch (error) {
        console.warn("Failed to fetch social media data:", error);
      }
    }

    // Merge social media data with listing data
    const enrichedData = filteredData.map((crypto) => ({
      ...crypto,
      urls: socialMediaData[crypto.id]?.urls,
      logo: socialMediaData[crypto.id]?.logo,
      description: socialMediaData[crypto.id]?.description,
    }));

    return {
      ...response.data,
      data: enrichedData,
    };
  },

  async getNewListingsByDateRange(
    start = 1,
    limit = 100,
    dateAddedStart: string,
    dateAddedEnd?: string
  ) {
    // Get all listings and filter by date range on the client side
    const response = await cmcApi.get<
      CoinMarketCapResponse<CryptocurrencyListings[]>
    >("/cryptocurrency/listings/latest", {
      params: {
        start,
        limit: Math.min(limit * 3, 500), // Get more results to filter
        convert: "USD",
        sort: "date_added",
        sort_dir: "desc",
      },
    });

    // Filter by date range on the client side
    const filteredData = response.data.data
      .filter((crypto) => {
        const cryptoDate = new Date(crypto.date_added);
        const startDate = new Date(dateAddedStart);
        const endDate = dateAddedEnd ? new Date(dateAddedEnd) : new Date();

        return cryptoDate >= startDate && cryptoDate <= endDate;
      })
      .slice(0, limit);

    // Get social media data for the filtered cryptocurrencies
    const cryptoIds = filteredData.map((crypto) => crypto.id);
    let socialMediaData: { [key: number]: any } = {};

    if (cryptoIds.length > 0) {
      try {
        const infoResponse = await this.getCryptocurrencyInfo(cryptoIds);
        socialMediaData = infoResponse.data;
      } catch (error) {
        console.warn("Failed to fetch social media data:", error);
      }
    }

    // Merge social media data with listing data
    const enrichedData = filteredData.map((crypto) => ({
      ...crypto,
      urls: socialMediaData[crypto.id]?.urls,
      logo: socialMediaData[crypto.id]?.logo,
      description: socialMediaData[crypto.id]?.description,
    }));

    return {
      ...response.data,
      data: enrichedData,
    };
  },
};
