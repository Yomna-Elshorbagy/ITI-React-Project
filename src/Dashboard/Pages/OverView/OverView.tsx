import CategoryProductDistributionChart from "../../Components/Charts/CategoryDistributionChart";
import OrdersDistributionChart from "../../Components/Charts/OrderDistChart";
import RevenueByCategoryChart from "../../Components/Charts/RevenuesByCategory";
import TopSellingProductsChart from "../../Components/Charts/TopSellingProdChart";
import TotalIncomeAnalysis from "../../Components/Charts/TotalIncomeAnalysis";
import DeletedUsersChart from "../../Components/Charts/UserDeletedChart";
import DemographicsChart from "../../Components/Charts/UserDemographicsChart";
import UsersOverviewChart from "../../Components/Charts/UsersOverviewChart";

const Overview: React.FC = () => {
  return (
    <div className="flex flex-col space-y-10">
      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col items-center justify-center bg-[var(--color-surface)] rounded-2xl p-6 elevate-soft h-[280px]">
          <UsersOverviewChart />
        </div>

        <div className="flex flex-col items-center justify-center bg-[var(--color-surface)] rounded-2xl p-6 elevate-soft h-[280px]">
          <DeletedUsersChart />
        </div>

        <div className="flex flex-col items-center justify-center bg-[var(--color-surface)] rounded-2xl p-6 elevate-soft h-[280px]">
          <DemographicsChart />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <CategoryProductDistributionChart />
        <RevenueByCategoryChart />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <TopSellingProductsChart />
        <OrdersDistributionChart />
      </div>

      <div>
        <TotalIncomeAnalysis />
      </div>
    </div>
  );
};

export default Overview;
