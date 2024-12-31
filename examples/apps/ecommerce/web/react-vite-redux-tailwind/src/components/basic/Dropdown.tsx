import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useTranslation } from "react-i18next";
import { DropdownItem, DropdownTypes } from "../../constants";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useAppSelector } from "../../store";
import DownArrow from "../icons/DownArrow";
import ErrorMessage from "./ErrorMessage";

/* To expose Dropdown Actions to parents */
export interface DropdownActions {
  forceSetSelectedItem(item: DropdownItem): void;
}

interface DropdownProps {
  type: DropdownTypes;
  onChange(selectedItem: DropdownItem): void;
  label?: string;
  itemsList: Array<DropdownItem>;
  defaultSelectedItem?: DropdownItem;
  mainButtonClassNames?: string;
  errorMessage?: string;
  actionsRef?: DropdownActions;
}

const Dropdown = forwardRef(
  (props: DropdownProps, ref: ForwardedRef<HTMLButtonElement>) => {
    const {
      type = DropdownTypes.noBorderDarkBg,
      onChange,
      label = "",
      itemsList,
      defaultSelectedItem,
      mainButtonClassNames = "",
      errorMessage = "",
      actionsRef,
    } = props;

    const { t } = useTranslation();
    const isRTL = useAppSelector((state) => state.language.isRTL);

    /* Reference to the top container of dropdown */
    const dropdownRef = useRef<HTMLDivElement>(null);

    /* To check for clicks outside the dropdown container, used to hide the dropdown menu */
    const [clickedOutside] = useOutsideClick(dropdownRef);

    /* Selected Item state */
    const [selectedItem, setSelectedItem] = useState(
      defaultSelectedItem ? defaultSelectedItem : null
    );

    /* Dropdown menu visibility state */
    const [isDropdownMenuShown, setIsDropdownMenuShown] = useState(false);

    /* Toggle dropdown menu visibility */
    const toggleDropdownMenu = () => {
      setIsDropdownMenuShown((prev) => !prev);
    };

    /* On click of an dropdown item */
    const itemChangeHandler = (item: DropdownItem): void => {
      setSelectedItem(item);
      onChange(item);

      /* Hide dropdown menu */
      toggleDropdownMenu();
    };

    /**
     * Text displayed against each option 
     * If text value is present use that, 
     * else use the textKey value to get the value from locales folder.
     */
    const getDisplayedButtonText = useCallback(
      (item: DropdownItem): string => {
        if (item.text) {
          return item.text;
        } else if (item.textKey) {
          return t(item.textKey);
        } else {
          return "";
        }
      },
      [t]
    );

    /* Styles for different dropdown types */
    const typeStyles: {
      mainButton: string;
      textColor: string;
      menuContainer: string;
      labelText: string;
    } = useMemo(() => {
      switch (type) {
        case DropdownTypes.noBorderDarkBg: {
          return {
            mainButton: "border-none outline-none",
            textColor: "text-zinc-50",
            menuContainer: "bg-black",
            labelText: "text-zinc-50 capitalize",
          };
        }
        case DropdownTypes.borderedLightBg: {
          return {
            mainButton: "border border-grey rounded px-2 py-1",
            textColor: "text-black",
            menuContainer: "bg-neutral-100 w-full shadow",
            labelText: "text-black capitalize",
          };
        }
        default:
          return {
            mainButton: "",
            textColor: "",
            menuContainer: "",
            labelText: "",
          };
      }
    }, [type]);

    /* Hiding Dropdown if a click is made outside */
    useEffect(() => {
      if (clickedOutside) {
        setIsDropdownMenuShown(false);
      }
    }, [clickedOutside]);

    /* Default selection */
    useEffect(() => {
      setSelectedItem(defaultSelectedItem ? defaultSelectedItem : null);
    }, [itemsList, defaultSelectedItem]);

    /* Providing implemetation of actions to the parent */
    useEffect(() => {
      if (actionsRef) {
        actionsRef.forceSetSelectedItem = (item: DropdownItem) => {
          setSelectedItem(item);
        };
      }
    }, [actionsRef]);

    return (
      <div className="relative" ref={dropdownRef} dir={"ltr"}>
        {label && (
          <label
            className={`text-sm ${isRTL ? "block text-right" : ""} ${
              typeStyles.labelText
            }`}
          >
            {label}
          </label>
        )}
        <button
          ref={ref}
          type="button"
          onClick={toggleDropdownMenu}
          className={`flex justify-between items-center ${
            typeStyles.mainButton
          }  ${mainButtonClassNames}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <span
            className={`text-sm capitalize truncate ${typeStyles.textColor}`}
          >
            {selectedItem ? getDisplayedButtonText(selectedItem) : t("select")}
          </span>

          <DownArrow
            className={`h-5 w-5 ${isRTL ? "mr-1" : "ml-1"} ${
              typeStyles.textColor
            } ${isDropdownMenuShown && "rotate-180"}`}
          />
        </button>
        {errorMessage && (
          <ErrorMessage
            className="mt-1 text-sm"
            message={errorMessage}
            isErrorIconShown={false}
          />
        )}
        {isDropdownMenuShown && (
          <div
            className={`absolute p-2 z-10 ${typeStyles.menuContainer} rounded-b-md max-h-52 overflow-auto`}
            dir={isRTL ? 'rtl': 'ltr'}
          >
            {/* Selected Item Comes First */}
            {selectedItem && (
              <div key={selectedItem.id}>
                <button
                  onClick={() => itemChangeHandler(selectedItem)}
                  className={`text-sm w-full flex capitalize ${typeStyles.textColor}`}
                >
                  <span className="truncate">
                    {getDisplayedButtonText(selectedItem)}
                  </span>
                </button>
              </div>
            )}
            {itemsList.map(
              (item) =>
                item.id !== selectedItem?.id && (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => itemChangeHandler(item)}
                      className={`text-sm w-full flex capitalize ${typeStyles.textColor}`}
                    >
                      <span className="truncate">
                        {getDisplayedButtonText(item)}
                      </span>
                    </button>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    );
  }
);

export default Dropdown;
