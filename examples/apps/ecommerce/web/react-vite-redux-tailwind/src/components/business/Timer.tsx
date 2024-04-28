import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { DATE_TIME_FORMATS, DURATION } from "../../constants";
import { convertMillisecondsToDaysHoursMinsSec } from "../../utils/dateTimeHelper";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store";
import { zeroFormattedNumber } from "../../utils/commonHelper";

interface TimerProps {
  startTime: string;
  endTime: string;
  className?: string;
  timerContainerClassName?: string;
}
const Timer = (props: TimerProps) => {
  const {
    startTime,
    endTime,
    className = "",
    timerContainerClassName = "",
  } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  const [duration, setDuration] = useState<DURATION>({
    days: -1,
    hours: -1,
    minutes: -1,
    seconds: -1,
  });

  const calculateDuration = useCallback(() => {
    /* Converting to moment objects */
    const start = moment.utc(startTime, DATE_TIME_FORMATS.standardDateWithTime);
    const end = moment.utc(endTime, DATE_TIME_FORMATS.standardDateWithTime);

    /* end - start in milliseconds */
    const diffInMillis = end.diff(start);

    /* Converting millisecinds to days, hours, minutes and seconds */
    const diffInDuration: DURATION =
      convertMillisecondsToDaysHoursMinsSec(diffInMillis);

    setDuration(diffInDuration);
  }, [startTime, endTime]);

  useEffect(() => {
    calculateDuration();
  }, [calculateDuration]);

  return (
    <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} ${className}`}>
      {duration?.days >= 0 && (
        <div
          className={`flex flex-col justify-center items-center rounded-full bg-white text-black p-4 w-20 h-20 ${timerContainerClassName}`}
        >
          <span className="font-semibold">{zeroFormattedNumber(duration.days)}</span>
          <span className="capitalize">{t("days")}</span>
        </div>
      )}
      {duration?.hours >= 0 && (
        <div
          className={`flex flex-col justify-center items-center rounded-full bg-white text-black p-4 w-20 h-20 ${timerContainerClassName}`}
        >
          <span className="font-semibold">{zeroFormattedNumber(duration.hours)}</span>
          <span className="capitalize">{t("hours")}</span>
        </div>
      )}
      {duration?.minutes >= 0 && (
        <div
          className={`flex flex-col justify-center items-center rounded-full bg-white text-black p-4 w-20 h-20 ${timerContainerClassName}`}
        >
          <span className="font-semibold">{zeroFormattedNumber(duration.minutes)}</span>
          <span className="capitalize">{t("minutes")}</span>
        </div>
      )}
      {duration?.seconds >= 0 && (
        <div
          className={`flex flex-col justify-center items-center rounded-full bg-white text-black p-4 w-20 h-20 ${timerContainerClassName}`}
        >
          <span className="font-semibold">{zeroFormattedNumber(duration.seconds)}</span>
          <span className="capitalize">{t("seconds")}</span>
        </div>
      )}
    </div>
  );
};

export default Timer;
