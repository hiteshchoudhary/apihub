import { useEffect, useState } from "react";
import { BREAKPOINTS } from "../constants";
import { useAppSelector } from "../store";

const useBreakpointCheck = (breakpoint: BREAKPOINTS) => {

  /* Current breakpoint from redux */
  const currentBreakpoint = useAppSelector(
    (state) => state.breakpoint.currentBreakpoint
  );

  /* To check the screen size */
  const [isCurrentBreakpoint, setIsCurrentBreakpoint] = useState(false);

  useEffect(() => {
    const breakpointWidthInInt = parseInt(breakpoint);
    
    if (window.innerWidth >= breakpointWidthInInt) {
      setIsCurrentBreakpoint(true);
    } else {
      setIsCurrentBreakpoint(false);
    }
  }, [breakpoint, currentBreakpoint]);

  return isCurrentBreakpoint;
};

export default useBreakpointCheck;
