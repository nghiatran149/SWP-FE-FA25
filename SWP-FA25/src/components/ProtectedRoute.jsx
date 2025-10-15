import React from 'react';
import authUtils from '../utils/auth.js';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const currentUser = authUtils.getCurrentUser();
  
  // Kiểm tra xem user đã đăng nhập chưa
  if (!authUtils.isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Truy cập bị từ chối
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để truy cập trang này.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // Nếu có định nghĩa allowedRoles và user không có quyền
  if (allowedRoles.length > 0 && (!currentUser?.role || !allowedRoles.includes(currentUser.role))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn không có quyền truy cập vào trang này.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Vai trò hiện tại: <span className="font-medium">{currentUser?.role || 'Không xác định'}</span>
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;