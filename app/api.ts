// src/api.ts
export const fetchSummonerData = async (name: string, tag: string) => {
  const response = await fetch(`/api/summoner?name=${name}&tag=${tag}`);
  if (!response.ok) {
    throw new Error(`Error fetching summoner data: ${response.statusText}`);
  }
  return response.json();
};

export const fetchCurrentGameData = async (summonerId: string) => {
  const response = await fetch(`/api/current-game?summonerId=${summonerId}`);
  if (!response.ok) {
    throw new Error(`Error fetching current game data: ${response.statusText}`);
  }
  return response.json();
};

export const fetchSummonerInfo = async (summonerId: string) => {
  const response = await fetch(`/api/summoner-info?summonerId=${summonerId}`);
  if (!response.ok) {
    throw new Error(`Error fetching summoner info: ${response.statusText}`);
  }
  return response.json();
};
