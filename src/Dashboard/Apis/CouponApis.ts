import axios from "axios";
import type { ICoupon } from "../DashBordInterfaces/CouponInterface";

const BASE_URL = "http://localhost:3000/coupons";
const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

export const getCoupons = async (
  page: number = 1,
  size: number = 10,
  search?: string
): Promise<{
  success: boolean;
  results: number;
  data: ICoupon[];
  metadata?: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    prevPage: number | null;
    nextPage?: number | null;
  };
}> => {
  const params: Record<string, any> = { page, size };
  if (search) params.search = search;

  const { data } = await axios.get(`${BASE_URL}`, { headers, params });
  return data;
};

export const getCouponById = async (id: string): Promise<ICoupon> => {
  const { data } = await axios.get(`${BASE_URL}/${id}`, { headers });
  return data.data;
};

export const addCoupon = async (couponData: ICoupon): Promise<ICoupon> => {
  const { data } = await axios.post(`${BASE_URL}/addCoupon`, couponData, { headers });
  return data.data;
};

export const updateCoupon = async (
  id: string,
  couponData: ICoupon
): Promise<ICoupon> => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, couponData, { headers });
  return data.data;
};

export const deleteCoupon = async (id: string): Promise<any> => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`, { headers });
  return data;
};

export const validateCoupon = async (code: string): Promise<ICoupon> => {
  const { data } = await axios.post(`${BASE_URL}/valid`, { code }, { headers });
  return data.data;
};
