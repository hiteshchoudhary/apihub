import { useSearchParams } from "react-router-dom";
import ProductDetailPage from "../presentation/ProductDetailPage";
import { QUERY_PARAMS } from "../../../constants";
import { useEffect, useMemo } from "react";

const ProductDetailPageContainer = () => {
  const [searchParams] = useSearchParams();

  /* Getting the productId and categoryId from search parameters */
  const productId = useMemo(() => {
    return searchParams.get(QUERY_PARAMS.productId);
  }, [searchParams]);

  const categoryId = useMemo(() => {
    return searchParams.get(QUERY_PARAMS.categoryId);
  }, [searchParams]);

  /* Scroll to top when search params change */
  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }, [searchParams])

  return (
    <>
      <ProductDetailPage
        productId={productId ? productId : ""}
        categoryId={categoryId ? categoryId : ""}
      />
    </>
  );
};

export default ProductDetailPageContainer;
