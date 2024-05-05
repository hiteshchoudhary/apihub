import { CATEGORY_ICONS } from "../../data/applicationData";
import { Category } from "../../services/category/CategoryTypes";
import GeneralCategoryIcon from "../icons/GeneralCategoryIcon";
import Button from "../basic/Button";

interface CategoryProps {
  category: Category;
  className?: string;
  categoryClickHandler?(category: Category): void
}
const CategoryCard = (props: CategoryProps) => {
  const { category, className = '', categoryClickHandler } = props;
  return (
    <Button
      className={`flex flex-col border-2 border-grey rounded items-center justify-around px-12 py-6 text-black active:bg-darkRed  active:text-zinc-50 ${className}`}
      onClickHandler={() => categoryClickHandler ? categoryClickHandler(category) : () => {}}
    >
      <>
        <div>{CATEGORY_ICONS?.[category._id] || <GeneralCategoryIcon className="w-10 h-10" />}</div>

        <span className="mt-4 capitalize">{category.name}</span>
      </>
    </Button>
  );
};

export default CategoryCard;
