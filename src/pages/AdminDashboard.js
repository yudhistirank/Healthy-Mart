import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import { Navigate } from 'react-router-dom';
import {
  UsersIcon,
  BookOpenIcon,
  TagIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const [stats, setStats] = useState({
    customers: 0,
    guestbook: 0,
    categories: 0,
    products: 0,
    orders: 0,
    totalRevenue: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customersRes, guestbookRes, categoriesRes, productsRes, ordersRes] = await Promise.all([
          adminAPI.getCustomers(),
          adminAPI.getGuestbookEntries(),
          adminAPI.getCategories(),
          adminAPI.getProducts(),
          adminAPI.getOrders()
        ]);

        // Calculate total revenue from completed orders
        const totalRevenue = ordersRes.data
          .filter(order => order.status === 'completed')
          .reduce((sum, order) => sum + (order.total || 0), 0);

        setStats({
          customers: customersRes.data.length,
          guestbook: guestbookRes.data.length,
          categories: categoriesRes.data.length,
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          totalRevenue: totalRevenue
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

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

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.customers,
      icon: UsersIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Guestbook Entries',
      value: stats.guestbook,
      icon: BookOpenIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: TagIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Products',
      value: stats.products,
      icon: CubeIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Orders',
      value: stats.orders,
      icon: ShoppingCartIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Revenue',
      value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.username}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div key={index} className={`${card.bgColor} rounded-lg p-6 border border-gray-200`}>
              <div className="flex items-center">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>
                    {loadingStats ? '...' : card.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/admin/customers"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Manage Customers</h3>
                  <p className="text-sm text-gray-600">View and delete customer accounts</p>
                </div>
              </a>
              
              <a
                href="/admin/guestbook"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookOpenIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Manage Guestbook</h3>
                  <p className="text-sm text-gray-600">Review guestbook entries</p>
                </div>
              </a>
              
              <a
                href="/admin/categories"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <TagIcon className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Manage Categories</h3>
                  <p className="text-sm text-gray-600">Add, edit, and delete categories</p>
                </div>
              </a>
              
              <a
                href="/admin/products"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CubeIcon className="h-8 w-8 text-indigo-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Manage Products</h3>
                  <p className="text-sm text-gray-600">Add, edit, and manage product inventory</p>
                </div>
              </a>
              
              <a
                href="/admin/orders"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShoppingCartIcon className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Manage Orders</h3>
                  <p className="text-sm text-gray-600">Update order shipping status</p>
                </div>
              </a>
              
              <a
                href="/admin/orders"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CurrencyDollarIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Revenue Analytics</h3>
                  <p className="text-sm text-gray-600">View detailed revenue reports</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;