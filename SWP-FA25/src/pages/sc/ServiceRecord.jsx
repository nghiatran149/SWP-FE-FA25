import React, { useState, useEffect } from 'react';
import { Search, Eye, Calendar, User, Car, FileText, Wrench, Replace, AlertCircle, X } from 'lucide-react';
import api from '../../api/api';

const ServiceRecord = () => {
  // State cho API và loading
  const [serviceRecords, setServiceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho tìm kiếm và filter
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');

  // State cho modal xem chi tiết
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Fetch service records từ API
  const fetchServiceRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/services');
      console.log('API Response:', response.data);

      if (response.data && Array.isArray(response.data)) {
        setServiceRecords(response.data);
      } else {
        console.warn('API response is not in expected format:', response.data);
        setServiceRecords([]);
        setError('Dữ liệu API không đúng định dạng.');
      }
    } catch (err) {
      setError('Không thể tải danh sách lịch sử dịch vụ. Vui lòng thử lại.');
      console.error('Error fetching service records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceRecords();
  }, []);

  // Hàm xem chi tiết record
  const handleViewRecord = async (recordId) => {
    try {
      setViewLoading(true);
      setSelectedRecord(null);
      setShowViewModal(true);

      const response = await api.get(`/services/${recordId}`);

      if (response.status === 200) {
        setSelectedRecord(response.data);
      }
    } catch (err) {
      console.error('Error fetching record details:', err);
      setError('Không thể tải chi tiết lịch sử dịch vụ.');
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  const getServiceTypeColor = (type) => {
    switch (type) {
      case 'WARRANTY_REPAIR':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'WARRANTY_REPLACE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getServiceTypeText = (type) => {
    switch (type) {
      case 'WARRANTY_REPAIR':
        return 'Sửa chữa bảo hành';
      case 'WARRANTY_REPLACE':
        return 'Thay thế bảo hành';
      default:
        return type || 'N/A';
    }
  };

  // Hàm format ngày
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Filter records
  const filteredRecords = serviceRecords.filter((record) => {
    const matchesSearch =
      record.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicleVin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicleModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.technicianName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesServiceType = serviceTypeFilter === 'all' || record.serviceType === serviceTypeFilter;

    return matchesSearch && matchesServiceType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lịch sử dịch vụ bảo hành</h1>
        <p className="mt-1 text-sm text-gray-500">
          Xem lại các dịch vụ bảo hành đã thực hiện
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng số dịch vụ</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{serviceRecords.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Replace className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Thay thế bảo hành</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {serviceRecords.filter(r => r.serviceType === 'WARRANTY_REPLACE').length}
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
                <Wrench className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Sửa chữa bảo hành</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {serviceRecords.filter(r => r.serviceType === 'WARRANTY_REPAIR').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchServiceRecords}
                className="mt-2 text-sm bg-red-100 text-red-700 rounded px-3 py-1 hover:bg-red-200"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã dịch vụ, VIN, model xe, kỹ thuật viên..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  value={serviceTypeFilter}
                  onChange={(e) => setServiceTypeFilter(e.target.value)}
                >
                  <option value="all">Tất cả loại dịch vụ</option>
                  <option value="WARRANTY_REPAIR">Sửa chữa bảo hành</option>
                  <option value="WARRANTY_REPLACE">Thay thế bảo hành</option>
                </select>
              </div>
            </div>
          </div>

          {/* Service Records Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lịch sử dịch vụ</h3>
                <p className="mt-1 text-sm text-gray-500">Chưa có dịch vụ bảo hành nào được thực hiện.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã dịch vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã xe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Xe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kỹ thuật viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại dịch vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày & Chi phí
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.id}</div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(record.serviceDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.vehicleId || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Km: {record.mileage?.toLocaleString() || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Car className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {record.vehicleModel || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.vehicleVin || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Wrench className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {record.technicianName || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID KTV: {record.technicianId || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getServiceTypeColor(record.serviceType)}`}>
                          {getServiceTypeText(record.serviceType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(record.serviceDate)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Chi phí: {record.cost?.toLocaleString() || 0} VNĐ
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewRecord(record.id)}
                          className="p-2 text-white hover:text-white hover:bg-blue-600 rounded-md bg-blue-500 border border-gray-500"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">
              Hiển thị {filteredRecords.length} trong tổng số {serviceRecords.length} dịch vụ
            </div>
          </div>
        </>
      )}

      {/* Modal xem chi tiết dịch vụ */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Chi tiết lịch sử dịch vụ
                    </h3>
                    {selectedRecord && (
                      <p className="text-sm font-semibold text-gray-500">
                        Mã dịch vụ: #{selectedRecord.id}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedRecord(null);
                    }}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Loading state */}
                {viewLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Đang tải chi tiết...</span>
                  </div>
                ) : selectedRecord ? (
                  <div className="max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Thông tin cơ bản */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-blue-500" />
                          Thông tin cơ bản
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Mã dịch vụ:</span>
                            <span className="text-sm font-semibold text-gray-900">{selectedRecord.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Loại dịch vụ:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getServiceTypeColor(selectedRecord.serviceType)}`}>
                              {getServiceTypeText(selectedRecord.serviceType)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Ngày dịch vụ:</span>
                            <span className="text-sm text-gray-900">{formatDate(selectedRecord.serviceDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Số km:</span>
                            <span className="text-sm text-gray-900">{selectedRecord.mileage?.toLocaleString() || 0} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Ngày tạo:</span>
                            <span className="text-sm text-gray-900">{formatDate(selectedRecord.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Thông tin xe */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <Car className="h-5 w-5 mr-2 text-teal-500" />
                          Thông tin xe
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Mã xe:</span>
                            <span className="text-sm font-semibold text-gray-900">{selectedRecord.vehicleId || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">VIN:</span>
                            <span className="text-sm font-semibold text-gray-900">{selectedRecord.vehicleVin || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Model:</span>
                            <span className="text-sm text-gray-900">{selectedRecord.vehicleModel || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Số km:</span>
                            <span className="text-sm text-gray-900">{selectedRecord.mileage?.toLocaleString() || 0} km</span>
                          </div>
                        </div>
                      </div>

                      {/* Thông tin kỹ thuật viên */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <Wrench className="h-5 w-5 mr-2 text-orange-500" />
                          Thông tin kỹ thuật viên
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Tên:</span>
                            <span className="text-sm text-gray-900">{selectedRecord.technicianName || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Mã KTV:</span>
                            <span className="text-sm text-gray-900">{selectedRecord.technicianId || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Chi phí */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-green-500" />
                          Chi phí
                        </h4>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Tổng chi phí:</span>
                          <span className="text-lg font-bold text-green-600">
                            {selectedRecord.cost?.toLocaleString() || 0} VNĐ
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mô tả công việc */}
                    <div className="mt-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                          Mô tả công việc
                        </h4>
                        <p className="text-sm text-gray-900 whitespace-pre-line">{selectedRecord.description || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Phụ tùng thay thế */}
                    {selectedRecord.replacedParts && selectedRecord.replacedParts.length > 0 && (
                      <div className="mt-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <Wrench className="h-5 w-5 mr-2 text-blue-500" />
                            Phụ tùng thay thế ({selectedRecord.replacedParts.length})
                          </h4>
                          <div className="space-y-2">
                            {selectedRecord.replacedParts.map((part, index) => (
                              <div key={index} className="bg-white border border-gray-200 rounded-md p-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">{part.partName}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Mã: {part.partNumber} | Serial: {part.serialNumber}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Danh mục: {part.category}
                                    </div>
                                    {part.installDate && (
                                      <div className="text-xs text-gray-500">
                                        Ngày lắp: {formatDate(part.installDate)}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${part.installed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                      }`}>
                                      {part.installed ? 'Đã lắp' : 'Chưa lắp'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}


                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Không thể tải thông tin dịch vụ</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedRecord(null);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRecord;
