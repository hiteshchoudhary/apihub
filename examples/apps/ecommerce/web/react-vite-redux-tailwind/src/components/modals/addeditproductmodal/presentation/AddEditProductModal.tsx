import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  AddEditProductFields,
  AddEditProductFieldsForService,
  ButtonTypes,
  DropdownItem,
  DropdownTypes,
} from "../../../../constants";
import { MAX_SUBIMAGES_PER_PRODUCT } from "../../../../data/applicationData";
import UtilServices from "../../../../services/UtilServices";
import { Product } from "../../../../services/product/ProductTypes";
import { useAppSelector } from "../../../../store";
import Button from "../../../basic/Button";
import Dropdown from "../../../basic/Dropdown";
import ErrorMessage from "../../../basic/ErrorMessage";
import FullPageLoadingSpinner from "../../../basic/FullPageLoadingSpinner";
import ImagePicker, { ImagePickerActions } from "../../../basic/ImagePicker";
import Input from "../../../basic/Input";
import Modal from "../../../basic/Modal";
import Text from "../../../basic/Text";

interface AddEditProductModalProps {
  hideModal(): void;
  categories: DropdownItem[];
  defaultSelectedCategory?: DropdownItem;
  product?: Product;
  addProductHandler(fields: AddEditProductFieldsForService): void;
  editProductHandler(fields: AddEditProductFieldsForService): void;
  isLoading?: boolean;
  apiErrorMessage?: string;
}
const AddEditProductModal = (props: AddEditProductModalProps) => {
  const {
    hideModal,
    categories,
    defaultSelectedCategory,
    product,
    addProductHandler,
    editProductHandler,
    isLoading = false,
    apiErrorMessage = "",
  } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  /* For Iterating through sub images to avoid repetition */
  const subImagesListForIteration = useMemo(
    () => new Array(MAX_SUBIMAGES_PER_PRODUCT).fill(true),
    []
  );

  /* To show a loading spinner until the default values are set when the modal is in edit mode. */
  const [isPreparingModalForEdit, setIsPreparingModalForEdit] = useState(false);

  /* Main Image Ref for setting the inital image in case of edit operation */
  const mainImageActionsRef = useRef<ImagePickerActions>({
    forceSetSelectedImage(_) {},
  });

  /* Sub Image Actions Ref as an array for setting the inital image in case of edit operation */
  const subImagesActionsRef = useRef<ImagePickerActions[]>([]);
  subImagesListForIteration.forEach((_) => {
    subImagesActionsRef.current.push({ forceSetSelectedImage(_) {} });
  });

  /* If product exists: edit mode is true */
  const isInEditMode = useMemo(() => {
    return product ? true : false;
  }, [product]);

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddEditProductFields>();

  /* Submit Handler */
  const submitHandler = (fields: AddEditProductFields) => {
    /* Change type, appending all subImages into a single list  */
    const fieldsForApiCall: AddEditProductFieldsForService = {
      ...fields,
      subImages: [],
    };

    /* For each subImage adding it to a single array in fieldsForApiCall */
    subImagesListForIteration.forEach((_, index) => {
      const subImage =
        fields[`subImage${index + 1}` as keyof AddEditProductFields];
      if (subImage && subImage instanceof File) {
        fieldsForApiCall.subImages.push(subImage);
      }
      /* Deleting subImage1, 2, etc.. as they got added when the object was initialized */
      delete fieldsForApiCall[
        `subImage${index + 1}` as keyof AddEditProductFieldsForService
      ];
    });

    if (isInEditMode) {
      editProductHandler(fieldsForApiCall);
    } else {
      addProductHandler(fieldsForApiCall);
    }
  };

  /* Setting the default values: If the modal is for update */
  useEffect(() => {
    const setDefaultProductValues = async () => {
      if (product) {
        setIsPreparingModalForEdit(true);

        /* Setting name, description, price and stock */
        setValue("name", product?.name);
        setValue("description", product.description);
        setValue("price", product.price);
        setValue("stock", product.stock);

        /* Setting the category of the product */
        if (defaultSelectedCategory) {
          setValue("category", defaultSelectedCategory);
        }

        /* Getting a main image as a blob*/
        const mainImageFile = await UtilServices.getImageUrlAsFileObject(
          product.mainImage.url,
          product.mainImage._id
        );

        /* Setting the mainImage, forceSetting it in the Image Picker component */
        setValue("mainImage", mainImageFile);
        mainImageActionsRef.current.forceSetSelectedImage(mainImageFile);

        /* Performing the same action for each subImage */
        for (let index = 0; index < subImagesListForIteration.length; index++) {
          if (product?.subImages?.[index]) {
            const subImageFile = await UtilServices.getImageUrlAsFileObject(
              product.subImages[index].url,
              product.subImages[index]._id
            );
            setValue(
              `subImage${index + 1}` as keyof AddEditProductFields,
              subImageFile
            );
            subImagesActionsRef.current[index].forceSetSelectedImage(
              subImageFile
            );
          }
        }

        setIsPreparingModalForEdit(false);
      }
    };
    setDefaultProductValues();
  }, [product, defaultSelectedCategory, setValue, subImagesListForIteration]);

  return (
    <Modal
      heading={isInEditMode ? t("updateProduct") : t("addProduct")}
      className="px-8 py-6 w-full lg:w-1/2 max-h-[80%] lg:max-h-full overflow-auto"
    >
      <form
        className="flex flex-col gap-y-4 mt-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        {isPreparingModalForEdit && <FullPageLoadingSpinner message={t("pleaseWaitFetchingDetails")} />}
        {apiErrorMessage && (
          <ErrorMessage
            message={apiErrorMessage}
            errorIconClassName="w-4 h-4"
          />
        )}
        <div
          className="flex flex-col gap-y-6 lg:grid lg:grid-cols-2 lg:gap-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <Input
            type="text"
            placeholder={t("productName")}
            className="placeholder:capitalize"
            errorMessage={errors.name?.message || ""}
            {...register("name", {
              required: t("nameIsRequired"),
              validate: (value) => {
                if (!value.trim()) {
                  return t("invalidValue");
                }
              },
            })}
          />
          <Input
            type="text"
            placeholder={t("description")}
            className="placeholder:capitalize"
            errorMessage={errors.description?.message || ""}
            {...register("description", {
              required: t("descriptionIsRequired"),
              validate: (value) => {
                if (!value.trim()) {
                  return t("invalidValue");
                }
              },
            })}
          />

          <Input
            type="number"
            placeholder={t("price")}
            errorMessage={errors.price?.message || ""}
            className="placeholder:capitalize"
            {...register("price", {
              required: t("priceIsRequired"),
              validate: (value) => {
                if (isNaN(Number(value)) || Number(value) < 0) {
                  return t("invalidValue");
                }
              },
            })}
          />

          <Input
            type="number"
            placeholder={t("stock")}
            errorMessage={errors.stock?.message || ""}
            className="placeholder:capitalize"
            {...register("stock", {
              required: t("priceIsRequired"),
              validate: (value) => {
                if (isNaN(Number(value)) || Number(value) < 0) {
                  return t("invalidValue");
                }
              },
            })}
          />

          <Controller
            control={control}
            name="category"
            rules={{ required: t("categoryIsRequired") }}
            render={({ field }) => (
              <Dropdown
                label={t("category")}
                itemsList={categories}
                defaultSelectedItem={defaultSelectedCategory}
                errorMessage={errors.category?.message || ""}
                type={DropdownTypes.borderedLightBg}
                mainButtonClassNames="w-full"
                {...field}
              />
            )}
          />
        </div>
        <div
          className={`flex flex-col gap-y-1 ${isRTL ? "ml-4" : "mr-4"}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <Text className="capitalize">{t("mainImage")}</Text>
          <Controller
            name="mainImage"
            control={control}
            rules={{ required: t("mainImageIsRequired") }}
            render={({ field }) => (
              <ImagePicker
                altText=""
                actionsRef={mainImageActionsRef.current}
                className="w-1/2 lg:w-1/4 h-32"
                errorMessage={errors.mainImage?.message || ""}
                {...field}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Text className="capitalize">{t("subImages")}</Text>
          <div
            className="grid grid-cols-2 gap-4 lg:flex lg:gap-x-4 lg:gap-y-0"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {subImagesListForIteration.map((_, index) => (
              <Controller
                key={index}
                name={`subImage${index + 1}` as keyof AddEditProductFields}
                control={control}
                render={({ field }) => (
                  <ImagePicker
                    altText=""
                    actionsRef={subImagesActionsRef.current[index]}
                    className="w-full h-32"
                    errorMessage={
                      errors?.[
                        `subImage${index + 1}` as keyof AddEditProductFields
                      ]?.message || ""
                    }
                    {...field}
                  />
                )}
              />
            ))}
          </div>
        </div>

        <Button
          buttonType={ButtonTypes.primaryButton}
          type="submit"
          onClickHandler={() => {}}
          isLoading={isLoading}
          className="px-12 py-1 uppercase flex justify-center"
        >
          <span>{isInEditMode ? t("update") : t("add")}</span>
        </Button>
        {!isLoading && (
          <Button
            buttonType={ButtonTypes.secondaryButton}
            onClickHandler={hideModal}
            className="px-12 py-1 uppercase"
          >
            <span>{t("cancel")}</span>
          </Button>
        )}
      </form>
    </Modal>
  );
};

export default AddEditProductModal;
