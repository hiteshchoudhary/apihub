import { useTranslation } from "react-i18next";
import Button from "../../../basic/Button";
import Input from "../../../basic/Input";
import Link from "../../../basic/Link";
import {
  ButtonTypes,
  LinkTypes,
  LoginFormFields,
  REGEX_PATTERNS,
} from "../../../../constants";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../../basic/ErrorMessage";
import Text from "../../../basic/Text";
import { useAppSelector } from "../../../../store";
import GoogleIcon from "../../../icons/GoogleIcon";

interface LoginProps {
  loginClickHandler(inputData: LoginFormFields): void;
  googleLoginClickHandler(): void;
  forgotPasswordClickHandler(): void;
  signupClickHandler(): void;
  isLoading?: boolean;
  apiError?: string;
}
const Login = (props: LoginProps) => {
  const {
    loginClickHandler,
    googleLoginClickHandler,
    forgotPasswordClickHandler,
    signupClickHandler,
    isLoading = false,
    apiError = "",
  } = props;

  const isRTL = useAppSelector((state) => state.language.isRTL);

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>();

  return (
    <form
      className="flex flex-col p-4 lg:p-0"
      onSubmit={handleSubmit(loginClickHandler)}
    >
      <Text className="capitalize text-2xl tracking-wider font-poppinsMedium self-center lg:self-auto">
        {t("login")}
      </Text>
      <Text className="capitalize mt-6 self-center lg:self-auto">
        {t("enterYourDetailsBelow")}
      </Text>
      {apiError && (
        <ErrorMessage
          className="text-sm mt-1"
          errorIconClassName="w-4 h-4"
          message={apiError}
        />
      )}
      <Input
        placeholder={t("email")}
        type="text"
        className="mt-12 placeholder:capitalize"
        autoComplete="username"
        errorMessage={errors.email?.message || ""}
        {...register("email", {
          required: t("emailIsRequired"),
          validate: {
            matchPattern: (value) =>
              REGEX_PATTERNS.emailPattern.test(value) ||
              t("invalidEmailAddress"),
          },
        })}
      />

      <Input
        placeholder={t("password")}
        type="password"
        className="mt-10 placeholder:capitalize"
        autoComplete="current-password"
        errorMessage={errors.password?.message || ""}
        {...register("password", { required: t("passwordIsRequired") })}
      />

      <div
        className={`flex justify-between items-center mt-10`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Button
          className="px-4 py-2 capitalize"
          type="submit"
          buttonType={ButtonTypes.primaryButton}
          onClickHandler={() => {}}
          isLoading={isLoading}
        >
          <span>{t("login")}</span>
        </Button>
        <Link
          text={t("forgotPassword")}
          linkType={LinkTypes.red}
          onClick={forgotPasswordClickHandler}
          className="capitalize"
        />
      </div>

      <Button
        className={`px-4 py-2 capitalize mt-4 flex justify-center items-center gap-4 ${isRTL ? 'flex-row-reverse': ''}`}
        type="button"
        buttonType={ButtonTypes.secondaryButton}
        onClickHandler={googleLoginClickHandler}
      >
        <>
          <GoogleIcon className="w-6 h-6" />
          <span>{t("signInWithGoogle")}</span>
        </>
      </Button>

      <Link
        text={t("dontHaveAnAccountSignUp")}
        linkType={LinkTypes.red}
        onClick={signupClickHandler}
        className="capitalize mt-4"
      />
    </form>
  );
};

export default Login;
