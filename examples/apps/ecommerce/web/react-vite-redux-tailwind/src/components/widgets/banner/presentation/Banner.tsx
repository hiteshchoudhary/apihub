import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../store";
import Image from "../../../basic/Image";
import Timer from "../../../business/Timer";
import { PUBLIC_IMAGE_PATHS } from "../../../../constants";

interface BannerProps {
  isTimerShown: boolean;
  startTime?: string;
  endTime?: string;
}
const Banner = (props: BannerProps) => {
  const { isTimerShown, startTime, endTime } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  return (
    <div
      className=" flex flex-col rounded-3xl bg-black
    "
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-y-2" dir={isRTL ? "rtl" : "ltr"}>
          <span
            className={`text-zinc-50 text-xl lg:text-3xl font-poppinsMedium ${isRTL ? "mr-6" : "ml-6"} w-fit lg:tracking-widest`}
          >
            {t("bannerPromotion")}
          </span>
          <span
            className={`text-zinc-50 text-xl lg:text-3xl font-poppinsMedium ${isRTL ? "mr-6" : "ml-6"} w-fit lg:tracking-widest`}
          >
            {t("bannerPromotion2")}
          </span>
        </div>
        <Image
          src={PUBLIC_IMAGE_PATHS.bannerProductImage}
          backupImageSrc=""
          alt={`${t("bannerPromotion")} ${t("bannerPromotion2")}`}
          className="w-1/3 p-4"
        />
      </div>
      {isTimerShown && startTime && endTime && (
        <Timer
          startTime={startTime}
          endTime={endTime}
          className="w-full mt-4 justify-center"
          timerContainerClassName="mr-4"
        />
      )}
    </div>
  );
};

export default Banner;
