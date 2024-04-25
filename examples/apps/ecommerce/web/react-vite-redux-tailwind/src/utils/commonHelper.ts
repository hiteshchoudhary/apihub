import { SUPPORTED_LANGUAGES } from "../constants";
import store from "../store";
export const generateRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const formatAmount = (amount: number, currency: string): string => {
    const currentLanguage = store.getState().language.selectedLanguage;
    if(currentLanguage === SUPPORTED_LANGUAGES.arabic){
        return new Intl.NumberFormat('ar-EN', {style: 'currency', currency: currency}).format(amount); 
    }
    return new Intl.NumberFormat('en-AE', {style: 'currency', currency: currency}).format(amount);
}

export const zeroFormattedNumber = (number: number): string => {
    if(number < 10){
        return `0${number}`
    }
    return number.toString();
}

export const capitalizeSentence = (sentence: string): string => {
    /* Split by space */
    const updatedWords = sentence.split(" ").map((word) => {
        /* Capitalize first letter of each word */
        return word.charAt(0).toUpperCase() + word.substring(1);
    })

    /* Join the words back to a string */
    return updatedWords.join(" ");
    
}