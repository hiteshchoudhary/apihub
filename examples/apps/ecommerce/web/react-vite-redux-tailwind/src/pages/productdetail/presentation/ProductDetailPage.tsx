import ProductDetailsContainer from "../../../components/widgets/productdetails/container/ProductDetailsContainer";
import RelatedItemsListContainer from "../../../components/widgets/relateditemslist/container/RelatedItemsListContainer";

interface ProductDetailPageProps {
  productId: string;
  categoryId: string;
}
const ProductDetailPage = (props: ProductDetailPageProps) => {
  const { productId = "", categoryId = "" } = props;

  return (
    <div className="px-2 py-4 lg:px-10">
      <ProductDetailsContainer productId={productId} />
      <div className="mt-32">
        <RelatedItemsListContainer
          productId={productId}
          categoryId={categoryId}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
