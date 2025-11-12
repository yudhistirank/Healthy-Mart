import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  CheckCircleIcon,
  CreditCardIcon,
  BanknotesIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const PaymentPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrder(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Pesanan tidak ditemukan');
      navigate('/home');
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

  const processPayment = async () => {
    setProcessing(true);
    try {
      const paymentData = {
        paymentMethod: order.paymentMethod,
        paymentDetails: {}
      };

      await ordersAPI.processPayment(orderId, paymentData);
      
      toast.success('Pembayaran berhasil!');
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Pembayaran gagal. Silakan coba lagi.');
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

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pesanan tidak ditemukan</h1>
          <Link to="/home" className="btn-primary">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pembayaran</h1>
          <p className="text-gray-600 mt-2">
            Pesanan #{order._id?.substring(0, 8).toUpperCase()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <CreditCardIcon className="w-6 h-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Detail Pembayaran</h2>
              </div>
              
              <div className="text-center p-8 bg-green-50 rounded-lg">
                <BanknotesIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pembayaran Simulasi</h3>
                <p className="text-gray-600 mb-4">
                  Ini adalah simulasi pembayaran. Klik tombol di bawah untuk melanjutkan.
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={processPayment}
                  disabled={processing}
                  className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Memproses Pembayaran...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Konfirmasi Pembayaran
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Ringkasan Pesanan
              </h2>
              
              <div className="space-y-4 mb-6">
                {order.items?.map((item) => (
                  <div key={item.product._id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {item.quantity}x
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="text-primary-600 font-bold text-lg">
                      {formatPrice(order.total)}
                    </span>
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

export default PaymentPage;