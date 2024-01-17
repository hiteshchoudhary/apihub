// Importing necessary modules and interfaces
import { AxiosResponse } from "axios";
import { FreeAPISuccessResponseInterface } from "../interfaces/api";

// Check if the code is running in a browser environment
export const isBrowser = typeof window !== "undefined";

// A utility function for handling API requests with loading, success, and error handling
export const requestHandler = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: () => Promise<AxiosResponse<FreeAPISuccessResponseInterface, any>>,
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: FreeAPISuccessResponseInterface) => void,
  onError: (error: string) => void
) => {
  // Show loading state if setLoading function is provided
  setLoading && setLoading(true);
  try {
    // Make the API request
    const response = await api();
    const { data } = response;
    if (data?.success) {
      // Call the onSuccess callback with the response data
      onSuccess(data);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    onError(error?.response?.data?.message || "Something went wrong");
  } finally {
    // Hide loading state if setLoading function is provided
    setLoading && setLoading(false);
  }
};

// A utility function to concatenate CSS class names with proper spacing
export const classNames = (...className: string[]) => {
  // Filter out any empty class names and join them with a space
  return className.filter(Boolean).join(" ");
};
