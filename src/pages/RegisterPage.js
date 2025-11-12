import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    retypePassword: '',
    email: '',
    dob: '',
    gender: '',
    role: 'customer',
    address: '',
    city: '',
    contactNumber: '',
    paypalId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username harus diisi';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!formData.retypePassword) {
      newErrors.retypePassword = 'Konfirmasi password harus diisi';
    } else if (formData.password !== formData.retypePassword) {
      newErrors.retypePassword = 'Password tidak cocok';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.dob) {
      newErrors.dob = 'Tanggal lahir harus diisi';
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.dob = 'Anda harus berusia minimal 13 tahun';
      }
    }

    if (!formData.gender) {
      newErrors.gender = 'Jenis kelamin harus dipilih';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Alamat harus diisi';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Kota harus diisi';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Nomor kontak harus diisi';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Format nomor kontak tidak valid';
    }

    if (!formData.paypalId.trim()) {
      newErrors.paypalId = 'PayPal ID harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.paypalId)) {
      newErrors.paypalId = 'Format PayPal ID tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const result = await register(formData);
    setIsLoading(false);

    if (result.success) {
      navigate('/home');
    }
  };

  const handleClear = () => {
    setFormData({
      username: '',
      password: '',
      retypePassword: '',
      email: '',
      dob: '',
      gender: '',
      role: 'customer',
      address: '',
      city: '',
      contactNumber: '',
      paypalId: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Daftar Akun HealthyMart
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Masuk di sini
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.username ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                    placeholder="Masukkan username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-danger-600">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.email ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                    placeholder="Masukkan email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-danger-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-danger-600">{errors.password}</p>
                )}
              </div>

              {/* Retype Password */}
              <div>
                <label htmlFor="retypePassword" className="block text-sm font-medium text-gray-700">
                  Konfirmasi Password *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="retypePassword"
                    name="retypePassword"
                    type={showRetypePassword ? 'text' : 'password'}
                    required
                    value={formData.retypePassword}
                    onChange={handleChange}
                    className={`input-field pl-10 pr-10 ${errors.retypePassword ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                    placeholder="Ulangi password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowRetypePassword(!showRetypePassword)}
                  >
                    {showRetypePassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.retypePassword && (
                  <p className="mt-1 text-sm text-danger-600">{errors.retypePassword}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                  Tanggal Lahir *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.dob ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                  />
                </div>
                {errors.dob && (
                  <p className="mt-1 text-sm text-danger-600">{errors.dob}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Jenis Kelamin *
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className={`input-field ${errors.gender ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-danger-600">{errors.gender}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Peran Akun *
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="customer">Pelanggan - Belanja produk kesehatan</option>
                  <option value="admin">Administrator - Kelola sistem & produk</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Pelanggan dapat membeli produk, Administrator dapat mengelola sistem
                </p>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Alamat *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.address ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-danger-600">{errors.address}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Kota *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.city ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                    placeholder="Masukkan kota"
                  />
                </div>
                {errors.city && (
                  <p className="mt-1 text-sm text-danger-600">{errors.city}</p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                  Nomor Kontak *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    required
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.contactNumber ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                    placeholder="Contoh: 08123456789"
                  />
                </div>
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-danger-600">{errors.contactNumber}</p>
                )}
              </div>

              {/* PayPal ID */}
              <div className="md:col-span-2">
                <label htmlFor="paypalId" className="block text-sm font-medium text-gray-700">
                  PayPal ID *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="paypalId"
                    name="paypalId"
                    type="email"
                    required
                    value={formData.paypalId}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.paypalId ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                    placeholder="Masukkan email PayPal Anda"
                  />
                </div>
                {errors.paypalId && (
                  <p className="mt-1 text-sm text-danger-600">{errors.paypalId}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 btn-secondary py-3"
              >
                Hapus
              </button>
              <button
                type="submit"
                disabled={isLoading || loading}
                className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading || loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mendaftar...
                  </div>
                ) : (
                  'Daftar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;