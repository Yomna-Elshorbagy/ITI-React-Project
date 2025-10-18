import { useEffect, useState } from "react";
import axios from "axios";

export const useUsersOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/user/analysis/overview",
          {
            headers: {
              authentication: `bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(`data is${data}`);

        setData(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  return { data, loading };
};
