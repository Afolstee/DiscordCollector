import { NextRequest, NextResponse } from "next/server";
import { coinMarketCapApi } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = parseInt(searchParams.get("start") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");

    const data = await coinMarketCapApi.getTrendingCryptocurrencies(start, limit);

    return NextResponse.json({
      success: true,
      data: data.data,
      meta: {
        start,
        limit,
        type: "trending",
      },
    });
  } catch (error) {
    console.error("Trending API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trending cryptocurrencies",
      },
      { status: 500 }
    );
  }
}