import { StatusListType } from "@/pages/codesList/components/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreType {
  HTTPStatusCodesList: StatusListType;
  setHTTPStatusCodesList: (HTTPStatusCodesList: StatusListType) => void;
  loading: number;
  setLoading: (loading: boolean) => void;
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
    }),
    {
      name: "HTTPStatusCodesList",
    }
  ) // Add an empty object as the second argument
);
