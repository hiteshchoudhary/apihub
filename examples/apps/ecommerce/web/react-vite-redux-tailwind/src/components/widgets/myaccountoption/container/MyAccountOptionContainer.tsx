import { ROUTE_PATHS, SelectionMenuItem } from "../../../../constants";
import MyAccountOption from "../presentation/MyAccountOption";
import { useState } from "react";
import LogoutModalContainer from "../../../modals/logoutmodal/container/LogoutModalContainer";
import useCustomNavigate from "../../../../hooks/useCustomNavigate";

const MyAccountOptionContainer = () => {

  /* Logout modal visibility state */
  const [isLogoutModalShown, setIsLogoutModalShown] = useState(false);
  const navigate = useCustomNavigate();

  const itemClickHandler = (item: SelectionMenuItem) => {
    switch (item.id) {
      case 1:
        navigate(ROUTE_PATHS.manageAccount);
        return;
      case 2: 
        navigate(ROUTE_PATHS.orders);
        return;
      case 3: {
        //Logout
        setIsLogoutModalShown(true);
        return;
      }
    }
  };

  const hideLogoutModal = () => {
    setIsLogoutModalShown(false);
  };

  return (
    <>
      <MyAccountOption itemClickHandler={itemClickHandler} />
      {
        isLogoutModalShown &&
        <LogoutModalContainer isShown={isLogoutModalShown} hideModal={hideLogoutModal} />
      }
    </>
  );
};

export default MyAccountOptionContainer;
