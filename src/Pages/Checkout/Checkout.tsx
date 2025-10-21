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
      },
      {
        onSuccess: (res) => {
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
    <section className="min-h-[70vh] py-10">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1">Full name</label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600"
                {...register("fullName")}
                placeholder="e.g. Yomna Mohamed"
              />
              {errors.fullName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1">Phone</label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600"
                {...register("phone")}
                placeholder="01001234567"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1">Address</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600"
                rows={3}
                {...register("address")}
                placeholder="15 El Tahrir St, Cairo, Egypt"
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1">Payment</label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600"
                {...register("payment")}
              >
                <option>Cash on Delivery</option>
                <option>Online</option>
              </select>
            </div>
            <button
              disabled={isPending}
              className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 disabled:opacity-60"
            >
              {isPending ? "Placing order..." : "Place order"}
            </button>
          </form>
        </div>

        <aside className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            {(products || []).map((p: any) => (
              <div key={p._id} className="flex justify-between">
                <span className="truncate pr-3">{p.title}</span>
                <span className="font-semibold">
                  {p.finalPrice} EGP × {p.quantity}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-base font-semibold">
            <span>Total</span>
            <span className="text-emerald-700">{totalPrice} EGP</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
