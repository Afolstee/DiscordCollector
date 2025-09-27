"use client";

import { Suspense, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { NewListings } from "@/components/new-listings";

type FilterType = "all" | "discord" | "telegram";

export default function HomePage() {
  const [filter, setFilter] = useState<FilterType>("all");

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Crypto Discord
        </h1>
      </div>

      {/* New Cryptocurrency Listings */}
      <div className="mt-12">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Latest Cryptocurrency Listings
          </h2>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              All
            </Button>
            <Button
              variant={filter === "discord" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("discord")}
              className="flex items-center gap-2"
            >
              Discord
            </Button>
            <Button
              variant={filter === "telegram" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("telegram")}
              className="flex items-center gap-2"
            >
              Telegram
            </Button>
          </div>
        </div>
        <Suspense fallback={<NewListingsSkeleton />}>
          <NewListings limit={100} showFilters={false} filter={filter} />
        </Suspense>
      </div>
    </div>
  );
}

function NewListingsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 24 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="px-4 sm:px-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 sm:h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-3">
              <div className="h-3 bg-muted rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
