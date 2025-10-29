import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Calendar, User, UserPlus, Car, X, FileText, Loader2, Phone, Mail, AlertCircle, Shield, Wrench } from 'lucide-react';
import api from '../../api/api';

// Helper functions
const getStatusColor = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'PROCESS':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'APPROVED':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'REJECTED':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'PENDING':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'Hoàn thành';
    case 'PROCESSING':
    case 'PROCESS':
      return 'Đang xử lý';
    case 'APPROVED':
      return 'Chờ phân công';
    case 'REJECTED':
      return 'Từ chối';
    case 'PENDING':
      return 'Chờ duyệt';
    default:
      return status;
  }
};

const getProcessingTypeText = (type) => {
  switch (type) {
    case 'MANUFACTURER_APPROVAL':
      return 'Hãng duyệt';
    case 'SELF_SERVICE':
      return 'Tự xử lý';
    case 'AUTO_APPROVED':
      return 'Tự động duyệt';
    default:
      return type || 'N/A';
  }
};

const getProcessingTypeColor = (type) => {
  switch (type) {
    case 'MANUFACTURER_APPROVAL':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'SELF_SERVICE':
      return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'AUTO_APPROVED':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Component con để render bảng yêu cầu gửi sang hãng
const SentToManufacturerTable = ({ 
  claims, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  title, 
  setShowAddModal,
  handleViewClaim,
  Pagination
}) => (
  <>
    {/* Title */}
    <div className="mb-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <button
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-500 hover:bg-purple-600"
        onClick={() => setShowAddModal(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Tạo yêu cầu cho hãng
      </button>
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
            <option value="PENDING">Chờ duyệt</option>
            <option value="REJECTED">Từ chối</option>
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
        <>
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
                  Loại xử lý
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
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs" style={{ maxWidth: '250px' }}>
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getProcessingTypeColor(claim.processingType)}`}>
                      {getProcessingTypeText(claim.processingType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(claim.claimStatus)}`}>
                      {getStatusText(claim.claimStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewClaim(claim.id)}
                        className="p-2 text-white hover:text-white hover:bg-blue-600 rounded-md bg-blue-500 border border-gray-500"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-white hover:text-white hover:bg-yellow-600 rounded-md bg-yellow-500 border border-gray-500">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination />
        </>
      )}
    </div>
  </>
);

// Component con để render bảng yêu cầu đang xử lí
const ProcessingClaimsTable = ({ 
  claims, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  processingTypeFilter, 
  setProcessingTypeFilter, 
  title, 
  setShowAddSelfServiceModal,
  handleViewClaim,
  handleOpenAssignModal,
  Pagination
}) => (
  <>
    {/* Title */}
    <div className="mb-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <button
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600"
        onClick={() => setShowAddSelfServiceModal(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Tạo yêu cầu tự xử lí
      </button>
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
            <option value="APPROVED">Chờ phân công</option>
            <option value="PROCESS">Đang xử lý</option>
            <option value="COMPLETED">Hoàn thành</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={processingTypeFilter}
            onChange={(e) => setProcessingTypeFilter(e.target.value)}
          >
            <option value="all">Tất cả loại</option>
            <option value="MANUFACTURER_APPROVAL">Hãng duyệt</option>
            <option value="SELF_SERVICE">Tự xử lí</option>
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
        <>
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
                  Kỹ thuật viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại xử lý
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
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs" style={{ maxWidth: '250px' }}>
                      {claim.issueDescription}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {claim.technician?.fullName || 'Chưa phân công'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getProcessingTypeColor(claim.processingType)}`}>
                      {getProcessingTypeText(claim.processingType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(claim.claimStatus)}`}>
                      {getStatusText(claim.claimStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewClaim(claim.id)}
                        className="p-2 text-white hover:text-white hover:bg-blue-600 rounded-md bg-blue-500 border border-gray-500"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-white hover:text-white hover:bg-yellow-600 rounded-md bg-yellow-500 border border-gray-500">
                        <Edit className="h-4 w-4" />
                      </button>
                      {claim.claimStatus === 'APPROVED' && (
                        <button 
                          onClick={() => handleOpenAssignModal(claim)}
                          className="p-2 text-white hover:text-white hover:bg-orange-600 rounded-md bg-orange-500 border border-gray-500"
                          title="Phân công kỹ thuật viên"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination />
        </>
      )}
    </div>
  </>
);

const WarrantyClaims = () => {
  // State cho API và loading
  const [warrantyClaims, setWarrantyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // State cho tìm kiếm và filter
  const [searchTermSentToManufacturer, setSearchTermSentToManufacturer] = useState('');
  const [statusFilterSentToManufacturer, setStatusFilterSentToManufacturer] = useState('all');
  const [searchTermProcessing, setSearchTermProcessing] = useState('');
  const [statusFilterProcessing, setStatusFilterProcessing] = useState('all');
  const [processingTypeFilter, setProcessingTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSelfServiceModal, setShowAddSelfServiceModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  
  // State cho modal phân công công việc
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [selectedClaimForAssign, setSelectedClaimForAssign] = useState(null);
  const [availableTechnicians, setAvailableTechnicians] = useState([]);
  const [assignFormData, setAssignFormData] = useState({
    assignedToId: '',
    dueDate: '',
    priority: 'MEDIUM',
    workDescription: '',
    notes: '',
    estimatedHours: ''
  });

  // State cho parts (cho modal tạo yêu cầu cho hãng)
  const [availableParts, setAvailableParts] = useState([]);
  const [partsLoading, setPartsLoading] = useState(false);
  const [selectedPartToAdd, setSelectedPartToAdd] = useState('');
  const [partQuantity, setPartQuantity] = useState(1);
  const [partSearchTerm, setPartSearchTerm] = useState('');
  const [partCategoryFilter, setPartCategoryFilter] = useState('all');

  // State cho parts (cho modal tự xử lí)
  const [availablePartsSelf, setAvailablePartsSelf] = useState([]);
  const [partsLoadingSelf, setPartsLoadingSelf] = useState(false);
  const [selectedPartToAddSelf, setSelectedPartToAddSelf] = useState('');
  const [partQuantitySelf, setPartQuantitySelf] = useState(1);
  const [partSearchTermSelf, setPartSearchTermSelf] = useState('');
  const [partCategoryFilterSelf, setPartCategoryFilterSelf] = useState('all');

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

  // Fetch available parts
  const fetchAvailableParts = async () => {
    try {
      setPartsLoading(true);
      const response = await api.get('/parts/models');
      if (response.status === 200 && Array.isArray(response.data)) {
        setAvailableParts(response.data);
      }
    } catch (err) {
      console.error('Error fetching parts:', err);
      setError('Không thể tải danh sách phụ tùng.');
    } finally {
      setPartsLoading(false);
    }
  };

  // Fetch parts khi mở modal
  useEffect(() => {
    if (showAddModal) {
      fetchAvailableParts();
    }
  }, [showAddModal]);

  // Fetch parts cho modal tự xử lí
  const fetchAvailablePartsSelf = async () => {
    try {
      setPartsLoadingSelf(true);
      const response = await api.get('/parts/models');
      if (response.status === 200 && Array.isArray(response.data)) {
        setAvailablePartsSelf(response.data);
      }
    } catch (err) {
      console.error('Error fetching parts:', err);
      setError('Không thể tải danh sách phụ tùng.');
    } finally {
      setPartsLoadingSelf(false);
    }
  };

  useEffect(() => {
    if (showAddSelfServiceModal) {
      fetchAvailablePartsSelf();
    }
  }, [showAddSelfServiceModal]);

  // Form state cho modal tạo yêu cầu bảo hành
  const [formData, setFormData] = useState({
    vin: '',
    issueDescription: '',
    diagnosisReport: '',
    requestDate: '',
    partModelQuantities: {}
  });

  // Form state cho modal tạo yêu cầu tự xử lí
  const [formDataSelf, setFormDataSelf] = useState({
    vin: '',
    issueDescription: '',
    diagnosisReport: '',
    requestDate: '',
    partModelQuantities: {},
    selfServiceReason: ''
  });

  // Phân loại yêu cầu bảo hành theo status
  const sentToManufacturerClaims = warrantyClaims.filter(claim =>
    claim.claimStatus === 'PENDING' || claim.claimStatus === 'REJECTED'
  );

  const processingClaims = warrantyClaims.filter(claim =>
    claim.claimStatus === 'APPROVED' ||
    claim.claimStatus === 'PROCESSING' ||
    claim.claimStatus === 'PROCESS' ||
    claim.claimStatus === 'COMPLETED'
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
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index
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

  // Hàm thêm warranty claim mới
  const handleAddWarrantyClaim = async (e) => {
    if (e) e.preventDefault();
    setAddLoading(true);

    try {
      const claimData = {
        vin: formData.vin,
        issueDescription: formData.issueDescription,
        diagnosisReport: formData.diagnosisReport,
        requestDate: formData.requestDate,
        partModelQuantities: formData.partModelQuantities
      };

      console.log('Sending manufacturer claim data:', JSON.stringify(claimData, null, 2));
      const response = await api.post('/warranty/claims', claimData);

      if (response.status === 201) {
        // Thêm thành công - refresh danh sách
        await fetchWarrantyClaims(currentPage, pageSize);
        setShowAddModal(false);
        resetForm();
        setError(null); // Clear any previous errors
        // Có thể thêm toast notification ở đây
      }
    } catch (err) {
      console.error('Error adding warranty claim:', err);
      setError('Không thể tạo yêu cầu bảo hành. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setAddLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      vin: '',
      issueDescription: '',
      diagnosisReport: '',
      requestDate: '',
      partModelQuantities: {}
    });
    // Reset part selection
    setSelectedPartToAdd('');
    setPartQuantity(1);
    setPartSearchTerm('');
    setPartCategoryFilter('all');
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý thêm phụ tùng
  const handleAddPartFromDropdown = () => {
    if (!selectedPartToAdd) {
      alert('Vui lòng chọn phụ tùng');
      return;
    }

    if (partQuantity <= 0) {
      alert('Số lượng phải lớn hơn 0');
      return;
    }

    // Kiểm tra phụ tùng đã tồn tại chưa
    if (formData.partModelQuantities[selectedPartToAdd]) {
      alert('Phụ tùng này đã được thêm. Vui lòng chọn phụ tùng khác hoặc cập nhật số lượng.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      partModelQuantities: {
        ...prev.partModelQuantities,
        [selectedPartToAdd]: partQuantity
      }
    }));

    // Reset selection
    setSelectedPartToAdd('');
    setPartQuantity(1);
  };

  const handleRemovePart = (partModelId) => {
    setFormData(prev => {
      const newParts = { ...prev.partModelQuantities };
      delete newParts[partModelId];
      return {
        ...prev,
        partModelQuantities: newParts
      };
    });
  };

  const handleUpdatePartQuantity = (partModelId, newQuantity) => {
    const quantityNum = parseInt(newQuantity);
    if (isNaN(quantityNum) || quantityNum <= 0) return;

    setFormData(prev => ({
      ...prev,
      partModelQuantities: {
        ...prev.partModelQuantities,
        [partModelId]: quantityNum
      }
    }));
  };

  // Handlers cho modal tự xử lí
  const handleAddSelfServiceClaim = async (e) => {
    if (e) e.preventDefault();
    setAddLoading(true);

    try {
      // Validation
      if (Object.keys(formDataSelf.partModelQuantities).length === 0) {
        setErrorMessage('Vui lòng thêm ít nhất một phụ tùng');
        setShowErrorModal(true);
        setAddLoading(false);
        return;
      }

      if (!formDataSelf.selfServiceReason || formDataSelf.selfServiceReason.trim() === '') {
        setErrorMessage('Vui lòng nhập lý do tự xử lí');
        setShowErrorModal(true);
        setAddLoading(false);
        return;
      }

      const claimData = {
        vin: formDataSelf.vin,
        issueDescription: formDataSelf.issueDescription,
        diagnosisReport: formDataSelf.diagnosisReport,
        requestDate: formDataSelf.requestDate,
        partModelQuantities: formDataSelf.partModelQuantities,
        selfServiceReason: formDataSelf.selfServiceReason
      };

      console.log('Sending self-service claim data:', JSON.stringify(claimData, null, 2));
      const response = await api.post('/warranty/claims/self-service', claimData);

      if (response.status === 201) {
        await fetchWarrantyClaims(currentPage, pageSize);
        setShowAddSelfServiceModal(false);
        resetFormSelf();
      }
    } catch (err) {
      console.error('Error adding self-service claim:', err);

      // Đóng modal form trước
      setShowAddSelfServiceModal(false);

      // Xử lý lỗi chi tiết từ server và hiển thị modal lỗi
      let errorMsg = '';

      if (err.response?.data?.message) {
        const serverMessage = err.response.data.message;

        // Check if it's an inventory error
        if (serverMessage.includes('Insufficient quantity')) {
          // Parse error message to extract details
          const match = serverMessage.match(/part '([^']+)'.*Required: (\d+), Available: (\d+)/);
          if (match) {
            const [, partName, required, available] = match;
            errorMsg = `Phụ tùng "${partName}" không đủ số lượng trong kho.\n\nSố lượng yêu cầu: ${required}\nSố lượng còn lại: ${available}\n\nVui lòng giảm số lượng hoặc chọn phụ tùng khác.`;
          } else {
            errorMsg = `Lỗi tồn kho: ${serverMessage}`;
          }
        } else {
          errorMsg = serverMessage;
        }
      } else if (err.response?.status === 500) {
        errorMsg = 'Lỗi server khi tạo yêu cầu tự xử lí. Vui lòng kiểm tra lại số lượng phụ tùng trong kho.';
      } else {
        errorMsg = 'Không thể tạo yêu cầu tự xử lí. Vui lòng kiểm tra lại thông tin.';
      }

      // Hiển thị modal lỗi
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setAddLoading(false);
    }
  };

  const resetFormSelf = () => {
    setFormDataSelf({
      vin: '',
      issueDescription: '',
      diagnosisReport: '',
      requestDate: '',
      partModelQuantities: {},
      selfServiceReason: ''
    });
    setSelectedPartToAddSelf('');
    setPartQuantitySelf(1);
    setPartSearchTermSelf('');
    setPartCategoryFilterSelf('all');
  };

  const handleInputChangeSelf = (e) => {
    const { name, value } = e.target;
    setFormDataSelf(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPartFromDropdownSelf = () => {
    if (!selectedPartToAddSelf) {
      alert('Vui lòng chọn phụ tùng');
      return;
    }

    if (partQuantitySelf <= 0) {
      alert('Số lượng phải lớn hơn 0');
      return;
    }

    // Kiểm tra phụ tùng đã tồn tại chưa
    if (formDataSelf.partModelQuantities[selectedPartToAddSelf]) {
      alert('Phụ tùng này đã được thêm. Vui lòng chọn phụ tùng khác hoặc cập nhật số lượng.');
      return;
    }

    setFormDataSelf(prev => ({
      ...prev,
      partModelQuantities: {
        ...prev.partModelQuantities,
        [selectedPartToAddSelf]: partQuantitySelf
      }
    }));

    // Reset selection
    setSelectedPartToAddSelf('');
    setPartQuantitySelf(1);
  };

  const handleRemovePartSelf = (partModelId) => {
    setFormDataSelf(prev => {
      const newPartModelQuantities = { ...prev.partModelQuantities };
      delete newPartModelQuantities[partModelId];
      return {
        ...prev,
        partModelQuantities: newPartModelQuantities
      };
    });
  };

  const handleUpdatePartQuantitySelf = (partModelId, newQuantity) => {
    const quantityNum = parseInt(newQuantity);
    if (isNaN(quantityNum) || quantityNum <= 0) return;

    setFormDataSelf(prev => ({
      ...prev,
      partModelQuantities: {
        ...prev.partModelQuantities,
        [partModelId]: quantityNum
      }
    }));
  };

  // Hàm xem chi tiết claim
  const handleViewClaim = async (claimId) => {
    try {
      setViewLoading(true);
      setSelectedClaim(null);
      setShowViewModal(true);

      const response = await api.get(`/warranty/claims/${claimId}`);

      if (response.status === 200) {
        setSelectedClaim(response.data);
      }
    } catch (err) {
      console.error('Error fetching claim details:', err);
      setError('Không thể tải chi tiết yêu cầu bảo hành.');
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  // Hàm mở modal phân công
  const handleOpenAssignModal = async (claim) => {
    setSelectedClaimForAssign(claim);
    setShowAssignModal(true);
    
    // Fetch danh sách technicians có sẵn
    try {
      const response = await api.get('/assignments/technicians/available');
      if (response.status === 200 && Array.isArray(response.data)) {
        setAvailableTechnicians(response.data);
      }
    } catch (err) {
      console.error('Error fetching technicians:', err);
      setError('Không thể tải danh sách kỹ thuật viên.');
    }
  };

  // Hàm phân công công việc
  const handleAssignWork = async (e) => {
    if (e) e.preventDefault();
    setAssignLoading(true);

    try {
      const assignData = {
        warrantyClaimId: selectedClaimForAssign.id,
        assignedToId: assignFormData.assignedToId,
        dueDate: assignFormData.dueDate,
        priority: assignFormData.priority,
        workDescription: assignFormData.workDescription,
        notes: assignFormData.notes,
        estimatedHours: parseInt(assignFormData.estimatedHours)
      };

      const response = await api.post(`/warranty/claims/${selectedClaimForAssign.id}/assign`, assignData);

      if (response.status === 201 || response.status === 200) {
        await fetchWarrantyClaims(currentPage, pageSize);
        setShowAssignModal(false);
        resetAssignForm();
      }
    } catch (err) {
      console.error('Error assigning work:', err);
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Không thể phân công công việc. Vui lòng thử lại.');
      }
      setShowErrorModal(true);
    } finally {
      setAssignLoading(false);
    }
  };

  // Reset form phân công
  const resetAssignForm = () => {
    setAssignFormData({
      assignedToId: '',
      dueDate: '',
      priority: 'MEDIUM',
      workDescription: '',
      notes: '',
      estimatedHours: ''
    });
    setSelectedClaimForAssign(null);
  };

  // Xử lý thay đổi input form phân công
  const handleAssignInputChange = (e) => {
    const { name, value } = e.target;
    setAssignFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredSentToManufacturerClaims = sentToManufacturerClaims.filter((claim) => {
    const matchesSearch =
      claim.claimNumber?.toLowerCase().includes(searchTermSentToManufacturer.toLowerCase()) ||
      claim.customer?.fullName?.toLowerCase().includes(searchTermSentToManufacturer.toLowerCase()) ||
      claim.vehicleVin?.toLowerCase().includes(searchTermSentToManufacturer.toLowerCase()) ||
      claim.vehicle?.vin?.toLowerCase().includes(searchTermSentToManufacturer.toLowerCase());

    const matchesStatus = statusFilterSentToManufacturer === 'all' || claim.claimStatus === statusFilterSentToManufacturer;

    return matchesSearch && matchesStatus;
  });

  const filteredProcessingClaims = processingClaims.filter((claim) => {
    const matchesSearch =
      claim.claimNumber?.toLowerCase().includes(searchTermProcessing.toLowerCase()) ||
      claim.customer?.fullName?.toLowerCase().includes(searchTermProcessing.toLowerCase()) ||
      claim.vehicleVin?.toLowerCase().includes(searchTermProcessing.toLowerCase()) ||
      claim.vehicle?.vin?.toLowerCase().includes(searchTermProcessing.toLowerCase());

    const matchesStatus = statusFilterProcessing === 'all' || claim.claimStatus === statusFilterProcessing;
    
    const matchesProcessingType = processingTypeFilter === 'all' || claim.processingType === processingTypeFilter;

    return matchesSearch && matchesStatus && matchesProcessingType;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý yêu cầu bảo hành</h1>
        <p className="mt-1 text-sm text-gray-500">
          Theo dõi và xử lý các yêu cầu bảo hành từ khách hàng
        </p>
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
                onClick={() => fetchWarrantyClaims(currentPage, pageSize)}
                className="mt-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
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
          {/* Yêu cầu gửi sang hãng */}
          <div className="space-y-6">
            <SentToManufacturerTable
              claims={filteredSentToManufacturerClaims}
              searchTerm={searchTermSentToManufacturer}
              setSearchTerm={setSearchTermSentToManufacturer}
              statusFilter={statusFilterSentToManufacturer}
              setStatusFilter={setStatusFilterSentToManufacturer}
              title="Yêu cầu gửi sang hãng"
              setShowAddModal={setShowAddModal}
              handleViewClaim={handleViewClaim}
              Pagination={Pagination}
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
              processingTypeFilter={processingTypeFilter}
              setProcessingTypeFilter={setProcessingTypeFilter}
              title="Yêu cầu đang xử lí"
              setShowAddSelfServiceModal={setShowAddSelfServiceModal}
              handleViewClaim={handleViewClaim}
              handleOpenAssignModal={handleOpenAssignModal}
              Pagination={Pagination}
            />
          </div>
        </>
      )}

      {/* Modal tạo yêu cầu bảo hành */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Tạo yêu cầu bảo hành mới
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Thông tin xe */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Car className="h-5 w-5 mr-2 text-blue-500" />
                        Thông tin xe
                      </h4>
                      <div className="space-y-4">
                        {/* VIN */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            VIN <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="vin"
                            value={formData.vin}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Nhập số VIN"
                          />
                        </div>

                        {/* Ngày yêu cầu */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày yêu cầu <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="requestDate"
                            value={formData.requestDate}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Thông tin sự cố */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-green-500" />
                        Thông tin sự cố
                      </h4>
                      <div className="space-y-4">
                        {/* Mô tả vấn đề */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả vấn đề <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="issueDescription"
                            value={formData.issueDescription}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Mô tả chi tiết vấn đề cần bảo hành..."
                          />
                        </div>

                        {/* Báo cáo chẩn đoán */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Báo cáo chẩn đoán <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="diagnosisReport"
                            value={formData.diagnosisReport}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Nhập báo cáo chẩn đoán kỹ thuật..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phụ tùng yêu cầu */}
                  <div className="mt-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-blue-500" />
                        Phụ tùng yêu cầu
                      </h4>

                      {/* Dropdown thêm phụ tùng */}
                      <div className="mb-4 bg-white rounded-lg p-3 border border-gray-300">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          {/* Filter theo category */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Danh mục
                            </label>
                            <select
                              value={partCategoryFilter}
                              onChange={(e) => setPartCategoryFilter(e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="all">Tất cả</option>
                              {[...new Set(availableParts.map(p => p.category))].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          {/* Select phụ tùng */}
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Chọn phụ tùng
                            </label>
                            <select
                              value={selectedPartToAdd}
                              onChange={(e) => setSelectedPartToAdd(e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              disabled={partsLoading}
                            >
                              <option value="">
                                {partsLoading ? 'Đang tải...' : '-- Chọn phụ tùng --'}
                              </option>
                              {availableParts
                                .filter(part => partCategoryFilter === 'all' || part.category === partCategoryFilter)
                                .filter(part =>
                                  partSearchTerm === '' ||
                                  part.partName.toLowerCase().includes(partSearchTerm.toLowerCase()) ||
                                  part.partModelId.toLowerCase().includes(partSearchTerm.toLowerCase())
                                )
                                .map(part => (
                                  <option key={part.partModelId} value={part.partModelId}>
                                    {part.partName} ({part.category}) - {part.partModelId}
                                  </option>
                                ))}
                            </select>
                          </div>

                          {/* Số lượng và nút thêm */}
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Số lượng
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={partQuantity}
                                onChange={(e) => setPartQuantity(parseInt(e.target.value) || 1)}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md text-center"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={handleAddPartFromDropdown}
                                className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 flex items-center"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Danh sách phụ tùng đã thêm */}
                      {Object.keys(formData.partModelQuantities).length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-3 bg-white rounded-md border border-dashed border-gray-300">
                          Chưa có phụ tùng nào. Chọn phụ tùng từ dropdown phía trên.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {Object.entries(formData.partModelQuantities).map(([partModelId, quantity]) => {
                            const partInfo = availableParts.find(p => p.partModelId === partModelId);
                            return (
                              <div key={partModelId} className="flex items-center justify-between bg-white border border-gray-200 rounded-md p-3">
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900">
                                    {partInfo ? partInfo.partName : partModelId}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    {partInfo && (
                                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                                        {partInfo.category}
                                      </span>
                                    )}
                                    <span className="text-xs text-gray-500">{partModelId}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => handleUpdatePartQuantity(partModelId, e.target.value)}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm text-center"
                                  />
                                  <span className="text-sm text-gray-600">x</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePart(partModelId)}
                                    className="p-1 text-white hover:text-white bg-red-500 hover:bg-red-800 rounded"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer buttons */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddWarrantyClaim}
                  disabled={addLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {addLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {addLoading ? 'Đang tạo...' : 'Tạo yêu cầu'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  disabled={addLoading}
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
                    {selectedClaim && (
                      <p className="text-sm font-semibold text-gray-500">
                        Mã yêu cầu: {selectedClaim.id}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedClaim(null);
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
                ) : selectedClaim ? (
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
                            <span className="text-sm font-semibold text-gray-900">{selectedClaim.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Ngày yêu cầu:</span>
                            <span className="text-sm text-gray-900">{selectedClaim.requestDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedClaim.claimStatus)}`}>
                              {getStatusText(selectedClaim.claimStatus)}
                            </span>
                          </div>
                          {selectedClaim.approvalDate && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Ngày duyệt:</span>
                              <span className="text-sm text-gray-900">{selectedClaim.approvalDate}</span>
                            </div>
                          )}
                          {selectedClaim.rejectedDate && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Ngày từ chối:</span>
                              <span className="text-sm text-gray-900">{selectedClaim.rejectedDate}</span>
                            </div>
                          )}
                          {selectedClaim.completionDate && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Ngày hoàn thành:</span>
                              <span className="text-sm text-gray-900">{selectedClaim.completionDate}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Loại xử lý:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getProcessingTypeColor(selectedClaim.processingType)}`}>
                              {getProcessingTypeText(selectedClaim.processingType)}
                            </span>
                          </div>
                          {selectedClaim.autoApprovedAt && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Tự động duyệt lúc:</span>
                              <span className="text-sm text-gray-900">{selectedClaim.autoApprovedAt}</span>
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
                            <span className="text-sm text-gray-900">{selectedClaim.customer?.fullName || selectedClaim.customerName || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Số điện thoại:</span>
                            <span className="text-sm text-gray-900 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {selectedClaim.customer?.phone || selectedClaim.customerPhone || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Email:</span>
                            <span className="text-sm text-gray-900 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {selectedClaim.customer?.email || 'N/A'}
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
                            <span className="text-sm font-semibold text-gray-900">{selectedClaim.vehicleVin || selectedClaim.vehicle?.vin || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Model:</span>
                            <span className="text-sm text-gray-900">{selectedClaim.vehicle?.modelName || selectedClaim.vehicleModel || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Năm sản xuất:</span>
                            <span className="text-sm text-gray-900">{selectedClaim.vehicle?.year || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Màu sắc:</span>
                            <span className="text-sm text-gray-900">{selectedClaim.vehicle?.color || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Thông tin phụ tùng */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-brown-500" />
                          Phụ tùng yêu cầu
                        </h4>
                        {selectedClaim.items && selectedClaim.items.length > 0 ? (
                          <div className="space-y-2">
                            {selectedClaim.items.map((item, index) => (
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
                        <p className="text-sm text-gray-900">{selectedClaim.issueDescription}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-yellow-500" />
                          Báo cáo chẩn đoán
                        </h4>
                        <p className="text-sm text-gray-900">{selectedClaim.diagnosisReport}</p>
                      </div>
                    </div>

                    {/* Thông tin xử lý - Kỹ thuật viên và Người tạo yêu cầu */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Người tạo yêu cầu */}
                      {selectedClaim.createdBy && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
                            Người tạo yêu cầu
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Tên:</span>
                              <span className="text-sm text-gray-900">{selectedClaim.createdBy.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Username:</span>
                              <span className="text-sm text-gray-900">{selectedClaim.createdBy.username}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Kỹ thuật viên */}
                      {selectedClaim.claimStatus !== 'REJECTED' && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <Wrench className="h-5 w-5 mr-2 text-orange-500" />
                            Kỹ thuật viên
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Tên:</span>
                              <span className="text-sm text-gray-900">{selectedClaim.technician?.fullName || selectedClaim.technicianName || 'Chưa phân công'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Username:</span>
                              <span className="text-sm text-gray-900">{selectedClaim.technician?.username || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ghi chú và lý do */}
                    {(selectedClaim.approvalNotes || selectedClaim.rejectionReason || selectedClaim.selfServiceReason) && (
                      <div className="mt-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-purple-500" />
                            Ghi chú và lý do
                          </h4>
                          <div className="space-y-3">
                            {selectedClaim.approvalNotes && (
                              <div>
                                <span className="text-sm font-medium text-gray-700">Ghi chú duyệt:</span>
                                <p className="text-sm text-gray-900 mt-1">{selectedClaim.approvalNotes}</p>
                              </div>
                            )}
                            {selectedClaim.rejectionReason && (
                              <div>
                                <span className="text-sm font-medium text-gray-700">Lý do từ chối:</span>
                                <p className="text-sm text-gray-900 mt-1">{selectedClaim.rejectionReason}</p>
                              </div>
                            )}
                            {selectedClaim.selfServiceReason && (
                              <div>
                                <span className="text-sm font-medium text-gray-700">Lý do tự xử lý:</span>
                                <p className="text-sm text-gray-900 mt-1">{selectedClaim.selfServiceReason}</p>
                              </div>
                            )}
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
                    setSelectedClaim(null);
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

      {/* Modal tạo yêu cầu tự xử lí */}
      {showAddSelfServiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Tạo yêu cầu tự xử lí
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddSelfServiceModal(false);
                      resetFormSelf();
                    }}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Form */}
                <form>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Thông tin xe */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Car className="h-5 w-5 mr-2 text-blue-500" />
                        Thông tin xe
                      </h4>
                      <div className="space-y-4">
                        {/* VIN */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            VIN <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="vin"
                            value={formDataSelf.vin}
                            onChange={handleInputChangeSelf}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Nhập số VIN"
                          />
                        </div>

                        {/* Ngày yêu cầu */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày yêu cầu <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="requestDate"
                            value={formDataSelf.requestDate}
                            onChange={handleInputChangeSelf}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Thông tin sự cố */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-green-500" />
                        Thông tin sự cố
                      </h4>
                      <div className="space-y-4">
                        {/* Mô tả vấn đề */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả vấn đề <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="issueDescription"
                            value={formDataSelf.issueDescription}
                            onChange={handleInputChangeSelf}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Mô tả chi tiết vấn đề cần bảo hành..."
                          />
                        </div>

                        {/* Báo cáo chẩn đoán */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Báo cáo chẩn đoán <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="diagnosisReport"
                            value={formDataSelf.diagnosisReport}
                            onChange={handleInputChangeSelf}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Nhập báo cáo chẩn đoán kỹ thuật..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lý do tự xử lý */}
                  <div className="mt-6">
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                        Lý do tự xử lý
                      </h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lý do tự xử lý <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="selfServiceReason"
                          value={formDataSelf.selfServiceReason}
                          onChange={handleInputChangeSelf}
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Giải thích lý do tự xử lý yêu cầu bảo hành này..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phụ tùng yêu cầu */}
                  <div className="mt-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-blue-500" />
                        Phụ tùng yêu cầu
                      </h4>

                      {/* Dropdown thêm phụ tùng */}
                      <div className="mb-4 bg-white rounded-lg p-3 border border-gray-300">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          {/* Filter theo category */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Danh mục
                            </label>
                            <select
                              value={partCategoryFilterSelf}
                              onChange={(e) => setPartCategoryFilterSelf(e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="all">Tất cả</option>
                              {[...new Set(availablePartsSelf.map(p => p.category))].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          {/* Select phụ tùng */}
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Chọn phụ tùng
                            </label>
                            <select
                              value={selectedPartToAddSelf}
                              onChange={(e) => setSelectedPartToAddSelf(e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              disabled={partsLoadingSelf}
                            >
                              <option value="">
                                {partsLoadingSelf ? 'Đang tải...' : '-- Chọn phụ tùng --'}
                              </option>
                              {availablePartsSelf
                                .filter(part => partCategoryFilterSelf === 'all' || part.category === partCategoryFilterSelf)
                                .filter(part =>
                                  partSearchTermSelf === '' ||
                                  part.partName.toLowerCase().includes(partSearchTermSelf.toLowerCase()) ||
                                  part.partModelId.toLowerCase().includes(partSearchTermSelf.toLowerCase())
                                )
                                .map(part => (
                                  <option key={part.partModelId} value={part.partModelId}>
                                    {part.partName} ({part.category}) - {part.partModelId}
                                  </option>
                                ))}
                            </select>
                          </div>

                          {/* Số lượng và nút thêm */}
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Số lượng
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={partQuantitySelf}
                                onChange={(e) => setPartQuantitySelf(parseInt(e.target.value) || 1)}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md text-center"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={handleAddPartFromDropdownSelf}
                                className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 flex items-center"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Danh sách phụ tùng đã thêm */}
                      {Object.keys(formDataSelf.partModelQuantities).length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-3 bg-white rounded-md border border-dashed border-gray-300">
                          Chưa có phụ tùng nào. Chọn phụ tùng từ dropdown phía trên.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {Object.entries(formDataSelf.partModelQuantities).map(([partModelId, quantity]) => {
                            const partInfo = availablePartsSelf.find(p => p.partModelId === partModelId);
                            return (
                              <div key={partModelId} className="flex items-center justify-between bg-white border border-gray-200 rounded-md p-3">
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900">
                                    {partInfo ? partInfo.partName : partModelId}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    {partInfo && (
                                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                                        {partInfo.category}
                                      </span>
                                    )}
                                    <span className="text-xs text-gray-500">{partModelId}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => handleUpdatePartQuantitySelf(partModelId, e.target.value)}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm text-center"
                                  />
                                  <span className="text-sm text-gray-600">x</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePartSelf(partModelId)}
                                    className="p-1 text-white hover:text-white bg-red-500 hover:bg-red-800 rounded"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer buttons */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddSelfServiceClaim}
                  disabled={addLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {addLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {addLoading ? 'Đang tạo...' : 'Tạo yêu cầu tự xử lí'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSelfServiceModal(false);
                    resetFormSelf();
                  }}
                  disabled={addLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal phân công công việc */}
      {showAssignModal && selectedClaimForAssign && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleAssignWork}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Phân công công việc
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Yêu cầu #{selectedClaimForAssign.id}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAssignModal(false);
                        resetAssignForm();
                      }}
                      className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Form */}
                  <div className="space-y-4">
                    {/* Kỹ thuật viên */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kỹ thuật viên <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="assignedToId"
                        value={assignFormData.assignedToId}
                        onChange={handleAssignInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- Chọn kỹ thuật viên --</option>
                        {availableTechnicians.map(tech => (
                          <option key={tech.id} value={tech.id}>
                            {tech.fullName} - {tech.username}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Ngày hết hạn và Độ ưu tiên */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày hết hạn <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          value={assignFormData.dueDate}
                          onChange={handleAssignInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Độ ưu tiên <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="priority"
                          value={assignFormData.priority}
                          onChange={handleAssignInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="LOW">Thấp</option>
                          <option value="MEDIUM">Trung bình</option>
                          <option value="HIGH">Cao</option>
                          <option value="URGENT">Khẩn cấp</option>
                        </select>
                      </div>
                    </div>

                    {/* Giờ ước tính */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số giờ ước tính <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="estimatedHours"
                        value={assignFormData.estimatedHours}
                        onChange={handleAssignInputChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập số giờ (VD: 24)"
                      />
                    </div>

                    {/* Mô tả công việc */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả công việc <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="workDescription"
                        value={assignFormData.workDescription}
                        onChange={handleAssignInputChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Mô tả chi tiết công việc cần thực hiện..."
                      />
                    </div>

                    {/* Ghi chú */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ghi chú
                      </label>
                      <textarea
                        name="notes"
                        value={assignFormData.notes}
                        onChange={handleAssignInputChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Thêm ghi chú nếu cần..."
                      />
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={assignLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {assignLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {assignLoading ? 'Đang phân công...' : 'Phân công'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAssignModal(false);
                      resetAssignForm();
                    }}
                    disabled={assignLoading}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal - Hiển thị ở ngoài các modal khác */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Lỗi tạo yêu cầu
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setShowErrorModal(false);
                    setErrorMessage('');
                    // Mở lại modal form để user có thể sửa
                    setShowAddSelfServiceModal(true);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Sửa lại
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowErrorModal(false);
                    setErrorMessage('');
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
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

export default WarrantyClaims;
