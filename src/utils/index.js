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
  const payload = {
    previousPage:
      page > 1
        ? `${req.protocol + "://" + req.get("host") + req.baseUrl}?page=${
            page - 1
          }&limit=${limit}`
        : null,
    currentPage: `${req.protocol + "://" + req.get("host") + req.originalUrl}`,
    nextPage:
      dataArray.length === limit && [...dataArray].pop()?.id < totalDataCount
        ? `${req.protocol + "://" + req.get("host") + req.baseUrl}?page=${
            page + 1
          }&limit=${limit}`
        : null,
    data: dataArray,
  };
  return payload;
};
