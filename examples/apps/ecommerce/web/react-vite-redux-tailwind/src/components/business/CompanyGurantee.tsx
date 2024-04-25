import { useTranslation } from "react-i18next";
import { COMPANY_GURANTEE } from "../../constants";
import RoundedIcon from "../basic/RoundedIcon";



const CompanyGurantee = (props: COMPANY_GURANTEE) => {
    const {icon, headingKey, descriptionKey} = props

    const {t} = useTranslation();
    return (
        <div className="flex flex-col items-center">
            <RoundedIcon icon={icon} />
            <span className="uppercase text-xl font-semibold text-black mt-4">{t(headingKey)}</span>
            <span className="capitalize text-sm text-black mt-2">{t(descriptionKey)}</span>
        </div>
    )
}

export default CompanyGurantee;