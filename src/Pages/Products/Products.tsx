import React, { useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../Components/ProductCard/ProductCard";
import AccessoriesBanner from "../../Components/AccessoriesBanner/AccessoriesBanner";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../Store/store"; 
import { addToWishlist, removeFromWishlist } from "../../Store/Slices/WishlistSlice";
import { useSelector } from "react-redux";

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
 //Wishlist
  const dispatch = useDispatch<AppDispatch>();
  const wishlist = useSelector((state: any) => state.wishlist.items);
  const [showModal, setShowModal] = useState(false);
  const handleAddToWishlist = async (id: string) => {
  await dispatch(addToWishlist(id));
  setShowModal(true);
  setTimeout(() => setShowModal(false), 1500);
};

const handleRemoveFromWishlist = async (id: string) => {
  await dispatch(removeFromWishlist(id));
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
      {/* wishlist Modal*/}
   {showModal && (
  <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
    <div className="bg-[#2e5339]/90 font-serif text-[#d4a762] px-6 py-3 rounded-full shadow-lg text-sm font-medium animate-bounce">
       Added to wishlist!
    </div>
  </div>
   )}

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Title + Search + Sort */}
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="md:col-span-1 hidden md:block">
            <div className="sticky top-20 p-5 border border-[color:var(--color-border)] rounded-xl shadow-sm space-y-6 bg-[color:var(--color-surface)]/80 backdrop-blur elevate-soft">
              {/* Category */}
              <div>
                <h3 className="font-semibold mb-3 text-lg text-[color:var(--color-text)]">
                  Category
                </h3>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => {
                          setSelectedCategory(cat);
                          setPage(1);
                        }}
                        className={`w-full text-left rounded-md px-3 py-2 transition border ${
                          selectedCategory === cat
                            ? "bg-[color:var(--color-accent)]/40 border-[color:var(--color-primary)]/30 text-[color:var(--color-text)] font-semibold"
                            : "border-transparent hover:bg-[color:var(--color-bg)] text-[color:var(--color-text)]"
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
                <h3 className="font-semibold mb-3 text-lg text-[color:var(--color-text)]">
                  Availability
                </h3>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All" },
                    { value: "in", label: "In Stock" },
                    { value: "out", label: "Out of Stock" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 cursor-pointer text-[color:var(--color-text)]"
                    >
                      <input
                        type="radio"
                        name="stock"
                        value={opt.value}
                        checked={stockFilter === opt.value}
                        onChange={() =>
                          setStockFilter(opt.value as "all" | "in" | "out")
                        }
                        className="accent-[color:var(--color-primary)]"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="font-semibold mb-3 text-lg text-[color:var(--color-text)]">
                  Max Price
                </h3>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[color:var(--color-primary)]"
                />
                <div className="text-sm mt-1 text-[color:var(--color-text-muted)]">
                  Up to:{" "}
                  <span className="font-semibold text-[color:var(--color-primary)]">
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
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                    isInWishlist={wishlist.some((item: any) => item._id === p._id)}
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  page === 1 || isFetching
                    ? "bg-[color:var(--color-border)] text-gray-400 cursor-not-allowed"
                    : "bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-primary)] hover:text-white shadow-sm"
                }`}
              >
                ‹ Prev
              </button>

              <div className="flex items-center gap-2">
                {/* show current page */}
                <span className="px-4 py-2 rounded-full bg-[color:var(--color-primary)] text-white font-semibold shadow">
                  {page}
                </span>
              </div>

              <button
                onClick={() => setPage((old) => old + 1)}
                disabled={products.length < size || isFetching}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  products.length < size || isFetching
                    ? "bg-[color:var(--color-border)] text-gray-400 cursor-not-allowed"
                    : "bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-primary)] hover:text-white shadow-sm"
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
