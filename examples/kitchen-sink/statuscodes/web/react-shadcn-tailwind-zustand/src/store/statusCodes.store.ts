import { StatusListType } from '@/pages/codesList/components/types';
import { create } from 'zustand'

interface StatusCodes {
    HTTPStatusCodesList: StatusListType;
    setHTTPStatusCodesList: (HTTPStatusCodesList: StatusListType) => void;
}

export const useStatusCodeStore = create<StatusCodes>()((set) => ({
  HTTPStatusCodesList:{},
  setHTTPStatusCodesList: (HTTPStatusCodesList) => set({ HTTPStatusCodesList }),
}))