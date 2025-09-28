import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, Users, Car } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      name: 'Tổng yêu cầu bảo hành',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: Shield,
    },
    {
      name: 'Đang xử lý',
      value: '89',
      change: '-5%',
      changeType: 'decrease',
      icon: Clock,
    },
    {
      name: 'Hoàn thành',
      value: '1,145',
      change: '+18%',
      changeType: 'increase',
      icon: CheckCircle,
    },
    {
      name: 'Cần chú ý',
      value: '23',
      change: '+3%',
      changeType: 'increase',
      icon: AlertTriangle,
    },
  ];

  const recentClaims = [
    {
      id: 'WC001',
      vehicle: 'VinFast VF8',
      vin: 'VF8XXXXXXX123456',
      issue: 'Lỗi pin',
      status: 'processing',
      date: '2024-09-10',
    },
    {
      id: 'WC002',
      vehicle: 'VinFast VF9',
      vin: 'VF9XXXXXXX789012',
      issue: 'Lỗi hệ thống sạc',
      status: 'completed',
      date: '2024-09-09',
    },
    {
      id: 'WC003',
      vehicle: 'VinFast VF8',
      vin: 'VF8XXXXXXX345678',
      issue: 'Lỗi phần mềm',
      status: 'pending',
      date: '2024-09-08',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'processing':
        return 'Đang xử lý';
      case 'pending':
        return 'Chờ xử lý';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tổng quan hệ thống quản lý bảo hành xe điện
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" />
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
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          item.changeType === 'increase'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Biểu đồ xu hướng yêu cầu bảo hành
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Biểu đồ sẽ được hiển thị ở đây</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Claims */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Yêu cầu bảo hành gần đây
            </h3>
            <div className="space-y-3">
              {recentClaims.map((claim) => (
                <div key={claim.id} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Car className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {claim.id} - {claim.vehicle}
                        </p>
                        <p className="text-xs text-gray-500">{claim.vin}</p>
                        <p className="text-xs text-gray-600">{claim.issue}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          claim.status
                        )}`}
                      >
                        {getStatusText(claim.status)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{claim.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600">
              <Shield className="h-4 w-4 mr-2" />
              Tạo yêu cầu bảo hành
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Users className="h-4 w-4 mr-2" />
              Quản lý khách hàng
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Car className="h-4 w-4 mr-2" />
              Tra cứu xe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
