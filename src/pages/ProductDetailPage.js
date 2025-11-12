import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsAPI, cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Produk tidak ditemukan');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await cartAPI.addToCart(id, quantity);
      toast.success(`${quantity} produk berhasil ditambahkan ke keranjang`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Gagal menambahkan ke keranjang');
    } finally {
      setAddingToCart(false);
    }
  };

  const updateQuantity = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 999)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produk tidak ditemukan</h1>
          <Link to="/products" className="btn-primary">
            Kembali ke Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/products" className="text-gray-600 hover:text-primary-600">
              Produk
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{product.category?.name}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500 truncate">{product.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/600x600?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="badge badge-primary">
                  {product.category?.name || 'Kategori'}
                </span>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(4.0)</span>
                </div>
                <span className="text-sm text-gray-600">100+ reviews</span>
              </div>
              
              <div className="text-4xl font-bold text-primary-600 mb-6">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Produk</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'Deskripsi produk tidak tersedia.'}
              </p>
            </div>

            {/* Stock Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm text-gray-600">
                  Stok: {product.stock || 0} tersedia
                </span>
              </div>
              <div className="flex items-center">
                <TruckIcon className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm text-gray-600">Gratis Ongkir</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Jumlah</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(quantity + 1)}
                    disabled={quantity >= (product.stock || 999)}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Maksimal: {product.stock || 0}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !product.stock}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Menambahkan...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    Tambah ke Keranjang
                  </div>
                )}
              </button>
              
              <Link
                to="/cart"
                className="w-full btn-secondary py-3 text-lg text-center block"
              >
                Lihat Keranjang
              </Link>
            </div>

            {/* Features */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Keunggulan Produk
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center">
                  <ShieldCheckIcon className="w-4 h-4 text-green-600 mr-2" />
                  Produk original dan berkualitas
                </li>
                <li className="flex items-center">
                  <TruckIcon className="w-4 h-4 text-blue-600 mr-2" />
                  Pengiriman cepat dan aman
                </li>
                <li className="flex items-center">
                  <HeartIcon className="w-4 h-4 text-red-600 mr-2" />
                  Garansi kepuasan pelanggan
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Kembali ke Produk
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;