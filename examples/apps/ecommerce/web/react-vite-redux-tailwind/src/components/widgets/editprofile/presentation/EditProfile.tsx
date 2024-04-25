import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ButtonTypes,
  LinkTypes,
  ProfileFormFields,
  REGEX_PATTERNS,
} from "../../../../constants";
import { useAppSelector } from "../../../../store";
import Button from "../../../basic/Button";
import Input from "../../../basic/Input";
import Link from "../../../basic/Link";
import ChangePasswordModalContainer from "../../../modals/changepasswordmodal/container/ChangePasswordModalContainer";

interface EditProfileProps {
  currentProfile: ProfileFormFields;
  updateProfileHandler(data: ProfileFormFields): void;
  updateInProgress: boolean;
  isChangePasswordOptionVisible: boolean;
}
const EditProfile = (props: EditProfileProps) => {
  const {
    currentProfile,
    updateProfileHandler,
    updateInProgress,
    isChangePasswordOptionVisible = true,
  } = props;

  const { t } = useTranslation();
  const isRTL = useAppSelector((state) => state.language.isRTL);

  /* Change password modal visibility */
  const [isChangePasswordModalShown, setIsChangePasswordModalShown] =
    useState(false);

  /* Whether profile values are updated */
  const [isValuesUpdated, setIsValuesUpdated] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormFields>();

  const toggleChangePasswordModal = () => {
    setIsChangePasswordModalShown((prev) => !prev);
  };

  useEffect(() => {
    let key: keyof typeof currentProfile;

    /* Whenever current profile prop changes, set the input values */
    for (key in currentProfile) {
      setValue(key, currentProfile[key]);
    }
  }, [currentProfile, setValue]);

  useEffect(() => {
    /* Checking on change of input, whether the values are updated or they remain same */
    const subscribe = watch((value, { name }) => {
      if (name && currentProfile[name] !== value[name]) {
        setIsValuesUpdated(true);
      } else {
        setIsValuesUpdated(false);
      }
    });

    /* Setting to false as currentProfile has been updated here */
    setIsValuesUpdated(false);

    return () => {
      subscribe.unsubscribe();
    };
  }, [currentProfile, watch]);

  return (
    <>
      {isChangePasswordModalShown && (
        <ChangePasswordModalContainer hideModal={toggleChangePasswordModal} />
      )}
      <form
        className="flex flex-col gap-y-8"
        onSubmit={handleSubmit(updateProfileHandler)}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <span className="capitalize text-darkRed text-xl font-semibold">
          {t("editYourProfile")}
        </span>
        <div className="flex flex-col gap-y-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
          <Input
            placeholder={t("firstName")}
            className="placeholder:capitalize"
            type="text"
            errorMessage={errors.firstName?.message || ""}
            {...register("firstName", { required: t("firstNameIsRequired") })}
          />

          <Input
            placeholder={t("lastName")}
            className="placeholder:capitalize"
            type="text"
            errorMessage={errors.lastName?.message || ""}
            {...register("lastName", { required: t("lastNameIsRequired") })}
          />

          <Input
            placeholder={t("countryCode")}
            className="placeholder:capitalize"
            type="text"
            errorMessage={errors.countryCode?.message || ""}
            {...register("countryCode", {
              required: t("countryCodeIsRequired"),
              validate: {
                matchPattern: (value) =>
                  REGEX_PATTERNS.countryCodePattern.test(value) ||
                  t("invalidCountryCode"),
              },
            })}
          />

          <Input
            placeholder={t("phoneNumber")}
            className="placeholder:capitalize"
            type="number"
            errorMessage={errors.phoneNumber?.message || ""}
            {...register("phoneNumber", {
              required: t("phoneNumberIsRequired"),
              validate: {
                matchPattern: (value) =>
                  REGEX_PATTERNS.phoneNumberPattern.test(value) ||
                  t("invalidPhoneNumber"),
              },
            })}
          />
        </div>

        {isChangePasswordOptionVisible && (
          <Link
            text={t("changePassword")}
            className="capitalize text-sm"
            linkType={LinkTypes.red}
            onClick={toggleChangePasswordModal}
          />
        )}

        <Button
          type="submit"
          buttonType={ButtonTypes.primaryButton}
          className="px-4 py-2 flex items-center justify-center lg:w-fit lg:self-center"
          onClickHandler={() => {}}
          isLoading={updateInProgress}
          isDisabled={!isValuesUpdated}
        >
          <span className="capitalize">{t("update")}</span>
        </Button>
      </form>
    </>
  );
};

export default EditProfile;
