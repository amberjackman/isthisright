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
    if (!name || !tag) {
      set({ error: "이름과 태그를 정확히 입력해주세요!", isLoading: false });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<Match[]>(
        `/api/matches?name=${name}&tag=${tag}`
      );
      if (response.data.length === 0) {
        set({
          error: "소환사를 찾을 수 없습니다!",
          isLoading: false,
          matches: [],
        });
      } else {
        set({ matches: response.data, isLoading: false, error: null });
      }
    } catch (error) {
      // console.error("Error fetching matches:", error);
      let errorMessage = "An unknown error occurred";
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          errorMessage = "이름과 태그를 정확히 입력해주세요!";
        } else if (error.response?.status === 500) {
          errorMessage = "소환사를 찾을 수 없습니다!";
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      set({ error: errorMessage, isLoading: false, matches: [] });
    }
  },
}));

export default useStore;
