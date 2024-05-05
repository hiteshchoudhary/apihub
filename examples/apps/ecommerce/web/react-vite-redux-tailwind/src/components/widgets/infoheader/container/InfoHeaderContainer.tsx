import { useMemo } from "react";
import InfoHeader from "../presentation/InfoHeader";
import {
  DropdownItem,
  SUPPORTED_LANGUAGES,
} from "../../../../constants";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { changeLanguage } from "../../../../store/LanguageSlice";

const InfoHeaderContainer = () => {
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();

  /* Shown at the top of the header */
  const infoText = t("infoHeaderMessage");
  const linkText = "";

  /* Returns the list of supported languages, and the current selected language
     Used for Dropdown props
  */
  const languageConfig = useMemo(() => {
    const result: Array<DropdownItem> = [];
    const defaultSelection: DropdownItem = { id: "", textKey: "" };
    let languageHeading: keyof typeof SUPPORTED_LANGUAGES;

    for (languageHeading in SUPPORTED_LANGUAGES) {
      const languageId = SUPPORTED_LANGUAGES[languageHeading];

      result.push({
        id: languageId,
        textKey: languageId,
      });

      /* Default / currently selected language */
      if (languageId === i18n.language) {
        defaultSelection.id = languageId;
        defaultSelection.textKey = languageId;
      }
    }

    return {
      languageList: result,
      defaultSelection,
    };
  }, [i18n.language]);

  /* On change of language */
  const languageChangeHandler = (selectedLanguage: DropdownItem) => {
    if (selectedLanguage?.id && typeof selectedLanguage.id === "string") {
      /* Change language in i18n, and redux state */
      i18n.changeLanguage(selectedLanguage.id);
      dispatch(changeLanguage(selectedLanguage.id));
    }
  };

  const onLinkClickHandler = () => {};

  return (
    <InfoHeader
      languageConfig={languageConfig}
      infoText={infoText}
      linkText={linkText}
      onLinkClickHandler={onLinkClickHandler}
      languageChangeHandler={languageChangeHandler}
    />
  );
};

export default InfoHeaderContainer;
