import newsJson from "../../json/news.json" assert { type: "json" };
import { getPaginatedPayload } from "../../utils/helpers.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getNews = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const query = req.query.query?.toLowerCase().trim(); // search query

  // Clean the news array by removing .inc from categories
  let newsArray = structuredClone(newsJson).map((news) => ({
    ...news,
    category: news.category.replace(/\.inc$/i, "").trim(),
  }));

  // Filter by query if provided
  if (query) {
    newsArray = newsArray.filter((news) => {
      const lowerTitle = news.title.toLowerCase();
      const lowerDescription = news.description.toLowerCase();
      const lowerCategory = news.category.toLowerCase();
      const lowerAuthor = news.author.toLowerCase();

      return (
        lowerTitle.indexOf(query) !== -1 ||
        lowerDescription.indexOf(query) !== -1 ||
        lowerCategory.indexOf(query) !== -1 ||
        lowerAuthor.indexOf(query) !== -1
      );
    });
  }

  const paginatedNews = getPaginatedPayload(newsArray, page, limit);

  return res
    .status(200)
    .json(new ApiResponse(200, paginatedNews, "News fetched successfully"));
});

const getNewsById = asyncHandler(async (req, res) => {
  const { newsId } = req.params;

  // Parse newsId as integer
  const requestedId = parseInt(newsId, 10);

  if (isNaN(requestedId)) {
    throw new ApiError(400, "Invalid news ID provided.");
  }

  // Find the news by matching ID exactly
  const news = newsJson.find((newsItem) => newsItem.id === requestedId);

  if (!news) {
    throw new ApiError(404, "News does not exist.");
  }

  // Clean the category by removing .inc suffix
  const cleanedNews = {
    ...news,
    category: news.category.replace(/\.inc$/i, "").trim(),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, cleanedNews, "News fetched successfully"));
});

const getARandomNews = asyncHandler(async (req, res) => {
  // Generate a truly random index each time
  const newsArray = newsJson;
  const randomIndex = Math.floor(Math.random() * newsArray.length);
  const randomNews = newsArray[randomIndex];

  // Clean the category by removing .inc suffix
  const cleanedNews = {
    ...randomNews,
    category: randomNews.category.replace(/\.inc$/i, "").trim(),
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, cleanedNews, "Random news fetched successfully")
    );
});

export { getNews, getARandomNews, getNewsById };
