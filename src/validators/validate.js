import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { errorHandler } from "../middlewares/error.middlewares.js";
import { removeImageFile } from "../utils/helpers.js";
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @description This is the validate middleware responsible to centralize the error checking done by the `express-validator` `ValidationChains`.
 * This checks if the request validation has errors.
 * If yes then it structures them and throws an {@link ApiError} which forwards the error to the {@link errorHandler} middleware which throws a uniform response at a single place
 *
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  const multerFile = req.file;
  const multerFiles = req.files;

  if (multerFile) {
    // If there is file uploaded and there is validation error
    // We want to remove that file
    removeImageFile(multerFile.path);
  }

  if (multerFiles) {
    /** @type {Express.Multer.File[][]}  */
    const filesValueArray = Object.values(multerFiles);
    // If there are multiple files uploaded for more than one fields
    // We want to remove those files as well
    filesValueArray.map((fileFields) => {
      fileFields.map((fileObject) => {
        removeImageFile(fileObject.path);
      });
    });
  }

  // 422: Unprocessable Entity
  throw new ApiError(422, "Received data is not valid", extractedErrors);
};
