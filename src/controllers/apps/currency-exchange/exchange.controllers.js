import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const baseUrl = "https://api.transferwise.com/v1/";

const getAllCurrencies = asyncHandler(async (req, res) => {
  const apiKey = getApiKey();

  try {
    const currencies = await fetchAndValidateResponse(
      `${baseUrl}/currencies`,
      apiKey,
      "Failed to fetch currencies from external API"
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, currencies, "Currencies fetched successfully")
      );
  } catch (error) {
    handleError(error, "Error fetching currencies");
  }
});

const getLiveExchangeRate = asyncHandler(async (req, res) => {
  const { source = "EUR", target = "INR" } = req.query;

  const apiKey = getApiKey();

  try {
    const rates = await fetchHistoricalExchangeRates(
      apiKey,
      source,
      target,
      validateAndParseTime()
    );

    res
      .status(200)
      .json(new ApiResponse(200, rates, "Exchange rates fetched successfully"));
  } catch (error) {
    handleError(error, "Error fetching exchange rates");
  }
});

const getHistoricalExchangeRate = asyncHandler(async (req, res) => {
  const { source = "EUR", target = "INR", time } = req.query;

  if (!validateCurrencyCodes(source, target)) {
    res
      .status(400)
      .json(
        new ApiError(
          400,
          "Invalid currency code. Please check and try again",
          "Invalid currency code. Please check and try again"
        )
      );
  }
  const parsedTime = validateAndParseTime(time);
  if (!parsedTime) {
    res
      .status(400)
      .json(
        new ApiError(
          400,
          "Invalid date. Must be between 2015-09-01 and today.",
          "Invalid date. Must be between 2015-09-01 and today."
        )
      );
  }

  const apiKey = getApiKey();

  try {
    const rates = await fetchHistoricalExchangeRates(
      apiKey,
      source,
      target,
      parsedTime
    );
    res
      .status(200)
      .json(new ApiResponse(200, rates, "Exchange rates fetched successfully"));
  } catch (error) {
    handleError(error, "Error fetching historical exchange rates");
  }
});

const getAggregatedHistoricalExchangeRate = asyncHandler(async (req, res) => {
  const {
    source = "EUR",
    target = "INR",
    start,
    end,
    aggregate = "hour",
  } = req.query;

  if (!validateCurrencyCodes(source, target)) {
    res
      .status(400)
      .json(
        new ApiError(
          400,
          "Invalid currency code. Please check and try again",
          "Invalid currency code. Please check and try again"
        )
      );
  }
  const startTime = validateAndParseTime(start);
  if (!startTime) {
    res
      .status(400)
      .json(
        new ApiError(
          400,
          "Invalid date. Must be between 2015-09-01 and today.",
          "Invalid date. Must be between 2015-09-01 and today."
        )
      );
  }
  const endTime = validateAndParseTime(end);
  if (!endTime) {
    res
      .status(400)
      .json(
        new ApiError(
          400,
          "Invalid date. Must be between 2015-09-01 and today.",
          "Invalid date. Must be between 2015-09-01 and today."
        )
      );
  }

  const apiKey = getApiKey();
  const queryParams = new URLSearchParams({
    source: source.toUpperCase(),
    target: target.toUpperCase(),
    from: startTime.toISOString(),
    to: endTime.toISOString(),
    group: aggregate,
  });

  const apiUrl = `${baseUrl}/rates?${queryParams}`;
  console.log(apiUrl, "HERE IS THE URL YOURE TRYING TO HIT");

  try {
    const rates = await fetchAndValidateResponse(
      apiUrl,
      apiKey,
      "Failed to fetch exchange rates from external API"
    );

    res
      .status(200)
      .json(new ApiResponse(200, rates, "Exchange rates fetched successfully"));
  } catch (error) {
    handleError(error, "Error fetching historical exchange rates");
  }
});

// Helper functions
const fetchAndValidateResponse = async (url, apiKey, errorMessage) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, errorMessage);
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new ApiError(500, "Invalid response from API");
  }

  return data;
};

const fetchCurrencies = async (apiKey) => {};

const fetchHistoricalExchangeRates = async (
  apiKey,
  source,
  target,
  parsedTime,
  aggregate
) => {
  const queryParams = new URLSearchParams({
    source: source.toUpperCase(),
    target: target.toUpperCase(),
    time: parsedTime.toISOString(),
    aggregate,
  });

  const apiUrl = `${baseUrl}/rates?${queryParams}`;
  return fetchAndValidateResponse(
    apiUrl,
    apiKey,
    "Failed to fetch exchange rates from external API"
  );
};

const validateCurrencyCodes = (source, target) => {
  if (!/^[A-Z]{3}$/.test(source) || !/^[A-Z]{3}$/.test(target)) {
    return false;
  }
  return true;
};

const validateAndParseTime = (time) => {
  if (time) {
    const parsedTime = new Date(time);
    if (
      isNaN(parsedTime) ||
      parsedTime > new Date() ||
      parsedTime < new Date("2015-09-01")
    ) {
      return null;
    }
    return parsedTime;
  }
  return new Date();
};

const getApiKey = () => {
  const apiKey = process.env.WISE_API_KEY;
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
  getAllCurrencies,
  getLiveExchangeRate,
  getHistoricalExchangeRate,
  getAggregatedHistoricalExchangeRate,
};
