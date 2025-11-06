import React, { useState, useEffect } from 'react';
import { Search, Shield, Calendar, CheckCircle, XCircle, FileText, Loader2, AlertCircle, Clock, Eye, X } from 'lucide-react';
import api from '../../api/api';

// Helper function for active status
const getActiveStatusColor = (isActive) => {
  return isActive 
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-gray-100 text-gray-800 border-gray-200';
};

const getActiveStatusText = (isActive) => {
  return isActive ? 'Đang áp dụng' : 'Không áp dụng';
};

const WarrantyPolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Fetch policies from API
  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/policies');
      setPolicies(response.data || []);
    } catch (err) {
      console.error('Error fetching policies:', err);
      setError('Không thể tải danh sách chính sách bảo hành. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Filter policies
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = 
      policy.policyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && policy.isActive) ||
      (statusFilter === 'inactive' && !policy.isActive);

    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Handle view policy
  const handleViewPolicy = async (policy) => {
    try {
      setViewLoading(true);
      setShowViewModal(true);
      setSelectedPolicy(null);
      
      const response = await api.get(`/admin/policies/${policy.id}`);
      setSelectedPolicy(response.data);
    } catch (err) {
      console.error('Error fetching policy details:', err);
      setError('Không thể tải chi tiết chính sách. Vui lòng thử lại.');
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chính sách bảo hành</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý và xem các chính sách bảo hành cho phương tiện
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên chính sách, model xe, hãng..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang áp dụng</option>
              <option value="inactive">Không áp dụng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredPolicies.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có chính sách bảo hành</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Không tìm thấy chính sách bảo hành phù hợp với bộ lọc.'
                : 'Chưa có chính sách bảo hành nào trong hệ thống.'}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã chính sách
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên chính sách
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model xe / Hãng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời hạn BH
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Km giới hạn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điều khoản chung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày hiệu lực
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
              {filteredPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{policy.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{policy.policyName}</div>
                    <div className="text-sm text-gray-500 mt-1 max-w-xs truncate" title={policy.description}>
                      {policy.description || 'Không có mô tả'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{policy.modelName}</div>
                    <div className="text-sm text-gray-500">{policy.brand} ({policy.year})</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      {policy.warrantyPeriodMonths} tháng
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {policy.warrantyMileageLimit?.toLocaleString('vi-VN')} km
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={policy.generalTerms}>
                      {policy.generalTerms || 'Không có điều khoản'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="font-medium text-green-600">
                          {formatDate(policy.effectiveDate)}
                        </span>
                      </div>
                      {policy.expiryDate && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="text-red-600 font-medium">
                            {formatDate(policy.expiryDate)}
                          </span>
                        </div>
                      )}
                      {!policy.expiryDate && (
                        <div className="text-xs text-gray-500 ml-5">
                          Không giới hạn
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActiveStatusColor(policy.isActive)}`}>
                      {policy.isActive ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {getActiveStatusText(policy.isActive)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewPolicy(policy)}
                      className="p-2 text-white hover:text-white hover:bg-blue-600 rounded-md bg-blue-500 border border-gray-500"
                      title="Xem chi tiết"
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

      {/* View Policy Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {viewLoading ? (
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 text-center">
                  <Loader2 className="animate-spin h-8 w-8 text-purple-500 mx-auto" />
                  <p className="mt-2 text-gray-500">Đang tải thông tin chính sách...</p>
                </div>
              </div>
            ) : selectedPolicy ? (
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Chi tiết chính sách bảo hành
                    </h3>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-purple-500" />
                        Thông tin cơ bản
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Mã chính sách:</span>
                          <span className="font-medium">{selectedPolicy.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tên chính sách:</span>
                          <span className="font-medium">{selectedPolicy.policyName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Trạng thái:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getActiveStatusColor(selectedPolicy.isActive)}`}>
                            {selectedPolicy.isActive ? (
                              <CheckCircle className="h-3 w-3 mr-1 inline" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1 inline" />
                            )}
                            {getActiveStatusText(selectedPolicy.isActive)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                        Thông tin phương tiện
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Model xe:</span>
                          <span className="font-medium">{selectedPolicy.modelName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Hãng:</span>
                          <span className="font-medium">{selectedPolicy.brand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Năm sản xuất:</span>
                          <span className="font-medium">{selectedPolicy.year}</span>
                        </div>
                      </div>
                    </div>

                    {/* Warranty Terms */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-green-500" />
                        Điều khoản bảo hành
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Thời hạn bảo hành:</span>
                          <span className="font-medium">{selectedPolicy.warrantyPeriodMonths} tháng</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Km giới hạn:</span>
                          <span className="font-medium">{selectedPolicy.warrantyMileageLimit?.toLocaleString('vi-VN')} km</span>
                        </div>
                      </div>
                    </div>

                    {/* Validity Period */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-yellow-500" />
                        Thời gian hiệu lực
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Ngày bắt đầu:</span>
                          <span className="font-medium">{formatDate(selectedPolicy.effectiveDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Ngày kết thúc:</span>
                          <span className="font-medium">{selectedPolicy.expiryDate ? formatDate(selectedPolicy.expiryDate) : 'Không giới hạn'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-orange-500" />
                        Mô tả
                      </h4>
                      <p className="text-sm text-gray-700">{selectedPolicy.description || 'Không có mô tả'}</p>
                    </div>

                    {/* General Terms */}
                    <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-red-500" />
                        Điều khoản chung
                      </h4>
                      <p className="text-sm text-gray-700">{selectedPolicy.generalTerms || 'Không có điều khoản'}</p>
                    </div>

                    {/* Timestamps */}
                    <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Thông tin hệ thống</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Ngày tạo:</span>
                          <span className="font-medium">{formatDate(selectedPolicy.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Cập nhật lần cuối:</span>
                          <span className="font-medium">{formatDate(selectedPolicy.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setShowViewModal(false)}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default WarrantyPolicy;
