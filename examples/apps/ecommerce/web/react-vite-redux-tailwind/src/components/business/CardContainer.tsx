import { RefObject } from "react";
import { ButtonTypes, CARD_CONTAINER_OPTION } from "../../constants";
import RectangleIcon from "../icons/RectangleIcon";
import Button from "../basic/Button";
import CarouselButtons from "../basic/CarouselButtons";
import { useAppSelector } from "../../store";

interface CardContainerProps {
  heading: string;
  subHeading?: string;
  extraOption?: CARD_CONTAINER_OPTION;
  children: React.ReactElement;
  carouselScrollableElementRef?: RefObject<HTMLDivElement>,
  extraOptionButtonText?: string;
  extraOptionButtonClickHandler?(): void;
  isLoadingButton?: boolean
}
const CardContainer = (props: CardContainerProps) => {
  const {
    heading,
    subHeading,
    extraOption,
    children,
    carouselScrollableElementRef,
    extraOptionButtonText,
    extraOptionButtonClickHandler,
    isLoadingButton = false
  } = props;

  const isRTL = useAppSelector((state) => state.language.isRTL);

  return (
    <div className="flex flex-col">
      <div className={`flex justify-between`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex flex-col">
          <div className={`text-darkRed flex items-center`} dir={isRTL ? 'rtl' : 'ltr'}>
            <RectangleIcon className="w-4 h-10" rectClassName="w-4 h-10" />
            <span className={`font-semibold capitalize ${isRTL ? 'mr-2' : 'ml-2'}`}>{heading}</span>
          </div>

          {subHeading && (
            <span className="text-2xl font-semibold text-black mt-2 capitalize">
              {subHeading}
            </span>
          )}
        </div>

        <div>
          {extraOption === CARD_CONTAINER_OPTION.CAROUSEL &&
            carouselScrollableElementRef && (
              <CarouselButtons scrollableElementRef={carouselScrollableElementRef}
              />
            )}
          {extraOption === CARD_CONTAINER_OPTION.RIGHT_BUTTON &&
            extraOptionButtonText &&
            extraOptionButtonClickHandler && (
              <Button
                buttonType={ButtonTypes.primaryButton}
                className="text-sm px-4 py-2 capitalize"
                onClickHandler={extraOptionButtonClickHandler}
                isLoading={isLoadingButton}
              >
                <span>{extraOptionButtonText}</span>
              </Button>
            )}
        </div>
      </div>
      {children}

      {extraOption === CARD_CONTAINER_OPTION.BOTTOM_BUTTON &&
        extraOptionButtonText &&
        extraOptionButtonClickHandler && (
          <div className="self-center mt-8">
            <Button
              buttonType={ButtonTypes.primaryButton}
              className="text-sm px-4 py-2 capitalize"
              onClickHandler={extraOptionButtonClickHandler}
              isLoading={isLoadingButton}
            >
              <span>{extraOptionButtonText}</span>
            </Button>
          </div>
        )}
    </div>
  );
};

export default CardContainer;
