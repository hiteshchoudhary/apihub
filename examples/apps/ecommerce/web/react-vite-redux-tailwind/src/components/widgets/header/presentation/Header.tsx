import { useTranslation } from "react-i18next";
import {
  BREAKPOINTS,
  ButtonTypes,
  NavigationOption,
} from "../../../../constants";
import useBreakpointCheck from "../../../../hooks/useBreakpointCheck";
import Hamburger from "../../../basic/Hamburger";
import SearchInput from "../../../basic/SearchInput";
import Button from "../../../basic/Button";
import CartIcon from "../../../icons/CartIcon";
import { useAppSelector } from "../../../../store";
import NavList from "../../../basic/NavList";
import InfoHeaderContainer from "../../infoheader/container/InfoHeaderContainer";
import { ForwardedRef, forwardRef, useState } from "react";
import LogoutModalContainer from "../../../modals/logoutmodal/container/LogoutModalContainer";

interface HeaderProps {
  logoClickHandler(): void;
  navItemList: NavigationOption[];
  itemsInCart: number;
  cartClickHandler(): void;
  searchHandler(inputText: string): void;
  isAdminPageLayoutShown: boolean;
}
const Header = forwardRef(function Header(
  props: HeaderProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const {
    logoClickHandler,
    navItemList,
    itemsInCart = 0,
    cartClickHandler,
    searchHandler,
    isAdminPageLayoutShown,
  } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);
  const isLG = useBreakpointCheck(BREAKPOINTS.lg);

  const [isLogoutModalShown, setIsLogoutModalShown] = useState(false);

  const toggleLogoutModal = () => {
    setIsLogoutModalShown((prev) => !prev);
  };

  /* Mobile & Tablet */
  if (!isLG) {
    return (
      <header ref={ref} className="fixed top-0 w-full z-10 bg-white">
        <InfoHeaderContainer />
        <div
          className={`flex items-center justify-between px-2 pb-4 mt-4 border-b-2 border-b-neutral-100`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <Hamburger headingText={t("companyName")} navList={navItemList} />
          <SearchInput
            placeholder={t("searchProductsPlaceholder")}
            className="flex-1 mx-8"
            submitHandler={searchHandler}
          />
          <Button onClickHandler={cartClickHandler}>
            <CartIcon className="w-8 h-8 text-black" quantity={itemsInCart} />
          </Button>
        </div>
      </header>
    );
  }

  /* Desktop */
  return (
    <header ref={ref} className="fixed top-0 w-full z-10 bg-white">
      <InfoHeaderContainer />
      <div
        className={`flex justify-between items-center mt-4 px-10 pb-4 border-b-2 border-b-neutral-100 `}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <button
          className={`font-semibold capitalize text-2xl tracking-wider text-black`} onClick={logoClickHandler}
        >
          {t("companyName")}
        </button>

        <NavList navList={navItemList} className="w-1/3" />

        {!isAdminPageLayoutShown && (
          <div className={`flex w-2/6`}>
            <>
              <SearchInput
                placeholder={t("searchProductsPlaceholder")}
                className={`w-full ${isRTL ? "ml-2" : "mr-2"}`}
                submitHandler={searchHandler}
              />
              <Button onClickHandler={cartClickHandler}>
                <CartIcon
                  className="w-8 h-8 text-black"
                  quantity={itemsInCart}
                />
              </Button>
            </>
          </div>
        )}
        {isAdminPageLayoutShown && (
          <>
            {isLogoutModalShown && (
              <LogoutModalContainer
                hideModal={toggleLogoutModal}
                isShown={true}
              />
            )}
            <Button
              buttonType={ButtonTypes.secondaryButton}
              className="px-4 py-1"
              onClickHandler={toggleLogoutModal}
            >
              <span>{t("logout")}</span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
});

export default Header;
