import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AddEditProductFieldsForService,
  DropdownItem,
  EditProductFieldsForService
} from "../../../../constants";
import ApiError from "../../../../services/ApiError";
import CategoryService from "../../../../services/category/CategoryService";
import ProductService from "../../../../services/product/ProductService";
import { Product } from "../../../../services/product/ProductTypes";
import FeedbackModal from "../../feedbackmodal/presentation/FeedbackModal";
import AddEditProductModal from "../presentation/AddEditProductModal";

interface AddEditProductModalContainerProps {
  hideModal(): void;
  product?: Product;
  onProductAddedOrUpdated(newProduct: Product): void;
}
const AddEditProductModalContainer = (
  props: AddEditProductModalContainerProps
) => {
  const { hideModal, product, onProductAddedOrUpdated } = props;

  const { t } = useTranslation();

  /* Categories Dropdown */
  const [categoriesDropdown, setCategoriesDropdown] = useState<DropdownItem[]>(
    []
  );

  /* Loader flag */
  const [isLoading, setIsLoading] = useState(false);

  /* Error message when editing or adding a product */
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  /* Once add or edit is complete to show the final success modal */
  const [isAddOrEditOperationComplete, setIsAddOrEditOperationComplete] =
    useState(false);

  /* Default category selected in case of edit product */
  const [defaultSelectedCategory, setDefaultSelectedCategory] =
    useState<DropdownItem>();

  /* Fetch all categories for dropdown menu */
  const fetchAllCategories = useCallback(() => {
    CategoryService.getAllCategoriesAsync((data, _, error) => {
      if (!error) {
        /* Set Categories Dropdown Items */
        setCategoriesDropdown((prev) => {
          const formatted = data.map((category) => {
            /* Formatting the object to include id as category id, and text as category name */
            const formattedCategory = { id: category._id, text: category.name };

            /* If a product is passed and it's id is same as the current category id, set it as the default selected category */
            if (product && category._id === product.category) {
              setDefaultSelectedCategory(formattedCategory);
            }

            /* Return formatted category from the map function */
            return formattedCategory;
          });

          /* Adding to the list of dropdown items for categories */
          return [...prev, ...formatted];
        });
      } else {
        console.error("Error -- fetchAllCategories()", error);
      }
    });
  }, [product]);

  const editProductHandler = async (fields: AddEditProductFieldsForService) => {
    if (product) {
      setIsLoading(true);
      setApiErrorMessage("");

      /* Object which will consist of all the fields to update */
      const fieldsToUpdate: EditProductFieldsForService = { ...fields };

      let isFieldsChanged = false;

      let key: keyof typeof fieldsToUpdate;

      /* Iterating through each key to only keep the fields which have been updated */
      for (key in fieldsToUpdate) {
        const value = fieldsToUpdate[key];

        /* Main Image */
        if (value instanceof File) {
          /* If the mainImage has not changed delete it from the fieldsToUpdate  */
          if (product.mainImage._id === value.name) {
            delete fieldsToUpdate.mainImage;
          }
          else{
            isFieldsChanged = true;
          }
        }
        /* SubImages */
        else if (Array.isArray(value)) {
          /* For each existing sub image of the product */
          for (const existingSubImage of product.subImages) {
            /* Checking if image exists in the updated subImages list */
            const imageIndex = value.findIndex((subImage) => {
              if (subImage.name === existingSubImage._id) {
                return true;
              }
            });
            /* If the image does not exist */
            if (imageIndex === -1) {
              /* Remove the image */
              const response = await ProductService.removeSubImageOfProduct(
                existingSubImage._id,
                product._id
              );
              /* Error removing the image, return an ApiError */
              if (response instanceof ApiError) {
                setApiErrorMessage(
                  response.errorResponse?.message || response.errorMessage
                );
                setIsLoading(false);
                console.error("-- Error removing Image", response);
                return;
              }
              isFieldsChanged = true;
            } else {
              /* Removing from the list of sub images in fields to update as the image already exists */
              value.splice(imageIndex, 1);
            }
          }
        }
        else if(typeof value === "object" && "id" in value){
          if(product.category !== value.id){
            isFieldsChanged = true;
          }
        }
        else {
          if(value === product[key]){
            delete fieldsToUpdate[key]
          }
          else{
            isFieldsChanged = true;
          }
        }
      }

      if(!isFieldsChanged){
        setApiErrorMessage(t("nothingToUpdate"));
        setIsLoading(false);
        return;
      }

      const response = await ProductService.editProduct(fieldsToUpdate, product._id);

      setIsLoading(false);

      if(!(response instanceof ApiError)){
        /* Success */
        setIsAddOrEditOperationComplete(true);
        onProductAddedOrUpdated(response);
      }
      else{
        /* Error */
        setApiErrorMessage(response.errorResponse?.message || response.errorMessage)
      }

    }
  };

  const addProductHandler = async (fields: AddEditProductFieldsForService) => {
    setIsLoading(true);
    setApiErrorMessage("");
    const response = await ProductService.addProduct(fields);
    setIsLoading(false);

    if (!(response instanceof ApiError)) {
      setIsAddOrEditOperationComplete(true);
      onProductAddedOrUpdated(response);
    } else {
      setApiErrorMessage(
        response.errorResponse?.message || response.errorMessage
      );
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  return (
    <>
      {isAddOrEditOperationComplete ? (
        <FeedbackModal
          message={product ? t("productUpdatedSuccessfully") : t("productAddedSuccessfully")}
          messageType="SUCCESS"
          hideModal={hideModal}
        />
      ) : (
        <AddEditProductModal
          categories={categoriesDropdown}
          product={product}
          hideModal={hideModal}
          defaultSelectedCategory={defaultSelectedCategory}
          addProductHandler={addProductHandler}
          editProductHandler={editProductHandler}
          isLoading={isLoading}
          apiErrorMessage={apiErrorMessage}
        />
      )}
    </>
  );
};

export default AddEditProductModalContainer;
