import { NextResponse } from "next/server";
import axios from "axios";

const RIOT_API_KEY = process.env.RIOT_API_KEY;

async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      // console.log(`Fetching data from ${url}, attempt ${i + 1}`);
      const response = await axios.get(url, {
        headers: { "X-Riot-Token": RIOT_API_KEY },
      });
      // console.log(`Successfully fetched data from ${url}`);
      return response.data;
    } catch (error) {
      // console.error(
      //   `Error fetching data from ${url}, attempt ${i + 1}:`,
      //   error
      // );
      if (i === retries - 1) throw error;
      // console.log(`Retrying ${url} after 1 second...`);
      await new Promise((res) => setTimeout(res, 1000));
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const tag = searchParams.get("tag");

  if (!name || !tag) {
    // console.log("Name and tag are required");
    return NextResponse.json(
      { error: "Name and tag are required" },
      { status: 400 }
    );
  }

  try {
    // console.log(`Fetching account data for ${name}/${tag}`);
    const accountData = await fetchWithRetry(
      `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}`
    );
    const puuid = accountData.puuid;

    // console.log(`Fetching match IDs for ${puuid}`);
    const matchIds = await fetchWithRetry(
      `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=5`
    );

    // console.log(`Fetching match details for ${matchIds}`);
    const matchDetails = [];
    for (const matchId of matchIds) {
      const matchData = await fetchWithRetry(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`
      );
      matchDetails.push(matchData);
    }

    // console.log("Processing match data");
    const processedMatches = matchDetails.map((match) => {
      const participant = match.info.participants.find(
        (participant) => participant.puuid === puuid
      );

      if (!participant) {
        // console.error(`Participant with puuid ${puuid} not found in match`);
        return {
          matchId: match.metadata.matchId,
          pingData: {},
        };
      }

      const participantId = participant.participantId;

      const pingsData = {};
      Object.entries(participant).forEach(([key, value]) => {
        if (key.endsWith("Pings") && value !== 0) {
          pingsData[key] = value;
        }
      });
      // console.log(pingsData);

      return {
        matchId: match.metadata.matchId,
        pingData: match.info.frames
          ? match.info.frames.reduce((acc, frame) => {
              const participantFrame = frame.participantFrames[participantId];
              if (participantFrame) {
                Object.entries(participantFrame).forEach(([key, value]) => {
                  if (key.endsWith("Pings")) {
                    acc[key] = (acc[key] || 0) + value;
                  }
                });
              }
              return acc;
            }, pingsData)
          : pingsData,
      };
    });

    // console.log("Processed matches:", processedMatches);
    return NextResponse.json(processedMatches);
  } catch (error) {
    // console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Error fetching matches" },
      { status: 500 }
    );
  }
}
