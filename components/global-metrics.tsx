"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import {
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
} from "@/utils/format";

interface GlobalMetricsData {
  total_market_cap: {
    USD: number;
  };
  total_volume_24h: {
    USD: number;
  };
  bitcoin_dominance: number;
  active_cryptocurrencies: number;
  active_exchanges: number;
  last_updated: string;
}

export function GlobalMetrics() {
  const [data, setData] = useState<GlobalMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGlobalMetrics();
  }, []);

  const fetchGlobalMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/global-metrics");
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch global metrics");
      }
    } catch (err) {
      setError("Failed to fetch global metrics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
              <div className="h-8 bg-muted animate-pulse rounded w-3/4"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={fetchGlobalMetrics}
          className="text-primary hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Market Cap
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data?.total_market_cap?.USD || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Global cryptocurrency market capitalization
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data?.total_volume_24h?.USD || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total trading volume in the last 24 hours
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Bitcoin Dominance
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercentage(data?.bitcoin_dominance || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Bitcoin's share of total market cap
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 