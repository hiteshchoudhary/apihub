import { COMPANY_GURANTEE_LIST } from "../../../../data/applicationData";
import CompanyGuranteeList from "../presentation/CompanyGuranteeList"


const CompanyGuranteeListContainer = () => {
    return (
        <CompanyGuranteeList gurantees={COMPANY_GURANTEE_LIST} />
    )
}

export default CompanyGuranteeListContainer;