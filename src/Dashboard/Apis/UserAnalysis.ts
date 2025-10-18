import axios from "axios";
import {
  type UsersOverview,
  type DeletedUsersAnalysis,
  type Demographics,
} from "../DashBordInterfaces/userAnalysis";

const token = localStorage.getItem("accessToken"); 

export const getUsersOverview = async (): Promise<UsersOverview> => {
  const { data } = await axios.get("http://localhost:3000/user/analysis/overview", {
    headers: {
      authentication: `bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const getDeletedUsersAnalysis = async (): Promise<DeletedUsersAnalysis> => {
  const { data } = await axios.get("http://localhost:3000/user/analysis/deleted", {
    headers: {
      authentication: `bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
    console.log("✅ Response from deleted:", data);

  return data;
};

export const getDemographics = async (): Promise<Demographics> => {
  const { data } = await axios.get("http://localhost:3000/user/analysis/demographics", {
    headers: {
      authentication: `bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};
