import ApiError from "../ApiError";
import ApiResponse from "../ApiResponse";
import CountryApiRequest from "../CountryApiRequest";
import { StatesOfACountryResponse } from "./CountryApiTypes";

class CountryApiService {
  COUNTRIES_END_POINT = "/countries";
  STATE_END_POINT = "/state"
  STATES_END_POINT = "/states";
  CITIES_END_POINT = "/cities";

  async getStatesOfACountry(
    countryName: string
  ): Promise<StatesOfACountryResponse | ApiError> {
    const apiRequest = new CountryApiRequest(
      `${this.COUNTRIES_END_POINT}${this.STATES_END_POINT}`
    );

    const response = await apiRequest.postRequest<StatesOfACountryResponse>({
      country: countryName,
    });

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    } else {
      return response;
    }
  }

  async getCitiesOfAState(
    countryName: string,
    stateName: string
  ): Promise<Array<string> | ApiError> {
    const apiRequest = new CountryApiRequest(
      `${this.COUNTRIES_END_POINT}${this.STATE_END_POINT}${this.CITIES_END_POINT}`
    );

    const response = await apiRequest.postRequest<Array<string>>({
      country: countryName,
      state: stateName,
    });

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    } else {
      return response;
    }
  }
}

export default new CountryApiService();
