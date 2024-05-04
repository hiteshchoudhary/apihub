import {
  DropdownItem,
  DropdownTypes,
} from "../../../../constants";
import Dropdown from "../../../basic/Dropdown";
import Link from "../../../basic/Link";
import { useAppSelector } from "../../../../store";



interface InfoHeaderProps {
  languageConfig: {languageList: Array<DropdownItem>, defaultSelection: DropdownItem};
  infoText: string;
  linkText?: string;
  onLinkClickHandler?(): void;
  languageChangeHandler(selectedLanguage: DropdownItem): void
}

const InfoHeader = (props: InfoHeaderProps) => {

  const {languageConfig, infoText, linkText = "", onLinkClickHandler, languageChangeHandler} = props;

  const isRTL = useAppSelector((state) => state.language.isRTL);

  return (
    <div className={`bg-black py-1 flex justify-center items-center`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`text-center ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
        {infoText && <span className="text-zinc-50 text-sm">{infoText}</span>}
        {linkText && (
          <Link
            text={linkText}
            onClick={onLinkClickHandler}
            className="text-zinc-50 font-semibold text-sm underline ml-1"
          />
        )}
      </div>
      <div className={`${isRTL ? 'mr-auto ml-5' : 'ml-auto mr-5'}`}>
        <Dropdown
          itemsList={languageConfig.languageList}
          onChange={languageChangeHandler}
          defaultSelectedItem={languageConfig.defaultSelection}
          type={DropdownTypes.noBorderDarkBg}
        />
      </div>
    </div>
  );
};

export default InfoHeader;
