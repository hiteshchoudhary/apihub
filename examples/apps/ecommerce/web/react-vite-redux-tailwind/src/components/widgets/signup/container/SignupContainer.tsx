import { useState } from "react";
import { ROUTE_PATHS, SignupFormFields } from "../../../../constants";
import useCustomNavigate from "../../../../hooks/useCustomNavigate";
import Signup from "../presentation/Signup";
import AuthService from "../../../../services/auth/AuthService";
import ApiError from "../../../../services/ApiError";
import { USER_ROLES } from "../../../../services/auth/AuthTypes";

const SignupContainer = () => {
  const navigate = useCustomNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(false);

  const signupClickHandler = async (inputData: SignupFormFields) => {
    setError("");
    setIsLoading(true);

    const {username, email, password} = inputData

    const response = await AuthService.signUp(email, username, password, USER_ROLES.user);

    setIsLoading(false);

    if(!(response instanceof ApiError)){
        setIsSignupSuccessful(true);
    }
    else{
        setError(response?.errorResponse?.message || response.errorMessage);
    }

  };
  const loginClickHandler = () => {
    navigate(ROUTE_PATHS.login, true);
  };
  return (
    <Signup
      loginClickHandler={loginClickHandler}
      signupClickHandler={signupClickHandler}
      isLoading={isLoading}
      apiError={error}
      isSignedUp={isSignupSuccessful}
    />
  );
};

export default SignupContainer;
