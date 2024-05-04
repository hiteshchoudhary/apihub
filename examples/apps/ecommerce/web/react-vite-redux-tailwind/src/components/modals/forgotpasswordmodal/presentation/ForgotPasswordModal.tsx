import { useTranslation } from "react-i18next";
import {
  ButtonTypes,
  ForgotPasswordFields,
  REGEX_PATTERNS,
} from "../../../../constants";
import Text from "../../../basic/Text";
import Input from "../../../basic/Input";
import Modal from "../../../basic/Modal";
import { useForm } from "react-hook-form";
import Button from "../../../basic/Button";
import ErrorMessage from "../../../basic/ErrorMessage";

interface ForgotPasswordProps {
  forgotPasswordSubmitHandler(fields: ForgotPasswordFields): void;
  isLoading?: boolean;
  apiErrorMessage?: string;
  hideModal(): void;
}

const ForgotPasswordModal = (props: ForgotPasswordProps) => {
  const {
    forgotPasswordSubmitHandler,
    isLoading = false,
    apiErrorMessage = "",
    hideModal,
  } = props;

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFields>();

  return (
    <Modal heading={t("forgotPassword")} className="px-8 py-8 w-[95%] lg:w-1/3">
      <div className="flex flex-col gap-y-6 mt-2">
        <Text className="capitalize">
          {t("enterYourDetailsBelow")}
        </Text>

        {apiErrorMessage && (
          <ErrorMessage
            message={apiErrorMessage}
            errorIconClassName="w-4 h-4"
          />
        )}
        <form
          className="flex flex-col gap-y-8"
          onSubmit={handleSubmit(forgotPasswordSubmitHandler)}
        >
          <Input
            placeholder={t("email")}
            autoComplete="email"
            type="email"
            className="placeholder:capitalize"
            errorMessage={errors.email?.message || ""}
            {...register("email", {
              required: t("thisFieldIsRequired"),
              validate: {
                matchPattern: (value) =>
                  REGEX_PATTERNS.emailPattern.test(value) ||
                  t("invalidEmailAddress"),
              },
            })}
          />
          <div className="flex flex-col gap-y-4">
            <Button
              type="submit"
              buttonType={ButtonTypes.primaryButton}
              className="flex justify-center uppercase px-12 py-1"
              onClickHandler={() => {}}
              isLoading={isLoading}
            >
              <span>{t("submit")}</span>
            </Button>

            {!isLoading && (
              <Button
                buttonType={ButtonTypes.secondaryButton}
                className="flex justify-center uppercase px-12 py-1"
                onClickHandler={hideModal}
              >
                <span>{t("cancel")}</span>
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;
