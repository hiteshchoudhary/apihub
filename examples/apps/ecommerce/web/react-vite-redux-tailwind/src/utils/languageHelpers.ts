import { SUPPORTED_LANGUAGES } from "../constants";

/**
 * To check if the language passed is from right to left.
 * @param language - string: Language code, en, ar.
 * @returns True/ False -> Is the language from right to left
 */
export const isRTL = (language: string): boolean => {
    switch(language){
        case SUPPORTED_LANGUAGES.english: return false;
        case SUPPORTED_LANGUAGES.arabic: return true;
        default: return false;
    }
}