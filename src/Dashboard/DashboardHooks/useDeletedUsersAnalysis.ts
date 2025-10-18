import { useEffect, useState } from "react";
import { getDeletedUsersAnalysis } from "../Apis/UserAnalysis";
import type { DeletedUsersAnalysis } from "../DashBordInterfaces/userAnalysis";

export const useDeletedUsersAnalysis = () => {
  const [data, setData] = useState<DeletedUsersAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(data);

  useEffect(() => {
    (async () => {
      try {
        const result = await getDeletedUsersAnalysis();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading };
};
