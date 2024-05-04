import AllProductListContainer from "../../../components/widgets/allproductlist/container/AllProductListContainer";


interface ProductSearchPageProps {
    productNameSearched: string;
}
const ProductSearchPage = (props: ProductSearchPageProps) => {
    const {productNameSearched = ''} = props;
    return (
        <div className="px-2 py-4 lg:px-10">
            <AllProductListContainer productNameSearched={productNameSearched} />
        </div>
    )
}

export default ProductSearchPage;