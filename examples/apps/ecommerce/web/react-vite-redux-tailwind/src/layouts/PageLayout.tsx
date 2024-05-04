import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateBreakpoint } from "../store/BreakpointSlice";
import { getCurrentBreakpoint } from "../utils/breakpointsHelper";

import { Outlet } from "react-router-dom";
import ArrowButton from "../components/basic/ArrowButton";
import ToastMessage from "../components/basic/ToastMessage";
import FooterContainer from "../components/widgets/footer/container/FooterContainer";
import HeaderContainer from "../components/widgets/header/container/HeaderContainer";
import { ARROW_BUTTONS } from "../constants";
import { useAppSelector } from "../store";

const PageLayout = () => {
  const dispatch = useDispatch();

  /* isRTL language */
  const isRTL = useAppSelector((state) => state.language.isRTL);

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
  }, [headerContainerRef]);

  /* Scroll to top smoothly */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <ToastMessage />
      <div>
        <HeaderContainer ref={headerContainerRef} />
        <main style={{ marginTop: headerHeight }}>
          <Outlet />
        </main>
      </div>
      <div className="flex flex-col">
        <ArrowButton
          type={ARROW_BUTTONS.UP}
          onClickHandler={scrollToTop}
          isDisabled={false}
          className={`mb-4 ${isRTL ? "mr-auto ml-4" : "ml-auto mr-4"}`}
        />
        <FooterContainer />
      </div>
    </div>
  );
};

export default PageLayout;
