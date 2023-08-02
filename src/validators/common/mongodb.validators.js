import { body, param } from "express-validator";

/**
 *
 * @param {string} idName
 * @description A common validator responsible to validate mongodb ids passed in the url's path variable
 */
export const mongoIdPathVariableValidator = (idName) => {
  return [
    param(idName).notEmpty().isMongoId().withMessage(`Invalid ${idName}`),
  ];
};

/**
 *
 * @param {string} idName
 * @description A common validator responsible to validate mongodb ids passed in the request body
 */
export const mongoIdRequestBodyValidator = (idName) => {
  return [body(idName).notEmpty().isMongoId().withMessage(`Invalid ${idName}`)];
};