import React, { useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../Components/ProductCard/ProductCard";

type Product = {
  _id: string;
  title: string;
  description?: string;
  imageCover?: { secure_url: string };
  finalPrice?: number;
  price?: number;
  category?: { name?: string };
};

const PAGE_SIZE = 12;

const fetchProducts = async (page: number, size: number) => {
  const res = await axios.get(
    `https://iti-react-backend.vercel.app/products/getproducts?page=${page}&size=${size}`
  );
  // API shape: { results, metadata, message, success, data: Array(...) }
  // we return the inner array directly
  return (res.data?.data || []) as Product[];
};

const Products: React.FC = () => {
  const [page, setPage] = useState(1);
  const [size] = useState(PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const {
    data: products = [],
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["products", page, size],
    queryFn: () => fetchProducts(page, size),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
  });

  // derive categories from data
  const categories = useMemo(() => {
    const names = products
      .map((p) => p.category?.name)
      .filter((n): n is string => !!n);
    return ["All", ...Array.from(new Set(names))];
  }, [products]);

  // local filtering + search
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || p.category?.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const handleAddToCart = (id: string) => {
    console.log("Add to cart:", id);
    // integrate with cart context / API here
  };

  const handleAddToWishlist = (id: string) => {
    console.log("Add to wishlist:", id);
    // integrate with wishlist context / API here
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p>Loading products…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-600">
        <p>Failed to load products. Try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page when searching
          }}
          className="w-full md:max-w-lg border rounded px-4 py-2 focus:outline-none focus:ring"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1 hidden md:block">
          <div className="sticky top-20 bg-white p-4 border rounded">
            <h3 className="font-semibold mb-3">Category</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setPage(1);
                    }}
                    className={`text-left w-full ${
                      selectedCategory === cat
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main grid */}
        <section className="md:col-span-3">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((old) => Math.max(1, old - 1))}
              disabled={page === 1 || isFetching}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span>Page {page}</span>

            <button
              onClick={() => setPage((old) => old + 1)}
              disabled={products.length < size || isFetching}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Products;
