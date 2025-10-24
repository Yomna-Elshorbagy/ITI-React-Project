interface Product {
  _id: string;
  title: string;
  stock: number;
  category?: string | { name?: string };
}

interface FilterCriteria {
  category?: string;
  searchId?: string;
  searchName?: string;
  searchStock?: string;
}

export const filterProducts = (
  products: Product[],
  { category, searchId, searchName, searchStock }: FilterCriteria
): Product[] => {
  return products
    ?.filter((p) =>
      category
        ? (typeof p.category === "string"
            ? p.category.toLowerCase() === category.toLowerCase()
            : p.category?.name?.toLowerCase() === category.toLowerCase())
        : true
    )
    ?.filter((p) =>
      searchId ? p._id?.toLowerCase().includes(searchId.toLowerCase()) : true
    )
    ?.filter((p) =>
      searchName ? p.title?.toLowerCase().includes(searchName.toLowerCase()) : true
    )
    ?.filter((p) =>
      searchStock ? p.stock?.toString().includes(searchStock) : true
    );
};
