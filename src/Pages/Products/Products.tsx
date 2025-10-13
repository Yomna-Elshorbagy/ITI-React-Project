import React, { useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../Components/ProductCard/ProductCard";
import AccessoriesBanner from "../../Components/AccessoriesBanner/AccessoriesBanner";
import { useSearchParams } from "react-router-dom";

type Product = {
  _id: string;
  title: string;
  description?: string;
  imageCover?: { secure_url: string };
  finalPrice?: number;
  price?: number;
  category?: { name?: string };
  inStock?: boolean;
};

const PAGE_SIZE = 12;

const fetchProducts = async (page: number, size: number) => {
  const res = await axios.get(
    `https://iti-react-backend.vercel.app/products/getproducts?page=${page}&size=${size}`
  );
  return (res.data?.data || []) as Product[];
};

const Products: React.FC = () => {
  
const [searchParams] = useSearchParams();
const initialCategory = searchParams.get("category") || "All";

  const [page, setPage] = useState(1);
  const [size] = useState(PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [sort, setSort] = useState<string>("az");
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "out">("all");
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<number>(0);

  React.useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

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

  // get max price dynamically
  React.useEffect(() => {
    if (products.length > 0) {
      const max = Math.max(...products.map((p) => p.price ?? 0));
      setMaxPrice(max);
      setPriceRange(max);
    }
  }, [products]);

  // categories (capitalized)
  const categories = useMemo(() => {
    const names = products
      .map((p) => p.category?.name)
      .filter((n): n is string => !!n)
      .map((n) => n.charAt(0).toUpperCase() + n.slice(1));
    return ["All", ...Array.from(new Set(names))];
  }, [products]);

  // filters, search & sort
  const filtered = useMemo(() => {
    let list = [...products];

    // search
    list = list.filter((p) =>
      p.title.toLowerCase().includes(search.trim().toLowerCase())
    );

    // category (case-insensitive fix ✅)
    if (selectedCategory !== "All") {
      list = list.filter(
        (p) =>
          p.category?.name?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // stock
    if (stockFilter === "in") {
      list = list.filter((p) => p.inStock !== false);
    } else if (stockFilter === "out") {
      list = list.filter((p) => p.inStock === false);
    }

    // price
    list = list.filter((p) => (p.price ?? 0) <= priceRange);

    // sorting
    list.sort((a, b) => {
      const priceA = a.price ?? 0;
      const priceB = b.price ?? 0;
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();

      switch (sort) {
        case "az":
          return titleA.localeCompare(titleB);
        case "za":
          return titleB.localeCompare(titleA);
        case "priceLowHigh":
          return priceA - priceB;
        case "priceHighLow":
          return priceB - priceA;
        default:
          return 0;
      }
    });

    return list;
  }, [products, search, selectedCategory, sort, stockFilter, priceRange]);

  const handleAddToCart = (id: string) => console.log("Add to cart:", id);
  const handleAddToWishlist = (id: string) => console.log("Wishlist:", id);

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
    <>
      <AccessoriesBanner />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title + Search + Sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-64 border rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-lg px-3 py-2 shadow-sm"
            >
              <option value="az">Sort: A → Z</option>
              <option value="za">Sort: Z → A</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="md:col-span-1 hidden md:block">
            <div className="sticky top-20 bg-white p-5 border rounded-xl shadow-sm space-y-6">
              {/* Category */}
              <div>
                <h3 className="font-semibold mb-3 text-lg">Category</h3>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => {
                          setSelectedCategory(cat);
                          setPage(1);
                        }}
                        className={`w-full text-left rounded px-2 py-1 transition ${
                          selectedCategory === cat
                            ? "bg-blue-100 text-blue-700 font-semibold"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stock */}
              <div>
                <h3 className="font-semibold mb-3 text-lg">Availability</h3>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All" },
                    { value: "in", label: "In Stock" },
                    { value: "out", label: "Out of Stock" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="stock"
                        value={opt.value}
                        checked={stockFilter === opt.value}
                        onChange={() =>
                          setStockFilter(opt.value as "all" | "in" | "out")
                        }
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="font-semibold mb-3 text-lg">Max Price</h3>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="text-sm mt-1 text-gray-600">
                  Up to:{" "}
                  <span className="font-semibold text-blue-600">
                    {priceRange} EGP
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
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
            {/* Pagination */}
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((old) => Math.max(1, old - 1))}
                disabled={page === 1 || isFetching}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
      ${
        page === 1 || isFetching
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-white border border-gray-300 hover:bg-green-600 hover:text-white shadow-sm"
      }`}
              >
                ‹ Prev
              </button>

              <div className="flex items-center gap-2">
                {/* show current page */}
                <span className="px-4 py-2 rounded-full bg-green-600 text-white font-semibold shadow">
                  {page}
                </span>
              </div>

              <button
                onClick={() => setPage((old) => old + 1)}
                disabled={products.length < size || isFetching}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
      ${
        products.length < size || isFetching
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-white border border-gray-300 hover:bg-green-600 hover:text-white shadow-sm"
      }`}
              >
                Next ›
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Products;
