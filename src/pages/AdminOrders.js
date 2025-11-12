import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import { Navigate } from 'react-router-dom';
import { TruckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const { user, isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await adminAPI.getOrders();
        setOrders(response.data);
      } catch (error) {
        toast.error('Failed to fetch orders');
        console.error('Error fetching orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const response = await adminAPI.updateOrderShipping(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId ? response.data : order
      ));
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      shipped: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/admin"
              className="flex items-center text-primary-600 hover:text-primary-700 mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Manage and update order shipping status</p>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Total Orders: {orders.length}
            </h2>
          </div>

          {loadingOrders ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {orders.map((order) => (
                <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Customer:</strong> {order.customer?.username || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Email:</strong> {order.customer?.email || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Total:</strong> {formatCurrency(order.total)}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Payment:</strong> {order.paymentMethod}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            <span className="font-medium">{item.name}</span>
                            <span className="mx-2">x{item.quantity}</span>
                            <span className="text-gray-500">{formatCurrency(item.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info & Actions */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Shipping Info</h4>
                      <div className="text-sm text-gray-600 mb-4">
                        <p><strong>Address:</strong> {order.shippingInfo?.address || 'N/A'}</p>
                        <p><strong>City:</strong> {order.shippingInfo?.city || 'N/A'}</p>
                        <p><strong>Contact:</strong> {order.shippingInfo?.contactNumber || 'N/A'}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Update Status:</p>
                        <div className="flex flex-wrap gap-2">
                          {['pending', 'paid', 'shipped', 'cancelled'].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusUpdate(order._id, status)}
                              disabled={updating === order._id || order.status === status}
                              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                order.status === status
                                  ? 'bg-primary-100 text-primary-700 cursor-not-allowed'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {status === 'pending' && 'Pending'}
                              {status === 'paid' && 'Paid'}
                              {status === 'shipped' && 'Shipped'}
                              {status === 'cancelled' && 'Cancelled'}
                            </button>
                          ))}
                        </div>
                        {updating === order._id && (
                          <p className="text-xs text-gray-500 flex items-center">
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-primary-600 mr-2"></div>
                            Updating...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;