import React, { useId } from "react";
import { RADIO_BUTTON_TYPE } from "../../constants";
import { useAppSelector } from "../../store";
import ErrorMessage from "./ErrorMessage";

interface RadioButtonsProps<T> {
  items: Array<RADIO_BUTTON_TYPE<T>>;
  containerClassName?: string;
  radioButtonContainerClassName?: string;
  onChange(selectedItem: T): void;
  errorMessage?: string;
}
const RadioButtons = React.forwardRef(
  <T,>(
    props: RadioButtonsProps<T>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const {
      items,
      containerClassName = "",
      radioButtonContainerClassName = "",
      onChange,
      errorMessage = "",
    } = props;

    const radioSetName = useId();

    const isRTL = useAppSelector((state) => state.language.isRTL);

    return (
      <div className={`${containerClassName}`}>
        {errorMessage && (
          <ErrorMessage message={errorMessage} errorIconClassName="w-4 h-4" />
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center ${
              isRTL ? "flex-row-reverse" : ""
            } ${radioButtonContainerClassName}`}
          >
            <input
              type="radio"
              id={item.id}
              name={radioSetName}
              defaultChecked={item.isDefaultSelected}
              ref={ref}
              className={`appearance-none cursor-pointer w-4 h-4 bg-white rounded-full outline outline-2 outline-black 
              checked:border-[3px] checked:border-white checked:bg-black
              ${isRTL ? "ml-2" : "mr-2"}`}
              onChange={() => {
                onChange(item.data);
              }}
            />
            {item.customElement ? (
              <div className="w-full">
                {React.cloneElement(item.customElement, {
                  data: item.data,
                })}
              </div>
            ) : item.label ? (
              <label htmlFor={item.id} className="w-full cursor-pointer">
                {item.label}
              </label>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    );
  }
);

export default RadioButtons;
