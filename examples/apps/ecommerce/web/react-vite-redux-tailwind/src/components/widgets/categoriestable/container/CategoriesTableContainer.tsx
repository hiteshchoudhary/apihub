import { useCallback, useEffect, useState } from "react";
import CategoryService from "../../../../services/category/CategoryService";
import CategoriesTable from "../presentation/CategoriesTable";
import { Category } from "../../../../services/category/CategoryTypes";
import {
  convertUTCToLocalTime,
  formatDateTime,
} from "../../../../utils/dateTimeHelper";
import { DATE_TIME_FORMATS } from "../../../../constants";

const CategoriesTableContainer = () => {
  /* Key value categories object, key is id and value is the Category */
  const [categories, setCategories] = useState<{ [key: string]: Category }>({});

  /* To know if an error has occurred when fetching categories */
  const [isError, setIsError] = useState(false);

  const formatCategory = (category: Category) => {
    /* Cloning the object, so the original object from container doesn't get updated */
    category = { ...category };

    /* Converting all times to local and formatting them */
    category.createdAt = formatDateTime(
      convertUTCToLocalTime(
        category.createdAt,
        DATE_TIME_FORMATS.standardDateWithTime
      ),
      DATE_TIME_FORMATS.standardDateWithTime,
      DATE_TIME_FORMATS.displayedDateWithTime
    );

    category.updatedAt = formatDateTime(
      convertUTCToLocalTime(
        category.updatedAt,
        DATE_TIME_FORMATS.standardDateWithTime
      ),
      DATE_TIME_FORMATS.standardDateWithTime,
      DATE_TIME_FORMATS.displayedDateWithTime
    );
    return category;
  };

  /* Fetch All Categories Asynchronously */
  const fetchAllCategories = useCallback(() => {
    CategoryService.getAllCategoriesAsync((data, _, error) => {
      if (!error) {
        setCategories((prev) => {
          data.map((category) => {
            /* Formatting category */
            category = formatCategory(category);

            /* At key: Category ID, value is the category object */
            prev[category._id] = category;
          });
          return {...prev};
        });
      } else {
        console.error("Error -- fetchAllCategories()", error);
        setIsError(true);
      }
    });
  }, []);

  /* Once a category has been updated or added (In order to avoid another apiCall) */
  const onCategoryAddedOrUpdatedHandler = (
    newCategory: Category,
  ) => {
    /* Update category object at the categoryId */
    setCategories((prev) => {
      prev[newCategory._id] = formatCategory(newCategory);
      return {...prev};
    });
  };

  const onCategoryDeletedHandler = (deletedCategory: Category) => {
    /* Removing the key value pair of the deletedCategory */
    setCategories((prev) => {
      delete prev[deletedCategory._id]
      return {...prev};
    });
  };

  /* Initial Render */
  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  return (
    <>
      <CategoriesTable
        categories={Object.values(categories)}
        isError={isError}
        onCategoryAddedOrUpdatedHandler={onCategoryAddedOrUpdatedHandler}
        onCategoryDeletedHandler={onCategoryDeletedHandler}
      />
    </>
  );
};

export default CategoriesTableContainer;
