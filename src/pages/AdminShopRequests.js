import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import { Navigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminShopRequests = () => {
  const { user, isAdmin, loading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await adminAPI.getShopRequests();
        setRequests(response.data);
      } catch (error) {
        toast.error('Failed to fetch shop requests');
        console.error('Error fetching shop requests:', error);
      } finally {
        setLoadingRequests(false);
      }
    };

    if (isAdmin) {
      fetchRequests();
    }
  }, [isAdmin]);

  const handleApproveRequest = async (requestId, vendorName) => {
    if (!window.confirm(`Are you sure you want to approve the shop request from "${vendorName}"?`)) {
      return;
    }

    setUpdating(requestId);
    try {
      const response = await adminAPI.approveShopRequest(requestId);
      setRequests(requests.map(req => 
        req._id === requestId ? response.data : req
      ));
      toast.success('Shop request approved successfully');
    } catch (error) {
      toast.error('Failed to approve shop request');
      console.error('Error approving shop request:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRejectRequest = async (requestId, vendorName) => {
    if (!window.confirm(`Are you sure you want to reject the shop request from "${vendorName}"?`)) {
      return;
    }

    setUpdating(requestId);
    try {
      const response = await adminAPI.rejectShopRequest(requestId);
      setRequests(requests.map(req => 
        req._id === requestId ? response.data : req
      ));
      toast.success('Shop request rejected successfully');
    } catch (error) {
      toast.error('Failed to reject shop request');
      console.error('Error rejecting shop request:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Shop Request Management</h1>
          <p className="text-gray-600 mt-2">Approve or reject shop creation requests</p>
        </div>

        {/* Shop Requests List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Total Requests: {requests.length}
            </h2>
          </div>

          {loadingRequests ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading shop requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No shop requests found</p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {requests.map((request) => (
                <div key={request._id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Request Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {request.vendorName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Requested by:</strong> {request.vendorId?.username || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Email:</strong> {request.vendorId?.email || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Request Date:</strong> {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">
                        {request.description || 'No description provided'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Actions</h4>
                      {request.status === 'pending' ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => handleApproveRequest(request._id, request.vendorName)}
                            disabled={updating === request._id}
                            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            {updating === request._id ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request._id, request.vendorName)}
                            disabled={updating === request._id}
                            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                          >
                            <XCircleIcon className="h-4 w-4 mr-2" />
                            {updating === request._id ? 'Processing...' : 'Reject'}
                          </button>
                          {updating === request._id && (
                            <p className="text-xs text-gray-500 text-center">
                              Processing request...
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {request.status === 'approved' ? (
                            <p className="text-green-600 font-medium">✓ This request has been approved</p>
                          ) : (
                            <p className="text-red-600 font-medium">✗ This request has been rejected</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {request.status === 'approved' ? 'Shop creation approved' : 'Shop creation rejected'}
                          </p>
                        </div>
                      )}
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

export default AdminShopRequests;