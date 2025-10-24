import React, { useState, type FormEvent } from "react";
import { useOrderTracking } from "../../Hooks/useOrderTracking";
import { FaCheckCircle, FaTimesCircle, FaUndo } from "react-icons/fa";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";

export const orderStatus = {
  PLACED: "placed",
  SHIPPING: "shipping",
  COMPLETED: "completed",
  CANCELED: "canceled",
  REFUNDED: "refund",
};

export default function OrderTracking(): JSX.Element {
  const [orderId, setOrderId] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");
  const { data: order, isLoading, isError } = useOrderTracking(searchId);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (orderId.trim()) setSearchId(orderId.trim());
  };

  // 🧭 Define full step order
  const steps = [
    { key: orderStatus.PLACED, label: "Placed" },
    { key: orderStatus.SHIPPING, label: "Shipping" },
    { key: orderStatus.COMPLETED, label: "Completed" },
    { key: orderStatus.CANCELED, label: "Canceled" },
    { key: orderStatus.REFUNDED, label: "Refunded" },
  ];

  const getStepIndex = (status: string): number =>
    steps.findIndex((s) => s.key === status.toLowerCase());

  const stepIndex = order ? getStepIndex(order.status) : -1;

  // 🎨 Progress color logic
  const getStepColor = (index: number): string => {
    if (!order) return "bg-[var(--sage-300)]";
    const status = order.status.toLowerCase();

    if (status === orderStatus.CANCELED) return "bg-red-500";
    if (status === orderStatus.REFUNDED) return "bg-yellow-500";
    if (index <= stepIndex) return "bg-[var(--color-primary)]";
    return "bg-[var(--sage-300)]";
  };

  const getStepIcon = (index: number): React.ReactNode => {
    if (!order) return index + 1;
    const status = order.status.toLowerCase();

    if (index < stepIndex && status !== orderStatus.CANCELED && status !== orderStatus.REFUNDED)
      return <FaCheckCircle className="text-white" />;

    if (status === orderStatus.CANCELED && steps[index].key === orderStatus.CANCELED)
      return <FaTimesCircle className="text-white" />;

    if (status === orderStatus.REFUNDED && steps[index].key === orderStatus.REFUNDED)
      return <FaUndo className="text-white" />;

    return index + 1;
  };

  const progressPercent =
    stepIndex >= 0 ? ((stepIndex + 1) / steps.length) * 100 : 0;

  const progressColor =
    order?.status === orderStatus.CANCELED
      ? "bg-red-500"
      : order?.status === orderStatus.REFUNDED
      ? "bg-yellow-500"
      : "bg-[var(--color-primary)]";

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 rounded-2xl elevate-soft text-[var(--color-text)]">
      <h2 className="text-2xl font-serif text-center mb-6 text-gradient">
        Track Your Order
      </h2>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-8"
      >
        <input
          type="text"
          placeholder="Enter your order ID..."
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 border border-[var(--color-border)] rounded-lg px-4 py-2 bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] transition"
        />
        <button
          type="submit"
          className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--color-primary-hover)] transition font-medium elevate-soft"
        >
          Search
        </button>
      </form>

      {isLoading && <LoaderPage />}
      {isError && (
        <p className="text-center text-[var(--color-error)] font-medium">
          Couldn’t find order. Please check your ID.
        </p>
      )}

      {order && (
        <>
          {/* Progress Tracker */}
          <div className="flex justify-between items-center relative mb-10">
            {steps.map((step, index) => (
              <div key={step.key} className="flex flex-col items-center w-1/5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold z-10 transition-all duration-300 ${getStepColor(
                    index
                  )}`}
                >
                  {getStepIcon(index)}
                </div>
                <p
                  className={`mt-2 text-sm font-medium ${
                    index <= stepIndex
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-[var(--color-border)] -z-10" />
            <div
              className={`absolute top-1/2 left-0 h-1 ${progressColor} -z-10 transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Order Details */}
          <div className="bg-[var(--sage-100)] dark:bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 elevate-soft">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
              Order #{order._id.slice(-6).toUpperCase()}
            </h3>
            <p className="text-[var(--color-text-muted)]">
              <span className="font-medium text-[var(--color-primary)]">
                Status:
              </span>{" "}
              {order.status.toUpperCase()}
            </p>
            <p className="text-[var(--color-text-muted)]">
              <span className="font-medium text-[var(--color-primary)]">
                Created:
              </span>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-[var(--color-text-muted)]">
              <span className="font-medium text-[var(--color-primary)]">
                Address:
              </span>{" "}
              {order.address}
            </p>
            <p className="text-[var(--color-text-muted)]">
              <span className="font-medium text-[var(--color-primary)]">
                Phone:
              </span>{" "}
              {order.phone}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
