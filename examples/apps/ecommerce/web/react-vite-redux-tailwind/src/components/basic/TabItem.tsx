import { useTranslation } from "react-i18next";
import { TabItemConfig } from "../../constants";
import Text from "./Text";

interface TabItemProps {
  tabItem: TabItemConfig;
  onTabSelected(tab: TabItemConfig): void;
  isTabSelected: boolean;
  tabItemClassName?: string
}
const TabItem = ({
  tabItem,
  onTabSelected,
  isTabSelected = false,
  tabItemClassName = ""
}: TabItemProps) => {

  const { t } = useTranslation();

  return (
    <button
      className={`p-2 text-sm  ${
        isTabSelected ? "border-b-2 border-b-darkRed" : ""
      } ${tabItemClassName}`}
      onClick={() => onTabSelected(tabItem)}
    >
      <Text className={`capitalize ${isTabSelected ? 'font-poppinsMedium' : ''}`}>{t(tabItem.tabHeadingKey)}</Text>
    </button>
  );
};

export default TabItem;
