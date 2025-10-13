// Utility functions để quản lý authentication

export const authUtils = {
  // Kiểm tra xem user đã đăng nhập chưa
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    return !!(token && userInfo);
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    const userInfo = localStorage.getItem('userInfo');
    try {
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  },

  // Lấy token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  },

  // Kiểm tra role của user
  hasRole: (requiredRole) => {
    const user = authUtils.getCurrentUser();
    return user && user.role === requiredRole;
  },

  // Kiểm tra xem user có phải admin không
  isAdmin: () => {
    return authUtils.hasRole('ADMIN');
  },

  // Lấy tên hiển thị của user
  getDisplayName: () => {
    const user = authUtils.getCurrentUser();
    return user ? user.fullName || user.username : 'Guest';
  }
};

export default authUtils;