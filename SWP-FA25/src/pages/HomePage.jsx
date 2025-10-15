import React from 'react';
import { Car, Shield, Wrench, BarChart3, Users, Settings } from 'lucide-react';
import authUtils from '../utils/auth.js';

const HomePage = () => {
  const currentUser = authUtils.getCurrentUser();
  
  const getWelcomeMessage = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          title: 'Chào mừng, Quản trị viên!',
          subtitle: 'Quản lý toàn bộ hệ thống bảo hành xe điện',
          features: [
            { icon: BarChart3, title: 'Báo cáo & Phân tích', desc: 'Theo dõi hiệu suất toàn hệ thống' },
            { icon: Settings, title: 'Chuỗi cung ứng', desc: 'Quản lý chuỗi cung ứng phụ tùng' },
            { icon: Shield, title: 'Giám sát bảo hành', desc: 'Tổng quan tất cả yêu cầu bảo hành' }
          ]
        };
      case 'EVM_STAFF':
        return {
          title: 'Chào mừng, Nhân viên EVM!',
          subtitle: 'Quản lý phụ tùng và duyệt yêu cầu bảo hành',
          features: [
            { icon: Settings, title: 'Quản lý phụ tùng', desc: 'Theo dõi kho phụ tùng và linh kiện' },
            { icon: Shield, title: 'Duyệt bảo hành', desc: 'Xét duyệt các yêu cầu bảo hành' },
            { icon: Car, title: 'Hỗ trợ kỹ thuật', desc: 'Tư vấn kỹ thuật cho dịch vụ' }
          ]
        };
      case 'SC_STAFF':
        return {
          title: 'Chào mừng, Nhân viên Trung tâm dịch vụ!',
          subtitle: 'Quản lý khách hàng và điều phối dịch vụ',
          features: [
            { icon: Users, title: 'Quản lý khách hàng', desc: 'Chăm sóc và hỗ trợ khách hàng' },
            { icon: Car, title: 'Quản lý xe', desc: 'Theo dõi thông tin xe và lịch sử dịch vụ' },
            { icon: Wrench, title: 'Điều phối dịch vụ', desc: 'Phân công công việc cho kỹ thuật viên' }
          ]
        };
      case 'SC_TECHNICIAN':
        return {
          title: 'Chào mừng, Kỹ thuật viên!',
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin tài khoản</h2>
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
    </div>
  );
};

export default HomePage;