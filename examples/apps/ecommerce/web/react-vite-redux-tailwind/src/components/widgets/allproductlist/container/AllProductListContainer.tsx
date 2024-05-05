import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ProductService from "../../../../services/product/ProductService";
import { Product } from "../../../../services/product/ProductTypes";
import AllProductList from "../presentation/AllProductList";
import { ProductFilterFields } from "../../../../constants";

interface AllProductListContainerProps {
  categoryId?: string;
  productNameSearched?: string;
}
const AllProductListContainer = (props: AllProductListContainerProps) => {
  const { categoryId = "", productNameSearched = "" } = props;

  const { t } = useTranslation();

  /* Loading flag */
  const [isLoading, setIsLoading] = useState(false);

  /* Error flag: When fetching products */
  const [isError, setIsError] = useState(false);

  /* Products List */
  const [products, setProducts] = useState<Product[]>([]);

  /* Filtered Products List */
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  /* Displayed Products List */
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);

  /* Category name if categoryId is passed */
  const [categoryName, setCategoryName] = useState("");

  /* Flag to store when data fetching has started*/
  const isFetchingDataStarted = useRef(false);

  const setDisplayedProductsForSearch = (data: Product[]) => {
    setDisplayedProducts((prev) => {
      /* If there is space for more products to be shown */
      if (prev.length <= ProductService.defaultPageLimit) {
        /* slice from 0 to the page limit */
        prev = [
          ...prev,
          ...data.slice(0, ProductService.defaultPageLimit - prev.length),
        ];
      }
      return prev;
    });
  };
  
  const fetchProducts = useCallback(async () => {
    /* Data fetching has started */
    isFetchingDataStarted.current = true;

    /* Hiding error, Displaying loading spinner, Resetting products list state */
    setIsError(false);
    setIsLoading(true);
    setProducts([]);
    setFilteredProducts([]);

    /* Used to set displayed products list on first response */
    let isFirstResponse = true;

    ProductService.getAllProductsAsync((data, _, error, categoryInfo) => {
      if (!error) {

        /* If productNameIsSearched, filter data by product name */
        if (productNameSearched) {
          data = data.filter((product) =>
            product.name
              ?.toLowerCase()
              ?.includes(productNameSearched?.toLowerCase())
          );
        }

        /* Set overall products list */
        setProducts((prev) => [...prev, ...data]);
        setFilteredProducts((prev) => [...prev, ...data]);

        /* If productNameIsSearched set displayed products list by checking page limit */
        if (productNameSearched) {
          setDisplayedProductsForSearch(data);
        }

        /* On first response, set displayed products list, category name and hide loading spinner */
        if (isFirstResponse) {
          if (!productNameSearched) {
            setDisplayedProducts(data);
          }

          if (categoryInfo) {
            setCategoryName(categoryInfo.name);
          }
          setIsLoading(false);
        }
      } else {
        setIsError(true);
        setProducts([]);
        setFilteredProducts([]);
      }
      isFirstResponse = false;
    }, categoryId);

    /* Hide Loading spinner */
    setIsLoading(false);
  }, [categoryId, productNameSearched]);

  /* Load more handler */
  const loadMoreHandler = () => {
    /**
     * Append to displayed products list from the end of filtered products list + the default page limit
     */
    setDisplayedProducts((prev) => [
      ...prev,
      ...filteredProducts.slice(
        prev.length,
        prev.length + ProductService.defaultPageLimit
      ),
    ]);
  };

  const resetFilterHandler = () => {
    /* Setting filtered products list to the entire product list */
    setFilteredProducts(products);

    /* Setting displayed products from the complete product list */
    setDisplayedProducts(products.slice(0, ProductService.defaultPageLimit));
  };

  /* Filtering products */
  const onFiltersChanged = (fields: ProductFilterFields) => {
    /* From the entire list of products */
    const filtered = products.filter((product) => {
      /* Price filter */
      if (
        product.price >= Number(fields.price.min) &&
        product.price <= Number(fields.price.max)
      ) {
        return true;
      }
      return false;
    });

    /* Setting filtered product list */
    setFilteredProducts(filtered);

    /* Displayed product list from the list of filtered products */
    setDisplayedProducts(filtered.slice(0, ProductService.defaultPageLimit));
  };

  useEffect(() => {
    if (!isFetchingDataStarted.current) {
      fetchProducts();
    }
  }, [fetchProducts]);

  return (
    <AllProductList
      heading={
        productNameSearched
          ? t("searchResults")
          : categoryId && categoryName
            ? categoryName
            : t("ourProducts")
      }
      products={displayedProducts}
      error={isError ? true : false}
      loadMoreShown={
        filteredProducts.length > displayedProducts.length ? true : false
      }
      loadMore={loadMoreHandler}
      isLoading={isLoading}
      onFiltersChanged={onFiltersChanged}
      resetFilterHandler={resetFilterHandler}
    />
  );
};

export default AllProductListContainer;
