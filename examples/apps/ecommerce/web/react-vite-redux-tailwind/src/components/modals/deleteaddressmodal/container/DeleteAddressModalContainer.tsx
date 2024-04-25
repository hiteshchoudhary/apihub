import { useState } from "react";
import DeleteAddressModal from "../presentation/DeleteAddressModal";
import { AddressClass } from "../../../../services/address/AddressTypes";
import AddressService from "../../../../services/address/AddressService";
import ApiError from "../../../../services/ApiError";
import FeedbackModal from "../../feedbackmodal/presentation/FeedbackModal";
import { useTranslation } from "react-i18next";

interface DeleteAddressModalContainerProps {
  hideModal(): void;
  onAddressDeletedCallback?(): void;
  address: AddressClass;
}
const DeleteAddressModalContainer = (
  props: DeleteAddressModalContainerProps
) => {
  const { hideModal, onAddressDeletedCallback, address } = props;

  const {t} = useTranslation();

  const [isDeletionInProgress, setIsDeletionInProgress] = useState(false);
  const [isFeedbackModalShown, setIsFeedbackModalShown] = useState(false);
  const [error, setError] = useState("");

  const hideModalHandler = () => {
    if(isFeedbackModalShown){
        if(onAddressDeletedCallback){
            onAddressDeletedCallback();
        }
        hideModal();
        return;
    }
    hideModal();
  }

  const addressDeleteHandler = async () => {
    setIsDeletionInProgress(true);
    setError("");

    const response = await AddressService.deleteAddress(address._id);
    if (!(response instanceof ApiError)) {
      // Success
      setIsFeedbackModalShown(true);
    } else {
      setError(response.errorResponse?.message || response.errorMessage);
    }
    setIsDeletionInProgress(false);
  };
  return (
    <>
      {isFeedbackModalShown ? (
        <FeedbackModal message={t('addressDeletedSuccessfully')} messageType="SUCCESS" hideModal={hideModalHandler} />
      ) : (
        <DeleteAddressModal
          hideModal={hideModal}
          addressDeleteHandler={addressDeleteHandler}
          apiError={error}
          isDeletionInProgress={isDeletionInProgress}
        />
      )}
    </>
  );
};

export default DeleteAddressModalContainer;
