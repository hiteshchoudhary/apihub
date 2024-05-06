import React from "react";
import { AddressClass } from "./services/address/AddressTypes";
import { DateRange } from "react-day-picker";
import { Category } from "./services/category/CategoryTypes";
import { COUPON_TYPES } from "./services/coupon/CouponTypes";

/* DROPDOWN */
export enum DropdownTypes {
  noBorderDarkBg,
  borderedLightBg
}

export interface DropdownItem {
  id?: string | number;
  textKey?: string;
  text?: string;
}


/* SELECTION MENU */
export interface SelectionMenuItem {
  id: string | number;
  textKey: string;
  icon?: React.ReactElement
}

/* LANGUAGE */
export enum SUPPORTED_LANGUAGES {
  english = "en",
  arabic = "ar",
  hindi = "hn"
}

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.english;

/* LOCAL STORAGE */
export enum LOCAL_STORAGE_KEYS {
  selectedLanguage = "lang",
  accessToken = "accessToken",
}

/* RESPONSIVE: BREAKPOINTS */
/* NOTE: Breakpoints have to be ordered in ascending order */
export enum BREAKPOINTS {
  "sm" = "640px",
  "md" = "768px",
  "lg" = "1024px",
  "xl" = "1280px",
  "2xl" = "1536px",
}

/* DRAWER OPTION */
export interface NavigationOption {
  id: string | number;
  textKey: string;
  icon?: React.ReactElement;
  navigateTo: string;
  customComponent?: React.ReactElement
}

/* DRAWER OPTION */
export interface DrawerOption  {
  id: string | number;
  textKey: string;
  icon?: React.ReactElement;
}

/* BUTTON TYPES */
export enum ButtonTypes {
  noBackgroundAndBorder,
  primaryButton,
  secondaryButton,
}

/* LINK TYPES */
export enum LinkTypes {
  default,
  red
}

/* DATE TIME FORMATS */
export enum DATE_TIME_FORMATS {
  standardDateWithTime = "YYYY-MM-DDTHH:mm:ss",
  displayedDateWithTime = "Do MMM YYYY, hh:mmA",
  standardDate = "YYYY-MM-DD"
}

export interface DURATION {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/* Category Icon Type */
export interface CategoryIcon  { [id: string]: React.ReactElement }

/* Card Container */
export enum CARD_CONTAINER_OPTION {
  CAROUSEL,
  RIGHT_BUTTON,
  BOTTOM_BUTTON,
}

/* Company Gurantee */
export interface COMPANY_GURANTEE {
  id: string | number,
  icon: React.ReactElement;
  headingKey: string;
  descriptionKey: string;
}

/* Arrow Button Types */
export enum ARROW_BUTTONS {
  UP,
  RIGHT,
  DOWN, 
  LEFT
}
/* Query param strings */
export enum QUERY_PARAMS {
  category = "category",
  productId = "productId",
  categoryId = "categoryId",
  productNameSearch = "productNameSearch",
  orderId = "orderId"
}

/* Paths */
export enum ROUTE_PATHS {
  products = "/products",
  product = "/product",
  productSearch = "/product-search",
  login = "/login",
  signup = "/signup",
  cart = "/cart",
  checkout = "/checkout",
  paymentFeedback = "/payment-feedback",
  manageAccount = "/manage-account",
  orders = "/orders",
  orderDetail = "/order",
  resetForgottenPassword = "/forgot-password/:token",
  pageNotFound = "/page-not-found",
  about = "/about",
  admin = "/admin",
  adminCategories = "/admin/categories",
  adminProducts = "/admin/products",
  adminOrders = "/admin/orders",
  adminCoupons = "/admin/coupons"
}

export enum USER_ROLES {
  admin = "ADMIN",
  user = "USER"
}


/* IMAGES IN PUBLIC FOLDER */
export enum PUBLIC_IMAGE_PATHS {
  loginSideImage = "/images/loginsideimage.png",
  defaultProductImage = "/images/defaultproduct.png",
  aboutSideImage = "/images/aboutsideimage.png",
  bannerProductImage = "/images/bannerproduct.png"
}

/* REGEX PATTERNS */
export const REGEX_PATTERNS = {
  emailPattern : /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  numberPattern: /^[0-9]*$/,
  countryCodePattern: /^\+[0-9]{1,3}$/,
  phoneNumberPattern: /^[0-9]{10}$/
}

export const MIN_USERNAME_LENGTH = 3;

/* LOGIN FORM FIELDS */
export interface LoginFormFields {
  email: string;
  password: string;
}

/* SIGN UP FORM FIELDS */
export interface SignupFormFields {
  email: string,
  password: string,
  username: string,
  confirmPassword: string
}

/* TYPES OF TOAST MESSAGES */
export enum TOAST_MESSAGE_TYPES {
  success = "SUCCESS",
  error = "ERROR"
}

/* ADDRESS FORM KEYS */
export enum ADDRESS_FORM_KEYS  {
  country,
  state,
  city, 
  addressLine1,
  addressLine2,
  pincode
}

export interface AddressFormFields {
  country: DropdownItem,
  city: DropdownItem,
  state: DropdownItem,
  addressLine1: string,
  addressLine2: string,
  pincode: string
}

export interface CheckoutFormFields {
  address: AddressClass
}

export interface ProfileFormFields {
  firstName: string,
  lastName: string,
  phoneNumber: string,
  countryCode: string
}

export interface CheckoutApplyCouponCodeFields {
  couponCode: string
}

export interface RADIO_BUTTON_TYPE<T> {
  label?: string;
  customElement?: React.ReactElement;
  data: T
  isDefaultSelected: boolean;
  id: string;
}

export interface CHECKBOX_TYPE<T> {
  label?: string;
  isLabelKey?: boolean;
  customElement?: React.ReactElement;
  data: T
  isDefaultSelected: boolean;
  id: string;
}

/**
 * Tab Config 
 */
export interface TabItemConfig {
  id: number | string,
  tabHeadingKey: string
}

/* Change Password Form Fields */
export interface ChangePasswordFields {
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
}

/* Forgot Password Form Fields */
export interface ForgotPasswordFields {
  email: string
}

/* Reset Forgotten Password Form Fields */
export interface ResetForgottenPasswordFields {
  newPassword: string,
  confirmNewPassword: string
}

/* Fields for product filters */
export interface ProductFilterFields {
  price: {
    min: number,
    max: number
  }
}

export interface OrderListFilterFields {
  dateRange: DateRange,
  checkedStatus: Array<CHECKBOX_TYPE<null>>
}

export interface AddCategoryFields {
  categoryName: string;
}

export interface EditCategoryFields {
  category: Category;
  newCategoryName: string;
}

export interface AddEditProductFields {
  name: string,
  description: string,
  category: DropdownItem,
  price: number,
  stock: number,
  mainImage: File,
  subImage1: File,
  subImage2: File,
  subImage3: File,
  subImage4: File
}

export interface AddEditProductFieldsForService {
  name: string,
  description: string,
  category: DropdownItem,
  price: number,
  stock: number,
  mainImage: File,
  subImages: File[]
}

/* For api call */
export interface EditProductFieldsForService {
  name?: string,
  description?: string,
  category?: DropdownItem,
  price?: number,
  stock?: number,
  mainImage?: File,
  subImages?: File[]
}

export interface AddEditCouponFields {
  name: string,
  couponCode: string,
  type: COUPON_TYPES,
  discountValue: number,
  minimumCartValue: number,
  startDate: Date,
  expiryDate: Date
}
