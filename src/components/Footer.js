import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/LogoHM-W.png"
                alt="HealthyMart"
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold">HealthyMart</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Toko alat kesehatan terpercaya yang menyediakan berbagai produk berkualitas 
              untuk menjaga kesehatan dan kesejahteraan Anda. Dapatkan produk terbaik 
              dengan harga terjangkau dan pelayanan yang memuaskan.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <PhoneIcon className="w-4 h-4" />
                <span>+62 812 3456 7890</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <EnvelopeIcon className="w-4 h-4" />
                <span>yudhislearning@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPinIcon className="w-4 h-4" />
                <span>Surabaya, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link to="/guestbook" className="text-gray-300 hover:text-white transition-colors">
                  Guestbook
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kategori Produk Unggulan</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products?category=6729f8001a2b3c4d5e6f7a8b"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Alat Kesehatan Rumah Tangga
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=6729f8001a2b3c4d5e6f7a8d"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Alat P3K & Darurat
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=6729f8001a2b3c4d5e6f7a8c"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Obat-Obatan & Suplemen
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=6729f8001a2b3c4d5e6f7a92"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Alat Monitor Kesehatan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 HealthyMart. Hak Cipta Dilindungi.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Kebijakan Privasi
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;