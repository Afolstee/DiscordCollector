"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  RefreshCw,
  ExternalLink,
  Twitter,
  Globe,
  Github,
  MessageCircle,
} from "lucide-react";
import {
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
  formatDate,
} from "@/utils/format";
import { cn } from "@/utils/cn";
import type { Cryptocurrency } from "@/types";

interface NewListingsProps {
  limit?: number;
  showFilters?: boolean;
}

export function NewListings({
  limit = 50,
  showFilters = true,
}: NewListingsProps) {
  const [listings, setListings] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    dateAdded: "",
    dateAddedStart: "",
    dateAddedEnd: "",
  });

  useEffect(() => {
    fetchNewListings();
  }, [limit]);

  // Separate effect for filters to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchNewListings();
    }, 500); // Debounce filter changes

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const fetchNewListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: limit.toString(),
      });

      // Add date filters if they exist
      if (filters.dateAdded) {
        params.append("dateAdded", filters.dateAdded);
      } else if (filters.dateAddedStart) {
        params.append("dateAddedStart", filters.dateAddedStart);
        if (filters.dateAddedEnd) {
          params.append("dateAddedEnd", filters.dateAddedEnd);
        }
      }

      // Updated to match your API endpoint structure
      const response = await fetch(`/api/new-listings?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Ensure we have an array and handle potential data structure issues
        const listingsData = Array.isArray(data.data) ? data.data : [];
        setListings(listingsData);

        if (listingsData.length === 0) {
          setError("No new listings found for the selected criteria.");
        }
      } else {
        setError(data.error || data.message || "Failed to fetch new listings");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch new listings");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => {
      // Clear conflicting filters
      if (key === "dateAdded" && value) {
        return {
          ...prev,
          [key]: value,
          dateAddedStart: "",
          dateAddedEnd: "",
        };
      } else if (
        (key === "dateAddedStart" || key === "dateAddedEnd") &&
        value
      ) {
        return {
          ...prev,
          [key]: value,
          dateAdded: "",
        };
      }
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      dateAdded: "",
      dateAddedStart: "",
      dateAddedEnd: "",
    });
  };

  const retryFetch = () => {
    fetchNewListings();
  };

  // Function to get social media links from CMC data
  const getSocialMediaLinks = (crypto: Cryptocurrency) => {
    const urls = crypto.urls || {};

    // Helper function to find Discord links in chat array
    const findDiscordLink = (chatArray: string[] | undefined) => {
      if (!chatArray) return null;
      return (
        chatArray.find(
          (link) =>
            link.includes("discord.gg") ||
            link.includes("discord.com") ||
            link.includes("discordapp.com")
        ) || null
      );
    };

    // Helper function to find Telegram links in chat array
    const findTelegramLink = (chatArray: string[] | undefined) => {
      if (!chatArray) return null;
      return (
        chatArray.find(
          (link) => link.includes("t.me") || link.includes("telegram.me")
        ) || null
      );
    };

    return {
      website:
        urls.website?.[0] ||
        `https://coinmarketcap.com/currencies/${crypto.slug}`,
      twitter: urls.twitter?.[0] || null,
      reddit: urls.reddit?.[0] || null,
      telegram: findTelegramLink(urls.chat) || null,
      discord: findDiscordLink(urls.chat) || null,
      github: urls.source_code?.[0] || null,
      explorer: urls.explorer?.[0] || null,
      announcement: urls.announcement?.[0] || null,
    };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {showFilters && (
          <div className="flex gap-4 p-4 bg-muted/50 rounded-lg animate-pulse">
            <div className="h-10 bg-muted rounded w-32"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        )}
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
      </div>
    );
  }

  if (error && listings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <div className="flex gap-2 justify-center">
          <Button onClick={retryFetch} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          {(filters.dateAdded ||
            filters.dateAddedStart ||
            filters.dateAddedEnd) && (
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter New Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Specific Date
                </label>
                <input
                  type="date"
                  value={filters.dateAdded}
                  onChange={(e) =>
                    handleFilterChange("dateAdded", e.target.value)
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  max={new Date().toISOString().split("T")[0]} // Prevent future dates
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Filter by exact date added
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.dateAddedStart}
                  onChange={(e) =>
                    handleFilterChange("dateAddedStart", e.target.value)
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.dateAddedEnd}
                  onChange={(e) =>
                    handleFilterChange("dateAddedEnd", e.target.value)
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  min={filters.dateAddedStart || undefined}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={fetchNewListings}
                size="sm"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
                Apply Filters
              </Button>
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                disabled={
                  !filters.dateAdded &&
                  !filters.dateAddedStart &&
                  !filters.dateAddedEnd
                }
              >
                Clear Filters
              </Button>
            </div>
            {error && (
              <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {listings.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Recent Listings ({listings.length})
            </h3>
            <Button
              onClick={retryFetch}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {listings.map((crypto) => {
              // Safe access to nested properties
              const quote = crypto.quote?.USD || {};
              const price = quote.price || 0;
              const change24h = quote.percent_change_24h || 0;
              const marketCap = quote.market_cap || 0;
              const volume24h = quote.volume_24h || 0;
              const isPositive = change24h >= 0;
              const socialLinks = getSocialMediaLinks(crypto);

              return (
                <Card
                  key={crypto.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {crypto.logo && (
                          <Image
                            src={crypto.logo}
                            alt={`${crypto.name} logo`}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <CardTitle className="text-lg font-bold">
                            {crypto.name || "Unknown Token"}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {crypto.symbol || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Date Added */}
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Added:</span> {formatDate(crypto.date_added)}
                      </div>

                      {/* Social Media Links */}
                      <div className="space-y-3">
                        {socialLinks.telegram && (
                          <a
                            href={socialLinks.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors"
                          >
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <MessageCircle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-blue-700 dark:text-blue-300">Telegram</div>
                              <div className="text-xs text-blue-600 dark:text-blue-400 truncate max-w-[200px]">
                                {socialLinks.telegram.replace('https://', '')}
                              </div>
                            </div>
                          </a>
                        )}

                        {socialLinks.discord && (
                          <a
                            href={socialLinks.discord}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950/30 transition-colors"
                          >
                            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                              <MessageCircle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-indigo-700 dark:text-indigo-300">Discord</div>
                              <div className="text-xs text-indigo-600 dark:text-indigo-400 truncate max-w-[200px]">
                                {socialLinks.discord.replace('https://', '')}
                              </div>
                            </div>
                          </a>
                        )}

                        {!socialLinks.telegram && !socialLinks.discord && (
                          <div className="text-sm text-muted-foreground text-center py-4">
                            No social media links available
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {listings.length === 0 && !loading && !error && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No new listings found for the selected criteria.
          </p>
          <Button onClick={clearFilters} className="mt-4" variant="outline">
            Clear Filters and Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
