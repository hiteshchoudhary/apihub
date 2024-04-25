import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { CARD_CONTAINER_OPTION } from "../../../../constants";
import { Category } from "../../../../services/category/CategoryTypes";
import { useAppSelector } from "../../../../store";
import ErrorMessage from "../../../basic/ErrorMessage";
import CardContainer from "../../../business/CardContainer";
import CategoryCard from "../../../business/CategoryCard";

interface CategoryList {
  categories: Category[];
  error: boolean;
  categoryClickHandler(category: Category) : void; 
}
const CategoryList = (props: CategoryList) => {
  const { categories, error, categoryClickHandler } = props;
  const { t } = useTranslation();

  /* Category Card Container Reference */
  const categoryContainerRef = useRef<HTMLDivElement>(null);

  const isRTL = useAppSelector((state) => state.language.isRTL);

  return (
    <CardContainer
      heading={t("categories")}
      subHeading={t("browseByCategory")}
      extraOption={CARD_CONTAINER_OPTION.CAROUSEL}
      carouselScrollableElementRef = {categoryContainerRef}
    >
     {
      error ? 
      <ErrorMessage message={t('pleaseTryAgainLater')} className="justify-center" />
      :
      <div
        className="flex overflow-auto no-scrollbar mt-4"
        ref={categoryContainerRef}
        dir={isRTL ? 'rtl': 'ltr'}
      >
        {categories.map((category) => (
          <div key={category._id} className="mr-4 p-1">
            <CategoryCard category={category} className="w-40 h-36" categoryClickHandler={categoryClickHandler} />
          </div>
        ))}
      </div>}
    </CardContainer>
  );
};

export default CategoryList;
