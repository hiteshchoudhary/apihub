import { asyncHandler } from "../../utils/asyncHandler.js";

const sendJpegImage = asyncHandler(async (req, res) => {
  return res.status(200).sendFile("/public/assets/ken_thompson.jpeg", {
    root: "./",
  });
});

const sendJpgImage = asyncHandler(async (req, res) => {
  return res.status(200).sendFile("/public/assets/gaearon.jpg", {
    root: "./",
  });
});

const sendPngImage = asyncHandler(async (req, res) => {
  return res.status(200).sendFile("/public/assets/rich_harris.png", {
    root: "./",
  });
});

const sendSvgImage = asyncHandler(async (req, res) => {
  return res.status(200).sendFile("/public/assets/javascript.svg", {
    root: "./",
  });
});

const sendWebpImage = asyncHandler(async (req, res) => {
  return res.status(200).sendFile("/public/assets/guido_van_rossum.webp", {
    root: "./",
  });
});

export {
  sendJpegImage,
  sendJpgImage,
  sendPngImage,
  sendSvgImage,
  sendWebpImage,
};
