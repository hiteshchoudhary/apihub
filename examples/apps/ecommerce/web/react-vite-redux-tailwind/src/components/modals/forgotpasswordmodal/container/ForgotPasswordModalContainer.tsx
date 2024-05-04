import { useState } from "react";
import ForgotPasswordModal from "../presentation/ForgotPasswordModal";
import { ForgotPasswordFields } from "../../../../constants";
import AuthService from "../../../../services/auth/AuthService";
import ApiResponse from "../../../../services/ApiResponse";
import FeedbackModal from "../../feedbackmodal/presentation/FeedbackModal";
import { useTranslation } from "react-i18next";

interface ForgotPasswordModalContainerProps {
  hideModal(): void;
}
const ForgotPasswordModalContainer = (
  props: ForgotPasswordModalContainerProps
) => {
  const { hideModal } = props;

  const { t } = useTranslation();

  /* API Request Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* If there is any error from the API */
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  /* email sent modal visbility */
  const [isEmailSentModalShown, setIsEmailSentModalShown] = useState(false);

  const forgotPasswordSubmitHandler = async (fields: ForgotPasswordFields) => {
    setIsLoading(true);
    setApiErrorMessage("");

    const response = await AuthService.forgotPassword(fields);

    setIsLoading(false);

    /* Success show the modal saying email sent */
    if (response instanceof ApiResponse) {
      setIsEmailSentModalShown(true);
    } else {
      /* Setting the error message */
      setApiErrorMessage(
        response.errorResponse?.message || response.errorMessage
      );
    }
  };

  return (
    <>
      {isEmailSentModalShown ? (
        <FeedbackModal
          messageType="SUCCESS"
          message={t("passwordResetEmailSent")}
          hideModal={hideModal}
        />
      ) : (
        <ForgotPasswordModal
          hideModal={hideModal}
          isLoading={isLoading}
          apiErrorMessage={apiErrorMessage}
          forgotPasswordSubmitHandler={forgotPasswordSubmitHandler}
        />
      )}
    </>
  );
};

export default ForgotPasswordModalContainer;
