import { useMemo } from "react";
import { ARROW_BUTTONS } from "../../constants";
import UpArrow from "../icons/UpArrow";
import LeftArrow from "../icons/LeftArrow";

interface ArrowButtonProps {
  type: ARROW_BUTTONS;
  onClickHandler: () => void;
  isDisabled: boolean;
  className?: string;
}
const ArrowButton = (props: ArrowButtonProps) => {
  const { type, onClickHandler, isDisabled, className } = props;

  const ArrowIcon = useMemo(() => {
    switch (type) {
      case ARROW_BUTTONS.UP:
        return <UpArrow className="w-4 h-4" />;
      case ARROW_BUTTONS.DOWN:
        return <UpArrow className="w-4 h-4 rotate-180" />;
      case ARROW_BUTTONS.LEFT:
        return <LeftArrow className="w-4 h-4" />;
      case ARROW_BUTTONS.RIGHT:
        return <LeftArrow className="w-4 h-4 rotate-180" />;
    }
  }, [type]);
  return (
    <button
      className={`rounded-full bg-neutral-100 p-2 active:bg-darkRed active:text-zinc-50 active:disabled:bg-neutral-100 active:disabled:text-black ${className}`}
      onClick={onClickHandler}
      disabled={isDisabled}
    >
      {ArrowIcon}
    </button>
  );
};

export default ArrowButton;
