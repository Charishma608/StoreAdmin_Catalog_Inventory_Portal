import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  Star,
  AlertCircle,
} from 'lucide-react';

/* =====================
   Types
===================== */
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface Category {
  slug: string;
  name: string;
}

/* =====================
   Constants
===================== */
const ITEMS_PER_PAGE = 20;

/* =====================
   Debounce Hook
===================== */
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
};

/* =====================
   Component
===================== */
const InventoryPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: 'asc' | 'desc';
  } | null>(null);

  /* =====================
     Fetch Categories 
  ===================== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products/categories');
        const data = await res.json();

        const normalized: Category[] = data.map((cat: any) => {
          if (typeof cat === 'string') {
            return {
              slug: cat,
              name: cat.replace(/-/g, ' '),
            };
          }

          return {
            slug: cat.slug ?? cat.name,
            name: cat.name ?? cat.slug,
          };
        });

        setCategories(normalized);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    fetchCategories();
  }, []);

  /* =====================
     Fetch Products
  ===================== */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const skip = (currentPage - 1) * ITEMS_PER_PAGE;
      let url = '';

      if (selectedCategory !== 'all') {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(
          selectedCategory
        )}?limit=${ITEMS_PER_PAGE}&skip=${skip}`;
      } else if (debouncedSearchTerm) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(
          debouncedSearchTerm
        )}&limit=${ITEMS_PER_PAGE}&skip=${skip}`;
      } else {
        url = `https://dummyjson.com/products?limit=${ITEMS_PER_PAGE}&skip=${skip}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');

      const data = await res.json();
      setProducts(data.products);
      setTotalProducts(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* =====================
     Sorting
  ===================== */
  const sortedProducts = useMemo(() => {
    if (!sortConfig) return products;

    return [...products].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [products, sortConfig]);

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  /* =====================
     States
  ===================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  /* =====================
     UI
  ===================== */
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Inventory Overview</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              className="pl-10 pr-3 py-2 border rounded-md"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-md capitalize"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortConfig ? `${sortConfig.key}-${sortConfig.direction}` : ''}
            onChange={(e) => {
              const [key, direction] = e.target.value.split('-');
              if (key && direction) {
                setSortConfig({
                  key: key as keyof Product,
                  direction: direction as 'asc' | 'desc',
                });
              } else {
                setSortConfig(null);
              }
            }}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">Sort by</option>
            <option value="title-asc">Name (A–Z)</option>
            <option value="title-desc">Name (Z–A)</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Brand</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Rating</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={p.thumbnail}
                      className="h-10 w-10 rounded object-cover"
                      alt={p.title}
                    />
                    {p.title}
                  </td>
                  <td className="px-6 py-4">{p.brand}</td>
                  <td className="px-6 py-4 capitalize">{p.category}</td>
                  <td className="px-6 py-4">${p.price}</td>
                  <td className="px-6 py-4">{p.stock}</td>
                  <td className="px-6 py-4 flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                    {p.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft /> Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
