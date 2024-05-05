import { useTranslation } from "react-i18next";
import { ButtonTypes, ProductFilterFields } from "../../constants";
import Input from "../basic/Input";
import { useForm } from "react-hook-form";
import Text from "../basic/Text";
import Button from "../basic/Button";
import { useAppSelector } from "../../store";

interface ProductFiltersProps {
  onFiltersChanged(fields: ProductFilterFields): void;
  resetFilterHandler(): void;
  className?: string;
  isLoading?: boolean;
}
const ProductFilters = (props: ProductFiltersProps) => {
  const {
    onFiltersChanged,
    resetFilterHandler,
    className = "",
    isLoading = false,
  } = props;

  const { t } = useTranslation();

  const isRTL = useAppSelector((state) => state.language.isRTL);

  const {
    register,
    formState: { errors },
    resetField,
    watch,
    handleSubmit,
  } = useForm<ProductFilterFields>();

  /* Resetting the input fields and then calling the parent function */
  const resetFilters = () => {
    resetField("price.min");
    resetField("price.max");
    resetFilterHandler();
  };

  return (
    <form
      className={`flex flex-col gap-y-4 items-center lg:flex-row lg:gap-x-8 ${className}`}
      onSubmit={handleSubmit(onFiltersChanged)}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Input
        placeholder={t("minPrice")}
        containerClassName="min-w-0 w-full lg:w-fit"
        className="placeholder:capitalize text-center lg:text-sm"
        errorMessage={errors.price?.min?.message || ""}
        type="number"
        {...register("price.min", {
          required: t("invalidValue"),
          validate: (value) => {
            if (isNaN(Number(value)) || Number(value) < 0) {
              return t("invalidValue");
            }
          },
        })}
      />

      <Text className="uppercase font-poppinsMedium lg:text-sm">{t("to")}</Text>

      <Input
        placeholder={t("maxPrice")}
        containerClassName="min-w-0 w-full lg:w-fit"
        className="placeholder:capitalize text-center lg:text-sm"
        type="number"
        errorMessage={errors.price?.max?.message || ""}
        {...register("price.max", {
          required: t("invalidValue"),
          validate: (value) => {
            if (
              isNaN(Number(value)) ||
              Number(value) < Number(watch("price.min"))
            ) {
              return t("maxValueIsLessThanMinValue");
            }
          },
        })}
      />
      <div className="flex flex-col gap-y-2 w-full lg:flex-row lg:gap-x-4 lg:w-fit">
        <Button
          type="submit"
          buttonType={ButtonTypes.primaryButton}
          className="flex justify-center capitalize py-1 px-12 lg:text-sm lg:px-8"
          onClickHandler={() => {}}
          isLoading={isLoading}
        >
          <span>{t("filter")}</span>
        </Button>

        <Button
          buttonType={ButtonTypes.secondaryButton}
          className="flex justify-center capitalize py-1 px-12 lg:text-sm lg:px-8"
          onClickHandler={resetFilters}
          isLoading={isLoading}
        >
          <span>{t("reset")}</span>
        </Button>
      </div>
    </form>
  );
};

export default ProductFilters;
