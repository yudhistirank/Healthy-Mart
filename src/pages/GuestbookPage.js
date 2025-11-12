import React, { useState } from 'react';
import { guestbookAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  BookOpenIcon,
  UserIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const GuestbookPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    setSubmitting(true);

    try {
      await guestbookAPI.submitEntry(formData);
      toast.success('Terima kasih! Pesan Anda telah berhasil dikirim');
      setFormData({
        name: user?.username || '',
        email: user?.email || '',
        message: ''
      });
    } catch (error) {
      toast.error('Gagal mengirim pesan. Silakan coba lagi');
      console.error('Error submitting guestbook:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <BookOpenIcon className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Guestbook HealthyMart
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tinggalkan pesan, saran, atau testimoni Anda untuk membantu kami meningkatkan layanan
          </p>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Guestbook Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-primary-600" />
              Tulis Pesan Anda
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="h-4 w-4 inline mr-1" />
                  Nama *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={!!user} // Disable if logged in
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Masukkan nama lengkap Anda"
                />
                {user && (
                  <p className="text-sm text-gray-500 mt-1">
                    Nama otomatis diisi dari profil Anda
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={!!user} // Disable if logged in
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Masukkan alamat email Anda"
                />
                {user && (
                  <p className="text-sm text-gray-500 mt-1">
                    Email otomatis diisi dari profil Anda
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 inline mr-1" />
                  Pesan *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tuliskan pesan, saran, atau testimoni Anda tentang HealthyMart..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Kirim Pesan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* About Guestbook */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Tentang Guestbook
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  Buku tamu HealthyMart adalah tempat bagi Anda untuk berbagi:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Pengalaman belanja di HealthyMart</li>
                  <li>Saran untuk perbaikan layanan</li>
                  <li>Testimoni tentang produk kesehatan</li>
                  <li>Pertanyaan atau kesan secara umum</li>
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Hubungi Kami
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong>Email:</strong> admin@healthymart.com
                </p>
                <p>
                  <strong>Telepon:</strong> (021) 1234-5678
                </p>
                <p>
                  <strong>Alamat:</strong> Jl. Kesehatan No. 123, Jakarta Pusat
                </p>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Panduan Penulisan
              </h3>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>• Gunakan bahasa yang sopan dan konstruktif</p>
                <p>• Hindari konten yang bersifat SARA</p>
                <p>• Fokus pada saran yang membangun</p>
                <p>• Pesan akan dibaca oleh tim admin kami</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="bg-primary-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              Selamat Berbelanja di HealthyMart!
            </h3>
            <p className="text-primary-700">
              Terima kasih atas kunjungan dan kepercayaan Anda. Kami berkomitmen memberikan produk kesehatan terbaik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestbookPage;