import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BREAKPOINTS, SelectionMenuItem } from "../../constants";
import useBreakpointCheck from "../../hooks/useBreakpointCheck";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useAppSelector } from "../../store";
import UpArrow from "../icons/UpArrow";

interface SelectionMenuProps {
  items: SelectionMenuItem[];
  onItemSelect(item: SelectionMenuItem): void;
  heading: string;
  headingClassName?: string;
}
const SelectionMenu = (props: SelectionMenuProps) => {
  const {
    items,
    heading,
    onItemSelect,
    headingClassName = "capitalize",
  } = props;

  const isLG = useBreakpointCheck(BREAKPOINTS.lg);
  const { t } = useTranslation();
  const isRTL = useAppSelector(state => state.language.isRTL);

  /* Menu visibility state */
  const [isMenuShown, setIsMenuShown] = useState(false);

  /* Reference for the menu's top container */
  const selectionMenuRef = useRef<HTMLDivElement>(null);

  /* To check clicks outside the menu's top container */
  const [clickedOutside] = useOutsideClick(selectionMenuRef);

  /* Toggle menu visibility */
  const toggleMenu = () => {
    setIsMenuShown((prev) => !prev);
  };

  /* On click of menu item */
  const menuItemClickHandler = (item: SelectionMenuItem) => {
    /* Hide the menu, call the function passed */
    setIsMenuShown(false);
    onItemSelect(item);
  };

  useEffect(() => {
    /* If an outside click has happened, hide the menu */
    if (clickedOutside) {
      setIsMenuShown(false);
    }
  }, [clickedOutside]);

  return (
    <div className="relative" ref={selectionMenuRef}>
      <button onClick={toggleMenu} className={`flex justify-between items-center w-full ${headingClassName}`}>
        <span>{heading}</span>
        {!isLG && (
          <UpArrow
            className={`w-4 h-4 ${!isMenuShown && "rotate-180"}`}
          />
        )}
      </button>

      {isMenuShown && (
        <div
          className={`absolute p-4 z-10 bg-transparent lg:bg-black rounded w-full lg:w-fit`}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`${index === items.length - 1 ? "mb-2" : "mb-4"}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <button
                onClick={() => menuItemClickHandler(item)}
                className={`text-sm capitalize text-zinc-50 flex items-center`}
              >
                {item.icon && item.icon}
                <span className={`whitespace-nowrap ${isRTL ? 'mr-2': 'ml-2'}`}>
                  {t(item.textKey)}{" "}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectionMenu;
