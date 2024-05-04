import Image from "../../../components/basic/Image";
import ResetForgottenPasswordContainer from "../../../components/widgets/resetforgottenpassword/container/ResetForgottenPasswordContainer";
import { BREAKPOINTS, PUBLIC_IMAGE_PATHS } from "../../../constants";
import useBreakpointCheck from "../../../hooks/useBreakpointCheck";
import { useAppSelector } from "../../../store";


interface ResetForgottenPasswordPageProps {
    token: string;
}
const ResetForgottenPasswordPage = (props: ResetForgottenPasswordPageProps) => {

    const {token} = props;

    const isRTL = useAppSelector((state) => state.language.isRTL);

    const isLG = useBreakpointCheck(BREAKPOINTS.lg);
    return (
        <div className={`pt-12 pb-4 px-4 lg:px-10 lg:flex lg:items-center ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
        {isLG && (
          <Image
            src={PUBLIC_IMAGE_PATHS.loginSideImage}
            alt="Reset"
            backupImageSrc=""
            className="w-2/5 h-2/5 rounded"
          />
        )}
        <div className={`flex-1 ${isRTL ? 'lg:mr-32' : 'lg:ml-32'}`}>
          <ResetForgottenPasswordContainer token={token} />
        </div>
      </div>
    )
}

export default ResetForgottenPasswordPage;