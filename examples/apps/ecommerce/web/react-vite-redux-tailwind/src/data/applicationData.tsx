import AccountIcon from "../components/icons/AccountIcon";
import GuranteeIcon from "../components/icons/GuranteeIcon";
import HeadphoneIcon from "../components/icons/HeadphoneIcon";
import LogoutIcon from "../components/icons/LogoutIcon";
import OrderIcon from "../components/icons/OrderIcon";
import TruckIcon from "../components/icons/TruckIcon";
import MyAccountOptionContainer from "../components/widgets/myaccountoption/container/MyAccountOptionContainer";
import {
  CHECKBOX_TYPE,
  COMPANY_GURANTEE,
  CategoryIcon,
  DropdownItem,
  NavigationOption,
  ROUTE_PATHS,
  SelectionMenuItem,
  TabItemConfig,
  USER_ROLES,
} from "../constants";
import i18n from "../i18n";

export const DRAWER_ITEMS: Array<NavigationOption> = [
  {
    id: 1,
    textKey: "home",
    navigateTo: "/",
  },
  {
    id: 2,
    textKey: "about",
    navigateTo: ROUTE_PATHS.about,
  },
  {
    id: 3,
    textKey: "login",
    navigateTo: ROUTE_PATHS.login,
  },
];

export const ADMIN_NAVIGATION_ITEMS: Array<NavigationOption> = [
  {
    id: 1,
    textKey: "categories",
    navigateTo: ROUTE_PATHS.adminCategories,
  },
  {
    id: 2,
    textKey: "products",
    navigateTo: ROUTE_PATHS.adminProducts,
  },
  {
    id: 3,
    textKey: "orders",
    navigateTo: ROUTE_PATHS.adminOrders,
  },
  {
    id: 4,
    textKey: "coupons",
    navigateTo: ROUTE_PATHS.adminCoupons,
  }
];

export const getNavigationItemList = (
  isLoggedIn: boolean,
  role: USER_ROLES
) => {
  const tempDrawerItems = [...DRAWER_ITEMS];
  if (isLoggedIn) {
    tempDrawerItems.pop();
    if (role === USER_ROLES.admin) {
      tempDrawerItems.push({
        id: 4,
        textKey: "admin",
        navigateTo: ROUTE_PATHS.adminCategories,
      });
    }
    tempDrawerItems.push({
      id: 5,
      textKey: "myAccount",
      navigateTo: "my-account",
      customComponent: <MyAccountOptionContainer />,
    });
  }
  return tempDrawerItems;
};

export const MY_ACCOUNT_OPTIONS: Array<SelectionMenuItem> = [
  {
    id: 1,
    textKey: "manageAccount",
    icon: <AccountIcon className="w-5 h-5" />,
  },
  {
    id: 2,
    textKey: "myOrders",
    icon: <OrderIcon className="w-5 h-5" />,
  },
  {
    id: 3,
    textKey: "logout",
    icon: <LogoutIcon className="w-5 h-5" />,
  },
];

export const BANNER_PROMOTION_END_DATE = "2023-04-30T00:00:00";

export const CATEGORY_ICONS: CategoryIcon = {};

export const DEFAULT_CURRENCY = "INR";

export const DEFAULT_COUNTRY = "United Arab Emirates";

export const COUPON_CODE_MINIMUM_LENGTH = 4;

export const COUNTRIES_DROPDOWN_LIST: DropdownItem[] = [
  { id: 1, text: DEFAULT_COUNTRY },
  { id: 2, text: "India" },
];
export const COMPANY_GURANTEE_LIST: COMPANY_GURANTEE[] = [
  {
    id: 1,
    icon: <TruckIcon className="w-10 h-10 text-white" />,
    headingKey: "freeAndFastDelivery",
    descriptionKey: "freeDeliveryFor",
  },
  {
    id: 2,
    icon: <HeadphoneIcon className="w-10 h-10 text-white" />,
    headingKey: "247customerService",
    descriptionKey: "247customerServiceDescription",
  },
  {
    id: 3,
    icon: <GuranteeIcon className="w-10 h-10 text-white" />,
    headingKey: "guranteeHeading",
    descriptionKey: "guranteeDescription",
  },
];

export const EXPLORE_PRODUCTS_COUNT = 8;
export const FEATURED_PRODUCTS_COUNT = 4;
export const RELATED_PRODUCTS_COUNT = 4;
export const MAX_SUBIMAGES_PER_PRODUCT = 4;

export enum PAYMENT_TYPES {
  PAYPAL = "PAYPAL",
}

export const MANAGE_ACCOUNT_TABS: Array<TabItemConfig> = [
  {
    id: 1,
    tabHeadingKey: "editProfile",
  },
  {
    id: 2,
    tabHeadingKey: "myAddresses",
  },
];

export enum ORDER_STATUS {
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  DELIVERED = "DELIVERED",
}
export const ORDER_STATUS_FILTERS_CHECKBOX: Array<CHECKBOX_TYPE<null>> = [
  {
    id: ORDER_STATUS.PENDING,
    data: null,
    isDefaultSelected: true,
    isLabelKey: true,
    label: i18n.t("pending"),
  },
  {
    id: ORDER_STATUS.CANCELLED,
    data: null,
    isDefaultSelected: true,
    label: i18n.t("cancelled"),
    isLabelKey: true,
  },
  {
    id: ORDER_STATUS.DELIVERED,
    data: null,
    isDefaultSelected: true,
    label: i18n.t("delivered"),
    isLabelKey: true,
  },
];


