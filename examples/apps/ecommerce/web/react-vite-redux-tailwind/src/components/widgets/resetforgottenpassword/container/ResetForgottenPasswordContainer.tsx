import { useState } from "react";
import ResetForgottenPassword from "../presentation/ResetForgottenPassword";
import { ROUTE_PATHS, ResetForgottenPasswordFields } from "../../../../constants";
import AuthService from "../../../../services/auth/AuthService";
import ApiResponse from "../../../../services/ApiResponse";
import { useTranslation } from "react-i18next";
import useCustomNavigate from "../../../../hooks/useCustomNavigate";

interface ResetForgottenPasswordContainerProps {
  token: string;
}
const ResetForgottenPasswordContainer = (
  props: ResetForgottenPasswordContainerProps
) => {
  const { token } = props;

  const navigate = useCustomNavigate();

  const {t} = useTranslation();

  /* API Call in progress flag */
  const [isLoading, setIsLoading] = useState(false);

  /* Error message from API  */
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  /* Flag to store if password was reset successfully  */
  const [isPasswordResetSuccessful, setIsPasswordResetSuccessful] = useState(false);

  /* Reset password handler */
  const resetForgottenPasswordSubmitHandler = async (
    fields: ResetForgottenPasswordFields
  ) => {

    /* Hiding the error message, and showing the loading spinner */
    setIsLoading(true);
    setApiErrorMessage("");

    const response = await AuthService.resetForgottenPassword(token, fields);

    setIsLoading(false);

    if(response instanceof ApiResponse){
        /* Success */
        setIsPasswordResetSuccessful(true);
    }
    else{
        /* Error */
        setApiErrorMessage(`${response.errorResponse?.message || response.errorMessage}, ${t("tryAgainLater")}`);
    }

  };

  /* Navigate to login */
  const loginClickHandler = () => {
    navigate(ROUTE_PATHS.login, true);
  }

  return (
    <>
      <ResetForgottenPassword
        resetForgottenPasswordSubmitHandler={
          resetForgottenPasswordSubmitHandler
        }
        isLoading={isLoading}
        apiErrorMessage={apiErrorMessage}
        isPasswordResetSuccessful={isPasswordResetSuccessful}
        loginClickHandler={loginClickHandler}
      />
    </>
  );
};

export default ResetForgottenPasswordContainer;
