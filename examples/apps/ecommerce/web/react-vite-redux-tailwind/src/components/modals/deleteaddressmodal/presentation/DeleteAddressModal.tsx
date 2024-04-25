import { useTranslation } from "react-i18next";
import Modal from "../../../basic/Modal";
import ErrorMessage from "../../../basic/ErrorMessage";

interface DeleteAddressModalProps {
  addressDeleteHandler(): void;
  isDeletionInProgress: boolean;
  hideModal(): void;
  apiError?: string;
}
const DeleteAddressModal = (props: DeleteAddressModalProps) => {
  const {
    addressDeleteHandler,
    hideModal,
    isDeletionInProgress = false,
    apiError = "",
  } = props;
  const { t } = useTranslation();
  return (
    <Modal
      heading={t("deleteAddress")}
      className="px-12 py-4"
      primaryButtonText={t("yes")}
      primaryButtonClassname="uppercase"
      secondaryButtonText={t("no")}
      secondaryButtonClassname="uppercase"
      primaryButtonHandler={addressDeleteHandler}
      secondaryButtonHandler={hideModal}
      isPrimaryButtonLoading={isDeletionInProgress}
    >
      <div className="flex flex-col">
        {apiError && <ErrorMessage message={apiError} errorIconClassName="w-4 h-4" className="text-sm" />}
        <span className="capitalize text-sm">{t("areYouSureYouWantToDeleteTheAddress")}</span>
      </div>
    </Modal>
  );
};

export default DeleteAddressModal;
