import fs from "fs";

/**
 *
 * @param {object | any[]} obj
 * @returns {object | any[]}
 * @return {typeof obj}
 * @description function responsible for deep cloning the object/array to avoid mutation of the original entity
 */
export const deepClone = (obj) => {
  if (!obj) return obj;
  const result = Array.isArray(obj) ? [] : {};
  Object.entries(obj).map(([key, value]) => {
    if (typeof value !== "object") {
      result[key] = value;
    } else {
      result[key] = deepClone(obj[key]);
    }
  });
  return result;
};

/**
 *
 * @param {string[]} fieldsArray
 * @param {any[]} objectArray
 * @returns {any[]}
 * @description utility function to only include fields present in the fieldsArray
 * For example,
 * ```js
 * let fieldsArray = [
 * {
 * id:1,
 * name:"John Doe",
 * email:"john@doe.com"
 * phone: "123456"
 * },
 * {
 * id:2,
 * name:"Mark H",
 * email:"mark@h.com"
 * phone: "563526"
 * }
 * ]
 * let fieldsArray = ["name", "email"]
 * 
 * const filteredKeysObject = filterObjectKeys(fieldsArray, fieldsArray)
 * console.log(filteredKeysObject) 
 * 
//  Above line's output will be:
//  [
//      {
//        name:"John Doe",
//        email:"john@doe.com"
//      },
//      {
//        name:"Mark H",
//        email:"mark@h.com"
//      }
//  ]
 * 
 * ```
 */
export const filterObjectKeys = (fieldsArray, objectArray) => {
  const filteredArray = deepClone(objectArray).map((originalObj) => {
    let obj = {};
    deepClone(fieldsArray)?.forEach((field) => {
      if (field?.trim() in originalObj) {
        obj[field] = originalObj[field];
      }
    });
    if (Object.keys(obj).length > 0) return obj;
    return originalObj;
  });
  return filteredArray;
};

/**
 *
 * @param {any[]} dataArray
 * @param {number} page
 * @param {number} limit
 * @returns {{previousPage: string | null, currentPage: string, nextPage: string | null, data: any[]}}
 */
export const getPaginatedPayload = (dataArray, page, limit) => {
  const startPosition = +(page - 1) * limit;

  const totalItems = dataArray.length; // total documents present after applying search query

  dataArray = deepClone(dataArray).slice(startPosition, startPosition + limit);

  const payload = {
    page,
    limit,
    totalPages: Math.ceil(totalItems / limit),
    previousPage: page > 1 ? true : false,
    nextPage:
      dataArray.length === limit && deepClone(dataArray).pop()?.id < totalItems
        ? true
        : false,
    totalItems,
    currentPageItems: dataArray?.length,
    data: dataArray,
  };
  return payload;
};

/**
 *
 * @param {import("express").Request} req
 * @param {string} fileName
 * @description returns the file's static path from where the server is serving the static image
 */
export const getStaticFilePath = (req, fileName) => {
  return `${req.protocol}://${req.get("host")}/images/${fileName}`;
};

/**
 *
 * @param {string} fileName
 * @description returns the file's local path in the file system to assist future removal
 */
export const getLocalPath = (fileName) => {
  return `public/images/${fileName}`;
};

/**
 *
 * @param {string} localPath
 * @description Removed the image file from the local file system based on the file name
 */
export const removeImageFile = (localPath) => {
  fs.unlink(localPath, (err) => {
    if (err) console.log("Error while removing image files: ", err);
    else {
      console.log("Removed image:", localPath);
    }
  });
};
