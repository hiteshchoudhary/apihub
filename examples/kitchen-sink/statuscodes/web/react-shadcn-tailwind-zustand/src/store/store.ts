import { StatusListType } from "@/pages/codesList/components/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreType {
  HTTPStatusCodesList: StatusListType;
  setHTTPStatusCodesList: (HTTPStatusCodesList: StatusListType) => void;
  loading: number;
  setLoading: (loading: boolean) => void;
  quizScore: {
    lastScore: number;
    highScore: number;
  };
  setQuizScore: (score: number) => void;
}

export const useAppStore = create<StoreType>()(
  persist(
    (set) => ({
      HTTPStatusCodesList: {},
      setHTTPStatusCodesList: (HTTPStatusCodesList) =>
        set({ HTTPStatusCodesList }),
      loading: 0,
      setLoading: (loading) =>
        set((state) => ({
          loading: loading ? state.loading + 1 : state.loading - 1,
        })),
      quizScore: {
        lastScore: 0,
        highScore: 0,
      },
      setQuizScore: (quizScore) =>
        set((state) => {
          const highScore =
            quizScore > state.quizScore.highScore
              ? quizScore
              : state.quizScore.highScore;
          return {
            quizScore: {
              lastScore: quizScore,
              highScore,
            },
          };
        }),
    }),
    {
      name: "HTTPStatusCodesList",
    }
  ) // Add an empty object as the second argument
);
