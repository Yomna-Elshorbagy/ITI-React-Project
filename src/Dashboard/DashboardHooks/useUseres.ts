// src/Dashboard/Hooks/useUsers.ts
import { useEffect, useState } from "react";
import axios from "axios";
import type { IUser, IUseUsers } from "../DashBordInterfaces/userInterfaces";

export const useUsers = (): IUseUsers => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pagesCount, setPagesCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async (pageNum: number = 1) => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      const res = await axios.get(
        `http://localhost:3000/user/allUsers?page=${pageNum}&size=5`,
        {
          headers: {
            authentication: `bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUsers(res.data.data);
      setPagesCount(Math.ceil(res.data.total / 5) || 2);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return { users, page, pagesCount, loading, setPage, fetchUsers };
};
