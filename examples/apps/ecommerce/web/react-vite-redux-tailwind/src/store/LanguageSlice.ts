import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_LANGUAGE, LOCAL_STORAGE_KEYS } from "../constants";
import { isRTL } from "../utils/languageHelpers";


const initialState = {
    selectedLanguage: localStorage.getItem(LOCAL_STORAGE_KEYS.selectedLanguage) || DEFAULT_LANGUAGE,
    isRTL: isRTL(localStorage.getItem(LOCAL_STORAGE_KEYS.selectedLanguage) || DEFAULT_LANGUAGE)
}
const LanguageSlice = createSlice({
    name: "languageSlice",
    initialState,
    reducers: {
        changeLanguage(state, {payload}) {
            state.selectedLanguage = payload;
            state.isRTL = isRTL(payload);
            localStorage.setItem(LOCAL_STORAGE_KEYS.selectedLanguage, payload);
        },
        reset(state){
            state.selectedLanguage = DEFAULT_LANGUAGE;
            state.isRTL = isRTL(DEFAULT_LANGUAGE);
            localStorage.removeItem(LOCAL_STORAGE_KEYS.selectedLanguage)
        }
    }
})

export const {changeLanguage, reset} = LanguageSlice.actions;
export default LanguageSlice;