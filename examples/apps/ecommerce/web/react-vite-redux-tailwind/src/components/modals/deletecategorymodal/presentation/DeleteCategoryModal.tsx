import { useTranslation } from "react-i18next";
import { Category } from "../../../../services/category/CategoryTypes";
import Modal from "../../../basic/Modal";
import Text from "../../../basic/Text";

interface DeleteCategoryModalProps {
    category: Category;
    deleteCategoryHandler(): void;
    isLoading?: boolean;
    cancelButtonHandler(): void;
  }
const DeleteCategoryModal = (props: DeleteCategoryModalProps) => {
    const {category, deleteCategoryHandler, isLoading, cancelButtonHandler} = props;

    const {t} = useTranslation();
    return (
        <Modal
            heading={t("deleteCategory")}
            className="px-8 py-6 w-[95%] lg:w-1/3"
            primaryButtonText={t("yes")}
            primaryButtonClassname="uppercase"
            secondaryButtonText={t("cancel")}
            secondaryButtonClassname="uppercase"
            secondaryButtonHandler={cancelButtonHandler}
            primaryButtonHandler={deleteCategoryHandler}
            isPrimaryButtonLoading={isLoading}
        >
            <div className="flex flex-col items-center gap-y-4">
                <Text className="capitalize">
                    {t("areYouSureYouWantToDeleteTheCategory")}
                </Text>
                <Text className="bg-darkRed text-zinc-50 rounded px-4 py-1">
                    {category.name}
                </Text>
            </div>
            
        </Modal>
    )
}

export default DeleteCategoryModal;