import { useMemo } from "react";
import { ButtonTypes } from "../../constants";
import Button from "./Button";

interface ModalProps {
  children: React.ReactElement;
  className?: string;
  heading?: string;
  primaryButtonText?: string;
  primaryButtonClassname?: string;
  secondaryButtonText?: string;
  secondaryButtonClassname?: string;
  primaryButtonHandler?(): void;
  secondaryButtonHandler?(): void;
  isPrimaryButtonLoading?: boolean;
}
const Modal = (props: ModalProps) => {
  const {
    children,
    className = "",
    heading = "",
    primaryButtonText = "",
    secondaryButtonText = "",
    primaryButtonClassname = "",
    secondaryButtonClassname = "",
    primaryButtonHandler,
    secondaryButtonHandler,
    isPrimaryButtonLoading = false,
  } = props;

  const isModalFooterShown = useMemo(() => {
    if (
      (primaryButtonText && primaryButtonHandler) ||
      (secondaryButtonText && secondaryButtonHandler)
    ) {
      return true;
    }
    return false;
  }, [
    primaryButtonText,
    primaryButtonHandler,
    secondaryButtonText,
    secondaryButtonHandler,
  ]);
  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <dialog
        className={`rounded-xl p-2 shadow-md flex flex-col justify-between ${className}`}
      >
        {heading && (
          <header className="text-2xl flex justify-center font-poppinsMedium mb-4 capitalize">
            {heading}
          </header>
        )}
        {children}

        {isModalFooterShown && (
          <div className="flex flex-col justify-center gap-2 mt-8">
            {primaryButtonText && primaryButtonHandler && (
              <Button
                buttonType={ButtonTypes.primaryButton}
                className={`px-12 py-1 flex justify-center ${primaryButtonClassname}`}
                onClickHandler={primaryButtonHandler}
                isLoading={isPrimaryButtonLoading}
              >
                <span>{primaryButtonText}</span>
              </Button>
            )}
            {secondaryButtonText && secondaryButtonHandler && (
              <Button
                buttonType={ButtonTypes.secondaryButton}
                className={`px-12 py-1 flex justify-center ${secondaryButtonClassname}`}
                onClickHandler={secondaryButtonHandler}
              >
                <span>{secondaryButtonText}</span>
              </Button>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
};

export default Modal;
