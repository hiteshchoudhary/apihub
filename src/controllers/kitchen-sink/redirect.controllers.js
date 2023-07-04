import { asyncHandler } from "../../utils/asyncHandler.js";

const redirectToTheUrl = asyncHandler(async (req, res) => {
  const { url } = req.query;

  return res.status(301).redirect(url);
});

export { redirectToTheUrl };
