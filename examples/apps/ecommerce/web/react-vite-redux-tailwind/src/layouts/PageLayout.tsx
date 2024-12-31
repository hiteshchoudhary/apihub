import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateBreakpoint } from "../store/BreakpointSlice";
import { getCurrentBreakpoint } from "../utils/breakpointsHelper";

import { Outlet, useLocation } from "react-router-dom";
import ArrowButton from "../components/basic/ArrowButton";
import ToastMessage from "../components/basic/ToastMessage";
import FooterContainer from "../components/widgets/footer/container/FooterContainer";
import HeaderContainer from "../components/widgets/header/container/HeaderContainer";
import { ARROW_BUTTONS, ROUTE_PATHS, USER_ROLES } from "../constants";
import { useAppSelector } from "../store";
import { updateHeaderHeight } from "../store/UIinfoSlice";

const PageLayout = () => {
  const dispatch = useDispatch();

  /* Page Location */
  const location = useLocation();

  /* isRTL language */
  const isRTL = useAppSelector((state) => state.language.isRTL);

  /* Logged in user details */
  const userDetails = useAppSelector((state) => state.auth.userDetails);

  /* 
  Shown admin page layout: if the logged in user is admin, 
  and the location path includes is /admin 
  */
  const isAdminPageLayoutShown =
    userDetails?.role === USER_ROLES.admin &&
    location.pathname.includes(ROUTE_PATHS.admin);

  /* Header height in pixels */
  const [headerHeight, setHeaderHeight] = useState("0px");

  /* Reference to the header container */
  const headerContainerRef = useRef<HTMLDivElement>(null);

  /* Updating current breakpoint: As per tailwind css and updating the redux state*/
  const checkForBreakpointUpdates = useCallback(() => {
    const breakpoint = getCurrentBreakpoint();
    if (breakpoint) {
      dispatch(updateBreakpoint(breakpoint));
    }
  }, [dispatch]);

  /* Checking for resize window event */
  useEffect(() => {
    checkForBreakpointUpdates();
    window.addEventListener("resize", checkForBreakpointUpdates);

    return () => {
      window.removeEventListener("resize", checkForBreakpointUpdates);
    };
  }, [checkForBreakpointUpdates]);

  /* Updating header height */
  useEffect(() => {
    setHeaderHeight(`${headerContainerRef.current?.clientHeight}px`);
    dispatch(updateHeaderHeight(headerContainerRef?.current?.clientHeight));
  }, [headerContainerRef, dispatch]);

  /* Scroll to top smoothly */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <ToastMessage />
      <div>
        <HeaderContainer ref={headerContainerRef} isAdminPageLayoutShown={isAdminPageLayoutShown}/>
        <main style={{ marginTop: headerHeight }}>
          <Outlet />
        </main>
      </div>
      {!isAdminPageLayoutShown && (
        <div className="flex flex-col">
          <ArrowButton
            type={ARROW_BUTTONS.UP}
            onClickHandler={scrollToTop}
            isDisabled={false}
            className={`mb-4 ${isRTL ? "mr-auto ml-4" : "ml-auto mr-4"}`}
          />
          <FooterContainer />
        </div>
      )}
    </div>
  );
};

export default PageLayout;
