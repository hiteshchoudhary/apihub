import { useTranslation } from "react-i18next";
import {
  ButtonTypes,
  ResetForgottenPasswordFields,
} from "../../../../constants";
import Text from "../../../basic/Text";
import { useForm } from "react-hook-form";
import Input from "../../../basic/Input";
import Button from "../../../basic/Button";
import ErrorMessage from "../../../basic/ErrorMessage";
import { useAppSelector } from "../../../../store";

interface ResetForgottenPasswordProps {
  resetForgottenPasswordSubmitHandler(
    fields: ResetForgottenPasswordFields
  ): void;
  apiErrorMessage?: string;
  isLoading: boolean;
  isPasswordResetSuccessful: boolean;
  loginClickHandler(): void;
}
const ResetForgottenPassword = (props: ResetForgottenPasswordProps) => {
  const {
    resetForgottenPasswordSubmitHandler,
    apiErrorMessage,
    isLoading,
    isPasswordResetSuccessful = false,
    loginClickHandler,
  } = props;
  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<ResetForgottenPasswordFields>();

  /* Password reset complete */
  if (isPasswordResetSuccessful) {
    return (
      <div className={`flex flex-col p-4 lg:p-0`} dir={isRTL ? "rtl" : "ltr"}>
        <Text className="capitalize text-2xl tracking-wider font-poppinsMedium self-center lg:self-auto">
          {t("resetPassword")}
        </Text>
        <Text className="capitalize mt-6 self-center lg:self-auto">
          {t("resetPasswordSuccessful")}
        </Text>
        <div dir={isRTL ? "rtl" : "ltr"} className="self-center lg:self-auto">
          <Button
            className="capitalize w-fit px-4 py-2 mt-12"
            buttonType={ButtonTypes.primaryButton}
            onClickHandler={loginClickHandler}
          >
            <Text>{t("proceedToLogin")}</Text>
          </Button>
        </div>
      </div>
    );
  }

  /* Reset password form */
  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(resetForgottenPasswordSubmitHandler)}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Text className="capitalize text-2xl tracking-wider font-poppinsMedium self-center lg:self-auto">
        {t("resetPassword")}
      </Text>

      {apiErrorMessage && (
        <ErrorMessage
          message={apiErrorMessage}
          errorIconClassName="w-4 h-4"
          className="mt-4"
        />
      )}

      <Input
        placeholder={t("newPassword")}
        type="password"
        className="mt-10 placeholder:capitalize"
        autoComplete="current-password"
        errorMessage={errors.newPassword?.message || ""}
        {...register("newPassword", { required: t("thisFieldIsRequired") })}
      />

      <Input
        placeholder={t("confirmNewPassword")}
        type="password"
        className="mt-10 placeholder:capitalize"
        autoComplete="current-password"
        errorMessage={errors.confirmNewPassword?.message || ""}
        {...register("confirmNewPassword", {
          required: t("thisFieldIsRequired"),
          validate: (value) => {
            if (watch("newPassword") !== value) {
              return t("passwordsDontMatch");
            }
          },
        })}
      />

      <Button
        type="submit"
        buttonType={ButtonTypes.primaryButton}
        className="capitalize px-12 py-2 lg:w-fit mt-8 flex justify-center"
        onClickHandler={() => {}}
        isLoading={isLoading}
      >
        <span>{t("reset")}</span>
      </Button>
    </form>
  );
};

export default ResetForgottenPassword;
