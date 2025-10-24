import { z } from "zod";

export const couponSchema = z
  .object({
    code: z.string().min(3, "Code must be at least 3 characters"),
    type: z.string().min(1, "Type is required"),
    fromDate: z.string().refine((s) => !!Date.parse(s), "Invalid start date"),
    expire: z.string().refine((s) => !!Date.parse(s), "Invalid expire date"),
    discount: z
      .number({ invalid_type_error: "Discount must be a number" })
      .min(0, "Discount must be >= 0")
      .max(100, "Max 100"),
  })
  .refine((data) => new Date(data.expire) > new Date(data.fromDate), {
    message: "Expire date must be after start date",
    path: ["expire"],
  });

export type CouponForm = z.infer<typeof couponSchema>;
