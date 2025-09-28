import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Users, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const ServiceCampaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const campaigns = [
    {
      id: 'SC001',
      name: 'Recall pin VF8 - Lô sản xuất Q1/2024',
      description: 'Triệu hồi kiểm tra và thay thế pin cho các xe VF8 sản xuất trong quý 1/2024',
      type: 'recall',
      status: 'active',
      startDate: '2024-09-01',
      endDate: '2024-12-31',
      affectedVehicles: 2500,
      completedVehicles: 850,
      priority: 'high',
    },
    {
      id: 'SC002',
      name: 'Cập nhật phần mềm VF9',
      description: 'Cập nhật phần mềm điều khiển cho tất cả xe VF9',
      type: 'service',
      status: 'active',
      startDate: '2024-08-15',
      endDate: '2024-11-15',
      affectedVehicles: 1800,
      completedVehicles: 1200,
      priority: 'medium',
    },
    {
      id: 'SC003',
      name: 'Kiểm tra hệ thống phanh',
      description: 'Kiểm tra và bảo dưỡng hệ thống phanh định kỳ',
      type: 'maintenance',
      status: 'completed',
      startDate: '2024-07-01',
      endDate: '2024-08-31',
      affectedVehicles: 3200,
      completedVehicles: 3200,
      priority: 'medium',
    },
    {
      id: 'SC004',
      name: 'Thay thế bộ sạc nhanh',
      description: 'Thay thế bộ sạc nhanh có lỗi cho các xe được sản xuất trước tháng 6/2024',
      type: 'recall',
      status: 'planned',
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      affectedVehicles: 1500,
      completedVehicles: 0,
      priority: 'high',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Đang thực hiện';
      case 'completed':
        return 'Hoàn thành';
      case 'planned':
        return 'Lên kế hoạch';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'recall':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'service':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'maintenance':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'recall':
        return 'Triệu hồi';
      case 'service':
        return 'Dịch vụ';
      case 'maintenance':
        return 'Bảo dưỡng';
      default:
        return type;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCompletionPercentage = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chiến dịch dịch vụ</h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi các chiến dịch triệu hồi, dịch vụ và bảo dưỡng
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600">
          <Plus className="h-4 w-4 mr-2" />
          Tạo chiến dịch mới
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm chiến dịch..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Chiến dịch đang hoạt động
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {campaigns.filter(c => c.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Hoàn thành
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {campaigns.filter(c => c.status === 'completed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Xe bị ảnh hưởng
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {campaigns.reduce((sum, c) => sum + c.affectedVehicles, 0).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Lên kế hoạch
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {campaigns.filter(c => c.status === 'planned').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                    {getStatusText(campaign.status)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(campaign.type)}`}>
                    {getTypeText(campaign.type)}
                  </span>
                  <span className={`text-xs font-medium ${getPriorityColor(campaign.priority)}`}>
                    Ưu tiên: {campaign.priority === 'high' ? 'Cao' : campaign.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {campaign.startDate} - {campaign.endDate}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {campaign.affectedVehicles.toLocaleString()} xe bị ảnh hưởng
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {campaign.completedVehicles.toLocaleString()} xe đã hoàn thành
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Tiến độ hoàn thành</span>
                    <span>{getCompletionPercentage(campaign.completedVehicles, campaign.affectedVehicles)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        campaign.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{
                        width: `${getCompletionPercentage(campaign.completedVehicles, campaign.affectedVehicles)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md bg-transparent">
                  <Eye className="h-5 w-5" />
                </button>
                <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md bg-transparent">
                  <Edit className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy chiến dịch</h3>
          <p className="mt-1 text-sm text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc tạo chiến dịch mới.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceCampaigns;
