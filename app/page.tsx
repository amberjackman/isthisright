"use client";

import { useState } from "react";
import axios from "axios";

const MyComponent = () => {
  const [summonerName, setSummonerName] = useState("");
  const [summonerTag, setSummonerTag] = useState("");
  const [summonerData, setSummonerData] = useState(null);
  const [error, setError] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.get(
        `/api/summoner?name=${encodeURIComponent(
          summonerName
        )}&tag=${encodeURIComponent(summonerTag)}`
      );
      setSummonerData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("오류");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <input
          type="text"
          value={summonerName}
          onChange={(e) => setSummonerName(e.target.value)}
          placeholder="소환사명"
          className="block w-full px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
        />
        <input
          type="text"
          value={summonerTag}
          onChange={(e) => setSummonerTag(e.target.value)}
          placeholder="# 제외한 소환사 태그"
          className="block w-full px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          검색
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {summonerData && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Summoner Data</h2>
          <pre className="bg-gray-200 p-4 rounded-lg">
            {JSON.stringify(summonerData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default MyComponent;
