import axios from "axios";
import type {
  ICreateOrder,
  IOrder,
  IOrderResponse,
} from "../DashBordInterfaces/OrderInterfaces";

const BASE_URL = "http://localhost:3000/order";
const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

export const getAllOrders = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  data: IOrder[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
  };
}> => {
  const { data } = await axios.get(
    `${BASE_URL}/allorders?page=${page}&limit=${limit}`,
    { headers }
  );
  return {
    data: data.data,
    pagination: data.pagination,
  };
};

export const getUserOrders = async (): Promise<IOrder[]> => {
  const { data } = await axios.get(`${BASE_URL}/`, { headers });
  return data.data;
};

export const getOrderDetails = async (id: string): Promise<IOrder> => {
  const { data } = await axios.get(`${BASE_URL}/${id}`, { headers });
  return data.data;
};

export const createOrder = async (
  orderData: ICreateOrder
): Promise<IOrderResponse> => {
  const { data } = await axios.post(`${BASE_URL}/`, orderData, { headers });
  return data;
};

export const updateOrderStatus = async (
  id: string,
  status: string
): Promise<IOrder> => {
  const { data } = await axios.put(
    `${BASE_URL}/status/${id}`,
    { status },
    { headers }
  );
  return data.data;
};

export const updateOrderInfo = async (
  id: string,
  updateData: {
    fullName?: string;
    phone?: string;
    address?: string;
    status?: string;
  }
): Promise<IOrder> => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, updateData, {
    headers,
  });
  return data.data;
};

export const softDeleteOrder = async (
  id: string,
  token: string
): Promise<any> => {
  const { data } = await axios.put(
    `${BASE_URL}/soft/${id}`,
    {},
    {
      headers: { authentication: `bearer ${token}` },
    }
  );
  return data;
};

export const hardDeleteOrder = async (id: string): Promise<any> => {
  const { data } = await axios.delete(`${BASE_URL}/hard/${id}`, { headers });
  return data;
};

export const getRevenuePerMonth = async (): Promise<any[]> => {
  const { data } = await axios.get(`${BASE_URL}/revenue`, { headers });
  console.log(data);

  return data.data;
};

export const exportOrdersToCSV = async (): Promise<void> => {
  const response = await axios.get(`${BASE_URL}/exportcsv`, {
    headers,
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "orders-report.csv");
  document.body.appendChild(link);
  link.click();
};

export const exportOrdersToPDF = async (): Promise<void> => {
  const response = await axios.get(`${BASE_URL}/exportpdf`, {
    headers,
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "orders-report.pdf");
  document.body.appendChild(link);
  link.click();
};
