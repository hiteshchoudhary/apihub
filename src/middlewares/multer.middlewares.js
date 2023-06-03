import multer from "multer";

// Middleware responsible to read form data and upload the File object to the mentioned path
export const upload = multer({
  dest: "public/images",
});
