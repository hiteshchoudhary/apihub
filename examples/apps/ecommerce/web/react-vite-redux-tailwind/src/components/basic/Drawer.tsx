import { useTranslation } from "react-i18next";
import { DrawerOption, NavigationOption } from "../../constants";
import { useAppSelector } from "../../store";
import CloseIcon from "../icons/CloseIcon";
import NavList from "./NavList";

interface DrawerProps {
  headingText: string;
  navList?: Array<NavigationOption>;
  optionsList?: Array<DrawerOption>;
  onDrawerCloseHandler(): void;
  onOptionClickHandler?(option: DrawerOption): void;
  show: boolean;
}
const Drawer = (props: DrawerProps) => {
  const {
    headingText,
    navList,
    optionsList,
    onDrawerCloseHandler,
    onOptionClickHandler,
    show = false,
  } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  /* On click of an DrawerOption, call the function passed as prop */
  const onOptionSelected = (option: DrawerOption) => {
    if (typeof onOptionClickHandler === "function") {
      onOptionClickHandler(option);
    }
  };

  return (
    <aside
      className={`flex flex-col fixed top-0 h-screen z-20 w-3/5 bg-gradient-to-b from-black via-stone-600 to-black p-4
      transition-all duration-500
      ${
        isRTL
          ? `${show ? "right-0" : "-right-full"}`
          : `${show ? "left-0" : "-left-full"}`
      }
      `}
    >
      <div
        className={`flex items-center justify-between`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <span className={`capitalize text-2xl tracking-wider text-zinc-50`}>
          {headingText}
        </span>
        <button onClick={onDrawerCloseHandler}>
          <CloseIcon className="w-3 h-3 text-zinc-50" />
        </button>
      </div>

      {navList?.length && <NavList navList={navList} className="mt-6" />}

      {optionsList?.length && (
        <div className={`flex flex-col mt-6`}>
          {optionsList.map((option) => (
            <div className={`mb-4`} key={option.id}>
              <button
                className={`w-full flex ${isRTL && "flex-row-reverse"}`}
                onClick={() => onOptionSelected(option)}
              >
                {option?.icon}

                <span className="text-zinc-50 capitalize">
                  {t(option.textKey)}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Drawer;
