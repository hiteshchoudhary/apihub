import { useTranslation } from "react-i18next";
import { Product } from "../../../../services/product/ProductTypes";
import Modal from "../../../basic/Modal";
import Text from "../../../basic/Text";

interface DeleteProductModalProps {
  product: Product;
  deleteProductHandler(): void;
  isLoading?: boolean;
  cancelButtonHandler(): void;
}
const DeleteProductModal = (props: DeleteProductModalProps) => {
  const { product, deleteProductHandler, isLoading, cancelButtonHandler } =
    props;

  const { t } = useTranslation();
  return (
    <Modal
      heading={t("deleteProduct")}
      className="px-8 py-6 w-[95%] lg:w-1/3"
      primaryButtonText={t("yes")}
      primaryButtonClassname="uppercase"
      secondaryButtonText={t("cancel")}
      secondaryButtonClassname="uppercase"
      secondaryButtonHandler={cancelButtonHandler}
      primaryButtonHandler={deleteProductHandler}
      isPrimaryButtonLoading={isLoading}
    >
      <div className="flex flex-col items-center gap-y-4">
        <Text className="capitalize">
          {t("areYouSureYouWantToDeleteTheProduct")}
        </Text>
        <Text className="bg-darkRed text-zinc-50 rounded px-4 py-1">
          {product.name}
        </Text>
      </div>
    </Modal>
  );
};

export default DeleteProductModal;
