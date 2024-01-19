import React from "react";
import { classNames } from "../utils";
import { FaSpinner } from "react-icons/fa6";

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    fullWidth?: boolean;
    severity?: "primary" | "secondary";
    size?: "base" | "small";
    loading?: boolean;
  }
> = ({
  fullWidth,
  severity = "secondary",
  size = "base",
  loading = false,
  ...props
}) => {
  return (
    <>
      <button
        {...props}
        disabled={loading}
        className={classNames(
          "rounded-md flex flex-shrink-0 gap-2 justify-center items-center text-cente focus-visible:outline  ",
          fullWidth ? "w-full" : "",
          severity === "primary"
            ? " items-center bg-[#ae7aff] text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
            : "",

          size === "small" ? "text-sm px-3 py-1.5" : "text-base px-4 py-3",
          props.className || ""
        )}
      >
        {loading ? <FaSpinner className="animate-spin" /> : props.children}
      </button>
    </>
  );
};

export default Button;
