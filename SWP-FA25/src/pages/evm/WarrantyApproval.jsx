import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Eye, Calendar, User, Car, Check, X, FileText, Loader2, Phone, Mail, AlertCircle, Shield, Image, UserPlus, Wrench } from 'lucide-react';
import api from '../../api/api';

// Helper functions
const getStatusColor = (status) => {
  switch (status) {
    case 'COMPLETED':
    case 'PROCESSING':
    case 'PROCESS':
    case 'APPROVED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'REJECTED':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'PENDING':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'COMPLETED':
    case 'PROCESSING':
    case 'PROCESS':
    case 'APPROVED':
      return 'Đã chấp nhận';
    case 'REJECTED':
      return 'Đã từ chối';
    case 'PENDING':
      return 'Chờ duyệt';
    default:
      return status;
  }
};

// Component bảng yêu cầu chờ duyệt
const PendingApprovalTable = ({ 
  claims, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  title, 
  onOpenApproveModal, 
  onOpenRejectModal, 
  onViewClaim,
  getStatusColor,
  getStatusText,
  Pagination
}) => (
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
            <option value="PENDING">Chờ duyệt</option>
          </select>
        </div>
      </div>
    </div>

    {/* Claims Table */}
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {claims.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có yêu cầu bảo hành</h3>
          <p className="mt-1 text-sm text-gray-500">Chưa có yêu cầu bảo hành nào trong danh sách này.</p>
        </div>
      ) : (
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{claim.id}</div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {claim.requestDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{claim.customer?.fullName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{claim.customer?.phone || ''}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Car className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{claim.vehicle?.modelName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{claim.vehicle?.vin || claim.vehicleVin}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-48">
                  <div className="text-sm text-gray-900 break-words" title={claim.issueDescription}>
                    {claim.issueDescription}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {claim.items && claim.items.length > 0 ? (
                    <div className="text-sm text-gray-900">
                      {claim.items.length === 1 ? (
                        <div title={`${claim.items[0].partName} (SL: ${claim.items[0].quantity})`}>
                          {claim.items[0].partName} (x{claim.items[0].quantity})
                        </div>
                      ) : (
                        <div className="group relative">
                          <div className="truncate max-w-xs cursor-help">
                            {claim.items[0].partName} và {claim.items.length - 1} phụ tùng khác
                          </div>
                          <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg -top-2 left-0 transform -translate-y-full w-64">
                            <div className="space-y-1">
                              {claim.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span>{item.partName}</span>
                                  <span className="ml-2">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Chưa có</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(claim.claimStatus)}`}>
                    {getStatusText(claim.claimStatus)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 text-white hover:text-white hover:bg-blue-600 rounded-md bg-blue-500 border border-gray-500"
                      title="Xem chi tiết"
                      onClick={() => onViewClaim(claim.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 text-white hover:text-white hover:bg-green-600 rounded-md bg-green-500 border border-gray-500"
                      title="Duyệt"
                      onClick={() => onOpenApproveModal(claim)}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 text-white hover:text-white hover:bg-red-600 rounded-md bg-red-500 border border-gray-500"
                      title="Từ chối"
                      onClick={() => onOpenRejectModal(claim)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {/* Pagination */}
      {claims.length > 0 && <Pagination />}
    </div>
  </>
);

// Component bảng yêu cầu đã xử lý
const ProcessedTable = ({ 
  claims, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  title, 
  onViewClaim,
  getStatusColor,
  getStatusText,
  Pagination
}) => (
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
            <option value="APPROVED">Đã chấp nhận</option>
            <option value="REJECTED">Đã từ chối</option>
          </select>
        </div>
      </div>
    </div>

    {/* Claims Table */}
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {claims.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có yêu cầu bảo hành</h3>
          <p className="mt-1 text-sm text-gray-500">Chưa có yêu cầu bảo hành nào trong danh sách này.</p>
        </div>
      ) : (
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{claim.id}</div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {claim.requestDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{claim.customer?.fullName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{claim.customer?.phone || ''}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Car className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{claim.vehicle?.modelName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{claim.vehicle?.vin || claim.vehicleVin}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-48">
                  <div className="text-sm text-gray-900 break-words" title={claim.issueDescription}>
                    {claim.issueDescription}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {claim.items && claim.items.length > 0 ? (
                    <div className="text-sm text-gray-900">
                      {claim.items.length === 1 ? (
                        <div title={`${claim.items[0].partName} (SL: ${claim.items[0].quantity})`}>
                          {claim.items[0].partName} (x{claim.items[0].quantity})
                        </div>
                      ) : (
                        <div className="group relative">
                          <div className="truncate max-w-xs cursor-help">
                            {claim.items[0].partName} và {claim.items.length - 1} phụ tùng khác
                          </div>
                          <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg -top-2 left-0 transform -translate-y-full w-64">
                            <div className="space-y-1">
                              {claim.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span>{item.partName}</span>
                                  <span className="ml-2">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Chưa có</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(claim.claimStatus)}`}>
                    {getStatusText(claim.claimStatus)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {claim.claimStatus === 'REJECTED' 
                    ? (claim.rejectedBy?.fullName || 'N/A')
                    : (claim.approvedBy?.fullName || 'N/A')
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 text-white hover:text-white hover:bg-blue-600 rounded-md bg-blue-500 border border-gray-500"
                      title="Xem chi tiết"
                      onClick={() => onViewClaim(claim.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {/* Pagination */}
      {claims.length > 0 && <Pagination />}
    </div>
  </>
);

const WarrantyApproval = () => {
  // State cho API và loading
  const [warrantyClaims, setWarrantyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // State cho tìm kiếm và filter
  const [searchTermPendingApproval, setSearchTermPendingApproval] = useState('');
  const [statusFilterPendingApproval, setStatusFilterPendingApproval] = useState('all');
  const [searchTermProcessed, setSearchTermProcessed] = useState('');
  const [statusFilterProcessed, setStatusFilterProcessed] = useState('all');

  // State cho modal approve
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [approving, setApproving] = useState(false);

  // State cho modal reject
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  // State cho modal view detail
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedViewClaim, setSelectedViewClaim] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Fetch warranty claims từ API
  const fetchWarrantyClaims = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/warranty/claims?page=${page}&size=${size}`);
      console.log('API Response:', response.data);
      
      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        setWarrantyClaims(response.data.content);
        setCurrentPage(response.data.page);
        setPageSize(response.data.size);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else if (response.data && Array.isArray(response.data)) {
        // Fallback for direct array response
        setWarrantyClaims(response.data);
      } else {
        console.warn('API response is not in expected format:', response.data);
        setWarrantyClaims([]);
        setError('Dữ liệu API không đúng định dạng.');
      }
    } catch (err) {
      setError('Không thể tải danh sách yêu cầu bảo hành. Vui lòng thử lại.');
      console.error('Error fetching warranty claims:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarrantyClaims(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Function để mở modal approve
  const handleOpenApproveModal = useCallback((claim) => {
    setSelectedClaim(claim);
    setApprovalNotes('');
    setShowApproveModal(true);
  }, []);

  // Function để approve warranty claim
  const handleApproveClaim = async () => {
    if (!selectedClaim) return;

    try {
      setApproving(true);
      const response = await api.put(`/warranty/claims/${selectedClaim.id}/approve`, {
        approvalNotes: approvalNotes || 'Đã phê duyệt'
      });

      if (response.status === 200) {
        // Close modal and refresh data
        setShowApproveModal(false);
        setSelectedClaim(null);
        setApprovalNotes('');
        fetchWarrantyClaims(currentPage, pageSize);
        alert('Yêu cầu bảo hành đã được phê duyệt thành công!');
      }
    } catch (err) {
      console.error('Error approving claim:', err);
      alert('Không thể phê duyệt yêu cầu bảo hành. Vui lòng thử lại.');
    } finally {
      setApproving(false);
    }
  };

  // Function để đóng modal
  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
    setSelectedClaim(null);
    setApprovalNotes('');
  };

  // Function để mở modal reject
  const handleOpenRejectModal = useCallback((claim) => {
    setSelectedClaim(claim);
    setRejectionReason('');
    setShowRejectModal(true);
  }, []);

  // Function để reject warranty claim
  const handleRejectClaim = async () => {
    if (!selectedClaim) return;

    try {
      setRejecting(true);
      const response = await api.put(`/warranty/claims/${selectedClaim.id}/reject`, {
        rejectionReason: rejectionReason || 'Đã từ chối'
      });

      if (response.status === 200) {
        // Close modal and refresh data
        setShowRejectModal(false);
        setSelectedClaim(null);
        setRejectionReason('');
        fetchWarrantyClaims(currentPage, pageSize);
        alert('Yêu cầu bảo hành đã được từ chối!');
      }
    } catch (err) {
      console.error('Error rejecting claim:', err);
      alert('Không thể từ chối yêu cầu bảo hành. Vui lòng thử lại.');
    } finally {
      setRejecting(false);
    }
  };

  // Function để đóng modal reject
  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setSelectedClaim(null);
    setRejectionReason('');
  };

  // Hàm xem chi tiết claim
  const handleViewClaim = useCallback(async (claimId) => {
    try {
      setViewLoading(true);
      setSelectedViewClaim(null);
      setShowViewModal(true);
      
      const response = await api.get(`/warranty/claims/${claimId}`);
      
      if (response.status === 200) {
        setSelectedViewClaim(response.data);
      }
    } catch (err) {
      console.error('Error fetching claim details:', err);
      setError('Không thể tải chi tiết yêu cầu bảo hành.');
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  }, []);

  // Phân loại yêu cầu bảo hành theo status (ẩn SELF_SERVICE)
  const pendingApprovalClaims = warrantyClaims.filter(claim => 
    claim.claimStatus === 'PENDING' && claim.processingType !== 'SELF_SERVICE'
  );

  const processedClaims = warrantyClaims.filter(claim => 
    (claim.claimStatus === 'REJECTED' || 
    claim.claimStatus === 'APPROVED' || 
    claim.claimStatus === 'PROCESSING' || 
    claim.claimStatus === 'PROCESS' || 
    claim.claimStatus === 'COMPLETED') &&
    claim.processingType !== 'SELF_SERVICE'
  );

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  // Pagination component
  const Pagination = () => (
    <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">{currentPage * pageSize + 1}</span> đến{' '}
            <span className="font-medium">{Math.min((currentPage + 1) * pageSize, totalElements)}</span> trong tổng số{' '}
            <span className="font-medium">{totalElements}</span> yêu cầu
          </p>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
            <option value={100}>100 / trang</option>
          </select>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === index
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </nav>
        </div>
      </div>
    </div>
  );

  const filteredPendingApprovalClaims = pendingApprovalClaims.filter((claim) => {
    const matchesSearch = 
      claim.id?.toString().toLowerCase().includes(searchTermPendingApproval.toLowerCase()) ||
      claim.customer?.fullName?.toLowerCase().includes(searchTermPendingApproval.toLowerCase()) ||
      claim.vehicleVin?.toLowerCase().includes(searchTermPendingApproval.toLowerCase()) ||
      claim.vehicle?.vin?.toLowerCase().includes(searchTermPendingApproval.toLowerCase());
    
    const matchesStatus = statusFilterPendingApproval === 'all' || claim.claimStatus === statusFilterPendingApproval;
    
    return matchesSearch && matchesStatus;
  });

  const filteredProcessedClaims = processedClaims.filter((claim) => {
    const matchesSearch = 
      claim.id?.toString().toLowerCase().includes(searchTermProcessed.toLowerCase()) ||
      claim.customer?.fullName?.toLowerCase().includes(searchTermProcessed.toLowerCase()) ||
      claim.vehicleVin?.toLowerCase().includes(searchTermProcessed.toLowerCase()) ||
      claim.vehicle?.vin?.toLowerCase().includes(searchTermProcessed.toLowerCase());
    
    const matchesStatus = statusFilterProcessed === 'all' || claim.claimStatus === statusFilterProcessed;
    
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
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchWarrantyClaims}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content - Only show when not loading */}
      {!loading && !error && (
        <>
          {/* Yêu cầu chờ duyệt */}
          <div className="space-y-6">
            <PendingApprovalTable 
              claims={filteredPendingApprovalClaims}
              searchTerm={searchTermPendingApproval}
              setSearchTerm={setSearchTermPendingApproval}
              statusFilter={statusFilterPendingApproval}
              setStatusFilter={setStatusFilterPendingApproval}
              title="Yêu cầu chờ duyệt"
              onOpenApproveModal={handleOpenApproveModal}
              onOpenRejectModal={handleOpenRejectModal}
              onViewClaim={handleViewClaim}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              Pagination={Pagination}
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
              onViewClaim={handleViewClaim}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              Pagination={Pagination}
            />
          </div>
        </>
      )}

      {/* Modal phê duyệt yêu cầu bảo hành */}
      {showApproveModal && selectedClaim && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Phê duyệt yêu cầu bảo hành
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn phê duyệt yêu cầu bảo hành <strong>{selectedClaim.id}</strong> không?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Khách hàng:</span>
                      <p className="text-gray-900">{selectedClaim.customer?.fullName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Xe:</span>
                      <p className="text-gray-900">{selectedClaim.vehicleModel || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">Vấn đề:</span>
                      <p className="text-gray-900">{selectedClaim.issueDescription}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">Báo cáo chẩn đoán:</span>
                      <p className="text-gray-900">{selectedClaim.diagnosisReport || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Ghi chú phê duyệt */}
                <div className="mt-4">
                  <label htmlFor="approvalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú phê duyệt
                  </label>
                  <textarea
                    id="approvalNotes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Nhập ghi chú phê duyệt..."
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Footer buttons */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleApproveClaim}
                  disabled={approving}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {approving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {approving ? 'Đang phê duyệt...' : 'Phê duyệt'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseApproveModal}
                  disabled={approving}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal từ chối yêu cầu bảo hành */}
      {showRejectModal && selectedClaim && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Từ chối yêu cầu bảo hành
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn từ chối yêu cầu bảo hành <strong>{selectedClaim.id}</strong> không?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Khách hàng:</span>
                      <p className="text-gray-900">{selectedClaim.customer?.fullName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Xe:</span>
                      <p className="text-gray-900">{selectedClaim.vehicleModel || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">Vấn đề:</span>
                      <p className="text-gray-900">{selectedClaim.issueDescription}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">Báo cáo chẩn đoán:</span>
                      <p className="text-gray-900">{selectedClaim.diagnosisReport || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Lý do từ chối */}
                <div className="mt-4">
                  <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do từ chối <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="rejectionReason"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    placeholder="Nhập lý do từ chối yêu cầu bảo hành..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              </div>

              {/* Footer buttons */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleRejectClaim}
                  disabled={rejecting || !rejectionReason.trim()}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {rejecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {rejecting ? 'Đang từ chối...' : 'Từ chối'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseRejectModal}
                  disabled={rejecting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết yêu cầu bảo hành */}
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
                      Chi tiết yêu cầu bảo hành
                    </h3>
                    {selectedViewClaim && (
                      <p className="text-sm font-semibold text-gray-500">
                        Mã yêu cầu: {selectedViewClaim.id}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedViewClaim(null);
                    }}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Loading state */}
                {viewLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-3 text-gray-600">Đang tải chi tiết...</span>
                  </div>
                ) : selectedViewClaim ? (
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
                            <span className="text-sm font-medium text-gray-700">Mã yêu cầu:</span>
                            <span className="text-sm font-semibold text-gray-900">{selectedViewClaim.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Ngày yêu cầu:</span>
                            <span className="text-sm text-gray-900">{selectedViewClaim.requestDate || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedViewClaim.claimStatus)}`}>
                              {getStatusText(selectedViewClaim.claimStatus)}
                            </span>
                          </div>
                          {selectedViewClaim.approvalDate && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Ngày duyệt:</span>
                              <span className="text-sm text-gray-900">{selectedViewClaim.approvalDate}</span>
                            </div>
                          )}
                          {selectedViewClaim.rejectedDate && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Ngày từ chối:</span>
                              <span className="text-sm text-gray-900">{selectedViewClaim.rejectedDate}</span>
                            </div>
                          )}
                          {selectedViewClaim.completionDate && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Ngày hoàn thành:</span>
                              <span className="text-sm text-gray-900">{selectedViewClaim.completionDate}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Loại xử lý:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              selectedViewClaim.processingType === 'MANUFACTURER_APPROVAL' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              selectedViewClaim.processingType === 'SELF_SERVICE' ? 'bg-green-100 text-green-800 border-green-200' :
                              selectedViewClaim.processingType === 'AUTO_APPROVED' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                              {selectedViewClaim.processingType === 'MANUFACTURER_APPROVAL' ? 'Hãng duyệt' :
                               selectedViewClaim.processingType === 'SELF_SERVICE' ? 'Tự xử lý' :
                               selectedViewClaim.processingType === 'AUTO_APPROVED' ? 'Tự động duyệt' :
                               selectedViewClaim.processingType || 'N/A'}
                            </span>
                          </div>
                          {selectedViewClaim.autoApprovedAt && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Tự động duyệt lúc:</span>
                              <span className="text-sm text-gray-900">{selectedViewClaim.autoApprovedAt}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Thông tin khách hàng */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <User className="h-5 w-5 mr-2 text-green-500" />
                          Thông tin khách hàng
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Tên khách hàng:</span>
                            <span className="text-sm text-gray-900">{selectedViewClaim.customer?.fullName || selectedViewClaim.customerName || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Số điện thoại:</span>
                            <span className="text-sm text-gray-900 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {selectedViewClaim.customer?.phone || selectedViewClaim.customerPhone || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Email:</span>
                            <span className="text-sm text-gray-900 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {selectedViewClaim.customer?.email || 'N/A'}
                            </span>
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
                            <span className="text-sm font-medium text-gray-700">VIN:</span>
                            <span className="text-sm font-semibold text-gray-900">{selectedViewClaim.vehicleVin || selectedViewClaim.vehicle?.vin || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Model:</span>
                            <span className="text-sm text-gray-900">{selectedViewClaim.vehicle?.modelName || selectedViewClaim.vehicleModel || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Năm sản xuất:</span>
                            <span className="text-sm text-gray-900">{selectedViewClaim.vehicle?.year || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Màu sắc:</span>
                            <span className="text-sm text-gray-900">{selectedViewClaim.vehicle?.color || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Thông tin phụ tùng */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-brown-500" />
                          Phụ tùng yêu cầu
                        </h4>
                        {selectedViewClaim.items && selectedViewClaim.items.length > 0 ? (
                          <div className="space-y-2">
                            {selectedViewClaim.items.map((item, index) => (
                              <div key={index} className="bg-white border border-gray-200 rounded-md p-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">{item.partName}</div>
                                    <div className="text-xs text-gray-500 mt-1">Mã: {item.partModelId}</div>
                                  </div>
                                  <div className="text-sm font-semibold text-blue-600">
                                    SL: {item.quantity}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Chưa có phụ tùng yêu cầu</p>
                        )}
                      </div>
                    </div>

                    {/* Mô tả vấn đề và chẩn đoán */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                          Mô tả vấn đề
                        </h4>
                        <p className="text-sm text-gray-900">{selectedViewClaim.issueDescription}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-yellow-500" />
                          Báo cáo chẩn đoán
                        </h4>
                        <p className="text-sm text-gray-900">{selectedViewClaim.diagnosisReport}</p>
                      </div>
                    </div>

                    {/* Thông tin người xử lý */}
                    {(selectedViewClaim.approvedBy || selectedViewClaim.rejectedBy) && (
                      <div className="mt-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <User className="h-5 w-5 mr-2 text-indigo-500" />
                            Người xử lý
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Tên:</span>
                              <span className="text-sm text-gray-900">
                                {selectedViewClaim.approvedBy?.fullName || selectedViewClaim.rejectedBy?.fullName || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Username:</span>
                              <span className="text-sm text-gray-900">
                                {selectedViewClaim.approvedBy?.username || selectedViewClaim.rejectedBy?.username || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Vai trò:</span>
                              <span className="text-sm text-gray-900">
                                {(selectedViewClaim.approvedBy?.role || selectedViewClaim.rejectedBy?.role) === 'EVM_STAFF' ? 'Nhân viên EVM' : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ghi chú và lý do */}
                    {(selectedViewClaim.approvalNotes || selectedViewClaim.rejectionReason || selectedViewClaim.selfServiceReason) && (
                      <div className="mt-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-purple-500" />
                            Ghi chú và lý do
                          </h4>
                          <div className="space-y-3">
                            {selectedViewClaim.approvalNotes && (
                              <div>
                                <span className="text-sm font-medium text-gray-700">Ghi chú duyệt:</span>
                                <p className="text-sm text-gray-900 mt-1">{selectedViewClaim.approvalNotes}</p>
                              </div>
                            )}
                            {selectedViewClaim.rejectionReason && (
                              <div>
                                <span className="text-sm font-medium text-gray-700">Lý do từ chối:</span>
                                <p className="text-sm text-gray-900 mt-1">{selectedViewClaim.rejectionReason}</p>
                              </div>
                            )}
                            {selectedViewClaim.selfServiceReason && (
                              <div>
                                <span className="text-sm font-medium text-gray-700">Lý do tự xử lý:</span>
                                <p className="text-sm text-gray-900 mt-1">{selectedViewClaim.selfServiceReason}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hình ảnh đính kèm */}
                    {selectedViewClaim.imageUrls && selectedViewClaim.imageUrls.length > 0 && (
                      <div className="mt-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <Image className="h-5 w-5 mr-2 text-lime-500" />
                            Hình ảnh đính kèm
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {selectedViewClaim.imageUrls.map((imageUrl, index) => (
                              <div key={index} className="bg-white border rounded-lg p-3 flex items-center space-x-2">
                                <Image className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-900 truncate">{imageUrl}</span>
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
                    <p className="mt-2 text-sm text-gray-500">Không thể tải thông tin yêu cầu bảo hành</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedViewClaim(null);
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

export default WarrantyApproval;