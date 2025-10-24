import type { ICoupon } from "../../DashBordInterfaces/CouponInterface";
import type { IOrder } from "../../DashBordInterfaces/OrderInterfaces";
import type { IUser } from "../../DashBordInterfaces/userInterfaces";

interface Product {
  _id: string;
  title: string;
  stock: number;
  category?: string | { name?: string };
}

interface FilterCriteria {
  category?: string;
  searchId?: string;
  searchName?: string;
  searchStock?: string;
}
interface CouponFilters {
  code?: string;
  type?: string;
  discount?: string;
}

interface UserFilterCriteria {
  searchId?: string;
  searchName?: string;
  searchEmail?: string;
  searchPhone?: string;
  status?: string;
}
interface OrderFilters {
  searchId?: string;
  searchUser?: string;
  searchEmail?: string;
  status?: string;
  payment?: string;
  fromDate?: string;
  toDate?: string;
}

export const filterProducts = (
  products: Product[],
  { category, searchId, searchName, searchStock }: FilterCriteria
): Product[] => {
  return products
    ?.filter((p) =>
      category
        ? typeof p.category === "string"
          ? p.category.toLowerCase() === category.toLowerCase()
          : p.category?.name?.toLowerCase() === category.toLowerCase()
        : true
    )
    ?.filter((p) =>
      searchId ? p._id?.toLowerCase().includes(searchId.toLowerCase()) : true
    )
    ?.filter((p) =>
      searchName
        ? p.title?.toLowerCase().includes(searchName.toLowerCase())
        : true
    )
    ?.filter((p) =>
      searchStock ? p.stock?.toString().includes(searchStock) : true
    );
};

export const filterCoupons = (
  coupons: ICoupon[],
  { code, type, discount }: CouponFilters
): ICoupon[] => {
  return coupons.filter((coupon) => {
    const matchCode = code ? coupon.code.includes(code) : true;

    const matchType = type
      ? coupon.type.toLowerCase() === type.toLowerCase()
      : true;

    const matchDiscount = discount
      ? coupon.discount.toString().includes(discount)
      : true;

    return matchCode && matchType && matchDiscount;
  });
};

export const filterUsers = (
  users: IUser[],
  { searchId, searchName, searchEmail, searchPhone, status }: UserFilterCriteria
): IUser[] => {
  return users
    ?.filter((u) =>
      searchId ? u._id?.toLowerCase().includes(searchId.toLowerCase()) : true
    )
    ?.filter((u) =>
      searchName
        ? `${u.userName}`.toLowerCase().includes(searchName.toLowerCase())
        : true
    )
    ?.filter((u) =>
      searchEmail
        ? u.email?.toLowerCase().includes(searchEmail.toLowerCase())
        : true
    )
    ?.filter((u) =>
      searchPhone ? u.mobileNumber?.toString().includes(searchPhone) : true
    )
    ?.filter((u) =>
      status ? u.status?.toLowerCase() === status.toLowerCase() : true
    );
};

export const filterOrders = (
  orders: IOrder[],
  { searchId, searchUser, status, fromDate, toDate }: OrderFilters
): IOrder[] => {
  return orders
    ?.filter((order) =>
      searchId ? order._id.toLowerCase().includes(searchId.toLowerCase()) : true
    )
    ?.filter((order) =>
      searchUser
        ? order.fullName?.toLowerCase().includes(searchUser.toLowerCase())
        : true
    )
    ?.filter((order) =>
      status ? order.status.toLowerCase() === status.toLowerCase() : true
    )
    ?.filter((order) => {
      if (fromDate && toDate) {
        const orderDate = new Date(order.createdAt);
        return orderDate >= new Date(fromDate) && orderDate <= new Date(toDate);
      }
      return true;
    });
};
