import TotalIncomeAnalysis from "../../Components/Charts/TotalIncomeAnalysis";
import DeletedUsersChart from "../../Components/Charts/UserDeletedChart";
import DemographicsChart from "../../Components/Charts/UserDemographicsChart";
import UsersOverviewChart from "../../Components/Charts/UsersOverviewChart";
import DashboardLayout from "../../Dashboared";

const Overview: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col items-center justify-center bg-[var(--color-surface)] rounded-2xl  p-6 elevate-soft h-[280px]">
          <UsersOverviewChart />
        </div>

        <div className="flex flex-col items-center justify-center bg-[var(--color-surface)] rounded-2xl p-6 elevate-soft h-[280px]">
          <DeletedUsersChart />
        </div>

        <div className="flex flex-col items-center justify-center bg-[var(--color-surface)] rounded-2xl p-6 elevate-soft h-[280px]">
          <DemographicsChart />
        </div>
      </div>    
      <div>
        <TotalIncomeAnalysis/>
      </div>
      </>
  );
};

export default Overview;
