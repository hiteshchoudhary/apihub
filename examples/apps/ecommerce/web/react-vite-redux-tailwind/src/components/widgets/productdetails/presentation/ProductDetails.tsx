import { useEffect, useMemo, useState } from "react";
import { DEFAULT_CURRENCY } from "../../../../data/applicationData";
import { Product } from "../../../../services/product/ProductTypes";
import ProductImagesView from "../../../business/ProductImagesView";
import { useTranslation } from "react-i18next";
import QuantityCounter from "../../../business/QuantityCounter";
import Button from "../../../basic/Button";
import { ButtonTypes } from "../../../../constants";
import { useAppSelector } from "../../../../store";
import ErrorMessage from "../../../basic/ErrorMessage";
import { formatAmount } from "../../../../utils/commonHelper";

interface ProductDetailsProps {
  product?: Product;
  isError?: boolean;
  updateQuantityButtonShown?: boolean;
  removeFromCartButtonShown?: boolean;
  addToCart(product: Product, quantity: number): void;
  removeFromCart(product: Product): void;
  quantityInCart: number;
  isAddOrUpdateCartInProgress?: boolean;
  isRemoveFromCartInProgress?: boolean;
}
const ProductDetails = (props: ProductDetailsProps) => {
  const {
    product,
    isError = false,
    updateQuantityButtonShown = false,
    removeFromCartButtonShown = false,
    isAddOrUpdateCartInProgress = false,
    isRemoveFromCartInProgress = false,
    addToCart,
    removeFromCart,
    quantityInCart,
  } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  /* If the product is already in cart, it's quantity is stored in this state */
  const [quantity, setQuantity] = useState(quantityInCart ? quantityInCart : 1);

  /* Whether the product is available */
  const isInStock = useMemo(() => {
    if (product) {
      if (product.stock > 0) {
        return true;
      }
      return false;
    }
  }, [product]);

  /* Case when user has added the entire stock in cart */
  const isMaxQuantityReached = useMemo(() => {
    if (product && quantity >= product.stock) {
      return true;
    }
    return false;
  }, [quantity, product]);

  /* Quantity change handler */
  const onQuantityChanged = (newQuantity: number): void => {
    setQuantity(newQuantity);
  };

  /* Whenever quantityInCart prop changes, update quantity state */
  useEffect(() => {
    if (quantityInCart) {
      setQuantity(quantityInCart);
    } else {
      /* Default quantity, If product is not added in cart yet */
      setQuantity(1);
    }
  }, [quantityInCart]);

  return (
    <>
      {!product || isError ? (
        <ErrorMessage
          message={t("pleaseTryAgainLater")}
          className="justify-center"
        />
      ) : (
        <div
          className={`flex flex-col gap-y-4 lg:gap-x-16 ${
            isRTL ? "lg:flex-row-reverse" : "lg:flex-row"
          }`}
        >
          <ProductImagesView
            productName={product.name}
            mainImage={product.mainImage}
            subImages={product.subImages}
            className="lg:w-3/5 lg:h-[550px] gap-y-2 lg:gap-y-0 lg:gap-x-4"
          />
          <div className="flex flex-col lg:w-2/5">
            <div className="flex flex-col border-b-2 border-b-grey pb-6">
              <span className="font-semibold text-2xl tracking-wider">
                {product.name}
              </span>

              <span
                className={`capitalize mt-2 font-poppinsMedium ${
                  isInStock ? "text-green-500" : "text-darkRed"
                }`}
              >
                {isInStock ? t("inStock") : t("outOfStock")}
              </span>

              <span className="mt-2 text-2xl tracking-wider">
                {formatAmount(
                  product.price,
                  product.currency || DEFAULT_CURRENCY
                )}
              </span>

              <span className="text-sm mt-4">{product.description}</span>
            </div>
            {isMaxQuantityReached && (
              <ErrorMessage
                message={t("maxQuantityReached")}
                className="mt-4 text-sm"
                errorIconClassName="w-5 h-5"
              />
            )}
            <div
              className={`flex flex-col gap-y-6 lg:gap-x-2 mt-16 ${
                isRTL ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              <QuantityCounter
                defaultQuantity={quantityInCart ? quantityInCart : 1}
                onQuantityChanged={onQuantityChanged}
                className="flex-1"
                maxLimit={product.stock}
              />
              <Button
                buttonType={ButtonTypes.primaryButton}
                className="flex-1 px-4 py-3 lg:p-0 flex justify-center items-center"
                isLoading={isAddOrUpdateCartInProgress}
                onClickHandler={() => {
                  addToCart(product, quantity);
                }}
              >
                <span className="uppercase">
                  {updateQuantityButtonShown
                    ? t("updateQuantity")
                    : t("addToCart")}
                </span>
              </Button>
              {removeFromCartButtonShown && (
                <Button
                  buttonType={ButtonTypes.secondaryButton}
                  className="flex-1 px-4 py-3 lg:p-0 flex justify-center items-center"
                  isLoading={isRemoveFromCartInProgress}
                  onClickHandler={() => {
                    removeFromCart(product);
                  }}
                >
                  <span className="uppercase">{t("removeFromCart")}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
