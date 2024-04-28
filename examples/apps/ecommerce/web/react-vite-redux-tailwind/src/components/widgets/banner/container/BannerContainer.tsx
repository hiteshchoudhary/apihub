import { useEffect, useState } from "react";
import { DATE_TIME_FORMATS } from "../../../../constants";
import { BANNER_PROMOTION_END_DATE } from "../../../../data/applicationData";
import { getCurrentUTCTime } from "../../../../utils/dateTimeHelper";
import Banner from "../presentation/Banner";

const BannerContainer = () => {

  /* Current time in UTC formatted as YYYY-MM-DDTHH:mm:ss */
  const [startTime, setStartTime] = useState(
    getCurrentUTCTime(DATE_TIME_FORMATS.standardDateWithTime)
  );

  useEffect(() => {
    /* Set current UTC time as start time after every 1 second */
    setInterval(() => {
      setStartTime(getCurrentUTCTime(DATE_TIME_FORMATS.standardDateWithTime));
    }, 1000);
  }, []);

  return (
    <Banner
      isTimerShown={false}
      startTime={startTime}
      endTime={BANNER_PROMOTION_END_DATE}
    />
  );
};

export default BannerContainer;
