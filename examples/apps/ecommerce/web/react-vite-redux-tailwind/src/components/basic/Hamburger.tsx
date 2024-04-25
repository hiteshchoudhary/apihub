import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { DrawerOption, NavigationOption } from "../../constants";
import useOutsideClick from "../../hooks/useOutsideClick";
import HamburgerIcon from "../icons/HamburgerIcon";
import Drawer from "./Drawer";

interface HamburgerProps {
  headingText: string;
  navList?: Array<NavigationOption>;
  optionsList?: Array<DrawerOption>
}
const Hamburger = (props: HamburgerProps) => {
  const { headingText, navList, optionsList } = props;

  /* Drawer visibility state */
  const [isDrawerShown, setIsDrawerShown] = useState(false);

  const location = useLocation();

  /* Toggle Drawer - toggles the drawer visibility state */
  const toggleDrawer = useCallback(() => {
    setIsDrawerShown((prev) => !prev);
  }, [setIsDrawerShown]);

  /* Hamburger components top container reference */
  const hamburgerRef = useRef<HTMLDivElement>(null);

  /* To check for clicks outside the hamburgers top container */
  const [clickedOutside] = useOutsideClick(hamburgerRef);

  /* If outside click has occurred: Hiding the drawer */
  useEffect(() => {
    /* Initially clickedOutside is 0: This prevents closing the drawer on first render */
    if (!clickedOutside) {
      return;
    }
    /* Hide the drawer */
    setIsDrawerShown(false);
  }, [clickedOutside]);

  /* Hide drawer once route changes */
  useEffect(() => {
    setIsDrawerShown(false);
  }, [location])
  
  return (
    <div ref={hamburgerRef}>
      <button onClick={toggleDrawer}>
        <HamburgerIcon className="w-5 h-5" />
      </button>
      <Drawer
        headingText={headingText}
        navList={navList}
        optionsList={optionsList}
        onDrawerCloseHandler={toggleDrawer}
        show={isDrawerShown}
      />
    </div>
  );
};

export default Hamburger;
