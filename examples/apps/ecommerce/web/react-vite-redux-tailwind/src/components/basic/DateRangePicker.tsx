import { ar } from "date-fns/locale/ar";
import { enIN } from "date-fns/locale/en-IN";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useTranslation } from "react-i18next";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useAppSelector } from "../../store";
import "../../styles/DateRangePicker.css";
import ErrorMessage from "./ErrorMessage";

export interface DateRangePickerActionsRef {
  forceSetSelectedRange(range: DateRange): void;
}
interface DateRangePickerProps {
  onChange(range: DateRange): void;
  errorMessage?: string;
  actionsRef?: DateRangePickerActionsRef;
  inputClassName?: string;
  containerClassName?: string;
}
const DateRangePicker = React.forwardRef(
  (props: DateRangePickerProps, _: React.ForwardedRef<HTMLInputElement>) => {
    const { onChange, errorMessage = "", actionsRef, containerClassName = "", inputClassName = "" } = props;

    const { t } = useTranslation();

    const isRTL = useAppSelector((state) => state.language.isRTL);

    /* Visibility of date range picker */
    const [isPickerShown, setIsPickerShown] = useState(false);

    /* To store the selected range of dates */
    const [selectedRange, setSelectedRange] = useState<DateRange>();

    /* Reference to the input element and div element which wraps around date range picker */
    const inputRef = useRef<HTMLInputElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);

    /* To know whether a click has occurred outside the date range picker */
    const [clickedOutsidePicker] = useOutsideClick(datePickerRef);

    /* Toggle visibility to date range picker calendar */
    const togglePicker = () => {
      setIsPickerShown((prev) => !prev);
    };

    /* As month index starts from 0, adding 1 */
    const getMonthValue = (month?: number): string => {
      if (typeof month === "number" && !isNaN(month)) {
        return `${month + 1}`;
      } else {
        return "";
      }
    };

    /* Value shown on the input */
    const inputValue = useMemo(() => {
      return `${selectedRange?.from?.getDate()}/${getMonthValue(selectedRange?.from?.getMonth())}/${selectedRange?.from?.getFullYear()} - ${selectedRange?.to?.getDate()}/${getMonthValue(selectedRange?.to?.getMonth())}/${selectedRange?.to?.getFullYear()}`;
    }, [selectedRange]);

    /* If clicked outside, toggle picker */
    useEffect(() => {
      if (clickedOutsidePicker) {
        togglePicker();
      }
    }, [clickedOutsidePicker]);

    useEffect(() => {
      /* On change of selectedRange call parent onChange function */
      if (selectedRange && selectedRange?.from && selectedRange?.to) {
        onChange(selectedRange);
      }
    }, [selectedRange, onChange]);

    /* To allow parent to forcefully set selected range: For operations like reset */
    useEffect(() => {

      if (actionsRef) {
        actionsRef.forceSetSelectedRange = (range) => {
          setSelectedRange(range);
        };
      }
    }, [actionsRef]);

    return (
      <div className={`relative ${containerClassName}`}>
        <input
          type="text"
          ref={inputRef}
          onClick={togglePicker}
          placeholder={t("selectRange")}
          value={selectedRange?.from && selectedRange?.to ? inputValue : ""}
          readOnly={true}
          className={`p-2 outline rounded outline-1 text-sm placeholder:capitalize
        ${isPickerShown ? "outline-darkRed" : "outline-neutral-300"} ${inputClassName}`}
        />
        {errorMessage && (
          <ErrorMessage message={errorMessage} errorIconClassName="w-4 h-4" />
        )}
        {isPickerShown && (
          <div ref={datePickerRef}>
            <DayPicker
              mode="range"
              selected={selectedRange}
              onSelect={setSelectedRange}
              className={`absolute z-20 bg-white top-1 ${isRTL ? 'right-0' : 'left-0'} w-fit border border-neutral-200 p-2 font-poppinsRegular m-0 rounded`}
              style={{ marginTop: inputRef.current?.clientHeight }}
              dir={isRTL ? 'rtl' : 'ltr'}
              locale={isRTL ? ar : enIN}
            />
          </div>
        )}
      </div>
    );
  }
);

export default DateRangePicker;
