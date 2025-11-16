import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI, cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  ShoppingCartIcon,
  StarIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);
  const { user, setCartCount } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchCategories();
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    if (category) setSelectedCategory(category);
    if (q) setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, sortBy, priceRange]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 100,
        page: 1
      };
      
      if (searchQuery) params.q = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await productsAPI.getProducts(params);
      let productsList = response.data.products || [];
      
      // Filter by price range
      productsList = productsList.filter(product =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );
      
      // Sort products
      productsList.sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
      
      setProducts(productsList);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    setCartLoading(prev => ({ ...prev, [productId]: true }));
    try {
      await cartAPI.addToCart(productId, 1);
      toast.success('Produk berhasil ditambahkan ke keranjang');
      
      // Update cart count
      const cartResponse = await cartAPI.getCart();
      const cartCount = cartResponse.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(cartCount);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Gagal menambahkan ke keranjang');
    } finally {
      setCartLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([0, 1000000]);
    setSortBy('name');
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Categories and Filters */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSearchParams(prev => {
                        prev.delete('category');
                        return prev;
                      });
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !selectedCategory 
                        ? 'bg-primary-100 text-primary-800' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Semua Kategori
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => {
                        setSelectedCategory(category._id);
                        const params = new URLSearchParams(searchParams);
                        params.set('category', category._id);
                        setSearchParams(params);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category._id 
                          ? 'bg-primary-100 text-primary-800' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rentang Harga</h3>
                <div className="space-y-3">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatPrice(0)}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full text-sm text-gray-600 hover:text-gray-800 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hapus Filter
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Produk Kesehatan'}
                </h1>
                <p className="text-gray-600">
                  {products.length} produk ditemukan
                </p>
              </div>
              
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="name">Urutkan Nama</option>
                  <option value="price-low">Harga Terendah</option>
                  <option value="price-high">Harga Tertinggi</option>
                </select>
              </div>
            </div>

            {/* Products Grid - 3 Columns */}
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCartIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada produk</h3>
                <p className="text-gray-600">Coba ubah filter atau kata kunci pencarian Anda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="card group">
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.stock <= 5 && (
                        <div className="absolute top-3 left-3">
                          <span className="badge-danger">Stok Terbatas</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">(4.0)</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-primary-600">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Stok: {product.stock}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="flex-1 btn-secondary text-sm py-2 text-center"
                        >
                          Lihat Detail
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          disabled={cartLoading[product._id] || product.stock === 0}
                          className="flex-1 btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cartLoading[product._id] ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <ShoppingCartIcon className="w-4 h-4 mr-1" />
                              Beli
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;