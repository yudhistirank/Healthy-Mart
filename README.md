# Healthy Mart - Online Shopping System Frontend

## 🎯 Overview

Healthy Mart adalah sistem e-commerce modern untuk toko alat kesehatan yang dibangun dengan React dan backend API. Frontend ini menyediakan antarmuka pengguna yang bersih, responsif, dan user-friendly untuk pengalaman belanja online yang optimal.

## ✨ Features

### 🎨 User Interface
- **Modern & Minimalist Design**: Menggunakan Tailwind CSS untuk tampilan yang clean dan modern
- **Responsive Layout**: Optimal di semua perangkat (desktop, tablet, mobile)
- **Dark/Light Mode Ready**: Struktur CSS yang mendukung tema gelap dan terang
- **Accessibility**: Komponen yang dapat diakses dan user-friendly

### 🔐 Authentication & User Management
- **Secure Login/Register**: Form validasi lengkap dengan error handling
- **JWT Token Management**: Otentikasi yang aman dengan automatic token refresh
- **Role-based Access**: Support untuk Customer, Admin, dan Visitor roles
- **Profile Management**: Update profil pengguna dengan form yang user-friendly

### 🛍️ Shopping Experience
- **Product Catalog**: 3-kolom layout dengan sidebar kategori
- **Advanced Search & Filtering**: Cari produk berdasarkan nama, kategori, dan rentang harga
- **Product Details**: Halaman detail dengan galeri gambar dan informasi lengkap
- **Shopping Cart**: Real-time cart updates dengan persistensi
- **Checkout Process**: Multi-step checkout dengan berbagai metode pembayaran

### 💳 Payment & Order Management
- **Multiple Payment Methods**: Credit Card, PayPal, Bank Transfer, E-Wallet, COD
- **Order Tracking**: Riwayat pesanan dengan status real-time
- **PDF Receipt Generation**: Struk pembayaran dalam format PDF
- **Order Success Flow**: Confirmation page dengan detail pesanan

### 📱 Mobile-First Design
- **Mobile Navigation**: Hamburger menu dengan slide-out navigation
- **Touch-Friendly**: Tombol dan interaksi yang optimal untuk mobile
- **Performance**: Loading states dan skeleton screens untuk UX yang smooth

## 🏗️ Architecture

### Project Structure
```
oss-fe/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── Footer.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── LandingPage.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── HomePage.js
│   │   ├── ProductsPage.js
│   │   ├── ProductDetailPage.js
│   │   ├── CartPage.js
│   │   ├── CheckoutPage.js
│   │   ├── PaymentPage.js
│   │   ├── OrderSuccessPage.js
│   │   └── ProfilePage.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

### Technology Stack
- **React 18**: Modern React dengan hooks dan functional components
- **React Router v6**: Client-side routing dengan protected routes
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client untuk API calls
- **React Hot Toast**: Notifikasi yang user-friendly
- **Heroicons**: SVG icons yang konsisten
- **jsPDF**: PDF generation untuk receipt
- **html2canvas**: HTML to canvas untuk PDF generation

## 📋 Available Pages

### Public Pages
- **Landing Page** (`/`): Homepage dengan hero section, fitur, dan testimoni
- **Login** (`/login`): Halaman login dengan validasi form
- **Register** (`/register`): Halaman registrasi dengan form lengkap

### Protected Pages
- **Home** (`/home`): Dashboard utama dengan kategori dan produk unggulan
- **Products** (`/products`): Katalog produk dengan 3-kolom layout dan filter
- **Product Detail** (`/products/:id`): Detail produk dengan galeri gambar
- **Cart** (`/cart`): Keranjang belanja dengan update kuantitas
- **Checkout** (`/checkout`): Proses checkout dengan ringkasan pesanan
- **Payment** (`/payment/:orderId`): Halaman pembayaran dengan multiple methods
- **Order Success** (`/order-success/:orderId`): Konfirmasi pembayaran dengan PDF receipt
- **Profile** (`/profile`): Manajemen profil pengguna

## 🎨 Design System

### Color Palette
```css
Primary: #0ea5e9 (Blue)
Success: #22c55e (Green)
Danger: #ef4444 (Red)
Gray Scale: #f9fafb to #111827
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Font weights 700-900
- **Body Text**: Font weight 400-500
- **Line Height**: 1.6 untuk readability optimal

### Components
- **Buttons**: Primary, Secondary, Danger variants
- **Cards**: Rounded corners dengan shadows
- **Forms**: Consistent input styling dengan validation states
- **Badges**: Status indicators dengan color coding

## 🔧 Configuration

### API Configuration
Update `src/services/api.js` untuk endpoint backend:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
```

### Tailwind Customization
Tailwind config di `tailwind.config.js` sudah dikustomisasi dengan:
- Custom color palette
- Extended typography
- Custom shadows dan spacing

## 🧪 Testing

### Manual Testing Flow
1. **User Registration**: Test form validation dan registration flow
2. **Login/Logout**: Test authentication dan session management
3. **Product Browsing**: Test search, filter, dan product navigation
4. **Shopping Cart**: Test add/remove items, quantity updates
5. **Checkout Process**: Test complete checkout flow
6. **Payment**: Test payment simulation
7. **Profile Management**: Test profile updates

### Demo Accounts
- **Customer**: customer1 / password123
- **Admin**: admin1 / admin123

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔐 Security Features

- **Protected Routes**: Automatic redirect untuk unauthenticated users
- **Token Validation**: JWT token validation dengan auto-logout
- **Form Validation**: Client-side dan server-side validation
- **HTTPS Ready**: Struktur untuk production deployment

## 🚀 Performance Optimizations

- **Code Splitting**: React lazy loading untuk pages
- **Image Optimization**: Responsive images dengan lazy loading
- **Bundle Optimization**: Tree shaking untuk minimal bundle size
- **Caching**: Browser caching untuk static assets

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🛠️ Development

### Available Scripts
- `npm start`: Development server
- `npm build`: Production build
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

### Code Style
- ESLint configuration
- Prettier integration
- Conventional commits

## 📝 Environment Variables

```env
REACT_APP_API_BASE_URL=http://localhost:xxxx
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail

## 📞 Support

Untuk support teknis atau pertanyaan:
- Email: yudhislearning@gmail.com
- Documentation: [https://github.com/yudhistirank/Healthy-Mart/edit/main/README.md]

---
