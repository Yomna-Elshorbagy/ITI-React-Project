import type { ICoupon } from "../../DashBordInterfaces/CouponInterface";

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
    const matchCode = code
      ? coupon.code.includes(code)
      : true;

    const matchType = type
      ? coupon.type.toLowerCase() === type.toLowerCase()
      : true;

    const matchDiscount = discount
      ? coupon.discount.toString().includes(discount)
      : true;

    return matchCode && matchType && matchDiscount;
  });
};
