import { useParams } from "react-router-dom";
import ResetForgottenPasswordPage from "../presentation/ResetForgottenPasswordPage";
import useCustomNavigate from "../../../hooks/useCustomNavigate";
import { ROUTE_PATHS } from "../../../constants";

const ResetForgottenPasswordPageContainer = () => {
  const { token } = useParams();

  const navigate = useCustomNavigate();

  /* If there is not token navigate to pageNotFound */
  if (!token) {
    navigate(ROUTE_PATHS.pageNotFound, true);
    return <></>
  }

  return (
    <>
      <ResetForgottenPasswordPage token={token} />
    </>
  );
};

export default ResetForgottenPasswordPageContainer;
