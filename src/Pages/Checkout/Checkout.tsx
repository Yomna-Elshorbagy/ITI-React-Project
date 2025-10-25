import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useCreateOrder } from "../../Hooks/useOrder";
import { useAppSelector, useAppDispatch } from "../../Hooks/reduxHooks";
import { clearCartApi } from "../../Store/Slices/CartSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const schema = z.object({
  fullName: z.string().min(3, "Enter your full name"),
  phone: z.string().regex(/^01[01245]\d{8}$/i, "Invalid Egyptian phone number"),
  address: z.string().optional(),
  payment: z.enum(["Cash on Delivery", "Online"]),
  couponCode: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { totalPrice, products } = useAppSelector((s) => s.cart);
  const { mutate: createOrder, isPending } = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { payment: "Cash on Delivery" },
  });

  const onSubmit = (values: FormValues) => {
    if (!products || products.length === 0) {
      MySwal.fire({ icon: "warning", title: "Your cart is empty" });
      return;
    }

    createOrder(
      {
        fullName: values.fullName,
        phone: values.phone,
        address: values.address || "",
        payment: values.payment,
        couponCode: values.couponCode,
      },
      {
        onSuccess: () => {
          MySwal.fire({
            icon: "success",
            title: "Order placed",
            text: "Redirecting to your orders...",
            timer: 2500,
            showConfirmButton: false,
          });
          dispatch(clearCartApi());
          navigate("/profile");
        },
        onError: (err: any) => {
          MySwal.fire({
            icon: "error",
            title: "Failed to place order",
            text: err?.response?.data?.message || "Please try again",
          });
        },
      }
    );
  };

  return (
    <section className="min-h-[80vh] py-12 bg-[var(--color-bg)] transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="rounded-2xl glass dark:glass-dark p-8 elevate-soft elevate-hover border border-[var(--color-border)] transition-all duration-300">
          <h2 className="text-3xl font-semibold mb-6 text-gradient header-font">
            Checkout
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium text-[var(--color-text-muted)]">
                Full name
              </label>
              <input
                {...register("fullName")}
                placeholder="e.g. Yomna Mohamed"
                className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5 bg-[var(--color-surface)] focus-ring focus:border-[var(--color-primary)] transition-all"
              />
              {errors.fullName && (
                <p className="text-[var(--color-error)] text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium text-[var(--color-text-muted)]">
                Phone
              </label>
              <input
                {...register("phone")}
                placeholder="01001234567"
                className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5 bg-[var(--color-surface)] focus-ring transition-all"
              />
              {errors.phone && (
                <p className="text-[var(--color-error)] text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium text-[var(--color-text-muted)]">
                Address
              </label>
              <textarea
                rows={3}
                {...register("address")}
                placeholder="18 abdelhameed shoman, Cairo, Egypt"
                className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5 bg-[var(--color-surface)] focus-ring transition-all"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-[var(--color-text-muted)]">
                Payment
              </label>
              <select
                {...register("payment")}
                className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5 bg-[var(--color-surface)] focus-ring transition-all"
              >
                <option>Cash on Delivery</option>
                <option>Online</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-[var(--color-text-muted)]">
                Coupon Code (Optional)
              </label>
              <input
                {...register("couponCode")}
                placeholder="Enter coupon code"
                className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5 bg-[var(--color-surface)] focus-ring transition-all"
              />
            </div>

            <button
              disabled={isPending}
              className="w-full py-3 rounded-xl text-white font-semibold text-lg animate-gradient-x elevate-soft transition-all disabled:opacity-60"
            >
              {isPending ? "Placing order..." : "Place order"}
            </button>
          </form>
        </div>

        <aside className="rounded-2xl glass dark:glass-dark p-8 border border-[var(--color-border)] elevate-soft elevate-hover h-fit transition-all">
          <h3 className="text-2xl font-semibold mb-6 text-gradient header-font">
            Order Summary
          </h3>

          <div className="space-y-4">
            {(products || []).map((p: any) => (
              <div
                key={p._id}
                className="flex items-center gap-4 p-3 bg-[var(--sage-50)] dark:bg-[var(--color-surface)] rounded-xl transition-all hover:elevate-soft"
              >
                <img
                  src={
                    p.productId?.imageCover?.secure_url ||
                    "/placeholder-image.jpg"
                  }
                  alt={p.productId?.title || "Product"}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-[var(--color-border)]"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[var(--color-text)] truncate">
                    {p.productId?.title || "Product Name"}
                  </h4>
                  <div className="flex items-center justify-between mt-1 text-sm">
                    <span className="text-[var(--color-text-muted)]">
                      Qty: {p.quantity}
                    </span>
                    <span className="font-semibold text-[var(--color-primary)]">
                      {p.price} EGP
                    </span>
                  </div>
                  {p.productId?.finalPrice &&
                    p.productId?.finalPrice < p.productId?.price && (
                      <div className="text-xs text-[var(--color-success)] font-medium mt-1">
                        {Math.round(
                          ((p.productId.price - p.productId.finalPrice) /
                            p.productId.price) *
                            100
                        )}
                        % off
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t border-[var(--color-border)]">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-[var(--color-primary)]">
                {totalPrice} EGP
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
