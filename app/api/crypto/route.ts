import { NextRequest, NextResponse } from "next/server";
import { coinMarketCapApi } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = parseInt(searchParams.get("start") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const symbol = searchParams.get("symbol");

    if (symbol) {
      // Get specific cryptocurrency data
      const data = await coinMarketCapApi.getCryptocurrencyQuotesBySymbol(
        symbol
      );
      return NextResponse.json({
        success: true,
        data: data.data,
      });
    } else {
      // Get latest listings
      const data = await coinMarketCapApi.getLatestListings(start, limit);
      return NextResponse.json({
        success: true,
        data: data.data,
      });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch cryptocurrency data",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coinId, name, symbol, slug } = body;

    // Database operations are disabled for now
    // TODO: Implement database storage when database is set up
    console.log("Database storage disabled - coin data:", {
      coinId,
      name,
      symbol,
      slug,
    });

    return NextResponse.json({
      success: true,
      data: {
        coinId,
        name,
        symbol,
        slug,
        message: "Database storage disabled",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process coin data",
      },
      { status: 500 }
    );
  }
}
