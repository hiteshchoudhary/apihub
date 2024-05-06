import { useCallback, useEffect, useRef, useState } from "react";
import { Product } from "../../../../services/product/ProductTypes";
import ProductService from "../../../../services/product/ProductService";
import ProductsTable from "../presentation/ProductsTable";
import CategoryService from "../../../../services/category/CategoryService";
import ApiError from "../../../../services/ApiError";

export interface ProductWithCategoryName extends Product {
  categoryName: string;
}
const ProductsTableContainer = () => {
  /* Key value products object, key is product id and value is the Product */
  const [products, setProducts] = useState<{
    [key: string]: ProductWithCategoryName;
  }>({});

  /* To store category names as object, id is categoryId and value is categoryName */
  const categoryNames = useRef<{ [key: string]: string }>({});

  /* To know if an error has occurred when fetching products */
  const [isError, setIsError] = useState(false);

  /* Get category name by categoryId */
  const getCategoryName = async (categoryId: string): Promise<string> => {
    /* Checking for category name locally */
    const categoryName = categoryNames.current?.[categoryId];

    /* If the category name is not found */
    if (!categoryName) {
      /* Fetch category by id */
      const response = await CategoryService.getCategoryById(categoryId);

      /* Success return category name */
      if (!(response instanceof ApiError)) {
        /* Save it in memory */
        categoryNames.current[categoryId] = response.name;

        return response.name;
      } else {
        /* Return empty string */
        return "";
      }
    }
    return categoryName;
  };

  const fetchProducts = useCallback(async () => {
    /* Hiding error, Displaying loading spinner, Resetting products list state */
    setIsError(false);

    /* Get all products asynchronously */
    ProductService.getAllProductsAsync(async (data, _, error) => {
      /* Success */
      if (!error) {
        const tempProducts: typeof products = {};

        /* Iterating through fetched products */
        for (const product of data) {
          /* Category Name*/
          const categoryName = await getCategoryName(product.category)

          /* Set products state */
          tempProducts[product._id] = { ...product, categoryName };
        }

        /* Set products */
        setProducts((prev) => {
          return { ...prev, ...tempProducts };
        });
      } else {
        /* API Error */
        setIsError(true);
      }
    });
  }, []);

  /* Once a product has been updated or added (In order to avoid another apiCall) */
  const onProductAddedOrUpdatedHandler = async (newProduct: Product) => {
    /* Getting the category name */
    const categoryName = await getCategoryName(newProduct.category);
    
    /* Update products object at the productId */
    setProducts((prev) => {
      prev[newProduct._id] = {
        ...newProduct,
        categoryName
      };

      return { ...prev };
    });
  };

  const onProductDeletedHandler = (deletedProduct: Product) => {
    /* Removing the key value pair of the deletedProduct */
    setProducts((prev) => {
      delete prev[deletedProduct._id];
      return { ...prev };
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <ProductsTable
        products={Object.values(products)}
        onProductAddedOrUpdated={onProductAddedOrUpdatedHandler}
        onProductDeletedHandler={onProductDeletedHandler}
        isError={isError}
      />
    </>
  );
};

export default ProductsTableContainer;
