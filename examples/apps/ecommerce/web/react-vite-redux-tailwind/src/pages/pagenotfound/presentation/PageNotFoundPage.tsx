import { useTranslation } from "react-i18next";
import Text from "../../../components/basic/Text";


const PageNotFoundPage = () => {
    const {t} = useTranslation();
    return (
        <div className="px-2 py-4 lg:px-10 flex justify-center items-center">
            <Text className="text-2xl uppercase tracking-wider font-poppinsMedium">
                {t("pageNotFound")}
            </Text>
        </div>
    )
}

export default PageNotFoundPage;