import { BREAKPOINTS } from "../constants";

/**
 * 
 * @returns The current breakpoint name being applied from the list of breakpoints
 */
export const getCurrentBreakpoint = () => {
  /* Current interior width of the window in pixels */
  const width = window.innerWidth;

  /* Returns an array, where each element is an array of 2 elements breakpoint name and width respectively */
  const breakpoints = Object.entries(BREAKPOINTS);

  /* 
   * Iterating backward through the breakpoint entries
   * NOTE: Breakpoints have to be ordered in ascending order 
  */
  for (let counter = breakpoints.length - 1; counter >= 0; --counter) {
    const [breakpointName, breakpointWidth] = breakpoints[counter];
    const breakpointWidthInInt = parseInt(breakpointWidth);

    if (width >= breakpointWidthInInt) {
      return breakpointName;
    }
  }
  return "";
};


