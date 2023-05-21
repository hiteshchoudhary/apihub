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
