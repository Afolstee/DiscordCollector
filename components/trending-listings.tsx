"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, MessageCircle, Twitter, Github, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";
import { formatDate, formatPercentage } from "@/utils/format";
import type { Cryptocurrency } from "@/types";

interface TrendingListingsProps {
  limit?: number;
  filter: "all" | "discord" | "telegram";
}

export function TrendingListings({
  limit = 100,
  filter,
}: TrendingListingsProps) {
  const [listings, setListings] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrendingListings();
  }, [limit]);

  const fetchTrendingListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: limit.toString(),
      });

      const response = await fetch(`/api/trending?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const listingsData = Array.isArray(data.data) ? data.data : [];
        setListings(listingsData);

        if (listingsData.length === 0) {
          setError("No trending cryptocurrencies found.");
        }
      } else {
        setError(data.error || data.message || "Failed to fetch trending cryptocurrencies");
      }
    } catch (err: any) {
      console.error("Trending fetch error:", err);
      setError(err.message || "Failed to fetch trending cryptocurrencies");
    } finally {
      setLoading(false);
    }
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

  // Function to check if cryptocurrency has any social media links
  const hasSocialMedia = (crypto: Cryptocurrency) => {
    const socialLinks = getSocialMediaLinks(crypto);
    return (
      socialLinks.twitter !== null ||
      socialLinks.reddit !== null ||
      socialLinks.telegram !== null ||
      socialLinks.discord !== null ||
      socialLinks.github !== null ||
      socialLinks.announcement !== null
    );
  };

  // Function to filter listings based on social media presence
  const filterListings = (
    listings: Cryptocurrency[],
    filterType: "all" | "discord" | "telegram"
  ) => {
    // First filter out cryptocurrencies without any social media
    const cryptosWithSocialMedia = listings.filter((crypto) => hasSocialMedia(crypto));

    if (filterType === "all") return cryptosWithSocialMedia;

    return cryptosWithSocialMedia.filter((crypto) => {
      const socialLinks = getSocialMediaLinks(crypto);

      if (filterType === "discord") {
        return socialLinks.discord !== null;
      }

      if (filterType === "telegram") {
        return socialLinks.telegram !== null;
      }

      return true;
    });
  };

  const filteredListings = filterListings(listings, filter);

  const retryFetch = () => {
    fetchTrendingListings();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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

  if (error && filteredListings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={retryFetch} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Trending Cryptocurrencies ({filteredListings.length})
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {filteredListings.map((crypto) => {
          const socialLinks = getSocialMediaLinks(crypto);
          const priceChange24h = crypto.quote.USD.percent_change_24h;
          const isPositive = priceChange24h > 0;

          return (
            <Card key={crypto.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <div className="flex items-center space-x-3">
                  {crypto.logo && (
                    <Image
                      src={crypto.logo}
                      alt={`${crypto.name} logo`}
                      width={32}
                      height={32}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg font-bold truncate">
                      {crypto.name || "Unknown Token"}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {crypto.symbol || "Unknown"}
                      </p>
                      <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {formatPercentage(Math.abs(priceChange24h))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 px-4 sm:px-6">
                <div className="space-y-3 sm:space-y-4">
                  {/* Date Added */}
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    <span className="font-medium">Added:</span>{" "}
                    {formatDate(crypto.date_added)}
                  </div>

                  {/* Social Media Links */}
                  <div className="space-y-2 sm:space-y-3">
                    {/* Twitter */}
                    {socialLinks.twitter && (filter === "all") && (
                      <a
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-sky-50 dark:bg-sky-950/20 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-950/30 transition-colors"
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Twitter className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sky-700 dark:text-sky-300 text-sm">
                            Twitter
                          </div>
                          <div className="text-xs text-sky-600 dark:text-sky-400 truncate">
                            {socialLinks.twitter.replace("https://", "")}
                          </div>
                        </div>
                      </a>
                    )}

                    {/* Reddit */}
                    {socialLinks.reddit && (filter === "all") && (
                      <a
                        href={socialLinks.reddit}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-950/30 transition-colors"
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-orange-700 dark:text-orange-300 text-sm">
                            Reddit
                          </div>
                          <div className="text-xs text-orange-600 dark:text-orange-400 truncate">
                            {socialLinks.reddit.replace("https://", "")}
                          </div>
                        </div>
                      </a>
                    )}

                    {/* Telegram */}
                    {socialLinks.telegram &&
                      (filter === "all" || filter === "telegram") && (
                        <a
                          href={socialLinks.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors"
                        >
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-blue-700 dark:text-blue-300 text-sm">
                              Telegram
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 truncate">
                              {socialLinks.telegram.replace("https://", "")}
                            </div>
                          </div>
                        </a>
                      )}

                    {/* Discord */}
                    {socialLinks.discord &&
                      (filter === "all" || filter === "discord") && (
                        <a
                          href={socialLinks.discord}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950/30 transition-colors"
                        >
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-indigo-700 dark:text-indigo-300 text-sm">
                              Discord
                            </div>
                            <div className="text-xs text-indigo-600 dark:text-indigo-400 truncate">
                              {socialLinks.discord.replace("https://", "")}
                            </div>
                          </div>
                        </a>
                      )}

                    {/* GitHub */}
                    {socialLinks.github && (filter === "all") && (
                      <a
                        href={socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950/30 transition-colors"
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <Github className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                            GitHub
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {socialLinks.github.replace("https://", "")}
                          </div>
                        </div>
                      </a>
                    )}

                    {/* Announcements */}
                    {socialLinks.announcement && (filter === "all") && (
                      <a
                        href={socialLinks.announcement}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 dark:bg-green-950/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-950/30 transition-colors"
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-green-700 dark:text-green-300 text-sm">
                            Announcements
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400 truncate">
                            {socialLinks.announcement.replace("https://", "")}
                          </div>
                        </div>
                      </a>
                    )}

                    {/* Show message when no relevant social media links are available for specific filters */}
                    {((filter === "telegram" && !socialLinks.telegram) ||
                      (filter === "discord" && !socialLinks.discord)) && (
                      <div className="text-xs sm:text-sm text-muted-foreground text-center py-3 sm:py-4">
                        No {filter} links available
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredListings.length === 0 && !loading && !error && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No trending cryptocurrencies found with social media presence for the selected filter.
          </p>
        </div>
      )}
    </>
  );
}