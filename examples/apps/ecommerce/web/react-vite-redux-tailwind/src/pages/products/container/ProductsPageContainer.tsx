import { useMemo } from "react";
import ProductsPage from "../presentation/ProductsPage";
import { useSearchParams } from "react-router-dom";
import { QUERY_PARAMS } from "../../../constants";

const ProductsPageContainer = () => {
  /* Search params */
  const [searchParams] = useSearchParams();

  /* Getting the category id from the search parameters */
  const categoryId = useMemo(() => {
    return searchParams.get(QUERY_PARAMS.category);
  }, [searchParams]);

  return <ProductsPage categoryId={categoryId ? categoryId : undefined} />;
};

export default ProductsPageContainer;
