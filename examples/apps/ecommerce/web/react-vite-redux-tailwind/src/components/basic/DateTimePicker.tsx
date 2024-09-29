import { ar } from "date-fns/locale/ar";
import { enIN } from "date-fns/locale/en-IN";
import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DayPicker, Matcher } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useTranslation } from "react-i18next";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useAppSelector } from "../../store";
import "../../styles/DateRangePicker.css";
import { zeroFormattedNumber } from "../../utils/commonHelper";
import ErrorMessage from "./ErrorMessage";

export interface DateTimePickerActionsRef {
  forceSetSelectedDateTime(range: Date): void;
}
interface DateTimePickerProps {
  onChange(range: Date): void;
  errorMessage?: string;
  actionsRef?: DateTimePickerActionsRef;
  inputClassName?: string;
  containerClassName?: string;
  openOnTop?: boolean;
  placeholder?: string;
  disabledProperties?: Matcher | Matcher[]
}
const DateTimePicker = React.forwardRef(
  (props: DateTimePickerProps, _: React.ForwardedRef<HTMLInputElement>) => {
    const {
      onChange,
      errorMessage = "",
      actionsRef,
      containerClassName = "",
      inputClassName = "",
      openOnTop = false,
      placeholder = "",
      disabledProperties
    } = props;

    const { t } = useTranslation();

    const isRTL = useAppSelector((state) => state.language.isRTL);

    /* Visibility of date range picker */
    const [isPickerShown, setIsPickerShown] = useState(false);

    /* To store the selected date and time */
    const [selectedDateTime, setSelectedDateTime] = useState<Date>();

    const [selectedTime, setSelectedTime] = useState<string>("");

    /* Reference to the input element and div element which wraps around date time picker */
    const inputRef = useRef<HTMLInputElement>(null);
    const dateTimePickerRef = useRef<HTMLDivElement>(null);

    /* To know whether a click has occurred outside the date time picker */
    const [clickedOutsidePicker] = useOutsideClick(dateTimePickerRef);

    /* Toggle visibility to date time picker calendar */
    const togglePicker = () => {
      setIsPickerShown((prev) => !prev);
    };

    /* As month index starts from 0, adding 1 */
    const getMonthValue = (month?: number): string => {
      if (typeof month === "number" && !isNaN(month)) {
        return `${zeroFormattedNumber(month + 1)}`;
      } else {
        return "";
      }
    };

    const timeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      /* Time as string hh:mm */
      const time = event.target.value;

      /* If selectedDateTime does not exist */
      if (!selectedDateTime) {
        /* Set the selected time and return */
        setSelectedTime(time);
        return;
      }

      /* Time as hh:mm being split into an array of 2 elements */
      const timeElementsList = time.split(":");
      const hour = Number(timeElementsList[0]); /* Hour */
      const minutes = Number(timeElementsList[1]); /* Minutes */

      /* Setting the time in selectedDateTime */
      setSelectedDateTime((prev) => {
        return new Date(
          prev!.getFullYear(),
          prev!.getMonth(),
          prev!.getDate(),
          hour,
          minutes
        );
      });
      /* Setting the selected time */
      setSelectedTime(time);
    };

    const dateChangeHandler = (selectedDate: Date | undefined) => {
      /* If selectedTime is undefined (Date is selected first) or the selected date is undefined */
      if (!selectedTime || !selectedDate) {
        setSelectedDateTime(selectedDate);
        return;
      }

      /* Time as hh:mm being split into an array of 2 elements */
      const timeElementsList = selectedTime.split(":");
      const hour = Number(timeElementsList[0]); /* Hour */
      const minutes = Number(timeElementsList[1]); /* Minutes */

      /* Setting the date in selected date time,  Time is already selected here*/
      setSelectedDateTime((_) => {
        return new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          hour,
          minutes
        );
      });
    };

    /* Value shown on the input */
    const inputValue = useMemo(() => {
      if (selectedDateTime) {
        const date = zeroFormattedNumber(selectedDateTime.getDate());
        const month = getMonthValue(selectedDateTime?.getMonth());
        const year = selectedDateTime.getFullYear();
        const hours = zeroFormattedNumber(selectedDateTime.getHours());
        const minutes = zeroFormattedNumber(selectedDateTime.getMinutes());
        return `${date}/${month}/${year} - ${hours}:${minutes}`;
      }
      return "";
    }, [selectedDateTime]);

    /* If clicked outside, toggle picker */
    useEffect(() => {
      if (clickedOutsidePicker) {
        togglePicker();
      }
    }, [clickedOutsidePicker]);

    useEffect(() => {
      /* On change of selected date time call parent onChange function */
      if (selectedDateTime) {
        onChange(selectedDateTime);
      }
    }, [selectedDateTime, onChange]);

    /* To allow parent to forcefully set selected date time: For operations like reset */
    useEffect(() => {
      if (actionsRef) {
        actionsRef.forceSetSelectedDateTime = (dateTime) => {
          setSelectedDateTime(dateTime);
          setSelectedTime(`${dateTime.getHours()}:${dateTime.getMinutes()}`);
        };
      }
    }, [actionsRef]);

    return (
      <div className={`relative ${containerClassName}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <input
          type="text"
          ref={inputRef}
          onClick={togglePicker}
          placeholder={placeholder ? placeholder : t("selectDateTime")}
          value={selectedDateTime && inputValue ? inputValue : ""}
          readOnly={true}
          className={`p-2 outline rounded outline-1 text-sm placeholder:capitalize
        ${isPickerShown ? "outline-darkRed" : "outline-neutral-300"} ${inputClassName}`}
        />
        {errorMessage && (
          <ErrorMessage message={errorMessage} isErrorIconShown={false} className="mt-1" />
        )}
        {isPickerShown && (
          <div ref={dateTimePickerRef}>
            <DayPicker
              mode="single"
              selected={selectedDateTime}
              onSelect={dateChangeHandler}
              className={`absolute z-20 bg-white ${isRTL ? "right-0" : "left-0"} ${openOnTop ? 'bottom-0' : 'top-1'} w-fit border border-neutral-200 p-2 font-poppinsRegular m-0 rounded`}
              style={{ marginTop: inputRef.current?.clientHeight }}
              dir={isRTL ? "rtl" : "ltr"}
              locale={isRTL ? ar : enIN}
              disabled={disabledProperties}
              footer={
                <>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={timeChangeHandler}
                  />
                </>
              }
            />
          </div>
        )}
      </div>
    );
  }
);

export default DateTimePicker;
