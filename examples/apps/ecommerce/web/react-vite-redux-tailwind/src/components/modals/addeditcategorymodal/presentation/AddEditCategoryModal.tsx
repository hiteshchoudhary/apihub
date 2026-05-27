import { useTranslation } from "react-i18next";
import Modal from "../../../basic/Modal";
import Input from "../../../basic/Input";
import Button from "../../../basic/Button";
import {
  AddCategoryFields,
  ButtonTypes,
  EditCategoryFields,
} from "../../../../constants";
import Text from "../../../basic/Text";
import { Category } from "../../../../services/category/CategoryTypes";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../../basic/ErrorMessage";

interface AddEditCategoryModalProps {
  category?: Category;
  addCategoryHandler(fields: AddCategoryFields): void;
  editCategoryHandler(fields: EditCategoryFields): void;
  isLoading?: boolean;
  apiErrorMessage?: string;
  cancelButtonHandler(): void;
}
const AddEditCategoryModal = (props: AddEditCategoryModalProps) => {
  const {
    category,
    addCategoryHandler,
    editCategoryHandler,
    isLoading = false,
    apiErrorMessage = "",
    cancelButtonHandler,
  } = props;

  /* If a category is passed, then edit mode is true else it's an add category request */
  const isInEditMode = useMemo(() => {
    return category ? true : false;
  }, [category]);

  const submitHandler = (fields: AddCategoryFields) => {
    if (isInEditMode && category) {
      editCategoryHandler({ category, newCategoryName: fields.categoryName });
    } else {
      addCategoryHandler(fields);
    }
  };

  const { t } = useTranslation();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCategoryFields>();

  /* If a category is passed set it's value in the input */
  useEffect(() => {
    if (category) {
      setValue("categoryName", category.name);
    }
  }, [category, setValue]);

  return (
    <Modal className="px-8 py-6 w-[95%] lg:w-1/3">
      <form
        className="flex flex-col gap-y-8"
        onSubmit={handleSubmit(submitHandler)}
      >
        <Text className="text-2xl capitalize font-poppinsMedium self-center">
          {isInEditMode ? t("updateCategory") : t("addCategory")}
        </Text>
        <div className="flex flex-col gap-y-6">
          {apiErrorMessage && (
            <ErrorMessage
              message={apiErrorMessage}
              errorIconClassName="w-4 h-4"
            />
          )}
          <Input
            placeholder={t("categoryName")}
            className="placeholder:capitalize text-sm"
            type="text"
            errorMessage={errors.categoryName?.message || ""}
            {...register("categoryName", {
              required: t("categoryNameIsRequired"),
            })}
          />
          <div className="flex flex-col gap-y-2">
            <Button
              className="uppercase px-4 py-1 flex justify-center"
              type="submit"
              buttonType={ButtonTypes.primaryButton}
              onClickHandler={() => {}}
              isLoading={isLoading}
            >
              <span>{isInEditMode ? t("update") : t("add")}</span>
            </Button>

            {!isLoading && (
              <Button
                buttonType={ButtonTypes.secondaryButton}
                className="uppercase px-4 py-1"
                onClickHandler={cancelButtonHandler}
              >
                <span>{t("cancel")}</span>
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditCategoryModal;
