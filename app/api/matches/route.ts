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

      await new Promise((res) => setTimeout(res, 1000));
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const tag = searchParams.get("tag");

  if (!name || !tag) {
    return NextResponse.json(
      { error: "소환사 이름을 입력해주세요!" },
      { status: 400 }
    );
  }

  try {
    const accountData = await fetchWithRetry(
      `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}`
    );
    const puuid = accountData.puuid;

    const matchIds = await fetchWithRetry(
      `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=5`
    );

    const matchDetails = [];
    for (const matchId of matchIds) {
      const matchData = await fetchWithRetry(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`
      );
      matchDetails.push(matchData);
    }

    const processedMatches = matchDetails.map((match) => {
      const participant = match.info.participants.find(
        (participant) => participant.puuid === puuid
      );

      if (!participant) {
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

    return NextResponse.json(processedMatches);
  } catch (error) {
    return NextResponse.json(
      { error: "Error in fetching matches" },
      { status: 500 }
    );
  }
}
