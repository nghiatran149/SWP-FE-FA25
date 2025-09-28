import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Car, Calendar, User, MapPin, Battery, Settings } from 'lucide-react';

const VehicleManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modelFilter, setModelFilter] = useState('all');

  const vehicles = [
    {
      id: 'VH001',
      vin: 'VF8XXXXXXX123456',
      model: 'VinFast VF8',
      year: 2024,
      color: 'Đỏ Cherry',
      batteryCapacity: '87.7 kWh',
      range: '420 km',
      ownerName: 'Nguyễn Văn Anh',
      ownerId: 'KH001',
      purchaseDate: '2024-01-15',
      warrantyStatus: 'active',
      warrantyExpiry: '2027-01-15',
      lastService: '2024-08-20',
      mileage: 8500,
      location: 'TP.HCM',
      status: 'active',
      totalClaims: 2,
    },
    {
      id: 'VH002',
      vin: 'VF9XXXXXXX789012',
      model: 'VinFast VF9',
      year: 2024,
      color: 'Trắng Ngọc Trai',
      batteryCapacity: '123 kWh',
      range: '594 km',
      ownerName: 'Trần Thị Bình',
      ownerId: 'KH002',
      purchaseDate: '2024-03-10',
      warrantyStatus: 'active',
      warrantyExpiry: '2027-03-10',
      lastService: '2024-09-05',
      mileage: 5200,
      location: 'Hà Nội',
      status: 'active',
      totalClaims: 1,
    },
    {
      id: 'VH003',
      vin: 'VF8XXXXXXX345678',
      model: 'VinFast VF8',
      year: 2023,
      color: 'Xanh Dương',
      batteryCapacity: '87.7 kWh',
      range: '420 km',
      ownerName: 'Lê Văn Cường',
      ownerId: 'KH003',
      purchaseDate: '2023-12-05',
      warrantyStatus: 'expired',
      warrantyExpiry: '2026-12-05',
      lastService: '2024-06-15',
      mileage: 15600,
      location: 'Đà Nẵng',
      status: 'maintenance',
      totalClaims: 5,
    },
    {
      id: 'VH004',
      vin: 'VF9XXXXXXX456789',
      model: 'VinFast VF9',
      year: 2024,
      color: 'Đen Obsidian',
      batteryCapacity: '123 kWh',
      range: '594 km',
      ownerName: 'Phạm Thị Dung',
      ownerId: 'KH004',
      purchaseDate: '2024-06-20',
      warrantyStatus: 'active',
      warrantyExpiry: '2027-06-20',
      lastService: '2024-09-01',
      mileage: 3200,
      location: 'Cần Thơ',
      status: 'active',
      totalClaims: 0,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'recalled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'maintenance':
        return 'Bảo dưỡng';
      case 'inactive':
        return 'Không hoạt động';
      case 'recalled':
        return 'Triệu hồi';
      default:
        return status;
    }
  };

  const getWarrantyStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWarrantyStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Còn hiệu lực';
      case 'expired':
        return 'Hết hạn';
      case 'expiring':
        return 'Sắp hết hạn';
      default:
        return status;
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = 
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModel = modelFilter === 'all' || vehicle.model.includes(modelFilter);
    
    return matchesSearch && matchesModel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý xe</h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi thông tin xe và lịch sử bảo dưỡng
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600">
          <Plus className="h-4 w-4 mr-2" />
          Đăng ký xe mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Car className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng số xe</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{vehicles.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Settings className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Đang hoạt động</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {vehicles.filter(v => v.status === 'active').length}
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
                <Battery className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Đang bảo dưỡng</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {vehicles.filter(v => v.status === 'maintenance').length}
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
                <Calendar className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">BH sắp hết hạn</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {vehicles.filter(v => {
                      const expiryDate = new Date(v.warrantyExpiry);
                      const now = new Date();
                      const monthsToExpiry = (expiryDate - now) / (1000 * 60 * 60 * 24 * 30);
                      return monthsToExpiry <= 6 && monthsToExpiry > 0;
                    }).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo VIN, model, chủ xe..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
            >
              <option value="all">Tất cả dòng xe</option>
              <option value="VF8">VinFast VF8</option>
              <option value="VF9">VinFast VF9</option>
            </select>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thông tin xe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chủ sở hữu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thông số kỹ thuật
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bảo hành
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Car className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{vehicle.model}</div>
                      <div className="text-sm text-gray-500">{vehicle.vin}</div>
                      <div className="text-xs text-gray-400">
                        {vehicle.year} • {vehicle.color}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{vehicle.ownerName}</div>
                      <div className="text-sm text-gray-500">{vehicle.ownerId}</div>
                      <div className="text-xs text-gray-400 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {vehicle.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center mb-1">
                      <Battery className="h-3 w-3 mr-1 text-gray-400" />
                      {vehicle.batteryCapacity}
                    </div>
                    <div className="text-xs text-gray-500">
                      Phạm vi: {vehicle.range}
                    </div>
                    <div className="text-xs text-gray-500">
                      Km đã đi: {vehicle.mileage.toLocaleString()} km
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getWarrantyStatusColor(vehicle.warrantyStatus)}`}>
                      {getWarrantyStatusText(vehicle.warrantyStatus)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Hết hạn: {vehicle.warrantyExpiry}
                    </div>
                    <div className="text-xs text-gray-500">
                      {vehicle.totalClaims} yêu cầu BH
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(vehicle.status)}`}>
                    {getStatusText(vehicle.status)}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    BH cuối: {vehicle.lastService}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md bg-transparent">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md bg-transparent">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-500">
          Hiển thị {filteredVehicles.length} trong tổng số {vehicles.length} xe
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;
