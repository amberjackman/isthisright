"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [summonerName, setSummonerName] = useState("");
  const [summonerTag, setSummonerTag] = useState("");
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState("");

  const getSummonerByName = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setGameData(null);

    try {
      // 소환사 정보 가져오기
      const summonerResponse = await axios.get(
        `http://localhost:3001/api/summoner/${summonerName}/${summonerTag}`
      );
      const { puuid } = summonerResponse.data;

      // 현재 게임 정보 가져오기
      const currentGameResponse = await axios.get(
        `http://localhost:3001/api/current-game/${puuid}`
      );
      const currentGameData = currentGameResponse.data;

      // 각 플레이어의 랭크 정보 가져오기
      const playersInfo = await Promise.all(
        currentGameData.participants.map(async (participant) => {
          const summonerInfoResponse = await axios.get(
            `http://localhost:3001/api/summoner-info/${participant.summonerId}`
          );
          return {
            ...participant,
            rankInfo: summonerInfoResponse.data,
          };
        })
      );

      // 포지션 매칭 확인
      const analyzedData = analyzePositions(playersInfo);

      setGameData(analyzedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("데이터를 가져오는 중 오류가 발생했습니다.");
    }
  };

  const analyzePositions = (players) => {
    // 여기에 포지션 매칭 로직을 구현합니다.
    // 예: 각 플레이어의 주 포지션과 현재 게임에서의 포지션을 비교
    return players.map((player) => ({
      ...player,
      isInMainPosition: checkMainPosition(player.rankInfo, player.position),
    }));
  };

  const checkMainPosition = (rankInfo, currentPosition) => {
    // 플레이어의 주 포지션을 판단하는 로직을 구현합니다.
    // 이는 rankInfo를 기반으로 할 수 있습니다.
    // 예시 로직입니다. 실제 구현은 더 복잡할 수 있습니다.
    const mainPosition = rankInfo[0]?.position; // 가장 높은 티어의 포지션을 주 포지션으로 가정
    return mainPosition === currentPosition;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold mb-5">LoL In-Game Analyzer</h1>
          <form onSubmit={getSummonerByName}>
            <input
              type="text"
              value={summonerName}
              onChange={(e) => setSummonerName(e.target.value)}
              placeholder="소환사 이름"
              className="px-3 py-2 border border-gray-300 rounded-md w-full mb-3"
            />
            <input
              type="text"
              value={summonerTag}
              onChange={(e) => setSummonerTag(e.target.value)}
              placeholder="소환사 태그"
              className="px-3 py-2 border border-gray-300 rounded-md w-full mb-3"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
            >
              분석 시작
            </button>
          </form>
          {error && <p className="text-red-500 mt-3">{error}</p>}
          {gameData && (
            <div className="mt-5">
              <h2 className="text-xl font-semibold mb-3">게임 분석 결과</h2>
              {gameData.map((player, index) => (
                <div key={index} className="mb-2">
                  <p>
                    {player.summonerName}:{" "}
                    {player.isInMainPosition ? "주 포지션" : "부 포지션"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
