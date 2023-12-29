import { asyncHandler } from "../../utils/asyncHandler.js";

export const sendJpegImage = asyncHandler(async (req, res) => {
  return res.status(200).sendFile("/public/assets/images/ken_thompson.jpeg", {
    root: "./",
  });
});

export const sendJpgImage = asyncHandler(async (req, res) => {
  return res.status(200).sendFile("/public/assets/images/gaearon.jpg", {
    root: "./",
  });
});

export const sendPngImage = asyncHandler(async (req, res) => {
  return res.status(200).sendFile("/public/assets/images/rich_harris.png", {
    root: "./",
  });
});

export const sendSvgImage = asyncHandler(async (req, res) => {
  return res.status(200).sendFile("/public/assets/images/javascript.svg", {
    root: "./",
  });
});

export const sendWebpImage = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .sendFile("/public/assets/images/guido_van_rossum.webp", {
      root: "./",
    });
});
