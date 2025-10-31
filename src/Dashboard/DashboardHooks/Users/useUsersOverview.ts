import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUsersOverview = () => {
  const token = localStorage.getItem("accessToken");

  const fetchOverview = async () => {
    const { data } = await axios.get(
      "https://iti-react-backend.vercel.app/user/analysis/overview",
      {
        headers: {
          authentication: `bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("data is", data);
    return data.data;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["usersOverview"],
    queryFn: fetchOverview,
  });

  return {
    data,
    loading: isLoading,
    error: isError,
    refetch,
  };
};
