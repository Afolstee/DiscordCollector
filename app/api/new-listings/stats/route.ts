import { NextResponse } from "next/server";
import { coinMarketCapApi } from "@/lib/api";

function filterListingsByDate(listings: any[], startDate: Date): any[] {
  if (!Array.isArray(listings)) return [];

  return listings.filter((listing) => {
    if (!listing.date_added) return false;

    try {
      const listingDate = new Date(listing.date_added);
      return listingDate >= startDate;
    } catch (error) {
      console.warn("Invalid date in listing:", listing.date_added);
      return false;
    }
  });
}

export async function GET() {
  try {
    console.log("Fetching new listings stats...");

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Try to get recent listings without date filters first
    // Then filter client-side to avoid API parameter issues
    let allRecentListings = [];

    try {
      // Try the original approach first
      const recentData = await coinMarketCapApi.getNewListingsByDateRange(
        1,
        200,
        oneMonthAgo.toISOString().split("T")[0]
      );
      allRecentListings = recentData.data || [];
    } catch (apiError) {
      console.warn(
        "Date range API failed, trying fallback approach:",
        apiError
      );

      // Fallback: get latest listings without date filter
      try {
        // You might need to adjust this based on your actual API structure
        const fallbackData = await coinMarketCapApi.getLatestListings(1, 200);
        allRecentListings = fallbackData.data || [];
      } catch (fallbackError) {
        console.error("Fallback API also failed:", fallbackError);
        // Return default data instead of throwing
        return NextResponse.json({
          success: true,
          data: {
            thisWeek: 0,
            thisMonth: 0,
            weekListings: [],
            monthListings: [],
            lastUpdated: now.toISOString(),
            note: "API temporarily unavailable - showing default data",
          },
        });
      }
    }

    console.log(`Retrieved ${allRecentListings.length} listings for filtering`);

    // Filter listings by date ranges on the client side
    const weekListings = filterListingsByDate(allRecentListings, oneWeekAgo);
    const monthListings = filterListingsByDate(allRecentListings, oneMonthAgo);

    console.log(
      `Week listings: ${weekListings.length}, Month listings: ${monthListings.length}`
    );

    return NextResponse.json({
      success: true,
      data: {
        thisWeek: weekListings.length,
        thisMonth: monthListings.length,
        weekListings: weekListings.slice(0, 10), // Top 10 for this week
        monthListings: monthListings.slice(0, 10), // Top 10 for this month
        lastUpdated: now.toISOString(),
      },
      meta: {
        totalProcessed: allRecentListings.length,
        dateRanges: {
          weekStart: oneWeekAgo.toISOString(),
          monthStart: oneMonthAgo.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("New Listings Stats Error:", error);

    // Return graceful fallback instead of 500 error
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch new listings statistics",
        data: {
          thisWeek: 0,
          thisMonth: 0,
          weekListings: [],
          monthListings: [],
          lastUpdated: new Date().toISOString(),
          fallbackMode: true,
        },
      },
      { status: 200 }
    ); // Return 200 with fallback data instead of 500
  }
}
