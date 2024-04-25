import { useCallback, useEffect, useMemo, useState } from "react";
import ApiError from "../../../../services/ApiError";
import ProfileService from "../../../../services/profile/ProfileService";
import EditProfile from "../presentation/EditProfile";
import { ProfileFormFields, TOAST_MESSAGE_TYPES } from "../../../../constants";
import ErrorMessage from "../../../basic/ErrorMessage";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { postMessageAction } from "../../../../store/ToastMessageSlice";
import { useTranslation } from "react-i18next";
import { LOGIN_TYPES } from "../../../../services/auth/AuthTypes";

const EditProfileContainer = () => {
  const dispatch = useAppDispatch();

  const {t} = useTranslation();

  const loggedInUser = useAppSelector((state) => state.auth.userDetails);

  const [currentProfile, setCurrentProfile] = useState<ProfileFormFields>();
  const [errorFetchingProfile, setErrorFetchingProfile] = useState("");
  const [updateInProgress, setUpdateInProgress] = useState(false);

  const isChangePasswordOptionVisible = useMemo(() => {
    if(loggedInUser?.loginType !== LOGIN_TYPES.emailPassword){
      return false;
    }
    return true;
  }, [loggedInUser])

  const fetchUserProfile = useCallback(async () => {
    setErrorFetchingProfile("");
    const response = await ProfileService.getUserProfile();
    if (!(response instanceof ApiError)) {
      setCurrentProfile({
        firstName: response.firstName,
        lastName: response.lastName,
        countryCode: response.countryCode,
        phoneNumber: response.phoneNumber,
      });
    } else {
      /* Error fetching profile */
      setErrorFetchingProfile(
        response.errorResponse?.message || response.errorMessage
      );
    }
  }, []);

  const updateProfileHandler = async (data: ProfileFormFields) => {
    setUpdateInProgress(true);
    const response = await ProfileService.updateUserProfile(
      data.countryCode,
      data.firstName,
      data.lastName,
      data.phoneNumber
    );
    setUpdateInProgress(false);
    if (!(response instanceof ApiError)) {
      setCurrentProfile({
        firstName: response.firstName,
        lastName: response.lastName,
        countryCode: response.countryCode,
        phoneNumber: response.phoneNumber,
      });
      dispatch(
        postMessageAction({
          type: TOAST_MESSAGE_TYPES.success,
          message: t("profileUpdatedSuccessfully"),
        })
      );
    } else {
      /* Error */
      dispatch(
        postMessageAction({
          type: TOAST_MESSAGE_TYPES.error,
          message: response.errorResponse?.message || response.errorMessage,
        })
      );
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return (
    <>
      {currentProfile ? (
        <EditProfile
          currentProfile={currentProfile}
          updateProfileHandler={updateProfileHandler}
          updateInProgress={updateInProgress}
          isChangePasswordOptionVisible={isChangePasswordOptionVisible}
        />
      ) : errorFetchingProfile ? (
        <ErrorMessage message={t("failedToFetchInformation")} />
      ) : (
        <></>
      )}
    </>
  );
};

export default EditProfileContainer;
