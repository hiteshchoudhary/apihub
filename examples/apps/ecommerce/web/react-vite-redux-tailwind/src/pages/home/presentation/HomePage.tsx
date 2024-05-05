import BannerContainer from "../../../components/widgets/banner/container/BannerContainer";
import CategoryListContainer from "../../../components/widgets/categorylist/container/CategoryListContainer";
import CompanyGuranteeListContainer from "../../../components/widgets/companyguranteelist/container/CompanyGuranteeListContainer";
import ExploreProductListContainer from "../../../components/widgets/exploreproductlist/container/ExploreProductListContainer";
import FeaturedProductListContainer from "../../../components/widgets/featuredproductlist/container/FeaturedProductListContainer";
import { BREAKPOINTS } from "../../../constants";
import useBreakpointCheck from "../../../hooks/useBreakpointCheck";

const HomePage = () => {
  const isLG = useBreakpointCheck(BREAKPOINTS.lg);
  return (
    <div className="px-2 py-4 lg:px-10">
      {isLG && <BannerContainer />}
      <div className={`${isLG ? 'mt-20' : ''}`}>
        <CategoryListContainer />
      </div>
      <div className="mt-20">
        <FeaturedProductListContainer />
      </div>
      <div className="mt-20">
        <ExploreProductListContainer />
      </div>
      <div className="mt-20">
        <CompanyGuranteeListContainer />
      </div>
    </div>
  );
};

export default HomePage;
