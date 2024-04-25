import { useState } from "react";
import Tabs from "../../../components/basic/Tabs";
import EditProfileContainer from "../../../components/widgets/editprofile/container/EditProfileContainer";
import { TabItemConfig } from "../../../constants";
import { MANAGE_ACCOUNT_TABS } from "../../../data/applicationData";
import EditAddressesContainer from "../../../components/widgets/editaddresses/container/EditAddressesContainer";

const ManageAccountPage = () => {
  /* Selected Tab */
  const [selectedTab, setSelectedTab] = useState<TabItemConfig>(
    MANAGE_ACCOUNT_TABS[0]
  );

  /* Change the selected tab state, on click of a new tab */
  const onTabSelectionChanged = (tabItem: TabItemConfig) => {
    setSelectedTab(tabItem);
  };

  return (
    <>
      <Tabs
        tabsConfig={MANAGE_ACCOUNT_TABS}
        onTabSelectionChanged={onTabSelectionChanged}
        defaultSelectedTab={MANAGE_ACCOUNT_TABS[0]}
      />

      <div className={`px-4 py-4 lg:px-10`}>
        {selectedTab.id === 1 ? (
          <EditProfileContainer />
        ) : selectedTab.id === 2 ? (
          <EditAddressesContainer />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ManageAccountPage;
