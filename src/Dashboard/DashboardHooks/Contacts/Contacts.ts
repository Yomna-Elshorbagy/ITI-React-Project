import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllContacts } from "../../Apis/Contact";
import type { IContact } from "../../DashBordInterfaces/Contact";

export const useContacts = () => {
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, refetch } = useQuery<
    Awaited<ReturnType<typeof getAllContacts>>
  >({
    queryKey: ["contacts", page],
    queryFn: async () => await getAllContacts(page, 8),
  });

  const contacts: IContact[] = data?.data || [];
  const pagesCount = data?.pagination?.totalPages || 1;

  return {
    contacts,
    page,
    pagesCount,
    loading: isLoading,
    error: isError,
    setPage,
    refetch,
  };
};
