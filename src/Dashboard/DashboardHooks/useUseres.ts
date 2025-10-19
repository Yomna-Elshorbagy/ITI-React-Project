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
        `https://iti-react-backend.vercel.app/user/allUsers?page=${pageNum}&size=5`,
        {
          headers: {
            authentication: `bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const usersData = (res.data.data || []).filter(
        (u: IUser) => u.role?.toLowerCase() === "user"
      );

      setUsers(usersData);
      setPagesCount(res.data.meta?.totalPages || 1);
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
