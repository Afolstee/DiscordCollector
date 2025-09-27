import { NextRequest, NextResponse } from "next/server";
import { coinMarketCapApi } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = parseInt(searchParams.get("start") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const dateAdded = searchParams.get("dateAdded");
    const dateAddedStart = searchParams.get("dateAddedStart");
    const dateAddedEnd = searchParams.get("dateAddedEnd");

    let data;

    if (dateAddedStart) {
      // Get new listings by date range
      data = await coinMarketCapApi.getNewListingsByDateRange(
        start,
        limit,
        dateAddedStart,
        dateAddedEnd || undefined
      );
    } else if (dateAdded) {
      // Get new listings from specific date
      data = await coinMarketCapApi.getNewListings(start, limit, dateAdded);
    } else {
      // Get new listings from default date (2024-01-01)
      data = await coinMarketCapApi.getNewListings(start, limit);
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      meta: {
        start,
        limit,
        dateAdded,
        dateAddedStart,
        dateAddedEnd,
      },
    });
  } catch (error) {
    console.error("New Listings API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch new listings",
      },
      { status: 500 }
    );
  }
}

