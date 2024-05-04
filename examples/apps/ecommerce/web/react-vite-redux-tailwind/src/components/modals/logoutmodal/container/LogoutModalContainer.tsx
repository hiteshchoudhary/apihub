import { useDispatch } from "react-redux";
import LogoutModal from "../presentation/LogoutModal";
import useCustomNavigate from "../../../../hooks/useCustomNavigate";
import { logOut } from "../../../../store/AuthSlice";
import { useState } from "react";
import ApiError from "../../../../services/ApiError";
import AuthService from "../../../../services/auth/AuthService";

interface LogoutModalContainerProps {
  isShown?: boolean;
  hideModal(): void;
}
const LogoutModalContainer = (props: LogoutModalContainerProps) => {
  const { isShown = false, hideModal } = props;

  /* State for loading spinner */
  const [logoutInProgress, setLogoutInProgress] = useState(false);

  /* To store any error message when logging out */
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useCustomNavigate();

  const logoutUser = async () => {
    setLogoutInProgress(true);
    const response = await AuthService.logoutService();
    setLogoutInProgress(false);
    if (response instanceof ApiError) {
      //Error
      setErrorMessage(response.errorResponse?.message || response.errorMessage)
    } else {
      dispatch(logOut());
      navigate("/");
    }
  };

  return (
    <LogoutModal
      hideLogoutModal={hideModal}
      isLogoutModalShown={isShown}
      logoutHandler={logoutUser}
      isLogoutModalButtonLoading={logoutInProgress}
      errorMessage={errorMessage}
    />
  );
};

export default LogoutModalContainer;
