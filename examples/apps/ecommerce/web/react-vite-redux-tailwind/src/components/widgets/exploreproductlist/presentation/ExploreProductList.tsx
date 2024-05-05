import { useTranslation } from "react-i18next";
import CardContainer from "../../../business/CardContainer";
import { CARD_CONTAINER_OPTION } from "../../../../constants";
import { Product } from "../../../../services/product/ProductTypes";
import ErrorMessage from "../../../basic/ErrorMessage";
import ProductList from "../../../business/ProductList";

interface ExploreProductListProps {
  products: Product[];
  error?: boolean;
  viewAllClickHandler(): void;
}
const ExploreProductList = (props: ExploreProductListProps) => {
  const { products, error = false, viewAllClickHandler } = props;
  const { t } = useTranslation();
  return (
    <CardContainer
      heading={t("ourProducts")}
      subHeading={t("exploreOurProducts")}
      extraOption={CARD_CONTAINER_OPTION.BOTTOM_BUTTON}
      extraOptionButtonText={t("viewAllProducts")}
      extraOptionButtonClickHandler={viewAllClickHandler}
    >
      {error ? (
        <ErrorMessage message={t("pleaseTryAgainLater")} className="justify-center"/>
      ) : (
        <ProductList products={products} className="mt-4" />
      )}
    </CardContainer>
  );
};

export default ExploreProductList;
