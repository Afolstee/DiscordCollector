import { NextResponse } from "next/server";
import { coinMarketCapApi } from "@/lib/api";

export async function GET() {
  try {
    const data = await coinMarketCapApi.getGlobalMetrics();
    return NextResponse.json({
      success: true,
      data: data.data,
    });
  } catch (error) {
    console.error("Global Metrics Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch global metrics",
      },
      { status: 500 }
    );
  }
}
