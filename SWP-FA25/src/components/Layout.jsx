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
  Users,
  UserRoundCog,
  Bell,
  UserCheck,
  Truck,
  LogOut,
  FileText,
  FileCog,
  Package,
  PackageX
} from 'lucide-react';
import authUtils from '../utils/auth.js';
import logoswp from '../assets/logoswp.png';

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
    // { name: 'Chuỗi cung ứng', href: '/supply-chain', icon: Truck, roles: ['ADMIN'] },
    { name: 'Quản lý người dùng', href: '/user-management', icon: UserCheck, roles: ['ADMIN'] },
    { name: 'Quản lý model xe', href: '/vehicle-model', icon: Car, roles: ['ADMIN'] },
    { name: 'Quản lý model phụ tùng', href: '/part-model', icon: Package, roles: ['ADMIN'] },

    { name: 'Duyệt yêu cầu', href: '/warranty-approval', icon: CheckCircle, roles: ['EVM_STAFF'] },
    { name: 'Quản lý chiến dịch', href: '/campaign-management', icon: Megaphone, roles: ['EVM_STAFF'] },
    { name: 'Lịch sử dịch vụ', href: '/service-records', icon: FileText, roles: ['EVM_STAFF'] },
    { name: 'Kho phụ tùng', href: '/part-warehouse', icon: Package, roles: ['EVM_STAFF'] },
    { name: 'Chính sách bảo hành', href: '/warranty-policy-management', icon: FileCog, roles: ['EVM_STAFF'] },

    { name: 'Quản lý kỹ thuật viên', href: '/technicians', icon: UserRoundCog, roles: ['SC_STAFF'] },
    { name: 'Quản lý khách hàng', href: '/customers', icon: Users, roles: ['SC_STAFF'] },
    { name: 'Quản lý xe', href: '/vehicles', icon: Car, roles: ['SC_STAFF'] },
    { name: 'Yêu cầu bảo hành', href: '/warranty-claims', icon: Shield, roles: ['SC_STAFF'] },
    { name: 'Lịch sử dịch vụ', href: '/service-records', icon: FileText, roles: ['SC_STAFF'] },
    { name: 'Quản lý chiến dịch', href: '/service-campaigns', icon: Megaphone, roles: ['SC_STAFF'] },
    { name: 'Phụ tùng có sẵn', href: '/available-parts', icon: Package, roles: ['SC_STAFF'] },
    { name: 'Phụ tùng lỗi', href: '/defective-parts', icon: PackageX, roles: ['SC_STAFF'] },
    { name: 'Chính sách bảo hành', href: '/warranty-policy', icon: FileCog, roles: ['SC_STAFF'] },

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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        <div className="flex items-center justify-between h-20 px-4 border-b-2 border-blue-600/40 bg-gradient-to-br from-blue-950/40 to-blue-900/60 flex-shrink-0 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-xl shadow-xl">
              <img src={logoswp} alt="SWP Logo" className="h-10 w-10 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white drop-shadow-md">EV Warranty</span>
              <span className="text-xs text-blue-200 font-medium">Quản lý bảo hành</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-blue-200 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Viền phân cách với gradient */}
        <div className="h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>

        <nav className="mt-5 px-3 flex-1 overflow-y-auto sidebar-scroll pb-6">
          <ul className="space-y-2">
            {navigation.length > 0 ? (
              navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`${isActive
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 border-l-4 border-yellow-400'
                          : 'text-blue-100 hover:bg-blue-600/50 hover:text-white border-l-4 border-transparent hover:border-blue-400'
                        } group flex items-center px-3 py-3.5 text-sm font-semibold rounded-lg transition-all duration-200 transform hover:translate-x-1`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`${isActive ? 'text-yellow-300' : 'text-blue-300 group-hover:text-blue-100'
                          } mr-3 h-5 w-5 flex-shrink-0`}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-2.5 text-xs text-blue-300 italic">
                Không có menu khả dụng cho vai trò này
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-lg">
          <div className="flex items-center justify-between h-20 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold text-white drop-shadow-md">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Trang chủ'}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* <button className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button> */}
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{displayName}</span>
                  {currentUser && (
                    <span className="text-xs text-blue-100 font-medium">{currentUser.role}</span>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2.5 border-2 border-white/30 text-sm font-bold rounded-lg text-white bg-red-500 hover:bg-red-600 hover:border-white/50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Đăng xuất
                <LogOut className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50">
          {children}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
