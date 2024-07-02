"use client";
import { useState } from "react";
import useStore from "../store/useStore";

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
      setError("매치 데이터를 가져오는 중 오류가 발생했습니다: " + err.message);
      console.error("Error details:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-black rounded-lg shadow-lg text-white">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <input
          type="text"
          value={summonerName}
          onChange={(e) => setSummonerName(e.target.value)}
          placeholder="소환사명"
          className="block w-full px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 bg-gray-800 text-white"
        />
        <input
          type="text"
          value={summonerTag}
          onChange={(e) => setSummonerTag(e.target.value)}
          placeholder="# 제외한 소환사 태그"
          className="block w-full px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 bg-gray-800 text-white"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? "로딩 중..." : "검색"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {matches.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Match Data</h2>
          <ul className="space-y-2">
            {matches.map((match) => (
              <li key={match.matchId} className="bg-gray-800 p-4 rounded-lg">
                <p className="text-white">Match ID: {match.matchId}</p>
                <h3 className="font-semibold mt-2 text-white">Ping Data:</h3>
                {Object.entries(match.pingData).map(([key, value]) => (
                  <p key={key} className="text-white">
                    {key}: {value}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyComponent;
