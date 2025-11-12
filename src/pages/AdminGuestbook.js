import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import { Navigate } from 'react-router-dom';
import { TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminGuestbook = () => {
  const { user, isAdmin, loading } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await adminAPI.getGuestbookEntries();
        setEntries(response.data);
      } catch (error) {
        toast.error('Failed to fetch guestbook entries');
        console.error('Error fetching guestbook entries:', error);
      } finally {
        setLoadingEntries(false);
      }
    };

    if (isAdmin) {
      fetchEntries();
    }
  }, [isAdmin]);

  const handleDeleteEntry = async (entryId, entryName) => {
    if (!window.confirm(`Are you sure you want to delete the guestbook entry from "${entryName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      await adminAPI.deleteGuestbookEntry(entryId);
      setEntries(entries.filter(entry => entry._id !== entryId));
      toast.success('Guestbook entry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete guestbook entry');
      console.error('Error deleting guestbook entry:', error);
    } finally {
      setDeleting(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Guestbook Management</h1>
          <p className="text-gray-600 mt-2">Review and manage guestbook entries</p>
        </div>

        {/* Guestbook Entries */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Total Entries: {entries.length}
            </h2>
          </div>

          {loadingEntries ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading guestbook entries...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No guestbook entries found</p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {entries.map((entry) => (
                <div key={entry._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{entry.name}</h3>
                        <span className="ml-2 text-sm text-gray-500">({entry.email})</span>
                      </div>
                      <p className="text-gray-700 mb-2">{entry.message}</p>
                      <p className="text-sm text-gray-500">
                        Submitted on {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteEntry(entry._id, entry.name)}
                      disabled={deleting}
                      className="ml-4 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <TrashIcon className="h-5 w-5 mr-1" />
                      Delete
                    </button>
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

export default AdminGuestbook;