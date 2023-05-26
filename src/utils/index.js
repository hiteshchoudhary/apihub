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
  const filteredArray = [...objectArray].map((originalObj) => {
    let obj = {};
    fieldsArray?.forEach((field) => {
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
 * @param {number} totalDataCount
 * @param {import("express").Request} req
 * @param {number} page
 * @param {number} limit
 * @returns {{previousPage: string | null, currentPage: string, nextPage: string | null, data: any[]}}
 */
export const getPaginatedPayload = (
  dataArray,
  totalDataCount,
  req,
  page,
  limit
) => {
  const prevPageUrl = `${
    req.protocol + "://" + req.get("host") + req.baseUrl
  }?page=${page - 1}&limit=${limit}`;
  const nextPageUrl = `${
    req.protocol + "://" + req.get("host") + req.baseUrl
  }?page=${page + 1}&limit=${limit}`;

  const payload = {
    previousPage: page > 1 ? prevPageUrl : null,
    currentPage: `${req.protocol + "://" + req.get("host") + req.originalUrl}`,
    nextPage:
      dataArray.length === limit && [...dataArray].pop()?.id < totalDataCount
        ? nextPageUrl
        : null,
    totalCount: totalDataCount,
    currentPageCount: dataArray?.length,
    data: dataArray,
  };
  return payload;
};
