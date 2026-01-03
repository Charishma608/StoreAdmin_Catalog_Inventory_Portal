import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react';

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

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [similarError, setSimilarError] = useState<string | null>(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch similar products when product data is loaded
  useEffect(() => {
    if (product) {
      const fetchSimilarProducts = async () => {
        try {
          setLoadingSimilar(true);
          const response = await fetch(
            `https://dummyjson.com/products/category/${product.category}?limit=7`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch similar products');
          }
          
          const data = await response.json();
          // Filter out the current product and limit to 6 items
          setSimilarProducts(
            data.products.filter((p: Product) => p.id !== product.id).slice(0, 6)
          );
        } catch (err) {
          setSimilarError(err instanceof Error ? err.message : 'Failed to load similar products');
        } finally {
          setLoadingSimilar(false);
        }
      };

      fetchSimilarProducts();
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Inventory
        </button>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {product.brand} • {product.category}
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                  <img
                    src={product.images[currentImageIndex] || product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`rounded-md overflow-hidden ${
                        currentImageIndex === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} - ${index + 1}`}
                        className="h-20 w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-6 lg:mt-0 lg:pl-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                    {product.discountPercentage > 0 && (
                      <div className="mt-1">
                        <span className="text-sm text-gray-500 line-through mr-2">
                          ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {Math.round(product.discountPercentage)}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-gray-700">
                      {product.rating.toFixed(1)}/5.0
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span
                      className={`text-sm ${
                        product.stock > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">Description</h3>
                  <div className="mt-2 text-gray-600 space-y-3">
                    <p>{product.description}</p>
                    <p>
                      <span className="font-medium">Brand:</span> {product.brand}
                    </p>
                    <p>
                      <span className="font-medium">Category:</span>{' '}
                      <span className="capitalize">{product.category}</span>
                    </p>
                    <p>
                      <span className="font-medium">Available Stock:</span> {product.stock} units
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex space-x-4">
                  <button
                    type="button"
                    className="flex-1 bg-blue-600 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ShoppingCart className="h-5 w-5 inline mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      {product && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Similar Products</h2>
          {loadingSimilar ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : similarError ? (
            <p className="text-red-500 text-center py-4">{similarError}</p>
          ) : similarProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {similarProducts.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/products/${item.id}`)}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1"
                >
                  <div className="h-32 w-full overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2" title={item.title}>
                      {item.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">
                        ${item.price.toFixed(2)}
                      </p>
                      {item.rating > 4.5 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
                          Top
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No similar products found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
