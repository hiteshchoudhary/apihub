import { COMPANY_GURANTEE } from "../../../../constants";
import { useAppSelector } from "../../../../store";
import CompanyGurantee from "../../../business/CompanyGurantee";

interface CompanyGuranteeListProps {
  gurantees: COMPANY_GURANTEE[];
}
const CompanyGuranteeList = (props: CompanyGuranteeListProps) => {
  const { gurantees } = props;

  const isRTL = useAppSelector((state) => state.language.isRTL)
  return (
    <div className={`flex flex-col lg:flex-row lg:justify-around ${isRTL ? 'lg:flex-row-reverse': ''}`}>
      {gurantees.map((gurantee) => (
        <div key={gurantee.id} className="mb-8 lg:mb-0">
          <CompanyGurantee
            id={gurantee.id}
            icon={gurantee.icon}
            descriptionKey={gurantee.descriptionKey}
            headingKey={gurantee.headingKey}
          />
        </div>
      ))}
    </div>
  );
};

export default CompanyGuranteeList;
