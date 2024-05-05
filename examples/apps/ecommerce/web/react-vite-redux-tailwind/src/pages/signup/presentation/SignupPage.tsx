import Image from "../../../components/basic/Image";
import SignupContainer from "../../../components/widgets/signup/container/SignupContainer";
import { BREAKPOINTS, PUBLIC_IMAGE_PATHS } from "../../../constants";
import useBreakpointCheck from "../../../hooks/useBreakpointCheck";
import { useAppSelector } from "../../../store";

const SignupPage = () => {
  const isLG = useBreakpointCheck(BREAKPOINTS.lg);
  const isRTL = useAppSelector((state) => state.language.isRTL);
  return (
    <div
      className={`px-2 py-4 lg:px-10 lg:flex lg:items-center ${
        isRTL ? "lg:flex-row-reverse" : ""
      }`}
    >
      {isLG && (
        <Image
          src={PUBLIC_IMAGE_PATHS.loginSideImage}
          alt="Login"
          backupImageSrc=""
          className="w-2/5 h-2/5 rounded"
        />
      )}
      <div className={`flex-1 ${isRTL ? "lg:mr-32" : "lg:ml-32"}`}>
        <SignupContainer />
      </div>
    </div>
  );
};

export default SignupPage;
