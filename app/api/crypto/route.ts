import { NextRequest, NextResponse } from "next/server";
import { coinMarketCapApi } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = parseInt(searchParams.get("start") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const symbol = searchParams.get("symbol");

    if (symbol) {
      // Get specific cryptocurrency data
      const data = await coinMarketCapApi.getCryptocurrencyInfo(symbol);
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

    // Store coin data in database
    const coinData = await prisma.coinData.upsert({
      where: { coinId },
      update: {
        name,
        symbol,
        slug,
        lastUpdated: new Date(),
      },
      create: {
        coinId,
        name,
        symbol,
        slug,
        lastUpdated: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: coinData,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to store coin data",
      },
      { status: 500 }
    );
  }
}
