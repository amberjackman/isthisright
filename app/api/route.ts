import { NextResponse } from "next/server";
import axios from "axios";

const RIOT_API_KEY = process.env.RIOT_API_KEY;

async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        headers: { "X-Riot-Token": RIOT_API_KEY },
      });
      return response.data;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((res) => setTimeout(res, 1000)); // Wait 1 second before retrying
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const tag = searchParams.get("tag");

  if (!name || !tag) {
    return NextResponse.json(
      { error: "Name and tag are required" },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch account data
    const accountData = await fetchWithRetry(
      `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}`
    );
    const puuid = accountData.puuid;

    // 2. Fetch match IDs
    const matchIds = await fetchWithRetry(
      `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=5`
    );

    // 3. Fetch match details in parallel
    const matchDetailsPromises = matchIds.map((matchId) =>
      fetchWithRetry(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`
      )
    );
    const matchDetails = await Promise.all(matchDetailsPromises);

    // 4. Process match data
    const processedMatches = matchDetails.map((match) => ({
      matchId: match.metadata.matchId,
      participantFrames: match.info.frames.reduce((acc, frame) => {
        Object.entries(frame.participantFrames).forEach(
          ([participantId, data]) => {
            if (!acc[participantId]) acc[participantId] = {};
            Object.entries(data).forEach(([key, value]) => {
              if (key.endsWith("Pings")) {
                acc[participantId][key] =
                  (acc[participantId][key] || 0) + value;
              }
            });
          }
        );
        return acc;
      }, {}),
    }));

    return NextResponse.json(processedMatches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Error fetching matches" },
      { status: 500 }
    );
  }
}
