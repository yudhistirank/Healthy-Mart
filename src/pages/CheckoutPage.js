import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, ordersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  ShoppingCartIcon, 
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('credit_card');
  const { user, setCartCount } = useAuth();
  const navigate = useNavigate();

  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Kartu Kredit/Debit',
      description: 'Visa, Mastercard, JCB',
      icon: CreditCardIcon
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Bayar dengan akun PayPal',
      icon: DevicePhoneMobileIcon
    },
    {
      id: 'bank_transfer',
      name: 'Transfer Bank',
      description: 'BCA, BRI, Mandiri, BNI',
      icon: BanknotesIcon
    },
    {
      id: 'e_wallet',
      name: 'E-Wallet',
      description: 'GoPay, OVO, DANA, ShopeePay',
      icon: DevicePhoneMobileIcon
    },
    {
      id: 'cash_on_delivery',
      name: 'Bayar di Tempat',
      description: 'Cash on Delivery',
      icon: TruckIcon
    }
  ];

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
      
      if (!response.data.items || response.data.items.length === 0) {
        toast.error('Keranjang masih kosong');
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Gagal memuat keranjang');
      navigate('/cart');
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

  const handleCheckout = async () => {
    if (!selectedPayment) {
      toast.error('Silakan pilih metode pembayaran');
      return;
    }

    setProcessing(true);
    try {
      const response = await ordersAPI.checkout(selectedPayment);
      const order = response.data.order;
      
      toast.success('Checkout berhasil! Silakan lanjutkan pembayaran.');
      
      // Clear cart
      setCartCount(0);
      
      // Redirect to payment page
      navigate(`/payment/${order._id}`);
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Checkout gagal. Silakan coba lagi.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Selesaikan pesanan Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h2>
              
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.product._id} className="flex items-center space-x-4">
                    <img
                      src={item.product.images?.[0] || 'https://via.placeholder.com/60x60?text=No+Image'}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(cart.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Alamat Pengiriman</h2>
              <div className="text-gray-700">
                <p className="font-medium">{user?.username}</p>
                <p>{user?.address}</p>
                <p>{user?.city}</p>
                <p>{user?.contactNumber}</p>
                <p className="text-sm text-gray-600 mt-2">
                  <TruckIcon className="w-4 h-4 inline mr-1" />
                  Pengiriman gratis ke seluruh Indonesia
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Metode Pembayaran</h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedPayment === method.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <div className="ml-3 flex items-center">
                        <method.icon className="w-6 h-6 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-600" />
                Keamanan Transaksi
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Transaksi dilindungi dengan enkripsi SSL 256-bit</p>
                <p>• Data kartu kredit tidak disimpan di server kami</p>
                <p>• Garansi uang kembali 100% jika tidak puas</p>
                <p>• Tim customer service 24/7 siap membantu</p>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={processing}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Memproses...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  Buat Pesanan
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;