import { AxiosResponse } from "axios";
import { FreeAPISuccessResponseInterface } from "../interfaces/api";

export const requestHandler = async (
  api: () => Promise<AxiosResponse<FreeAPISuccessResponseInterface, any>>,
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: FreeAPISuccessResponseInterface) => void,
  onError: (error: string) => void
) => {
  //This is used in the UI while the API is called and awaited
  setLoading && setLoading(true);
  try {
    //Making the API Request
    const response = await api();
    const { data } = response;
    if (data?.success) {
      //call onSuccess cb with response data
      onSuccess(data);
    }
  } catch (error: any) {
    if ([401, 403].includes(error?.response.data?.statusCode)) {
      localStorage.clear(); //clear local storage on authentication errors
      if (isBrowser) window.location.href = "/login";
    }
    onError(error?.response?.data?.message || "something went wrong");
  } finally {
    setLoading && setLoading(false);
  }
};

//Check if the code is running on a browser environment

export const isBrowser = typeof window !== "undefined";

//An utility function to concatenate CSS class names with proper spacing
export const classNames = (...className: string[]) => {
  //Filter out any empty class names and join with a space
  return className.filter(Boolean).join(" ");
};

//A utility class to deal with local storage of browsers

export class LocalStorage {
  // Get a value from local storage by key

  static get(key: string) {
    if (!isBrowser) return;
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  //Function to set a value in local storage
  static set(key: string, value: any) {
    if (!isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  //Remove key value from local storage by key

  static remove(key: string) {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  }

  //Clear all items from local storage mostly will be used in log out feature

  static clear() {
    if (!isBrowser) return;
    localStorage.clear();
  }
}
