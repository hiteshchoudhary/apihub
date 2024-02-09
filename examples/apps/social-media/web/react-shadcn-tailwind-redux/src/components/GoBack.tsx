import clsx from "clsx";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GoBack = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const gobackHandler = () => {
    navigate(-1);
  };

  return (
    <div
      onClick={gobackHandler}
      className={clsx(props.className, "cursor-pointer", {
        hidden: pathname === "/",
      })}
      {...props}
    >
      <ArrowLeft />
    </div>
  );
};

export default GoBack;
