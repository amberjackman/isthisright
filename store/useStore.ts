import create from "zustand";
import axios from "axios";

interface PingData {
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
}

interface Match {
  matchId: string;
  pingData: PingData;
}

interface State {
  matches: Match[];
  isLoading: boolean;
  error: string | null;
  fetchMatches: (name: string, tag: string) => Promise<void>;
}

const useStore = create<State>((set) => ({
  matches: [],
  isLoading: false,
  error: null,
  fetchMatches: async (name: string, tag: string) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await axios.get<Match[]>(
        `/api/matches?name=${name}&tag=${tag}`
      );
      set((state) => ({ ...state, matches: response.data, isLoading: false }));
    } catch (error) {
      console.error("Error fetching matches:", error);
      set((state) => ({
        ...state,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      }));
    }
  },
}));

export default useStore;
