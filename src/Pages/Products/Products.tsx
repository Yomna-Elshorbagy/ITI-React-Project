import React, { useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../Components/ProductCard/ProductCard";
import PromoBanner from "../../components/PromoBanner/PromoBanner";

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
  const [page, setPage] = useState(1);
  const [size] = useState(PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sort, setSort] = useState<string>("az");
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "out">("all");
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<number>(0);

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

  // Get max price dynamically
  React.useEffect(() => {
    if (products.length > 0) {
      const max = Math.max(...products.map((p) => p.price ?? 0));
      setMaxPrice(max);
      setPriceRange(max);
    }
  }, [products]);

  // derive categories from data
  const categories = useMemo(() => {
    const names = products
      .map((p) => p.category?.name)
      .filter((n): n is string => !!n)
      .map((n) => n.charAt(0).toUpperCase() + n.slice(1));
    return ["All", ...Array.from(new Set(names))];
  }, [products]);

  // local filtering + search + sorting
  const filtered = useMemo(() => {
    let list = [...products];

    // Search
    list = list.filter((p) =>
      p.title.toLowerCase().includes(search.trim().toLowerCase())
    );

    // Category
    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category?.name === selectedCategory);
    }

    // Stock filter
    if (stockFilter === "in") {
      list = list.filter((p) => p.inStock !== false);
    } else if (stockFilter === "out") {
      list = list.filter((p) => p.inStock === false);
    }

    // Price filter
    list = list.filter((p) => (p.price ?? 0) <= priceRange);

    // Sorting
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

  const handleAddToCart = (id: string) => {
    console.log("Add to cart:", id);
  };

  const handleAddToWishlist = (id: string) => {
    console.log("Add to wishlist:", id);
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
    <>
      <PromoBanner />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          {/* ✅ Dynamic Title */}
          <h1 className="text-2xl font-bold">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
          </h1>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-64 border rounded px-4 py-2 focus:outline-none focus:ring"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="az">Sort: A → Z</option>
              <option value="za">Sort: Z → A</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1 hidden md:block">
            <div className="sticky top-20 bg-white p-4 border rounded space-y-6">
              {/* Category */}
              <div>
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

              {/* Stock Filter */}
              <div>
                <h3 className="font-semibold mb-3">Availability</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stock"
                      value="all"
                      checked={stockFilter === "all"}
                      onChange={() => setStockFilter("all")}
                    />
                    <span>All</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stock"
                      value="in"
                      checked={stockFilter === "in"}
                      onChange={() => setStockFilter("in")}
                    />
                    <span>In Stock</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stock"
                      value="out"
                      checked={stockFilter === "out"}
                      onChange={() => setStockFilter("out")}
                    />
                    <span>Out of Stock</span>
                  </label>
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-semibold mb-3">Max Price</h3>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm mt-1 text-gray-600">
                  Up to: <span className="font-semibold">{priceRange} EGP</span>
                </div>
              </div>
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
    </>
  );
};

export default Products;
