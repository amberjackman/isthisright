import create from "zustand";
import axios from "axios";

interface Match {
  matchId: string;
  participantFrames: {
    [participantId: string]: {
      allInPings?: number;
      assistMePings?: number;
      commandPings?: number;
      enemyMissingPings?: number;
      enemyVisionPings?: number;
      holdPing?: number;
      getBackPings?: number;
      needVisionPings?: number;
      onMyWayPings?: number;
      pushPings?: number;
      visionClearedPings?: number;
    };
  };
}

interface State {
  matches: Match[];
  fetchMatches: (name: string, tag: string) => Promise<void>;
}

const useStore = create<State>((set) => ({
  matches: [],
  fetchMatches: async (name: string, tag: string) => {
    try {
      const response = await axios.get(`/api/matches?name=${name}&tag=${tag}`);
      set({ matches: response.data });
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  },
}));

export default useStore;
