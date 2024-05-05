import { useTranslation } from "react-i18next";
import { Product } from "../../../../services/product/ProductTypes";
import CardContainer from "../../../business/CardContainer";
import ErrorMessage from "../../../basic/ErrorMessage";
import ProductList from "../../../business/ProductList";

interface RelatedItemsListProps {
  isError?: boolean;
  relatedProducts: Product[];
}
const RelatedItemsList = (props: RelatedItemsListProps) => {
  const { relatedProducts, isError = false } = props;

  const { t } = useTranslation();
  return (
    <CardContainer heading={t("relatedItems")}>
      {isError ? (
        <ErrorMessage
          message={t("pleaseTryAgainLater")}
          className="justify-center mt-4"
        />
      ) : (
        <ProductList products={relatedProducts} className="mt-4" />
      )}
    </CardContainer>
  );
};

export default RelatedItemsList;
