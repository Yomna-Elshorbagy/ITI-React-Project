import React, { useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../Components/ProductCard/ProductCard";
import AccessoriesBanner from "../../Components/AccessoriesBanner/AccessoriesBanner";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../Store/Slices/WishlistSlice";
import { Filter, X } from "lucide-react";
import { useAppSelector } from "../../Hooks/reduxHooks";
import type { AppDispatch } from "../../Store/store";

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

const fetchProducts = async (page: number, size: number): Promise<Product[]> => {
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
  const discountFilter = searchParams.get("filter");
  const [sort, setSort] = useState<string>("az");
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "out">("all");
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["products", page, size],
    queryFn: () => fetchProducts(page, size),
    staleTime: 1000 * 60 * 2,
  });

  React.useEffect(() => {
    if (products.length > 0) {
      const max = Math.max(...products.map((p) => p.price ?? 0));
      setMaxPrice(max);
      setPriceRange(max);
    }
  }, [products]);

  const categories = useMemo<string[]>(() => {
    const names = products
      .map((p: Product) => p.category?.name)
      .filter((n): n is string => !!n)
      .map((n: string) => n.charAt(0).toUpperCase() + n.slice(1));
    return ["All", ...Array.from(new Set(names))];
  }, [products]);

  const filtered = useMemo<Product[]>(() => {
    let list = [...products];

    list = list.filter((p) =>
      p.title.toLowerCase().includes(search.trim().toLowerCase())
    );

    if (selectedCategory !== "All") {
      list = list.filter(
        (p) =>
          p.category?.name?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (stockFilter === "in") {
      list = list.filter((p) => p.inStock !== false);
    } else if (stockFilter === "out") {
      list = list.filter((p) => p.inStock === false);
    }

    list = list.filter((p) => (p.price ?? 0) <= priceRange);

    if (discountFilter === "discounted") {
      list = list.filter(
        (p) => p.finalPrice && p.price && p.finalPrice < p.price
      );
    }

    list.sort((a: Product, b: Product) => {
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
  }, [
    products,
    search,
    selectedCategory,
    sort,
    stockFilter,
    priceRange,
    discountFilter,
  ]);

  const dispatch = useDispatch<AppDispatch>();
  const wishlist = useAppSelector((state) => state.wishlist.items);
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = (id: string) => console.log("Add to cart:", id);

  const handleAddToWishlist = async (id: string) => {
    await dispatch(addToWishlist(id)).unwrap();
    setShowModal(true);
    setTimeout(() => setShowModal(false), 1500);
  };

  const handleRemoveFromWishlist = async (id: string) => {
    await dispatch(removeFromWishlist(id)).unwrap();
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
      <AccessoriesBanner />

      {showModal && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-[#2e5339]/90 font-serif text-[#d4a762] px-6 py-3 rounded-full shadow-lg text-sm font-medium animate-bounce">
            Added to wishlist!
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10 relative">
        {/* Sidebar Burger Button - Mobile */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-20 left-4 z-40 p-2 bg-[#4f6f52] text-white rounded-lg shadow-lg"
        >
          <Filter size={22} />
        </button>

        {/* Sidebar Slide Panel - Mobile */}
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 z-50 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
        >
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold dark:text-white">Filters</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={22} className="text-gray-700 dark:text-gray-200" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-full pb-20">
            <FiltersSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              stockFilter={stockFilter}
              setStockFilter={setStockFilter}
              maxPrice={maxPrice}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block md:col-span-1">
            <FiltersSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              stockFilter={stockFilter}
              setStockFilter={setStockFilter}
              maxPrice={maxPrice}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </aside>

          {/* Products */}
          <section className="md:col-span-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <h1 className="text-2xl font-bold tracking-tight text-[color:var(--color-text)]">
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
                  className="w-full sm:w-64 border border-[color:var(--color-border)] rounded-lg px-4 py-2 shadow-sm bg-[color:var(--color-surface)] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/30"
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-[color:var(--color-border)] rounded-lg px-3 py-2 shadow-sm bg-[color:var(--color-surface)] text-[color:var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/30"
                >
                  <option value="az">Sort: A → Z</option>
                  <option value="za">Sort: Z → A</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                </select>
              </div>
            </div>

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
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                    isInWishlist={wishlist.some(
                      (item: any) => item._id === p._id
                    )}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Products;

// ✅ Filters Sidebar Component
type FiltersProps = {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  stockFilter: "all" | "in" | "out";
  setStockFilter: (v: "all" | "in" | "out") => void;
  maxPrice: number;
  priceRange: number;
  setPriceRange: (v: number) => void;
};

const FiltersSidebar: React.FC<FiltersProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  stockFilter,
  setStockFilter,
  maxPrice,
  priceRange,
  setPriceRange,
}) => (
  <div className="space-y-8">
    {/* Category Filter */}
    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition p-5 border border-gray-100 dark:border-gray-700 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#4f6f52] rounded-t-2xl"></div>
      <h3 className="text-lg font-semibold mb-4 text-[#2e4d3e] dark:text-white tracking-wide">
        Categories
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full border text-sm transition ${
              selectedCategory === cat
                ? "bg-[#4f6f52] text-white border-[#4f6f52] shadow-sm"
                : "border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>

    {/* Stock Filter */}
    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition p-5 border border-gray-100 dark:border-gray-700 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#4f6f52] rounded-t-2xl"></div>
      <h3 className="text-lg font-semibold mb-4 text-[#2e4d3e] dark:text-white tracking-wide">
        Availability
      </h3>
      <div className="space-y-3">
        {[
          { value: "all", label: "All" },
          { value: "in", label: "In Stock" },
          { value: "out", label: "Out of Stock" },
        ].map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-3 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-[#2e4d3e] dark:hover:text-white transition"
          >
            <input
              type="radio"
              name="stock"
              value={opt.value}
              checked={stockFilter === opt.value}
              onChange={() => setStockFilter(opt.value as any)}
              className="text-[#4f6f52] focus:ring-[#4f6f52] accent-[#4f6f52]"
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Price Filter */}
    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition p-5 border border-gray-100 dark:border-gray-700 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#4f6f52] rounded-t-2xl"></div>
      <h3 className="text-lg font-semibold mb-4 text-[#2e4d3e] dark:text-white tracking-wide">
        Price Range
      </h3>
      <div className="flex flex-col gap-4">
        <input
          type="range"
          min={0}
          max={maxPrice}
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-[#4f6f52] cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>0 EGP</span>
          <span className="font-semibold text-[#2e4d3e] dark:text-white">
            {priceRange} EGP
          </span>
        </div>
      </div>
    </div>
  </div>
);
