import { useQuery } from "@tanstack/react-query";
import { getDeletedUsersAnalysis } from "../Apis/UserAnalysis";
import type { DeletedUsersAnalysis } from "../DashBordInterfaces/userAnalysis";

export const useDeletedUsersAnalysis = () => {
  const { data, isLoading, isError, refetch } = useQuery<
    Awaited<ReturnType<typeof getDeletedUsersAnalysis>>
  >({
    queryKey: ["deletedUsersAnalysis"],
    queryFn: async () => await getDeletedUsersAnalysis(),
  });

  console.log(data);

  return {
    data: data as DeletedUsersAnalysis | undefined,
    loading: isLoading,
    error: isError,
    refetch,
  };
};
