import React, { useState } from 'react';
import { Search, Plus, Eye, Calendar, User, Car, Check, X } from 'lucide-react';

const WarrantyApproval = () => {
  const [searchTermPendingApproval, setSearchTermPendingApproval] = useState('');
  const [statusFilterPendingApproval, setStatusFilterPendingApproval] = useState('all');
  const [searchTermProcessed, setSearchTermProcessed] = useState('');
  const [statusFilterProcessed, setStatusFilterProcessed] = useState('all');

  // Yêu cầu chờ duyệt từ SC
  const pendingApprovalClaims = [
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
      id: 'WC007',
      customerName: 'Phạm Văn I',
      vehicle: 'VinFast VF8',
      vin: 'VF8XXXXXXX890123',
      issue: 'Hỏng camera lùi',
      status: 'pending-approval',
      createdDate: '2024-09-13',
      requestedParts: 'Camera lùi, Module xử lý hình ảnh',
    },
    {
      id: 'WC008',
      customerName: 'Lê Thị K',
      vehicle: 'VinFast VF9',
      vin: 'VF9XXXXXXX456789',
      issue: 'Lỗi hệ thống điều hòa',
      status: 'pending-approval',
      createdDate: '2024-09-14',
      requestedParts: 'Compressor điều hòa, Cảm biến nhiệt độ',
    },
  ];

  // Yêu cầu đã xử lý (duyệt hoặc từ chối)
  const processedClaims = [
    {
      id: 'WC006',
      customerName: 'Nguyễn Thị H',
      vehicle: 'VinFast VF9',
      vin: 'VF9XXXXXXX234567',
      issue: 'Màn hình giải trí không hoạt động',
      status: 'rejected',
      createdDate: '2024-09-11',
      requestedParts: 'Màn hình trung tâm 15.6 inch',
      processedDate: '2024-09-12',
      processor: 'Nguyễn Văn Admin',
      rejectionReason: 'Không thuộc phạm vi bảo hành',
    },
    {
      id: 'WC004',
      customerName: 'Đỗ Văn F',
      vehicle: 'VinFast VF9',
      vin: 'VF9XXXXXXX901234',
      issue: 'Tiếng ồn động cơ',
      status: 'approved',
      createdDate: '2024-09-07',
      requestedParts: 'Gối đỡ động cơ, Cao su chống rung',
      processedDate: '2024-09-08',
      processor: 'Trần Thị Admin',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
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
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'pending-approval':
        return 'Chờ duyệt';
      default:
        return status;
    }
  };

  // Component bảng yêu cầu chờ duyệt
  const PendingApprovalTable = ({ claims, searchTerm, setSearchTerm, statusFilter, setStatusFilter, title }) => (
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
              <option value="all">Tất cả yêu cầu</option>
              <option value="pending-approval">Chờ duyệt</option>
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
                <td className="px-6 py-4 max-w-48">
                  <div className="text-sm text-gray-900 break-words">
                    {claim.issue}
                  </div>
                </td>
                <td className="px-6 py-4 max-w-48">
                  <div className="text-sm text-gray-900 break-words">
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
                    <button 
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md bg-transparent"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md bg-transparent"
                      title="Duyệt"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md bg-transparent"
                      title="Từ chối"
                    >
                      <X className="h-4 w-4" />
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
            Hiển thị {claims.length} yêu cầu chờ duyệt
          </div>
        </div>
      </div>
    </>
  );

  // Component bảng yêu cầu đã xử lý
  const ProcessedTable = ({ claims, searchTerm, setSearchTerm, statusFilter, setStatusFilter, title }) => (
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
              <option value="approved">Đã duyệt</option>
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
                Người xử lý
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
                <td className="px-6 py-4 max-w-48">
                  <div className="text-sm text-gray-900 break-words">
                    {claim.issue}
                  </div>
                </td>
                <td className="px-6 py-4 max-w-48">
                  <div className="text-sm text-gray-900 break-words">
                    {claim.requestedParts}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                    {getStatusText(claim.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {claim.processor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md bg-transparent"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
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
            Hiển thị {claims.length} yêu cầu đã xử lý
          </div>
        </div>
      </div>
    </>
  );

  const filteredPendingApprovalClaims = pendingApprovalClaims.filter((claim) => {
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchTermPendingApproval.toLowerCase()) ||
      claim.customerName.toLowerCase().includes(searchTermPendingApproval.toLowerCase()) ||
      claim.vin.toLowerCase().includes(searchTermPendingApproval.toLowerCase());
    
    const matchesStatus = statusFilterPendingApproval === 'all' || claim.status === statusFilterPendingApproval;
    
    return matchesSearch && matchesStatus;
  });

  const filteredProcessedClaims = processedClaims.filter((claim) => {
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchTermProcessed.toLowerCase()) ||
      claim.customerName.toLowerCase().includes(searchTermProcessed.toLowerCase()) ||
      claim.vin.toLowerCase().includes(searchTermProcessed.toLowerCase());
    
    const matchesStatus = statusFilterProcessed === 'all' || claim.status === statusFilterProcessed;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Duyệt yêu cầu bảo hành</h1>
          <p className="mt-1 text-sm text-gray-500">
            Xem xét và phê duyệt các yêu cầu bảo hành từ các trung tâm dịch vụ
          </p>
        </div>
      </div>

      {/* Yêu cầu chờ duyệt */}
      <div className="space-y-6">
        <PendingApprovalTable 
          claims={filteredPendingApprovalClaims}
          searchTerm={searchTermPendingApproval}
          setSearchTerm={setSearchTermPendingApproval}
          statusFilter={statusFilterPendingApproval}
          setStatusFilter={setStatusFilterPendingApproval}
          title="Yêu cầu chờ duyệt"
        />
      </div>

      {/* Yêu cầu đã xử lý */}
      <div className="space-y-6">
        <ProcessedTable 
          claims={filteredProcessedClaims}
          searchTerm={searchTermProcessed}
          setSearchTerm={setSearchTermProcessed}
          statusFilter={statusFilterProcessed}
          setStatusFilter={setStatusFilterProcessed}
          title="Yêu cầu đã xử lý"
        />
      </div>
    </div>
  );
};

export default WarrantyApproval;