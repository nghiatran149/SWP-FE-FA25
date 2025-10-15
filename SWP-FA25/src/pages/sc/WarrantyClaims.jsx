import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Calendar, User, Car, X, Upload, FileText, Loader2, Phone, Mail, AlertCircle, Shield, Image } from 'lucide-react';
import api from '../../api/api';

const WarrantyClaims = () => {
  // State cho API và loading
  const [warrantyClaims, setWarrantyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho tìm kiếm và filter
  const [searchTermSentToManufacturer, setSearchTermSentToManufacturer] = useState('');
  const [statusFilterSentToManufacturer, setStatusFilterSentToManufacturer] = useState('all');
  const [searchTermProcessing, setSearchTermProcessing] = useState('');
  const [statusFilterProcessing, setStatusFilterProcessing] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Fetch warranty claims từ API
  const fetchWarrantyClaims = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/v1/warranty/claims');
      console.log('API Response:', response.data);
      
      if (Array.isArray(response.data)) {
        setWarrantyClaims(response.data);
      } else {
        console.warn('API response is not an array:', response.data);
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
    fetchWarrantyClaims();
  }, []);
  
  // Form state cho modal tạo yêu cầu bảo hành
  const [formData, setFormData] = useState({
    vin: '',
    issueDescription: '',
    diagnosisReport: '',
    requestDate: '',
    imageUrls: []
  });

  // Phân loại yêu cầu bảo hành theo status
  const sentToManufacturerClaims = warrantyClaims.filter(claim => 
    claim.claimStatus === 'PENDING' || claim.claimStatus === 'REJECTED'
  );

  const processingClaims = warrantyClaims.filter(claim => 
    claim.claimStatus === 'APPROVED' || 
    claim.claimStatus === 'PROCESSING' || 
    claim.claimStatus === 'COMPLETED'
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'APPROVED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
        return 'Hoàn thành';
      case 'PROCESSING':
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

  // Hàm thêm warranty claim mới
  const handleAddWarrantyClaim = async (e) => {
    if (e) e.preventDefault();
    setAddLoading(true);
    
    try {
      const claimData = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const response = await api.post('/v1/warranty/claims', claimData);
      
      if (response.status === 201) {
        // Thêm thành công - refresh danh sách
        await fetchWarrantyClaims();
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
      imageUrls: []
    });
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ...fileNames]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  // Hàm xem chi tiết claim
  const handleViewClaim = async (claimId) => {
    try {
      setViewLoading(true);
      setSelectedClaim(null);
      setShowViewModal(true);
      
      const response = await api.get(`/v1/warranty/claims/${claimId}`);
      
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
                      {claim.claimNumber}
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
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {claim.requestDate}
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
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={claim.issueDescription}>
                        {claim.issueDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={claim.partName}>
                        {claim.partName || 'N/A'}
                      </div>
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
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md bg-transparent"
                        >
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
          </>
        )}
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
              <option value="APPROVED">Chờ phân công</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="COMPLETED">Hoàn thành</option>
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
                      {claim.claimNumber}
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
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {claim.requestDate}
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
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={claim.issueDescription}>
                        {claim.issueDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {claim.technician?.fullName || 'Chưa phân công'}
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
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md bg-transparent"
                        >
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
          </>
        )}
      </div>
    </>
  );

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
        <button 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo yêu cầu mới
        </button>
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

                  {/* Hình ảnh đính kèm */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                      <Upload className="h-5 w-5 mr-2 text-purple-500" />
                      Hình ảnh đính kèm
                    </h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="mt-2">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="text-sm font-medium text-primary-600 hover:text-primary-500">
                              Tải lên hình ảnh
                            </span>
                            <span className="text-sm text-gray-500"> hoặc kéo thả vào đây</span>
                          </label>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, JPEG lên tới 5MB
                        </p>
                      </div>
                    </div>

                    {/* Hiển thị file đã upload */}
                    {formData.imageUrls.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-gray-700">Hình ảnh đã tải lên:</p>
                        {formData.imageUrls.map((fileName, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{fileName}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
                      <p className="text-sm text-gray-500">
                        Mã yêu cầu: {selectedClaim.claimNumber}
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
                            <span className="text-sm text-gray-900">{selectedClaim.claimNumber}</span>
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
                          {selectedClaim.completionDate && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Ngày hoàn thành:</span>
                              <span className="text-sm text-gray-900">{selectedClaim.completionDate}</span>
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
                          <Car className="h-5 w-5 mr-2 text-purple-500" />
                          Thông tin xe
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">VIN:</span>
                            <span className="text-sm text-gray-900">{selectedClaim.vehicleVin || selectedClaim.vehicle?.vin || 'N/A'}</span>
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
                          <Shield className="h-5 w-5 mr-2 text-orange-500" />
                          Thông tin phụ tùng
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Tên phụ tùng:</span>
                            <span className="text-sm text-gray-900">{selectedClaim.partName || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Số serial:</span>
                            <span className="text-sm text-gray-900">{selectedClaim.partSerialNumber || 'N/A'}</span>
                          </div>
                        </div>
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
                          <FileText className="h-5 w-5 mr-2 text-blue-500" />
                          Báo cáo chẩn đoán
                        </h4>
                        <p className="text-sm text-gray-900">{selectedClaim.diagnosisReport}</p>
                      </div>
                    </div>

                    {/* Thông tin xử lý */}
                    {selectedClaim.claimStatus !== 'REJECTED' && (
                      <div className="mt-6">
                        {/* Kỹ thuật viên */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <User className="h-5 w-5 mr-2 text-blue-500" />
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
                      </div>
                    )}

                    {/* Ghi chú và lý do */}
                    {(selectedClaim.approvalNotes || selectedClaim.rejectionReason) && (
                      <div className="mt-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-yellow-500" />
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
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hình ảnh đính kèm */}
                    {selectedClaim.imageUrls && selectedClaim.imageUrls.length > 0 && (
                      <div className="mt-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <Image className="h-5 w-5 mr-2 text-purple-500" />
                            Hình ảnh đính kèm
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {selectedClaim.imageUrls.map((imageUrl, index) => (
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
    </div>
  );
};

export default WarrantyClaims;
