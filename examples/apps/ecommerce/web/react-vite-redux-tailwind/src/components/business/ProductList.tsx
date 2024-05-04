import { Product } from "../../services/product/ProductTypes";
import { useAppSelector } from "../../store";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  className?: string
}
const ProductList = (props: ProductListProps) => {
  const { products, className } = props;

  const isRTL = useAppSelector(state => state.language.isRTL)
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`} dir={isRTL ? 'rtl': 'ltr'}>
      {products.map((product) => (
        <div key={product._id}>
          <ProductCard
            product={product}
            className=""
            imageContainerClassName="h-56"
          />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
