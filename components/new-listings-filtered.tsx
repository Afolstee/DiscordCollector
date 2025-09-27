"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, MessageCircle } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/utils/format";
import type { Cryptocurrency } from "@/types";

interface FilteredListingsProps {
  listings: Cryptocurrency[];
  filter: "all" | "discord" | "telegram";
  retryFetch: () => void;
  getSocialMediaLinks: (crypto: Cryptocurrency) => {
    website: string;
    twitter: string | null;
    reddit: string | null;
    telegram: string | null;
    discord: string | null;
    github: string | null;
    explorer: string | null;
    announcement: string | null;
  };
}

export function FilteredListings({
  listings,
  filter,
  retryFetch,
  getSocialMediaLinks,
}: FilteredListingsProps) {
  // Function to filter listings based on social media presence
  const filterListings = (
    listings: Cryptocurrency[],
    filterType: "all" | "discord" | "telegram"
  ) => {
    if (filterType === "all") return listings;

    return listings.filter((crypto) => {
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

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Recent Listings ({filteredListings.length})
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
        {filteredListings.map((crypto) => {
          const socialLinks = getSocialMediaLinks(crypto);

          return (
            <Card key={crypto.id} className="hover:shadow-lg transition-shadow">
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
                          e.currentTarget.style.display = "none";
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
                    <span className="font-medium">Added:</span>{" "}
                    {formatDate(crypto.date_added)}
                  </div>

                   {/* Social Media Links */}
                   <div className="space-y-3">
                     {/* Show Telegram only when filter is 'all' or 'telegram' */}
                     {socialLinks.telegram && (filter === "all" || filter === "telegram") && (
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
                           <div className="font-medium text-blue-700 dark:text-blue-300">
                             Telegram
                           </div>
                           <div className="text-xs text-blue-600 dark:text-blue-400 truncate max-w-[200px]">
                             {socialLinks.telegram.replace("https://", "")}
                           </div>
                         </div>
                       </a>
                     )}

                     {/* Show Discord only when filter is 'all' or 'discord' */}
                     {socialLinks.discord && (filter === "all" || filter === "discord") && (
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
                           <div className="font-medium text-indigo-700 dark:text-indigo-300">
                             Discord
                           </div>
                           <div className="text-xs text-indigo-600 dark:text-indigo-400 truncate max-w-[200px]">
                             {socialLinks.discord.replace("https://", "")}
                           </div>
                         </div>
                       </a>
                     )}

                     {/* Show message when no relevant social media links are available */}
                     {((filter === "telegram" && !socialLinks.telegram) || 
                       (filter === "discord" && !socialLinks.discord) ||
                       (filter === "all" && !socialLinks.telegram && !socialLinks.discord)) && (
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
  );
}
