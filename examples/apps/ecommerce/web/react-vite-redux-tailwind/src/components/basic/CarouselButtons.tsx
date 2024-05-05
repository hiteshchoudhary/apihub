import { RefObject, useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../store";
import ArrowButton from "./ArrowButton";
import { ARROW_BUTTONS } from "../../constants";

interface CarouselButtons {
  scrollableElementRef: RefObject<HTMLDivElement>;
}
const CarouselButtons = (props: CarouselButtons) => {
  const { scrollableElementRef } = props;

  const isRTL = useAppSelector((state) => state.language.isRTL);

  /* Next & Back buttons disabled state */
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);
  const [isBackButtonDisabled, setIsBackButtonDisabled] = useState(true);

  /* Scroll to the right */
  const onNextClickHandler = () => {
    if (scrollableElementRef.current) {
      scrollableElementRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };

  /* Scroll to the left */
  const onBackClickHandler = () => {
    if (scrollableElementRef.current) {
      scrollableElementRef.current.scrollBy({ left: -500, behavior: "smooth" });
    }
  };

  const onElementScroll = useCallback(() => {
    if (scrollableElementRef.current) {
      /* Checking if there is more scrollable width: Disabling/Enabling Button based on it */
      const scrollWidth = scrollableElementRef.current.scrollWidth;
      const clientWidth = scrollableElementRef.current.clientWidth;
      const scrollLeft = Math.abs(scrollableElementRef.current.scrollLeft);

      if (scrollLeft === 0) {
        /* 0 Scrolled */
        setIsBackButtonDisabled(true);
        setIsNextButtonDisabled(false);
      } else if (scrollLeft + clientWidth === scrollWidth) {
        /* Fully Scrolled */
        setIsNextButtonDisabled(true);
        setIsBackButtonDisabled(false);
      } else {
        /* In between */
        setIsBackButtonDisabled(false);
        setIsNextButtonDisabled(false);
      }
    }
  }, [scrollableElementRef]);

  /* Listening for scroll event on the referenced element passed */
  useEffect(() => {
    const elementRef = scrollableElementRef.current;
    if (elementRef) {
      elementRef.addEventListener("scroll", onElementScroll);
    }
    return () => {
      elementRef?.removeEventListener("scroll", onElementScroll);
    };
  }, [scrollableElementRef, onElementScroll]);
  
  return (
    <div className={`flex justify-between`} dir={'ltr'}>
      <ArrowButton
        type={ARROW_BUTTONS.LEFT}
        onClickHandler={onBackClickHandler}
        isDisabled={isRTL ? isNextButtonDisabled : isBackButtonDisabled}
      />
      <ArrowButton
        type={ARROW_BUTTONS.RIGHT}
        onClickHandler={onNextClickHandler}
        isDisabled={isRTL ? isBackButtonDisabled : isNextButtonDisabled}
        className="ml-1"
      />
    </div>
  );
};

export default CarouselButtons;
