import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  ShoppingCartIcon, 
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const { setCartCount } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
      
      // Update cart count
      const cartCount = response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(cartCount);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Gagal memuat keranjang');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setUpdating(prev => ({ ...prev, [productId]: true }));
    try {
      await cartAPI.updateCartItem(productId, newQuantity);
      await fetchCart();
      toast.success('Keranjang berhasil diperbarui');
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error('Gagal memperbarui keranjang');
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId) => {
    setUpdating(prev => ({ ...prev, [productId]: true }));
    try {
      await cartAPI.removeFromCart(productId);
      await fetchCart();
      toast.success('Produk berhasil dihapus dari keranjang');
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast.error('Gagal menghapus produk');
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      await fetchCart();
      toast.success('Keranjang berhasil dikosongkan');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Gagal mengosongkan keranjang');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const handleCheckout = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error('Keranjang masih kosong');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBagIcon className="mx-auto h-24 w-24 text-gray-400" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Keranjang Kosong</h2>
            <p className="mt-2 text-lg text-gray-600">
              Anda belum menambahkan produk apapun ke keranjang.
            </p>
            <div className="mt-8">
              <Link
                to="/products"
                className="btn-primary text-lg px-8 py-3"
              >
                Mulai Belanja
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
          <button
            onClick={clearCart}
            className="text-sm text-gray-600 hover:text-red-600 flex items-center"
          >
            <TrashIcon className="w-4 h-4 mr-1" />
            Kosongkan Keranjang
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Daftar Produk ({cart.items.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <div key={item.product._id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.images?.[0] || 'https://via.placeholder.com/80x80?text=No+Image'}
                          alt={item.product.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.product.category?.name || 'Kategori tidak tersedia'}
                        </p>
                        <p className="text-lg font-semibold text-primary-600 mt-2">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            disabled={updating[item.product._id]}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                            {updating[item.product._id] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mx-auto"></div>
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            disabled={updating[item.product._id] || item.quantity >= item.product.stock}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.product._id)}
                          disabled={updating[item.product._id]}
                          className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Ringkasan Pesanan
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya Pengiriman</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pajak</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(cart.total)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full btn-primary py-3 text-lg mt-6"
              >
                <div className="flex items-center justify-center">
                  <span>Lanjut ke Pembayaran</span>
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </div>
              </button>
              
              <Link
                to="/products"
                className="block w-full text-center text-primary-600 hover:text-primary-700 font-medium py-2 mt-3"
              >
                Lanjut Belanja
              </Link>
              
              {/* Security Features */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center">
                    <ShoppingCartIcon className="w-4 h-4 mr-2 text-green-600" />
                    <span>Transaksi aman dan terpercaya</span>
                  </div>
                  <div className="flex items-center">
                    <TrashIcon className="w-4 h-4 mr-2 text-green-600" />
                    <span>Garansi uang kembali</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;