import { useTranslation } from "react-i18next";
import { Product } from "../../../../services/product/ProductTypes";
import CardContainer from "../../../business/CardContainer";
import ProductList from "../../../business/ProductList";
import ErrorMessage from "../../../basic/ErrorMessage";
import {
  CARD_CONTAINER_OPTION,
  ProductFilterFields,
} from "../../../../constants";
import ProductFilters from "../../../business/ProductFilters";
import { useAppSelector } from "../../../../store";

interface AllProductListProps {
  products: Product[];
  heading: string;
  error?: boolean;
  isLoading?: boolean;
  loadMoreShown: boolean;
  loadMore(): void;
  onFiltersChanged(fields: ProductFilterFields): void;
  resetFilterHandler(): void;
}
const AllProductList = (props: AllProductListProps) => {
  const {
    products,
    heading,
    error = false,
    isLoading = false,
    loadMoreShown = true,
    loadMore,
    onFiltersChanged,
    resetFilterHandler,
  } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  return (
    <CardContainer
      heading={heading}
      extraOption={
        loadMoreShown ? CARD_CONTAINER_OPTION.BOTTOM_BUTTON : undefined
      }
      extraOptionButtonText={t("loadMore")}
      extraOptionButtonClickHandler={loadMore}
      isLoadingButton={isLoading}
    >
      <div className="lg:flex lg:flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <ProductFilters
          onFiltersChanged={onFiltersChanged}
          resetFilterHandler={resetFilterHandler}
          className="lg:self-end lg:mt-2 lg:mb-2"
        />
        <ProductList products={products} className="mt-4" />
        {error && (
          <ErrorMessage
            message={t("pleaseTryAgainLater")}
            className="justify-center"
          />
        )}
      </div>
    </CardContainer>
  );
};

export default AllProductList;
