import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getProfile: () => apiClient.get('/auth/me'),
  updateProfile: (profileData) => apiClient.put('/auth/profile', profileData),
  logout: () => apiClient.post('/auth/logout'),
};

// Products API
export const productsAPI = {
  getProducts: (params = {}) => apiClient.get('/products', { params }),
  getProduct: (id) => apiClient.get(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getCategories: () => apiClient.get('/categories'),
};

// Cart API
export const cartAPI = {
  getCart: () => apiClient.get('/cart'),
  addToCart: (productId, quantity) => apiClient.post('/cart/add', { productId, quantity }),
  updateCartItem: (productId, quantity) => apiClient.put('/cart/update', { productId, quantity }),
  removeFromCart: (productId) => apiClient.delete(`/cart/remove/${productId}`),
  clearCart: () => apiClient.delete('/cart/clear'),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => apiClient.post('/orders', orderData),
  checkout: (paymentMethod) => apiClient.post('/orders/checkout', { paymentMethod }),
  processPayment: (orderId, paymentData) => apiClient.post(`/orders/${orderId}/pay`, paymentData),
  getOrder: (orderId) => apiClient.get(`/orders/${orderId}`),
  getMyOrders: () => apiClient.get('/orders/my-orders'),
  getReceipt: (orderId) => apiClient.get(`/orders/${orderId}/receipt`),
  downloadReceiptPDF: (orderId) => {
    return apiClient.get(`/orders/${orderId}/pdf`, {
      responseType: 'blob'
    });
  },
};

// Admin API
export const adminAPI = {
  // Customer Management
  getCustomers: () => apiClient.get('/admin/customers'),
  deleteCustomer: (id) => apiClient.delete(`/admin/customers/${id}`),
  
  // Guestbook Management (Admin)
  getGuestbookEntries: () => apiClient.get('/admin/guestbook'),
  deleteGuestbookEntry: (id) => apiClient.delete(`/admin/guestbook/${id}`),
  
  // Category Management
  getCategories: () => apiClient.get('/admin/categories'),
  createCategory: (categoryData) => apiClient.post('/admin/categories', categoryData),
  updateCategory: (id, categoryData) => apiClient.put(`/admin/categories/${id}`, categoryData),
  deleteCategory: (id) => apiClient.delete(`/admin/categories/${id}`),
  
  // Product Management (Admin)
  getProducts: () => apiClient.get('/admin/products'),
  createProduct: (productData) => apiClient.post('/admin/products', productData),
  updateProduct: (id, productData) => apiClient.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => apiClient.delete(`/admin/products/${id}`),
  
  // Order Management
  getOrders: () => apiClient.get('/admin/orders'),
  updateOrderShipping: (id, status) => apiClient.put(`/admin/orders/${id}/shipping`, { status }),
  
  // Shop Request Management
  getShopRequests: () => apiClient.get('/admin/shop-requests'),
  approveShopRequest: (id) => apiClient.put(`/admin/shop-requests/${id}/approve`),
  rejectShopRequest: (id) => apiClient.put(`/admin/shop-requests/${id}/reject`),
  createShopRequest: (requestData) => apiClient.post('/admin/shop-requests', requestData),
};

// Guestbook API (Public)
export const guestbookAPI = {
  submitEntry: (entryData) => apiClient.post('/guestbook', entryData),
  getEntries: () => apiClient.get('/guestbook'), // Admin only via admin API
};

export default apiClient;