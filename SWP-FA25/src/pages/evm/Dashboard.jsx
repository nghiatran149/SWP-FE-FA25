import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, Users, Car, Package, Briefcase, Loader2 } from 'lucide-react';
import api from '../../api/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data từ API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/dashboard');
        console.log('Dashboard API Response:', response.data);
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Hiển thị loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-800">Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  // Chuẩn bị stats từ API data
  const stats = dashboardData ? [
    {
      name: 'Khách hàng hoạt động',
      value: dashboardData.totalActiveCustomer?.toLocaleString() || '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Nhân viên hoạt động',
      value: dashboardData.totalActiveStaff?.toLocaleString() || '0',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Xe đang hoạt động',
      value: dashboardData.totalActiveVehicle?.toLocaleString() || '0',
      icon: Car,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Linh kiện trong kho',
      value: dashboardData.totalInStockPart?.toLocaleString() || '0',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
  ] : [];

  // Dữ liệu bảo hành và chiến dịch
  const warrantyClaims = dashboardData ? {
    total: dashboardData.totalWarrantyClaim || 0,
    completed: dashboardData.completedWarrantyClaim || 0,
    processing: dashboardData.processingWarrantyClaim || 0
  } : { total: 0, completed: 0, processing: 0 };

  const campaigns = dashboardData ? {
    total: dashboardData.totalCampaign || 0,
    completed: dashboardData.completedCampaign || 0,
    processing: dashboardData.processingCampaign || 0
  } : { total: 0, completed: 0, processing: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tổng quan hệ thống quản lý bảo hành xe điện
        </p>
      </div>

      {/* Stats - Thống kê chính */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${item.bgColor}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {item.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Warranty Claims & Campaigns Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Warranty Claims */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Yêu cầu bảo hành
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tổng yêu cầu</p>
                  <p className="text-3xl font-bold text-gray-900">{warrantyClaims.total}</p>
                </div>
                <Shield className="h-12 w-12 text-gray-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-600">Đang xử lý</p>
                      <p className="text-2xl font-bold text-blue-700">{warrantyClaims.processing}</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-green-600">Hoàn thành</p>
                      <p className="text-2xl font-bold text-green-700">{warrantyClaims.completed}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </div>
              </div>
              {warrantyClaims.total > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Tỷ lệ hoàn thành: <span className="font-semibold text-green-600">
                      {((warrantyClaims.completed / warrantyClaims.total) * 100).toFixed(1)}%
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Campaigns */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Chiến dịch dịch vụ
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tổng chiến dịch</p>
                  <p className="text-3xl font-bold text-gray-900">{campaigns.total}</p>
                </div>
                <AlertTriangle className="h-12 w-12 text-gray-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-yellow-600">Đang thực hiện</p>
                      <p className="text-2xl font-bold text-yellow-700">{campaigns.processing}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-400" />
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-green-600">Hoàn thành</p>
                      <p className="text-2xl font-bold text-green-700">{campaigns.completed}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </div>
              </div>
              {campaigns.total > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Tỷ lệ hoàn thành: <span className="font-semibold text-green-600">
                      {((campaigns.completed / campaigns.total) * 100).toFixed(1)}%
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
