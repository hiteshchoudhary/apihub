import { useTranslation } from "react-i18next";
import FooterSection from "../../../business/FooterSection";
import { useAppSelector } from "../../../../store";
import Text from "../../../basic/Text";

const Footer = () => {
  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);
  return (
    <footer className="bg-black">
      <div
        className={`flex justify-between`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <FooterSection
          heading={t("companyName")}
          headingClassName="font-semibold tracking-wider capitalize p-8"
          className="w-2/6"
        />
        <FooterSection heading={t("support")} headingClassName="capitalize" className="p-8">
          <div className="flex flex-col text-zinc-50">
            <Text
              className="break-words text-base capitalize"
            >
              {t("companyAddress")}
            </Text>
            <Text className="mt-4">
              {t("companyEmail")}
            </Text>
            <Text className="mt-4">
              {t("companyPhone")}
            </Text>
          </div>
        </FooterSection>
      </div>
      <Text
        className="text-zinc-50 flex justify-center pb-4 capitalize"
      >
        {t("copyrightMessage")}
      </Text>
    </footer>
  );
};

export default Footer;
