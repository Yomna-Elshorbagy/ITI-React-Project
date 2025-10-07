export default function Cart() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          🛒 Your Shopping Cart
        </h1>
        <div className="text-lg mt-3 sm:mt-0 text-gray-600 dark:text-gray-300">
          Total: <span className="font-semibold text-blue-600">1250 EGP</span>
        </div>
      </div>

      <div className="relative overflow-x-auto rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">
                Image
              </th>
              <th scope="col" className="px-6 py-3">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <td className="p-4 text-center">
                <img
                  src=""
                  alt="Product"
                  className="w-20 h-20 object-cover rounded-lg shadow-sm"
                />
              </td>

              <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                Elegant Gold Ring
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  24K – Size: M
                </p>
              </td>

              <td className="px-6 py-4 text-center">
                <div className="inline-flex items-center">
                  <button
                    type="button"
                    className="h-7 w-7 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 18 2"
                    >
                      <path d="M1 1h16" />
                    </svg>
                  </button>

                  <input
                    type="number"
                    value={1}
                    className="mx-2 w-14 text-center bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />

                  <button
                    type="button"
                    className="h-7 w-7 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 18 18"
                    >
                      <path d="M9 1v16M1 9h16" />
                    </svg>
                  </button>
                </div>
              </td>

              <td className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">
                1250 EGP
              </td>

              <td className="px-6 py-4 text-center">
                <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500 font-medium transition">
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition">
          Continue Shopping
        </button>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
