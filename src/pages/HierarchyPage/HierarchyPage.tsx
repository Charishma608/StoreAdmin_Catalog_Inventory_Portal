import { useEffect, useState } from 'react';
import { ChevronRight, Grid, List, ArrowLeft, Package } from 'lucide-react';

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
  count: number;
  thumbnail?: string;
}

const HierarchyPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState({ categories: false, products: false });
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  /* ===========================
      Fetch Categories
     =========================== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(prev => ({ ...prev, categories: true }));
        setError(null);

        const res = await fetch('https://dummyjson.com/products/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');

        const data = await res.json();

        const categoriesWithMeta: Category[] = await Promise.all(
          data.map(async (item: any) => {
            const slug =
              typeof item === 'string'
                ? item
                : item.slug || item.name;

            const name =
              typeof item === 'string'
                ? item.replace(/-/g, ' ')
                : item.name || item.slug;

            const productRes = await fetch(
              `https://dummyjson.com/products/category/${encodeURIComponent(slug)}`
            );
            const productData = await productRes.json();

            return {
              slug,
              name,
              count: productData.products?.length ?? 0,
              thumbnail: productData.products?.[0]?.thumbnail,
            };
          })
        );

        setCategories(categoriesWithMeta);
      } catch (err) {
        console.error(err);
        setError('Failed to load categories.');
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }
    };

    fetchCategories();
  }, []);

  /* ===========================
      Fetch Products
     =========================== */
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchProducts = async () => {
      try {
        setLoading(prev => ({ ...prev, products: true }));
        setError(null);

        const res = await fetch(
          `https://dummyjson.com/products/category/${encodeURIComponent(
            selectedCategory.slug
          )}`
        );
        if (!res.ok) throw new Error('Failed to fetch products');

        const data = await res.json();

        setProducts(
          data.products.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            price: p.price,
            discountPercentage: p.discountPercentage,
            rating: p.rating,
            stock: p.stock,
            brand: p.brand,
            category: p.category,
            thumbnail: p.thumbnail,
            images: p.images ?? [],
          }))
        );
      } catch (err) {
        console.error(err);
        setError('Failed to load products.');
      } finally {
        setLoading(prev => ({ ...prev, products: false }));
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  /* ===========================
      STATES
     =========================== */
  if (loading.categories && categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading categories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          {selectedCategory ? (
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedCategory(null)}>
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold capitalize">
                  {selectedCategory.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {products.length} products
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold">Product Categories</h1>
              <p className="text-sm text-gray-500">
                Browse inventory by category
              </p>
            </div>
          )}

          {!selectedCategory && (
            <div className="flex gap-2 bg-white border rounded p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : ''
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : ''
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* CONTENT */}
        {selectedCategory ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="bg-white rounded shadow hover:shadow-md"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-48 w-full object-contain p-4"
                />
                <div className="p-4">
                  <h3 className="font-medium line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-2 flex justify-between">
                    <span className="font-bold">${product.price}</span>
                    <span className="text-sm text-gray-500">
                      ⭐ {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <div
                key={category.slug}
                onClick={() => setSelectedCategory(category)}
                className="bg-white rounded shadow hover:shadow-md cursor-pointer"
              >
                {category.thumbnail ? (
                  <img
                    src={category.thumbnail}
                    alt={category.name}
                    className="h-40 w-full object-contain p-4"
                  />
                ) : (
                  <div className="h-40 bg-gray-100 flex items-center justify-center">
                    <Package className="h-10 w-10 text-gray-400" />
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-medium capitalize">{category.name}</h3>
                  <p className="text-sm text-gray-500">
                    {category.count} products
                  </p>
                  <div className="mt-2 flex items-center text-blue-600">
                    View products <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="bg-white rounded shadow divide-y">
            {categories.map(category => (
              <li
                key={category.slug}
                onClick={() => setSelectedCategory(category)}
                className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              >
                <div>
                  <p className="font-medium capitalize">{category.name}</p>
                  <p className="text-sm text-gray-500">
                    {category.count} products
                  </p>
                </div>
                <ChevronRight className="text-gray-400" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HierarchyPage;
