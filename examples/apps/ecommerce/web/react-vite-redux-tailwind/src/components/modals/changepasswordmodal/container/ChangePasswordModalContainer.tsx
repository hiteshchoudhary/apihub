import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChangePasswordFields } from "../../../../constants";
import ApiError from "../../../../services/ApiError";
import AuthService from "../../../../services/auth/AuthService";
import FeedbackModal from "../../feedbackmodal/presentation/FeedbackModal";
import ChangePasswordModal from "../presentation/ChangePasswordModal";

interface ChangePasswordModalContainerProps {
  hideModal(): void;
}
const ChangePasswordModalContainer = (
  props: ChangePasswordModalContainerProps
) => {
  const { hideModal } = props;

  const { t } = useTranslation();

  /* Flag for whether password is changed or not */
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  /* For loading spinner */
  const [isPasswordChangeInProgress, setIsPasswordChangeInProgress] = useState(false);

  /* To hold errors when calling the change password API */
  const [errorChangingPassword, setErrorChangingPassword] = useState("");

  /* Change password handler */
  const changePasswordHandler = async (fields: ChangePasswordFields) => {
    /* Hide error message */
    setErrorChangingPassword("");

    /* Show loading spinner */
    setIsPasswordChangeInProgress(true);

    /* API Call */
    const response = await AuthService.changePassword(fields);

    /* Hide loading spinner */
    setIsPasswordChangeInProgress(false);

    /* Error */
    if (response instanceof ApiError) {
      setErrorChangingPassword(
        response.errorResponse?.message || response.errorMessage
      );
    } else {
      /* Success */
      setIsPasswordChanged(true);
    }
  };

  return (
    <>
      {isPasswordChanged ? (
        <FeedbackModal
          message={t("passwordChangedSuccessfully")}
          messageType="SUCCESS"
          hideModal={hideModal}
        />
      ) : (
        <ChangePasswordModal
          hideModal={hideModal}
          changePasswordHandler={changePasswordHandler}
          errorChangingPassword={errorChangingPassword}
          isPasswordChangeInProgress={isPasswordChangeInProgress}
        />
      )}
    </>
  );
};

export default ChangePasswordModalContainer;
