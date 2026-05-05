import { asyncHandler } from "../../utils/asyncHandler.js";

const redirectToTheUrl = asyncHandler(async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const parsedUrl = new URL(url);
    const allowedDomains = ["localhost", "127.0.0.1"];

    if (!allowedDomains.includes(parsedUrl.hostname)) {
      return res.status(400).json({ error: "Invalid redirect URL" });
    }

    return res.status(301).redirect(url);
  } catch (error) {
    return res.status(400).json({ error: "Invalid URL format" });
  }
});

export { redirectToTheUrl };
