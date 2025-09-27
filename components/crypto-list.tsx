"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Star, StarOff } from "lucide-react";
import {
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
} from "@/utils/format";
import { cn } from "@/utils/cn";
import type { Cryptocurrency } from "@/types";

interface CryptoListProps {
  limit?: number;
  showWatchlist?: boolean;
}

export function CryptoList({
  limit = 50,
  showWatchlist = false,
}: CryptoListProps) {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCryptos();
  }, [limit]);

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/crypto?limit=${limit}`);
      const data = await response.json();

      if (data.success) {
        setCryptos(data.data);
      } else {
        setError(data.error || "Failed to fetch cryptocurrencies");
      }
    } catch (err) {
      setError("Failed to fetch cryptocurrencies");
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = async (coinId: string) => {
    // TODO: Implement watchlist functionality
    console.log("Toggle watchlist for coin:", coinId);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-6 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchCryptos}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cryptos.map((crypto) => {
        const price = crypto.quote.USD.price;
        const change24h = crypto.quote.USD.percent_change_24h;
        const marketCap = crypto.quote.USD.market_cap;
        const volume24h = crypto.quote.USD.volume_24h;
        const isPositive = change24h >= 0;
        const isInWatchlist = watchlist.has(crypto.id.toString());

        return (
          <Card key={crypto.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-bold">
                    {crypto.symbol.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-sm">{crypto.symbol}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {crypto.name}
                    </p>
                  </div>
                </div>
                {showWatchlist && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleWatchlist(crypto.id.toString())}
                  >
                    {isInWatchlist ? (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {formatCurrency(price)}
                  </span>
                  <div
                    className={cn(
                      "flex items-center space-x-1 text-sm",
                      isPositive ? "text-positive" : "text-negative"
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{formatPercentage(change24h)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="block">Market Cap</span>
                    <span className="font-medium">
                      {formatCompactNumber(marketCap)}
                    </span>
                  </div>
                  <div>
                    <span className="block">Volume 24h</span>
                    <span className="font-medium">
                      {formatCompactNumber(volume24h)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Rank #{crypto.cmc_rank}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
