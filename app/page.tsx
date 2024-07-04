"use client";

import { useState } from "react";
import useStore from "../store/useStore";
import { Nanum_Gothic, Press_Start_2P } from "next/font/google";

const MyComponent = () => {
  const [summonerName, setSummonerName] = useState("");
  const [summonerTag, setSummonerTag] = useState("");
  const { matches, fetchMatches } = useStore((state) => ({
    matches: state.matches,
    fetchMatches: state.fetchMatches,
  }));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await fetchMatches(summonerName, summonerTag);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError("오류가 발생했습니다: " + err.message);
      console.error("Error details:", err);
    }
  };

  const pingImages = {
    allInPings: "/images/All_In_ping.png",
    assistMePings: "/images/Assist_Me_ping.png",
    basicPings: "/images/Generic_ping.png",
    commandPings: "/images/Generic_ping.png",
    dangerPings: "/images/Retreat_ping.png",
    enemyMissingPings: "/images/Enemy_Missing_ping.png",
    enemyVisionPings: "/images/Enemy_Vision_ping.png",
    getBackPings: "/images/Retreat_ping.png",
    holdPings: "/images/Hold_ping.png",
    onMyWayPings: "/images/On_My_Way_ping.png",
    pushPings: "/images/Push_ping.png",
    needVisionPings: "/images/Need_Vision_ping.png",
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Nanum+Square:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <div className="font-sans min-h-screen flex items-center justify-center">
        <div className="w-9/12 max-w-lg px-4">
          <div className="flex flex-col items-center">
            <img
              className="w-40 h-40 mb-3"
              src="/images/Landing_Logo_design.png"
              alt="logo"
            />

            <div className="flex w-lvw h-5 m-3 flex-nowrap overflow-hidden transition duration-300 shadow-xl text-md font-bold bg-gray-600 opacity-95 text-gray-400 hover:text-white">
              <div className="flex flow-wrap h-6 w-fit animate-textLoop hover:pause-textLoop pr-[1.5vw]">
                <div className="whitespace-nowrap">
                  hide on bush#KR1(FAKER) : 27.4회 T1 Gumayusi#KR1 : 74회
                  kiin#KR1 : 11.2회 JUGKING#KR1(Canyon) : 8.6회 God
                  Thunder#KR1(Zeus) : 86회{" "}
                </div>
              </div>
            </div>
            <div className=" w-full p-6 rounded-lg shadow-2xl bg-gray-200">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input
                  type="text"
                  value={summonerName}
                  onChange={(e) => setSummonerName(e.target.value)}
                  placeholder="소환사명"
                  className="font-sans block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 bg-gray-800 text-white"
                />
                <input
                  type="text"
                  value={summonerTag}
                  onChange={(e) => setSummonerTag(e.target.value)}
                  placeholder="# 제외한 소환사 태그"
                  className="block w-full px-4 py-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 bg-gray-800 text-white"
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "로딩 중..." : "검색"}
                </button>
              </form>
              {error && <p className="text-red-500 mt-4">{error}</p>}
              {matches.length > 0 && (
                <div className="mt-4">
                  <ul className="space-y-2">
                    {matches.length > 0 && (
                      <div className="mt-4">
                        {(() => {
                          const totalSum = matches.reduce((acc, match) => {
                            return (
                              acc +
                              Object.values(match.pingData).reduce(
                                (sum, value) => sum + value,
                                0
                              )
                            );
                          }, 0);
                          const overallAverage = totalSum / 5;

                          return (
                            <>
                              <div className="mb-4 text-white text-center bg-gray-700 p-3 rounded-lg">
                                경기당 평균 핑 횟수: {overallAverage.toFixed(2)}
                              </div>
                              <ul className="space-y-2">
                                {matches.map((match) => (
                                  <li
                                    key={match.matchId}
                                    className="bg-gray-800 p-4 rounded-lg"
                                  >
                                    {Object.entries(match.pingData).map(
                                      ([key, value]) => (
                                        <div
                                          key={key}
                                          className="flex flex-row items-center justify-center gap-5 w-full"
                                        >
                                          {pingImages[key] && (
                                            <img
                                              src={pingImages[key]}
                                              alt={key}
                                              className="w-14 h-13"
                                            />
                                          )}
                                          <p
                                            className={`text-white ${
                                              value > 10
                                                ? "text-red-500"
                                                : "text-blue-100"
                                            }`}
                                          >
                                            {value}
                                          </p>
                                        </div>
                                      )
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyComponent;
