import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const baseUrl = "https://api.metalpriceapi.com/v1/";

const getAllMetals = asyncHandler(async (req, res) => {
  const apiKey = getApiKey();

  try {
    const metals = await fetchAndValidateResponse(
      `${baseUrl}symbols?api_key=${apiKey}`,
      "Failed to fetch metals from external API"
    );

    res
      .status(200)
      .json(new ApiResponse(200, metals, "Metals fetched successfully"));
  } catch (error) {
    handleError(error, "Error fetching metals");
  }
});

const getLiveMetalRates = asyncHandler(async (req, res) => {
  const apiKey = getApiKey();

  try {
    const url = new URL(`${baseUrl}latest`);
    url.searchParams.append("api_key", apiKey);

    const rates = await fetchAndValidateResponse(
      url.toString(),
      "Failed to fetch metal rates from external API"
    );

    res
      .status(200)
      .json(new ApiResponse(200, rates, "Metal rates fetched successfully"));
  } catch (error) {
    handleError(error, "Error fetching metal rates");
  }
});

const getHistoricalMetalRates = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    throw new ApiError(400, "Date is required for historical rates");
  }

  const apiKey = getApiKey();

  try {
    const url = new URL(`${baseUrl}${date}`);
    url.searchParams.append("api_key", apiKey);

    const rates = await fetchAndValidateResponse(
      url.toString(),
      "Failed to fetch historical metal rates from external API"
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          rates,
          "Historical metal rates fetched successfully"
        )
      );
  } catch (error) {
    handleError(error, "Error fetching historical metal rates");
  }
});

const convertMetalRates = asyncHandler(async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    throw new ApiError(400, "From, to, and amount are required for conversion");
  }

  const apiKey = getApiKey();

  try {
    const url = new URL(`${baseUrl}convert`);
    url.searchParams.append("api_key", apiKey);
    url.searchParams.append("from", from);
    url.searchParams.append("to", to);
    url.searchParams.append("amount", amount);

    const conversion = await fetchAndValidateResponse(
      url.toString(),
      "Failed to convert metal rates from external API"
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, conversion, "Metal rates converted successfully")
      );
  } catch (error) {
    handleError(error, "Error converting metal rates");
  }
});

const getTimeframeMetalRates = asyncHandler(async (req, res) => {
  const { start_date, end_date, base = "USD", currencies } = req.query;

  if (!start_date || !end_date) {
    throw new ApiError(
      400,
      "Start date and end date are required for timeframe rates"
    );
  }

  const apiKey = getApiKey();

  try {
    const url = new URL(`${baseUrl}timeframe`);
    url.searchParams.append("api_key", apiKey);
    url.searchParams.append("start_date", start_date);
    url.searchParams.append("end_date", end_date);
    url.searchParams.append("base", base);
    if (currencies) url.searchParams.append("currencies", currencies);

    const rates = await fetchAndValidateResponse(
      url.toString(),
      "Failed to fetch timeframe metal rates from external API"
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          rates,
          "Timeframe metal rates fetched successfully"
        )
      );
  } catch (error) {
    handleError(error, "Error fetching timeframe metal rates");
  }
});

// Helper functions
const fetchAndValidateResponse = async (url, errorMessage) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new ApiError(response.status, errorMessage);
  }

  const data = await response.json();

  if (!data || data.success === false) {
    throw new ApiError(500, data.error || "Invalid response from API");
  }

  return data;
};

const getApiKey = () => {
  const apiKey = process.env.METAL_PRICE_API_KEY;
  if (!apiKey) {
    throw new ApiError(500, "API key is not configured");
  }
  return apiKey;
};

const handleError = (error, message) => {
  console.error(message, error);
  if (error instanceof ApiError) {
    throw error;
  }
  throw new ApiError(500, message);
};

export {
  getAllMetals,
  getLiveMetalRates,
  getHistoricalMetalRates,
  convertMetalRates,
  getTimeframeMetalRates,
};
