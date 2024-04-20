import React from "react";
import { classNames } from "../utils";

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    fullWidth?: boolean;
    severity?: "primary" | "secondary" | "danger";
    size?: "base" | "small";
  }
> = ({ fullWidth, severity = "primary", size = "base", ...props }) => {
  return (
    <>
      <button
        {...props}
        className={classNames(
          "rounded-full inline-flex flex-shrink-0 justify-center items-center text-center text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm",
          fullWidth ? "w-full" : "",
          severity === "secondary"
            ? "bg-secondary hover:bg-secondary/80 disabled:bg-secondary/50 outline outline-[1px] outline-zinc-400"
            : severity === "danger"
            ? "bg-danger hover:bg-danger/80 disabled:bg-danger/50"
            : "bg-primary hover:bg-primary/80 disabled:bg-primary/50",
          size === "small" ? "text-sm px-3 py-1.5" : "text-base px-4 py-3",
          props.className || ""
        )}
      >
        {props.children}
      </button>
    </>
  );
};

export default Button;
