import { useEffect, useState } from "react";
import { Product } from "../../../../services/product/ProductTypes";
import ProductService from "../../../../services/product/ProductService";
import FeaturedProductList from "../presentation/FeaturedProductList";
import { FEATURED_PRODUCTS_COUNT } from "../../../../data/applicationData";
import { ROUTE_PATHS } from "../../../../constants";
import useCustomNavigate from "../../../../hooks/useCustomNavigate";

const FeaturedProductListContainer = () => {
  
  const navigate = useCustomNavigate();

  /* List of products */
  const [products, setProducts] = useState<Product[]>([]);

  /* True/False: Representing any error when fetching featured products */
  const [isError, setIsError] = useState(false);

  /* Fetch featured products */
  const fetchFeaturedProducts = async () => {
    const response = await ProductService.getTopOnSaleProducts(FEATURED_PRODUCTS_COUNT);

    if (Array.isArray(response)) {
      setProducts(response);
    } else {
      // Error 
      setIsError(true);
    }
  };

  /* navigate to /products */
  const viewAllClickHandler = () => {
    navigate(ROUTE_PATHS.products);
  }

  /* Initial Render */
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);
  return <FeaturedProductList products={products} error={isError} viewAllClickHandler={viewAllClickHandler}/>;
};

export default FeaturedProductListContainer;
