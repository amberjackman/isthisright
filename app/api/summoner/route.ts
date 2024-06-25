// /app/api/summoner/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const tag = searchParams.get("tag");
  const RIOT_API_KEY = process.env.RIOT_API_KEY;

  if (!name || !tag) {
    return NextResponse.json(
      { error: "Missing name or tag parameters" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}?api_key=${RIOT_API_KEY}`
    );
    const data = response.data;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
