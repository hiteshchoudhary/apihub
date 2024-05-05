import { useTranslation } from "react-i18next";
import Text from "../../../basic/Text";
import Image from "../../../basic/Image";
import { PUBLIC_IMAGE_PATHS } from "../../../../constants";
import CompanyGuranteeListContainer from "../../companyguranteelist/container/CompanyGuranteeListContainer";
import { useAppSelector } from "../../../../store";

const About = () => {
  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  return (
    <div className="flex flex-col gap-y-32 py-4">
      <div
        className="flex flex-col gap-y-20 lg:gap-y-0 lg:flex-row lg:items-center lg:justify-between"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex flex-col items-center gap-y-4 px-2 lg:items-start lg:w-3/4 lg:px-10">
          <Text className="capitalize font-semibold text-3xl lg:text-4xl tracking-wider">
            {t("ourStory")}
          </Text>
          <Text className="mt-4 text-center lg:text-start">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus
            quibusdam tempora praesentium illum.
          </Text>
          <Text className="text-center lg:text-start">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et eveniet
            autem consectetur quidem perferendis aliquid molestias ducimus
            repellat animi possimus. Incidunt laudantium similique pariatur qui
            accusamus praesentium a odio hic?
          </Text>
        </div>
        <div className="lg:w-1/2">
          <Image
            src={PUBLIC_IMAGE_PATHS.aboutSideImage}
            backupImageSrc=""
            alt={t("about")}
            className="rounded"
          />
        </div>
      </div>
      <CompanyGuranteeListContainer />
    </div>
  );
};

export default About;
