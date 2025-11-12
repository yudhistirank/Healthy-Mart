import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ShieldCheckIcon, 
  TruckIcon, 
  UserGroupIcon,
  ShoppingCartIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const features = [
    {
      icon: HeartIcon,
      title: 'Kesehatan Terpercaya',
      description: 'Produk alat kesehatan berkualitas tinggi dari brand ternama'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Garansi Produk',
      description: 'Jaminan keamanan dan kualitas untuk semua produk yang dijual'
    },
    {
      icon: TruckIcon,
      title: 'Pengiriman Cepat',
      description: 'Layanan pengiriman ke seluruh Indonesia dengan tracking real-time'
    },
    {
      icon: UserGroupIcon,
      title: 'Layanan Pelanggan 24/7',
      description: 'Tim customer service siap membantu Anda kapan saja'
    }
  ];

  const testimonials = [
    {
      name: 'Sari Dewi',
      role: 'Ibu Rumah Tangga',
      content: 'Produknya berkualitas bagus dan pengirimannya sangat cepat. Puas banget belanja di HealthyMart!',
      rating: 5
    },
    {
      name: 'Dr. Ahmad Rizki',
      role: 'Dokter',
      content: 'Sebagai dokter, saya selalu merekomendasikan HealthyMart kepada pasien saya. Produknya terpercaya.',
      rating: 5
    },
    {
      name: 'Maya Putri',
      role: 'Atlet',
      content: 'Suka banget sama produk olahraga dan suplemennya. Harga terjangkau tapi kualitasnya bagus.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Kesehatan adalah{' '}
                <span className="text-primary-600">Prioritas</span>{' '}
                Utama
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-lg">
                Temukan berbagai produk alat kesehatan berkualitas tinggi untuk menjaga 
                kesehatan dan kesejahteraan Anda. Belanja aman, mudah, dan terpercaya.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="btn-primary text-lg px-8 py-3 text-center"
                >
                  Mulai Berbelanja
                </Link>
                <Link
                  to="/products"
                  className="btn-secondary text-lg px-8 py-3 text-center"
                >
                  Lihat Produk
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-primary-400 rounded-2xl transform rotate-6"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-100 p-4 rounded-xl text-center">
                    <HeartIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">1000+</p>
                    <p className="text-xs text-gray-600">Produk Sehat</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-xl text-center">
                    <ShieldCheckIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">100%</p>
                    <p className="text-xs text-gray-600">Original</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-xl text-center">
                    <TruckIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">24 Jam</p>
                    <p className="text-xs text-gray-600">Pengiriman</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-xl text-center">
                    <UserGroupIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">10K+</p>
                    <p className="text-xs text-gray-600">Pelanggan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih HealthyMart?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami berkomitmen untuk memberikan pengalaman belanja online yang terbaik 
              dengan produk berkualitas dan layanan yang memuaskan.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Memulai Perjalanan Sehat Anda?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pelanggan yang telah merasakan manfaat produk berkualitas dari HealthyMart.
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
          >
            Daftar Sekarang
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata Pelanggan Kami?
            </h2>
            <p className="text-xl text-gray-600">
              Testimoni dari pelanggan yang telah merasakan pengalaman terbaik dengan kami
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <CheckCircleIcon key={i} className="w-5 h-5 text-primary-600" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Produk Tersedia</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Pelanggan Aktif</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">99%</div>
              <div className="text-gray-600">Tingkat Kepuasan</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;