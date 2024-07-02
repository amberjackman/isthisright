import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, tag } = req.query;

  try {
    const accountResponse = await axios.get(
      `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}`,
      {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY,
        },
      }
    );
    const puuid = accountResponse.data.puuid;

    const matchIdsResponse = await axios.get(
      `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`,
      {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY,
        },
      }
    );
    const matchIds = matchIdsResponse.data;

    const matchDetailsPromises = matchIds.slice(0, 1).map((matchId) =>
      axios.get(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`,
        {
          headers: {
            "X-Riot-Token": process.env.RIOT_API_KEY,
          },
        }
      )
    );
    const matchDetailsResponses = await Promise.all(matchDetailsPromises);

    const matches = matchDetailsResponses.map((response) => ({
      matchId: response.data.metadata.matchId,
      participantFrames: response.data.info.frames.reduce(
        (acc: any, frame: any) => {
          Object.keys(frame.participantFrames).forEach(
            (participantId: string) => {
              if (!acc[participantId]) {
                acc[participantId] = {};
              }
              acc[participantId].allInPings =
                frame.participantFrames[participantId].allInPings;
              acc[participantId].assistMePings =
                frame.participantFrames[participantId].assistMePings;
              acc[participantId].commandPings =
                frame.participantFrames[participantId].commandPings;
              acc[participantId].enemyMissingPings =
                frame.participantFrames[participantId].enemyMissingPings;
              acc[participantId].enemyVisionPings =
                frame.participantFrames[participantId].enemyVisionPings;
              acc[participantId].holdPing =
                frame.participantFrames[participantId].holdPing;
              acc[participantId].getBackPings =
                frame.participantFrames[participantId].getBackPings;
              acc[participantId].needVisionPings =
                frame.participantFrames[participantId].needVisionPings;
              acc[participantId].onMyWayPings =
                frame.participantFrames[participantId].onMyWayPings;
              acc[participantId].pushPings =
                frame.participantFrames[participantId].pushPings;
              acc[participantId].visionClearedPings =
                frame.participantFrames[participantId].visionClearedPings;
            }
          );
          return acc;
        },
        {}
      ),
    }));

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Error fetching matches" });
  }
}
