import { useSearchParams } from "react-router-dom";
import ProductSearchPage from "../presentation/ProductSearchPage";
import { useMemo } from "react";
import { QUERY_PARAMS } from "../../../constants";


const ProductSearchPageContainer = () => {

    const [searchParams] = useSearchParams();

    /* Getting the product name searched from query params */
    const productNameSearched = useMemo(() => {
        return searchParams.get(QUERY_PARAMS.productNameSearch) || '';
    }, [searchParams])
    return (
        <ProductSearchPage productNameSearched={productNameSearched} />
    )
}

export default ProductSearchPageContainer;