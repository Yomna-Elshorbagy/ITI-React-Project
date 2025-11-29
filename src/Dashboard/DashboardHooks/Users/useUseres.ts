import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import type { IUser } from "../../DashBordInterfaces/userInterfaces";
import { baseURL } from "../../../Constants/BaseUrls";

const getAllUsers = async (page: number, size: number = 5) => {
  const token = localStorage.getItem("accessToken");

  const res = await axios.get(
    `${baseURL}/user/allUsers?page=${page}&size=${size}`,
    {
      headers: {
        authentication: `bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const filteredUsers: IUser[] = (res.data.data || []).filter(
    (u: IUser) =>
      u.role?.toLowerCase() === "admin" || u.role?.toLowerCase() === "user"
  );

  return {
    data: filteredUsers,
    pagination: res.data.meta || { totalPages: 1 },
  };
};

export const useUsers = () => {
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["users", page],
    queryFn: () => getAllUsers(page, 7),
  });

  const users = data?.data || [];
  const pagesCount = data?.pagination?.totalPages || 1;

  return {
    users,
    page,
    pagesCount,
    loading: isLoading,
    error: isError,
    setPage,
    refetch,
  };
};
