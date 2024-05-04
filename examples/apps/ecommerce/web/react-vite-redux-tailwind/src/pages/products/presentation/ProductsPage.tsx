import AllProductListContainer from "../../../components/widgets/allproductlist/container/AllProductListContainer";

interface ProductsPageProps {
  categoryId?: string;
}
const ProductsPage = (props: ProductsPageProps) => {
  const { categoryId = "" } = props;

  return (
    <div className="px-2 py-4 lg:px-10">
      <AllProductListContainer categoryId={categoryId} />
    </div>
  );
};

export default ProductsPage;
