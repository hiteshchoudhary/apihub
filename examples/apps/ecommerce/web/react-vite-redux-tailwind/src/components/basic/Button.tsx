import { ReactElement, useMemo } from "react";
import { ButtonTypes } from "../../constants";
import LoadingSpinner from "../icons/LoadingSpinner";

interface ButtonProps {
  buttonType?: ButtonTypes;
  children: ReactElement;
  className?: string;
  onClickHandler(): void;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  isDisabled?: boolean;
}
const Button = (props: ButtonProps) => {
  const {
    buttonType = ButtonTypes.noBackgroundAndBorder,
    children,
    className,
    onClickHandler,
    isLoading = false,
    type = "button",
    isDisabled = false,
  } = props;

  // Styles based on type
  const buttonStyles = useMemo(() => {
    switch (buttonType) {
      case ButtonTypes.primaryButton:
        return "bg-darkRed text-zinc-50 rounded";
      case ButtonTypes.secondaryButton:
        return "bg-white text-black font-poppinsMedium rounded border border-grey";
      default:
        return "";
    }
  }, [buttonType]);

  return (
    <button
      type={type}
      className={`transition transform lg:hover:scale-105 active:scale-95 lg:active:scale-95 
      disabled:lg:hover:scale-100 disabled:active:scale-100 disabled:lg:active:scale-100 disabled:opacity-50
       ${buttonStyles} ${className}`}
      onClick={onClickHandler}
      disabled={isDisabled}
    >
      {!isLoading ? (
        children
      ) : (
        <LoadingSpinner className={"w-8 h-8 text-gray-200 fill-black"} />
      )}
    </button>
  );
};

export default Button;
