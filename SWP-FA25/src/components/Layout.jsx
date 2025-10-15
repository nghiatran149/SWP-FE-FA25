import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  CheckCircle,
  Wrench,
  Megaphone,
  Settings,
  BarChart3,
  Menu,
  X,
  Car,
  User,
  Bell,
  UserCheck,
  Truck,
  LogOut
} from 'lucide-react';
import authUtils from '../utils/auth.js';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Function xử lý logout
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      authUtils.logout();
    }
  };

  // Lấy thông tin user hiện tại
  const currentUser = authUtils.getCurrentUser();
  const displayName = authUtils.getDisplayName();

  // Định nghĩa tất cả navigation items
  const allNavigationItems = [
    { name: 'Trang chủ', href: '/', icon: LayoutDashboard, roles: ['ADMIN', 'EVM_STAFF', 'SC_STAFF', 'SC_TECHNICIAN'] },
    
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, roles: ['ADMIN'] },
    { name: 'Báo cáo & Phân tích', href: '/reports', icon: BarChart3, roles: ['ADMIN'] },
    { name: 'Chuỗi cung ứng', href: '/supply-chain', icon: Truck, roles: ['ADMIN'] },

    { name: 'Duyệt yêu cầu bảo hành', href: '/warranty-approval', icon: CheckCircle, roles: ['EVM_STAFF'] },
    { name: 'Quản lý phụ tùng', href: '/parts', icon: Settings, roles: ['EVM_STAFF'] },
    
    { name: 'Quản lý khách hàng', href: '/customers', icon: User, roles: ['SC_STAFF'] },
    { name: 'Quản lý xe', href: '/vehicles', icon: Car, roles: ['SC_STAFF'] },
    { name: 'Yêu cầu bảo hành', href: '/warranty-claims', icon: Shield, roles: ['SC_STAFF'] },
    { name: 'Quản lý kỹ thuật viên', href: '/technicians', icon: UserCheck, roles: ['SC_STAFF'] },
    { name: 'Chiến dịch dịch vụ', href: '/service-campaigns', icon: Megaphone, roles: ['SC_STAFF'] },

    { name: 'Công việc của tôi', href: '/technician-tasks', icon: Wrench, roles: ['SC_TECHNICIAN'] },
  ];

  // Function lọc navigation theo role
  const getNavigationForRole = (userRole) => {
    if (!userRole) return [];
    return allNavigationItems.filter(item => item.roles.includes(userRole));
  };

  // Lấy navigation items theo role của user hiện tại
  const navigation = getNavigationForRole(currentUser?.role);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">EV Warranty</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.length > 0 ? (
              navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`${
                        isActive
                          ? 'bg-primary-50 border-primary-500 text-primary-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors duration-200`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`${
                          isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 h-6 w-6`}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500 italic">
                Không có menu khả dụng cho vai trò này
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* <button className="text-gray-500 hover:text-gray-700">
                <Bell className="h-6 w-6" />
              </button> */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">{displayName}</span>
                  {currentUser && (
                    <span className="text-xs text-gray-500">{currentUser.role}</span>
                  )}
                </div>
                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
                >
                  Đăng xuất
                  <LogOut className="h-4 w-4 ml-2" /> 
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
