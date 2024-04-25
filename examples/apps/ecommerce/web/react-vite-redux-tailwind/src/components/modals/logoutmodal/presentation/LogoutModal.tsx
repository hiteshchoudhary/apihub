import { useTranslation } from "react-i18next";
import Modal from "../../../basic/Modal";
import ErrorMessage from "../../../basic/ErrorMessage";

interface LogoutModalProps {
  isLogoutModalShown: boolean;
  hideLogoutModal(): void;
  logoutHandler(): void;
  isLogoutModalButtonLoading?: boolean;
  errorMessage?: string
}
const LogoutModal = (props: LogoutModalProps) => {

  const { t } = useTranslation();

  const {
    isLogoutModalShown,
    hideLogoutModal,
    logoutHandler,
    isLogoutModalButtonLoading = false,
    errorMessage = ''
  } = props;
  return (
    <>
      {isLogoutModalShown && (
        <Modal
          heading={t("confirmation")}
          primaryButtonText={errorMessage ? t("ok") : t("yes")}
          secondaryButtonText={isLogoutModalButtonLoading || errorMessage ? '' : t("no")}
          className="px-12 py-8"
          primaryButtonHandler={errorMessage ? hideLogoutModal : logoutHandler}
          secondaryButtonHandler={hideLogoutModal}
          primaryButtonClassname="uppercase"
          secondaryButtonClassname="uppercase"
          isPrimaryButtonLoading={isLogoutModalButtonLoading}
        >
          {
            errorMessage ? 
            <ErrorMessage className="justify-center text-sm" errorIconClassName="w-4 h-4" message={errorMessage} />
            :
            <span className="capitalize">{t("areYouSureYouWantToLogout")}</span>
          }
        </Modal>
      )}
    </>
  );
};

export default LogoutModal;
