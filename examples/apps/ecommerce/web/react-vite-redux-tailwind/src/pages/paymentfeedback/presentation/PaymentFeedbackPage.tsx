import { useTranslation } from "react-i18next";
import ErrorMessage from "../../../components/basic/ErrorMessage";
import TickIcon from "../../../components/icons/TickIcon";
import Button from "../../../components/basic/Button";
import { ButtonTypes } from "../../../constants";

interface PaymentFeedbackPageProps {
  isSuccess: boolean;
  navigateToHome(): void;
}
const PaymentFeedbackPage = (props: PaymentFeedbackPageProps) => {
  const { isSuccess, navigateToHome } = props;

  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center pt-8">
      <div className="flex flex-col gap-y-12">
        {isSuccess ? (
          <div className="flex items-center gap-4">
            <TickIcon
              className="w-8 h-8 text-zinc-50"
              circleProps={{
                className: "fill-green-700",
                cx: 25,
                cy: 25,
                r: 25,
              }}
            />
            <span className="capitalize text-xl tracking-wider">
              {t("paymentSuccessfullyCompleted")}
            </span>
          </div>
        ) : (
          <ErrorMessage message={t("failedToProcessPaymentTryAgain")} className="text-xl" />
        )}

        <Button
          onClickHandler={navigateToHome}
          className="px-4 py-2 w-fit self-center"
          buttonType={ButtonTypes.primaryButton}
        >
          <span className="capitalize">{t("goToHome")}</span>
        </Button>
      </div>
    </div>
  );
};

export default PaymentFeedbackPage;
