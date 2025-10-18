import React, { useState, type FormEvent } from "react";
import { useOrderTracking } from "../../Hooks/useOrderTracking";
import { FaCheckCircle } from "react-icons/fa";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";

export default function OrderTracking(): JSX.Element {
  const [orderId, setOrderId] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");
  const { data: order, isLoading, isError } = useOrderTracking(searchId);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (orderId.trim()) setSearchId(orderId.trim());
  };

  const getStepStatus = (status: string): number => {
    const steps = ["placed", "shipping", "delivered"];
    return steps.indexOf(status);
  };

  const stepIndex = order ? getStepStatus(order.status) : -1;

  return (
    <div className="max-w-4xl mx-auto mt-10  p-8 rounded-2xl elevate-soft text-[var(--color-text)]">
      <h2 className="text-2xl font-serif text-center mb-6 text-gradient">
        Track Your Order
      </h2>

      {/* Search Bar */}
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
          {/* Progress Steps */}
          <div className="flex justify-between items-center relative mb-10">
            {["Shopping Bag", "Shipping & Checkout", "Confirmation"].map(
              (label, index) => (
                <div key={index} className="flex flex-col items-center w-1/3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold z-10 transition-all duration-300 ${
                      index <= stepIndex
                        ? "bg-[var(--color-primary)]"
                        : "bg-[var(--sage-300)]"
                    }`}
                  >
                    {index < stepIndex ? (
                      <FaCheckCircle className="text-white" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium transition-all ${
                      index <= stepIndex
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {label}
                  </p>
                </div>
              )
            )}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-[var(--color-border)] -z-10" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[var(--color-primary)] -z-10 transition-all duration-500"
              style={{ width: `${((stepIndex + 1) / 3) * 100}%` }}
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
