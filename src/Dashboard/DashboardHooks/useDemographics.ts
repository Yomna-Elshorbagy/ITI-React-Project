import { useEffect, useState } from "react";
import { getDemographics } from "../Apis/UserAnalysis";
import type { Demographics } from "../DashBordInterfaces/userAnalysis";

export const useDemographics = () => {
  const [data, setData] = useState<Demographics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await getDemographics();
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
