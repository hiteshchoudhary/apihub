import { useState } from "react";
import { AddCategoryFields, EditCategoryFields } from "../../../../constants";
import { Category } from "../../../../services/category/CategoryTypes";
import AddEditCategoryModal from "../presentation/AddEditCategoryModal";
import CategoryService from "../../../../services/category/CategoryService";
import ApiError from "../../../../services/ApiError";
import FeedbackModal from "../../feedbackmodal/presentation/FeedbackModal";
import { useTranslation } from "react-i18next";

interface AddEditCategoryModalContainer {
  category?: Category;
  hideModal(): void;
  onCategoryAddedOrUpdatedHandler(category: Category): void;
}
const AddEditCategoryModalContainer = (
  props: AddEditCategoryModalContainer
) => {
  const { category, hideModal, onCategoryAddedOrUpdatedHandler } = props;

  const { t } = useTranslation();

  /* API Call in progress flag */
  const [isLoading, setIsLoading] = useState(false);

  /* Error from API */
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  /* State to show success dialog once add or edit operation is complete */
  const [isAddOrEditComplete, setIsAddOrEditComplete] = useState(false);

  const addCategoryHandler = async (fields: AddCategoryFields) => {
    setIsLoading(true);
    setApiErrorMessage("");

    const response = await CategoryService.addCategory(fields.categoryName);

    setIsLoading(false);

    if (!(response instanceof ApiError)) {
        setIsAddOrEditComplete(true);
        onCategoryAddedOrUpdatedHandler(response);
    } else {
      setApiErrorMessage(
        response.errorResponse?.message || response.errorMessage
      );
    }
  };

  const editCategoryHandler = async (fields: EditCategoryFields) => {
    setIsLoading(true);
    setApiErrorMessage("");

    const response = await CategoryService.editCategory(fields);

    setIsLoading(false);

    if (!(response instanceof ApiError)) {
        setIsAddOrEditComplete(true);
        onCategoryAddedOrUpdatedHandler(response);
    } else {
      setApiErrorMessage(
        response.errorResponse?.message || response.errorMessage
      );
    }
  };
  return (
    <>
      {isAddOrEditComplete ? (
        <FeedbackModal
          message={
            category
              ? t("categoryUpdatedSuccessfully")
              : t("categoryAddedSuccessfully")
          }
          hideModal={hideModal}
          messageType="SUCCESS"
        />
      ) : (
        <AddEditCategoryModal
          category={category}
          addCategoryHandler={addCategoryHandler}
          editCategoryHandler={editCategoryHandler}
          cancelButtonHandler={hideModal}
          isLoading={isLoading}
          apiErrorMessage={apiErrorMessage}
        />
      )}
    </>
  );
};

export default AddEditCategoryModalContainer;
