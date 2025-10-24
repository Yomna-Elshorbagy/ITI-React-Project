import { useQuery } from "@tanstack/react-query";
import { getDemographics } from "../Apis/UserAnalysis";
import type { Demographics } from "../DashBordInterfaces/userAnalysis";

export const useDemographics = () => {
  const { data, isLoading, isError, refetch } = useQuery<
    Awaited<ReturnType<typeof getDemographics>>
  >({
    queryKey: ["demographics"],
    queryFn: async () => await getDemographics(),
  });

  return {
    data: data as Demographics | undefined,
    loading: isLoading,
    error: isError,
    refetch,
  };
};
