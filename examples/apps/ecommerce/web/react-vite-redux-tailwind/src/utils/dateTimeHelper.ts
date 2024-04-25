import moment from "moment";
import { DATE_TIME_FORMATS, DURATION } from "../constants";

export const getCurrentUTCTime = (format: DATE_TIME_FORMATS): string => {
  return moment.utc().format(format);
};

export const convertUTCToLocalTime = (date: string, format: DATE_TIME_FORMATS): string => {
  return moment.utc(date, format).local().format(format);
}
export const convertMillisecondsToDaysHoursMinsSec = (
  milliseconds: number
): DURATION => {
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)) || -1;

  milliseconds = milliseconds % (1000 * 60 * 60 * 24);

  const hours = Math.floor(milliseconds / (1000 * 60 * 60)) || -1;

  milliseconds = milliseconds % (1000 * 60 * 60);

  const minutes = Math.floor(milliseconds / (1000 * 60));

  milliseconds = milliseconds % (1000 * 60);

  const seconds = Math.floor(milliseconds / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export const formatDateTime = (
  input: string,
  inputFormat: DATE_TIME_FORMATS,
  outputFormat: DATE_TIME_FORMATS
): string => {
  return moment(input, inputFormat).format(outputFormat);
};

export const formatDateFromDateObject = (
  date: Date,
  outputFormat: DATE_TIME_FORMATS
): string => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const day = date.getDate();

  return moment(
    `${year}-${month}-${day}`,
    DATE_TIME_FORMATS.standardDate
  ).format(outputFormat);
};

export const checkIfDateIsInRange = (
  date: string,
  startRange: string,
  endRange: string,
  dateFormat: DATE_TIME_FORMATS
): boolean => {
  const momentDate = moment(date, dateFormat);
  const momentStartRange = moment(startRange, dateFormat);
  const momentEndRange = moment(endRange, dateFormat);

  if (
    momentDate.isSameOrBefore(momentEndRange) &&
    momentDate.isSameOrAfter(momentStartRange)
  ) {
    return true;
  }
  return false;
};
