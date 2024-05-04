import { useEffect, useState } from "react";
import CategoryList from "../presentation/CategoryList";
import { Category } from "../../../../services/category/CategoryTypes";
import CategoryService from "../../../../services/category/CategoryService";
import { createSearchParams } from "react-router-dom";
import { QUERY_PARAMS, ROUTE_PATHS } from "../../../../constants";
import useCustomNavigate from "../../../../hooks/useCustomNavigate";

const CategoryListContainer = () => {
  const navigate = useCustomNavigate();

  /* List of all categories */
  const [categories, setCategories] = useState<Category[]>([]);

  /* To know if an error has occurred when fetching categories */
  const [isError, setIsError] = useState(false);

  /* Fetch All Categories Asynchronously */
  const fetchAllCategories = () => {
    CategoryService.getAllCategoriesAsync((data, _, error) => {
      if (!error) {
        setCategories((prev) => [...prev, ...data]);
      } else {
        console.error("Error -- fetchAllCategories()", error);
        setIsError(true);
      }
    });
  };

  /* navigate to /products?category=<categoryId> */
  const categoryClickHandler = (category: Category) => {
    navigate({
      pathname: ROUTE_PATHS.products,
      search: createSearchParams({
        [QUERY_PARAMS.category]: category._id,
      }).toString(),
    });
  };

  /* Initial Render */
  useEffect(() => {
    fetchAllCategories();
  }, []);
  return (
    <CategoryList
      categories={categories}
      error={isError}
      categoryClickHandler={categoryClickHandler}
    />
  );
};

export default CategoryListContainer;
