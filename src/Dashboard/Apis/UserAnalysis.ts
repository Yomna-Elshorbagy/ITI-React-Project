import axios from "axios";
import {
  type UsersOverview,
  type DeletedUsersAnalysis,
  type Demographics,
} from "../DashBordInterfaces/userAnalysis";
import { baseURL } from "../../Constants/BaseUrls";

const token = localStorage.getItem("accessToken");

export const getUsersOverview = async (): Promise<UsersOverview> => {
  const { data } = await axios.get(`${baseURL}/user/analysis/overview`, {
    headers: {
      authentication: `bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const getDeletedUsersAnalysis =
  async (): Promise<DeletedUsersAnalysis> => {
    const { data } = await axios.get(`${baseURL}/user/analysis/deleted`, {
      headers: {
        authentication: `bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return data;
  };

export const getDemographics = async (): Promise<Demographics> => {
  const { data } = await axios.get(`${baseURL}/user/analysis/demographics`, {
    headers: {
      authentication: `bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

const BASE_URL = `${baseURL}/user`;

export const hardDeleteUser = async (id: string, token: string) => {
  const res = await axios.delete(`${BASE_URL}/delete/${id}`, {
    headers: { authentication: `bearer ${token}` },
  });
  console.log("hard delete", res.data);

  return res.data;
};

export const softDeleteUser = async (id: string, token: string) => {
  const res = await axios.put(
    `${BASE_URL}/softDelete/${id}`,
    {},
    {
      headers: { authentication: `bearer ${token}` },
    }
  );
  return res.data;
};
