import React, { useState } from 'react';
import { Car, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({});
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim()) {
      setErrors({ email: 'Vui lòng nhập địa chỉ email' });
      return;
    }
    
    if (!validateEmail(email)) {
      setErrors({ email: 'Địa chỉ email không hợp lệ' });
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      // Gọi API reset password
      const response = await api.post('/auth/forgot-password', { email });
      
      console.log('Gửi yêu cầu reset password cho email:', email);
      console.log('Response:', response.data);
      
      // Kiểm tra response thành công
      if (response.data.success) {
        setIsSuccess(true);
      } else {
        setErrors({ submit: response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
      }
      
    } catch (error) {
      console.error('Lỗi gửi yêu cầu:', error);
      
      let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      
      if (error.response?.status === 404) {
        errorMessage = 'Email không tồn tại trong hệ thống.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Địa chỉ email không hợp lệ.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <div className="bg-blue-600 p-3 rounded-full">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">EV Warranty</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700">
            Quên mật khẩu
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Nhập email để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        {/* Forget Password Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {isSuccess ? (
            /* Success Message */
            <div className="text-center">
              <div className="bg-green-50 rounded-full p-4 inline-flex mb-4">
                <Mail className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email đã được gửi!
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email <strong>{email}</strong>. 
                Vui lòng kiểm tra hộp thư của bạn.
              </p>
              <Link
                to="/login"
                className="inline-block text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                ← Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            /* Form */
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Nhập địa chỉ email của bạn"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-colors ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang gửi...
                    </div>
                  ) : (
                    'Gửi yêu cầu'
                  )}
                </button>
              </div>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  ← Quay lại đăng nhập
                </Link>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2025 EV Warranty System.
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Thông tin hỗ trợ:</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Hotline: 1900-xxxx | Email: support@evwarranty.vn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
