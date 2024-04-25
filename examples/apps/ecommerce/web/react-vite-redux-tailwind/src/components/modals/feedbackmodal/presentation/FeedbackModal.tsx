import { useTranslation } from "react-i18next";
import ErrorMessage from "../../../basic/ErrorMessage";
import Modal from "../../../basic/Modal";
import TickIcon from "../../../icons/TickIcon";
import { useAppSelector } from "../../../../store";

interface FeedbackModalProps {
  messageType: "SUCCESS" | "ERROR";
  message: string;
  hideModal(): void;
}
const FeedbackModal = (props: FeedbackModalProps) => {
  const { messageType, message, hideModal } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  return (
    <Modal
      className="px-12 py-8"
      primaryButtonText={t("ok")}
      primaryButtonHandler={hideModal}
      primaryButtonClassname="uppercase"
    >
      <div className="flex items-center justify-center">
        {messageType === "ERROR" && (
          <ErrorMessage
            message={message}
            errorIconClassName="w-4 h-4"
            className="text-sm capitalize"
          />
        )}
        {messageType === "SUCCESS" && (
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <TickIcon
              className="w-4 h-4 text-zinc-50"
              circleProps={{
                className: "fill-green-700",
                cx: 25,
                cy: 25,
                r: 25,
              }}
            />
            <span
              className={`text-sm text-green-700 font-poppinsMedium capitalize ${
                isRTL ? "mr-2" : "ml-2"
              }`}
            >
              {message}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FeedbackModal;
