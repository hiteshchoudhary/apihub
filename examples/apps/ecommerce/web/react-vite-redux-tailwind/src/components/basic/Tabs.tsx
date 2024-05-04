import { useState } from "react";
import { TabItemConfig } from "../../constants";
import TabItem from "./TabItem";
import { useAppSelector } from "../../store";

interface TabsProps {
  tabsConfig: TabItemConfig[];
  defaultSelectedTab?: TabItemConfig;
  onTabSelectionChanged(tabItem: TabItemConfig): void;
  tabsContainerClassName?: string;
  tabItemClassName?: string;
}
const Tabs = (props: TabsProps) => {
  const {
    tabsConfig,
    defaultSelectedTab = { id: -1, tabHeadingKey: "" },
    onTabSelectionChanged,
    tabsContainerClassName = "",
    tabItemClassName = ""
  } = props;

  const isRTL = useAppSelector((state) => state.language.isRTL);

  /* Selected Tab */
  const [selectedTab, setSelectedTab] =
    useState<TabItemConfig>(defaultSelectedTab);

  /* Tab Change */
  const tabChangeHandler = (tab: TabItemConfig) => {
    /* If the tab clicked is not equal to the currently selected tab */
    if (tab.id !== selectedTab.id) {
      onTabSelectionChanged(tab);
      setSelectedTab(tab);
    }
  };

  return (
    <div className={`flex border-b-2 gap-x-4  border-b-neutral-100 shadow-sm ${tabsContainerClassName}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {tabsConfig.map((tab) => (
        <TabItem
          tabItem={tab}
          key={tab.id}
          onTabSelected={tabChangeHandler}
          isTabSelected={tab.id === selectedTab.id}
          tabItemClassName={`flex-1 ${tabItemClassName}`}
        />
      ))}
    </div>
  );
};

export default Tabs;
