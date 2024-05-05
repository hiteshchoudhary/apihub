import { useTranslation } from "react-i18next";
import { SelectionMenuItem } from "../../../../constants";
import SelectionMenu from "../../../basic/SelectionMenu";
import { MY_ACCOUNT_OPTIONS } from "../../../../data/applicationData";

interface MyAccountOptionProps {
  itemClickHandler(item: SelectionMenuItem): void
}
const MyAccountOption = (props: MyAccountOptionProps) => {
  const {
    itemClickHandler
  } = props;
  const { t } = useTranslation();

  return (
    <>
      <SelectionMenu
        heading={t("myAccount")}
        items={MY_ACCOUNT_OPTIONS}
        onItemSelect={itemClickHandler}
        headingClassName="capitalize text-zinc-50 lg:text-black"
      />
    </>
  );
};

export default MyAccountOption;
