import { RefObject, useCallback, useEffect, useState } from "react";

/**
 * Notifies the component when a click outside of the 
 * element whose reference has been passed has occurred
 */
const useOutsideClick = (ref: RefObject<HTMLElement>) => {

  /* Counter which increments when clicked outside of the element whose ref passed */
  const [clickedOutside, setClickedOutside] = useState(0);

  const checkOutsideClick = useCallback(
    (event: MouseEvent) => {
      /* If the element's ref passed is in the target event's element - Increment the counter */
      if (ref?.current && !ref?.current?.contains(event?.target as Node)) {
        setClickedOutside((prev) => ++prev);
      }
    },
    [ref]
  );

  /* Listener on mouse down event */
  useEffect(() => {
    window.addEventListener("mousedown", checkOutsideClick);

    return () => {
      window.removeEventListener("mousedown", checkOutsideClick);
    };
  }, [ref, checkOutsideClick]);

  /* Return clickedOutside counter */
  return [clickedOutside];
};

export default useOutsideClick;
