import { useState } from "react";
import { useTranslation } from "react-i18next";
import ApiError from "../../../../services/ApiError";
import ProductService from "../../../../services/product/ProductService";
import { Product } from "../../../../services/product/ProductTypes";
import FeedbackModal from "../../feedbackmodal/presentation/FeedbackModal";
import DeleteProductModal from "../presentation/DeleteProductModal";

interface DeleteProductModalContainerProps {
  hideModal(): void;
  product: Product;
  onProductDeleted(deletedProduct: Product): void;
}
const DeleteProductModalContainer = (
  props: DeleteProductModalContainerProps
) => {
  const { hideModal, product, onProductDeleted } = props;

  const { t } = useTranslation();

  /* API Call in progress flag */
  const [isLoading, setIsLoading] = useState(false);

  /* Error from API */
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  /* State to show success dialog once delete operation is complete */
  const [isDeletionComplete, setIsDeletionComplete] = useState(false);

  const deleteProductHandler = async () => {
    setIsLoading(true);
    setApiErrorMessage("");

    const response = await ProductService.deleteProduct(product._id);

    setIsLoading(false);

    if (!(response instanceof ApiError)) {
      /* Success */
      setIsDeletionComplete(true);
      onProductDeleted(response);
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
          message={
            apiErrorMessage ? apiErrorMessage : t("productDeletedSuccessfully")
          }
          hideModal={hideModal}
        />
      ) : (
        <DeleteProductModal
          cancelButtonHandler={hideModal}
          product={product}
          deleteProductHandler={deleteProductHandler}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default DeleteProductModalContainer;
