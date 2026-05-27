import { useState } from "react";
import { Category } from "../../../../services/category/CategoryTypes";
import DeleteCategoryModal from "../presentation/DeleteCategoryModal";
import { useTranslation } from "react-i18next";
import CategoryService from "../../../../services/category/CategoryService";
import ApiError from "../../../../services/ApiError";
import FeedbackModal from "../../feedbackmodal/presentation/FeedbackModal";

interface DeleteCategoryModalContainerProps {
  hideModal(): void;
  category: Category;
  onCategoryDeleted(deletedCategory: Category): void;
}
const DeleteCategoryModalContainer = (
  props: DeleteCategoryModalContainerProps
) => {
  const { hideModal, category, onCategoryDeleted } = props;

  const { t } = useTranslation();

  /* API Call in progress flag */
  const [isLoading, setIsLoading] = useState(false);

  /* Error from API */
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  /* State to show success dialog once delete operation is complete */
  const [isDeletionComplete, setIsDeletionComplete] = useState(false);

  const deleteCategoryHandler = async () => {
    setIsLoading(true);
    setApiErrorMessage("");

    const response = await CategoryService.deleteCategory(category);

    setIsLoading(false);

    if (!(response instanceof ApiError)) {
      /* Success */
      setIsDeletionComplete(true);
      onCategoryDeleted(response.data.deletedCategory);
    } else {
      /* Error */
      setApiErrorMessage(
        response.errorResponse?.message || response.errorMessage
      );
    }
  };

  return (
    <>
      {isDeletionComplete || apiErrorMessage ? (
        <FeedbackModal
          messageType={apiErrorMessage ? "ERROR" : "SUCCESS"}
          message={apiErrorMessage ? apiErrorMessage : t("categoryDeletedSuccessfully")}
          hideModal={hideModal}
        />
      ) : (
        <DeleteCategoryModal 
            cancelButtonHandler={hideModal}
            category={category}
            deleteCategoryHandler={deleteCategoryHandler}
            isLoading={isLoading}
        />
      )}
    </>
  );
};

export default DeleteCategoryModalContainer;
