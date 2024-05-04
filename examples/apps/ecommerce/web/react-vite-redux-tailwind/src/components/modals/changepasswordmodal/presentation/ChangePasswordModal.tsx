import { useTranslation } from "react-i18next";
import Modal from "../../../basic/Modal";
import Button from "../../../basic/Button";
import { ButtonTypes, ChangePasswordFields } from "../../../../constants";
import Input from "../../../basic/Input";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../../basic/ErrorMessage";

interface ChangePasswordModalProps {
  hideModal(): void;
  errorChangingPassword?: string;
  changePasswordHandler(fields: ChangePasswordFields): void;
  isPasswordChangeInProgress: boolean;
}
const ChangePasswordModal = (props: ChangePasswordModalProps) => {
  const {
    hideModal,
    errorChangingPassword = "",
    changePasswordHandler,
    isPasswordChangeInProgress = false,
  } = props;

  const { t } = useTranslation();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFields>();

  return (
    <>
      <Modal
        heading={t("changePassword")}
        className="px-8 py-4 w-[95%] lg:w-1/3"
      >
        <form
          className="flex flex-col gap-y-8 mt-4"
          onSubmit={handleSubmit(changePasswordHandler)}
        >
          {errorChangingPassword && (
            <ErrorMessage
              message={errorChangingPassword}
              errorIconClassName="w-4 h-4"
              className="text-sm"
            />
          )}
          <Input
            placeholder={t("currentPassword")}
            type="password"
            className="placeholder:capitalize"
            autoComplete="current-password"
            errorMessage={errors.currentPassword?.message || ""}
            {...register("currentPassword", {
              required: t("thisFieldIsRequired"),
            })}
          />

          <Input
            placeholder={t("newPassword")}
            type="password"
            className="placeholder:capitalize"
            autoComplete="current-password"
            errorMessage={errors.newPassword?.message || ""}
            {...register("newPassword", {
              required: t("thisFieldIsRequired"),
            })}
          />

          <Input
            placeholder={t("confirmNewPassword")}
            type="password"
            className="placeholder:capitalize"
            autoComplete="current-password"
            errorMessage={errors.confirmNewPassword?.message || ""}
            {...register("confirmNewPassword", {
              required: t("thisFieldIsRequired"),
              validate: {
                matchesNewPassword: (value) => {
                  if (watch("newPassword") !== value) {
                    return t("passwordsDontMatch");
                  }
                },
              },
            })}
          />
          <div className="flex flex-col gap-y-4">
            <Button
              type="submit"
              buttonType={ButtonTypes.primaryButton}
              onClickHandler={() => {}}
              className="uppercase px-12 py-1 flex justify-center"
              isLoading={isPasswordChangeInProgress}
            >
              <span>{t("update")}</span>
            </Button>

            {!isPasswordChangeInProgress && (
              <Button
                buttonType={ButtonTypes.secondaryButton}
                onClickHandler={hideModal}
                className="uppercase px-12 py-1"
              >
                <span>{t("cancel")}</span>
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
