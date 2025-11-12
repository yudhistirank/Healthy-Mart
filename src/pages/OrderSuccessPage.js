import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  CheckCircleIcon,
  DocumentArrowDownIcon,
  HomeIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
    
    fetchOrder();
  }, [orderId, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generatePDFReceipt = async () => {
    try {
      setGeneratingPDF(true);
      
      const response = await ordersAPI.downloadReceiptPDF(orderId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `struk-pembayaran-${order._id.substring(0, 8).toUpperCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Struk PDF berhasil didownload!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Gagal mendownload struk PDF');
    } finally {
      setGeneratingPDF(false);
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pembayaran Berhasil!
          </h1>
          <p className="text-lg text-gray-600">
            Terima kasih atas pembelian Anda. Pesanan Anda sedang diproses.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Detail Pesanan
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm text-gray-600">Nomor Pesanan</label>
                  <p className="font-semibold text-gray-900">
                    #{order._id?.substring(0, 8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Tanggal Pesanan</label>
                  <p className="font-semibold text-gray-900">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <span className="badge badge-success">
                    {order.status === 'paid' ? 'Lunas' : order.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Metode Pembayaran</label>
                  <p className="font-semibold text-gray-900 capitalize">
                    {order.paymentMethod.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Items yang Dibeli
              </h3>
              
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.product._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ShoppingBagIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
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
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ringkasan Pembayaran
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ongkir</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <DocumentArrowDownIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Struk Digital
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Download struk pembayaran Anda sebagai PDF
                </p>
                <button
                  onClick={generatePDFReceipt}
                  disabled={generatingPDF}
                  className="w-full btn-primary text-sm py-2 disabled:opacity-50"
                >
                  {generatingPDF ? 'Generate PDF...' : 'Download Struk PDF'}
                </button>
              </div>

              <div className="space-y-3">
                <Link
                  to="/home"
                  className="w-full btn-primary py-3 text-center block"
                >
                  <div className="flex items-center justify-center">
                    <HomeIcon className="w-5 h-5 mr-2" />
                    Kembali ke Beranda
                  </div>
                </Link>
                
                <Link
                  to="/products"
                  className="w-full btn-secondary py-3 text-center block"
                >
                  Lanjut Belanja
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;