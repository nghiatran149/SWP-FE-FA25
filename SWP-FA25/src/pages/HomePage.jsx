import React, { useState } from 'react';
import { Car, Shield, Wrench, BarChart3, Users, Settings, CheckCircle, Megaphone, Package, FileText, Key, X, Eye, EyeOff } from 'lucide-react';
import authUtils from '../utils/auth.js';
import api from '../api/api.js';

const HomePage = () => {
  const currentUser = authUtils.getCurrentUser();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setPasswordError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Mật khẩu mới không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      // Gọi API đổi mật khẩu
      const response = await api.put('/auth/password', {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setTimeout(() => {
        setShowChangePasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Đã xảy ra lỗi khi đổi mật khẩu';
      setPasswordError(errorMessage);
    }
  };
  
  const getWelcomeMessage = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          title: 'Chào mừng, ADMIN!',
          subtitle: 'Quản lý toàn bộ hệ thống bảo hành xe điện',
          features: [
            { icon: BarChart3, title: 'Báo cáo & Phân tích', desc: 'Theo dõi hiệu suất toàn hệ thống' },
            // { icon: Settings, title: 'Chuỗi cung ứng', desc: 'Quản lý chuỗi cung ứng phụ tùng' },
            { icon: Shield, title: 'Giám sát bảo hành', desc: 'Tổng quan tất cả yêu cầu bảo hành' }
          ]
        };
      case 'EVM_STAFF':
        return {
          title: 'Chào mừng, EVM STAFF!',
          subtitle: 'Quản lý phụ tùng và duyệt yêu cầu bảo hành',
          features: [
            { icon: CheckCircle, title: 'Duyệt bảo hành', desc: 'Xét duyệt các yêu cầu bảo hành' },
            { icon: Megaphone, title: 'Quản lý chiến dịch', desc: 'Quản lý và theo dõi các chiến dịch' },
            { icon: FileText, title: 'Lịch sử dịch vụ', desc: 'Xem lại các dịch vụ bảo hành đã thực hiện' },
            { icon: Package, title: 'Kho phụ tùng', desc: 'Theo dõi tồn kho và quản lý phụ tùng thay thế' },
            
          ]
        };
      case 'SC_STAFF':
        return {
          title: 'Chào mừng, SC STAFF!',
          subtitle: 'Quản lý trung tâm dịch vụ và điều phối công việc',
          features: [
            { icon: Users, title: 'Quản lý khách hàng', desc: 'Quản lý thông tin khách hàng' },
            { icon: Car, title: 'Quản lý xe', desc: 'Theo dõi thông tin xe và lịch sử' },
            { icon: Shield, title: 'Yêu cầu bảo hành', desc: 'Tiếp nhận và xử lý yêu cầu bảo hành' },
            { icon: Wrench, title: 'Quản lý kỹ thuật viên', desc: 'Quản lý và phân công kỹ thuật viên' },
            { icon: FileText, title: 'Lịch sử dịch vụ', desc: 'Theo dõi lịch sử các dịch vụ đã thực hiện' },
            { icon: Megaphone, title: 'Chiến dịch dịch vụ', desc: 'Quản lý các chiến dịch và thông báo' },
            { icon: Package, title: 'Phụ tùng có sẵn', desc: 'Quản lý tồn kho phụ tùng' }
          ]
        };
      case 'SC_TECHNICIAN':
        return {
          title: 'Chào mừng, SC TECHNICIAN!',
          subtitle: 'Thực hiện các công việc sửa chữa và bảo dưỡng',
          features: [
            { icon: Wrench, title: 'Công việc của tôi', desc: 'Xem và cập nhật tiến độ công việc' },
            { icon: Shield, title: 'Thực hiện bảo hành', desc: 'Sửa chữa theo yêu cầu bảo hành' },
            { icon: Car, title: 'Chẩn đoán xe', desc: 'Kiểm tra và chẩn đoán tình trạng xe' }
          ]
        };
      default:
        return {
          title: 'Chào mừng đến với hệ thống!',
          subtitle: 'Hệ thống quản lý bảo hành xe điện',
          features: []
        };
    }
  };

  const welcomeData = getWelcomeMessage(currentUser?.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center space-x-4">
          <Car className="h-12 w-12 text-white" />
          <div>
            <h1 className="text-3xl font-bold">{welcomeData.title}</h1>
            <p className="text-blue-100 mt-2">{welcomeData.subtitle}</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Thông tin tài khoản</h2>
          <button
            onClick={() => setShowChangePasswordModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Key className="h-4 w-4" />
            <span>Đổi mật khẩu</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Họ và tên</p>
            <p className="text-lg text-gray-900">{currentUser?.fullName || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Vai trò</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {currentUser?.role || 'Chưa xác định'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tên đăng nhập</p>
            <p className="text-lg text-gray-900">{currentUser?.username || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg text-gray-900">{currentUser?.email || 'Chưa cập nhật'}</p>
          </div>
        </div>
      </div>

      {/* Features */}
      {welcomeData.features.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Chức năng chính</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {welcomeData.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex-shrink-0">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Hướng dẫn sử dụng</h2>
        <div className="prose text-gray-600">
          <p>
            Sử dụng menu bên trái để điều hướng đến các chức năng tương ứng với vai trò của bạn.
            Mỗi vai trò có quyền truy cập vào các chức năng khác nhau trong hệ thống.
          </p>
          <ul className="mt-4 space-y-2">
            <li>• Sử dụng sidebar để truy cập các chức năng</li>
            <li>• Kiểm tra thông báo định kỳ</li>
            <li>• Cập nhật thông tin cá nhân khi cần thiết</li>
            <li>• Liên hệ admin nếu gặp vấn đề kỹ thuật</li>
          </ul>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Đổi mật khẩu</h3>
                    <p className="text-sm text-gray-500 mt-1">Cập nhật mật khẩu cho tài khoản của bạn</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowChangePasswordModal(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordError('');
                      setPasswordSuccess('');
                      setShowPasswords({ currentPassword: false, newPassword: false, confirmPassword: false });
                    }}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Error message */}
                {passwordError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
                    <p className="text-sm text-red-700">{passwordError}</p>
                  </div>
                )}

                {/* Success message */}
                {passwordSuccess && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-md">
                    <p className="text-sm text-green-700">{passwordSuccess}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu hiện tại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.currentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('currentPassword')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent border border-gray-300 rounded-r-md text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.currentPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.newPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('newPassword')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent border border-gray-300 rounded-r-md text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.newPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent border border-gray-300 rounded-r-md text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3 -mx-4 -mb-4 mt-6">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Đổi mật khẩu
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowChangePasswordModal(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setPasswordError('');
                        setPasswordSuccess('');
                        setShowPasswords({ currentPassword: false, newPassword: false, confirmPassword: false });
                      }}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;