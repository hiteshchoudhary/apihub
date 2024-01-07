import { AxiosResponse } from "axios";
import { FreeAPISuccessResponseInterface } from "../interfaces/api";

export const handleRequest = async (
  axiosRequest: () => Promise<
    AxiosResponse<FreeAPISuccessResponseInterface, any>
  >,
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: FreeAPISuccessResponseInterface) => void,
  onError: (errorMessage: string) => void
) => {
  try {
    setLoading && setLoading(true);

    const { data } = await axiosRequest();

    if (data?.success) {
      onSuccess(data);
    }
  } catch (error: any) {
    onError(
      error.response?.data.message || error.message || "Something went wrong"
    );
  } finally {
    setLoading && setLoading(false);
  }
};
