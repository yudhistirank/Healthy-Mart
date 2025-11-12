import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CreditCardIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    contactNumber: user?.contactNumber || '',
    paypalId: user?.paypalId || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateProfile(formData);
    setLoading(false);
    
    if (result.success) {
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      address: user?.address || '',
      city: user?.city || '',
      contactNumber: user?.contactNumber || '',
      paypalId: user?.paypalId || ''
    });
    setEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profil Saya</h1>
          <p className="text-gray-600 mt-2">Kelola informasi akun Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <UserCircleIcon className="w-6 h-6 mr-2" />
                  Informasi Pribadi
                </h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{user.username}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <EnvelopeIcon className="w-4 h-4 mr-1" />
                    Email
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{user.email}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    Alamat
                  </label>
                  {editing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{user.address || 'Belum diisi'}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    Kota
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{user.city || 'Belum diisi'}</p>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-1" />
                    Nomor Kontak
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{user.contactNumber || 'Belum diisi'}</p>
                  )}
                </div>

                {/* PayPal ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <CreditCardIcon className="w-4 h-4 mr-1" />
                    PayPal ID
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      name="paypalId"
                      value={formData.paypalId}
                      onChange={handleChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{user.paypalId || 'Belum diisi'}</p>
                  )}
                </div>

                {/* Edit Actions */}
                {editing && (
                  <div className="flex space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="btn-primary disabled:opacity-50"
                    >
                      {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-secondary"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Ringkasan Akun
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Role</span>
                  <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                    {user.role === 'admin' ? 'Administrator' : 'Pelanggan'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    Bergabung
                  </span>
                  <span className="text-gray-900">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Jenis Kelamin</span>
                  <span className="text-gray-900">
                    {user.gender === 'male' ? 'Laki-laki' : 
                     user.gender === 'female' ? 'Perempuan' : 'Belum diisi'}
                  </span>
                </div>
                
                {user.dob && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tanggal Lahir</span>
                    <span className="text-gray-900">
                      {formatDate(user.dob)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={logout}
                  className="w-full btn-danger"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;