import { ForwardedRef, forwardRef, useId, useState } from "react";
import { useAppSelector } from "../../store";
import HidePasswordIcon from "../icons/HidePasswordIcon";
import ShowPasswordIcon from "../icons/ShowPasswordIcon";
import ErrorMessage from "./ErrorMessage";

interface InputProps {
  placeholder: string;
  type: string;
  className?: string;
  autoComplete?: string;
  errorMessage?: string;
  containerClassName?: string;
}

const Input = forwardRef(
  (props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {
      placeholder = "",
      type = "text",
      className = "",
      containerClassName = "",
      autoComplete = "",
      errorMessage = "",
      ...otherProps
    } = props;

    /* Unique id */
    const id = useId();

    const isRTL = useAppSelector((state) => state.language.isRTL);

    /* Password visibility state */
    const [isPasswordVisisble, setIsPasswordVisible] = useState(false);

    /* Toggle password visibility */
    const togglePassword = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    /* Password Input */
    if (type === "password") {
      return (
        <div className={`flex flex-col ${containerClassName}`}>
          <div
            className={`flex justify-between border-b border-b-grey pb-1 focus-within:border-b-black`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <input
              ref={ref}
              placeholder={placeholder}
              type={isPasswordVisisble ? "text" : type}
              {...otherProps}
              id={id}
              className={`flex-1 outline-none ${className}`}
              dir={isRTL ? "rtl" : "ltr"}
              autoComplete={autoComplete}
            />
            <button
              onClick={togglePassword}
              className="h-fit self-end ml-2"
              type="button"
            >
              {isPasswordVisisble ? (
                <HidePasswordIcon className="w-4 h-4 text-black" />
              ) : (
                <ShowPasswordIcon className="w-4 h-4 text-black" />
              )}
            </button>
          </div>
          {errorMessage && <ErrorMessage className="mt-1 text-sm" message={errorMessage} isErrorIconShown={false} />}
        </div>
      );
    }
    return (
      <div className={`flex flex-col ${containerClassName}`}>
        <input
          ref={ref}
          placeholder={placeholder}
          type={type}
          {...otherProps}
          id={id}
          className={`outline-none border-b border-b-grey pb-1 focus:border-b-black ${className}`}
          dir={isRTL ? "rtl" : "ltr"}
          autoComplete={autoComplete}
        />
        {errorMessage && <ErrorMessage className="mt-1 text-sm" message={errorMessage} isErrorIconShown={false} />}
      </div>
    );
  }
);

export default Input;
