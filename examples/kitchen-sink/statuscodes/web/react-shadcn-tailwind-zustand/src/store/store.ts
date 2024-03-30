import { StatusListType } from "@/pages/codesList/components/types";
import { create } from "zustand";

interface StoreType {
  HTTPStatusCodesList: StatusListType;
  setHTTPStatusCodesList: (HTTPStatusCodesList: StatusListType) => void;
  loading: number;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<StoreType>()((set) => ({
  HTTPStatusCodesList: {},
  setHTTPStatusCodesList: (HTTPStatusCodesList) => set({ HTTPStatusCodesList }),
  loading: 0,
  setLoading: (loading) =>
    set((state) => ({
      loading: loading ? state.loading + 1 : state.loading - 1,
    })),
}));
