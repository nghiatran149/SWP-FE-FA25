import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Calendar, User, Car } from 'lucide-react';

const WarrantyClaims = () => {
  const [searchTermSentToManufacturer, setSearchTermSentToManufacturer] = useState('');
  const [statusFilterSentToManufacturer, setStatusFilterSentToManufacturer] = useState('all');
  const [searchTermProcessing, setSearchTermProcessing] = useState('');
  const [statusFilterProcessing, setStatusFilterProcessing] = useState('all');

  // Yêu cầu gửi sang hãng (chờ duyệt hoặc từ chối)
  const sentToManufacturerClaims = [
    {
      id: 'WC005',
      customerName: 'Trần Văn G',
      vehicle: 'VinFast VF8',
      vin: 'VF8XXXXXXX567890',
      issue: 'Lỗi cảm biến áp suất lốp',
      status: 'pending-approval',
      createdDate: '2024-09-12',
      requestedParts: 'Cảm biến áp suất lốp, Dây cáp kết nối',
    },
    {
      id: 'WC006',
      customerName: 'Nguyễn Thị H',
      vehicle: 'VinFast VF9',
      vin: 'VF9XXXXXXX234567',
      issue: 'Màn hình giải trí không hoạt động',
      status: 'rejected',
      createdDate: '2024-09-11',
      requestedParts: 'Màn hình trung tâm 15.6 inch',
    },
    {
      id: 'WC007',
      customerName: 'Phạm Văn I',
      vehicle: 'VinFast VF8',
      vin: 'VF8XXXXXXX890123',
      issue: 'Hỏng camera lùi',
      status: 'pending-approval',
      createdDate: '2024-09-13',
      requestedParts: 'Camera lùi, Module xử lý hình ảnh',
    },
  ];

  // Yêu cầu đang xử lí (đang xử lý hoặc chờ xử lý)
  const processingClaims = [
    {
      id: 'WC001',
      customerName: 'Nguyễn Văn A',
      vehicle: 'VinFast VF8',
      vin: 'VF8XXXXXXX123456',
      issue: 'Lỗi pin không sạc được',
      status: 'processing',
      priority: 'high',
      createdDate: '2024-09-10',
      assignee: 'Trần Thị B',
      estimatedCompletion: '2024-09-15',
    },
    {
      id: 'WC003',
      customerName: 'Hoàng Thị E',
      vehicle: 'VinFast VF8',
      vin: 'VF8XXXXXXX345678',
      issue: 'Lỗi phần mềm điều khiển',
      status: 'pending',
      priority: 'low',
      createdDate: '2024-09-08',
      assignee: 'Chưa phân công',
      estimatedCompletion: '2024-09-20',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending-approval':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      case 'rejected':
        return 'Từ chối';
      case 'pending-approval':
        return 'Chờ duyệt';
      default:
        return status;
    }
  };

  // Component con để render bảng yêu cầu gửi sang hãng
  const SentToManufacturerTable = ({ claims, searchTerm, setSearchTerm, statusFilter, setStatusFilter, title }) => (
    <>
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã, tên khách hàng, VIN..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending-approval">Chờ duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã yêu cầu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Xe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vấn đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phụ tùng yêu cầu
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
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {claim.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm font-medium text-gray-900">{claim.customerName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {claim.createdDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Car className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{claim.vehicle}</div>
                      <div className="text-sm text-gray-500">{claim.vin}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate" title={claim.issue}>
                    {claim.issue}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate" title={claim.requestedParts}>
                    {claim.requestedParts}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                    {getStatusText(claim.status)}
                  </span>
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

        {/* Summary */}
        <div className="bg-gray-50 px-6 py-3">
          <div className="text-sm text-gray-500">
            Hiển thị {claims.length} yêu cầu bảo hành
          </div>
        </div>
      </div>
    </>
  );

  // Component con để render bảng yêu cầu đang xử lí
  const ProcessingClaimsTable = ({ claims, searchTerm, setSearchTerm, statusFilter, setStatusFilter, title }) => (
    <>
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã, tên khách hàng, VIN..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã yêu cầu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Xe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vấn đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kỹ thuật viên
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
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {claim.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm font-medium text-gray-900">{claim.customerName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {claim.createdDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Car className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{claim.vehicle}</div>
                      <div className="text-sm text-gray-500">{claim.vin}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate" title={claim.issue}>
                    {claim.issue}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {claim.assignee}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                    {getStatusText(claim.status)}
                  </span>
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

        {/* Summary */}
        <div className="bg-gray-50 px-6 py-3">
          <div className="text-sm text-gray-500">
            Hiển thị {claims.length} yêu cầu bảo hành
          </div>
        </div>
      </div>
    </>
  );

  const filteredSentToManufacturerClaims = sentToManufacturerClaims.filter((claim) => {
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchTermSentToManufacturer.toLowerCase()) ||
      claim.customerName.toLowerCase().includes(searchTermSentToManufacturer.toLowerCase()) ||
      claim.vin.toLowerCase().includes(searchTermSentToManufacturer.toLowerCase());
    
    const matchesStatus = statusFilterSentToManufacturer === 'all' || claim.status === statusFilterSentToManufacturer;
    
    return matchesSearch && matchesStatus;
  });

  const filteredProcessingClaims = processingClaims.filter((claim) => {
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchTermProcessing.toLowerCase()) ||
      claim.customerName.toLowerCase().includes(searchTermProcessing.toLowerCase()) ||
      claim.vin.toLowerCase().includes(searchTermProcessing.toLowerCase());
    
    const matchesStatus = statusFilterProcessing === 'all' || claim.status === statusFilterProcessing;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý yêu cầu bảo hành</h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi và xử lý các yêu cầu bảo hành từ khách hàng
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Tạo yêu cầu mới
        </button>
      </div>

      {/* Yêu cầu gửi sang hãng */}
      <div className="space-y-6">
        <SentToManufacturerTable 
          claims={filteredSentToManufacturerClaims}
          searchTerm={searchTermSentToManufacturer}
          setSearchTerm={setSearchTermSentToManufacturer}
          statusFilter={statusFilterSentToManufacturer}
          setStatusFilter={setStatusFilterSentToManufacturer}
          title="Yêu cầu gửi sang hãng"
        />
      </div>

      {/* Yêu cầu đang xử lí */}
      <div className="space-y-6">
        <ProcessingClaimsTable 
          claims={filteredProcessingClaims}
          searchTerm={searchTermProcessing}
          setSearchTerm={setSearchTermProcessing}
          statusFilter={statusFilterProcessing}
          setStatusFilter={setStatusFilterProcessing}
          title="Yêu cầu đang xử lí"
        />
      </div>
    </div>
  );
};

export default WarrantyClaims;
