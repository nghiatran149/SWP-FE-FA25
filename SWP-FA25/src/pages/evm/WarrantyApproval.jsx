import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Calendar, User, Car, Check, X, FileText, Loader2, Phone, Mail, AlertCircle, Shield, Image } from 'lucide-react';
import api from '../../api/api';

const WarrantyApproval = () => {
  // State cho API và loading
  const [warrantyClaims, setWarrantyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  // State cho modal thêm phụ tùng
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [selectedPartClaim, setSelectedPartClaim] = useState(null);
  const [partCategory, setPartCategory] = useState('');
  const [partName, setPartName] = useState('');
  const [partQuantity, setPartQuantity] = useState(1);
  const [partNote, setPartNote] = useState('');
  const [addingPart, setAddingPart] = useState(false);
  const [addPartError, setAddPartError] = useState(null);
  
  // State cho danh sách categories
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  // State cho danh sách part names
  const [partNames, setPartNames] = useState([]);
  const [loadingPartNames, setLoadingPartNames] = useState(false);

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

  // Function để mở modal approve
  const handleOpenApproveModal = (claim) => {
    setSelectedClaim(claim);
    setApprovalNotes('');
    setShowApproveModal(true);
  };

  // Function để approve warranty claim
  const handleApproveClaim = async () => {
    if (!selectedClaim) return;

    try {
      setApproving(true);
      const response = await api.put(`/v1/warranty/claims/${selectedClaim.id}/approve`, {
        approvalNotes: approvalNotes || 'Đã phê duyệt'
      });

      if (response.status === 200) {
        // Close modal and refresh data
        setShowApproveModal(false);
        setSelectedClaim(null);
        setApprovalNotes('');
        fetchWarrantyClaims();
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
  const handleOpenRejectModal = (claim) => {
    setSelectedClaim(claim);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  // Function để reject warranty claim
  const handleRejectClaim = async () => {
    if (!selectedClaim) return;

    try {
      setRejecting(true);
      const response = await api.put(`/v1/warranty/claims/${selectedClaim.id}/reject`, {
        rejectionReason: rejectionReason || 'Đã từ chối'
      });

      if (response.status === 200) {
        // Close modal and refresh data
        setShowRejectModal(false);
        setSelectedClaim(null);
        setRejectionReason('');
        fetchWarrantyClaims();
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
  const handleViewClaim = async (claimId) => {
    try {
      setViewLoading(true);
      setSelectedViewClaim(null);
      setShowViewModal(true);
      
      const response = await api.get(`/v1/warranty/claims/${claimId}`);
      
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
  };

  // Fetch categories từ API
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch('https://isiah-hyperhilarious-disheartenedly.ngrok-free.dev/api/v1/evm-staff/categories', {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setAddPartError('Không thể tải danh sách categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch part names by category từ API
  const fetchPartNames = async (category) => {
    if (!category) {
      setPartNames([]);
      return;
    }

    try {
      setLoadingPartNames(true);
      const response = await fetch(`https://isiah-hyperhilarious-disheartenedly.ngrok-free.dev/api/v1/evm-staff/parts/part-names?category=${encodeURIComponent(category)}`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách part names');
      }

      const data = await response.json();
      setPartNames(data);
    } catch (err) {
      console.error('Error fetching part names:', err);
      setAddPartError('Không thể tải danh sách part names');
      setPartNames([]);
    } finally {
      setLoadingPartNames(false);
    }
  };

  // Handle thay đổi category
  const handleCategoryChange = (selectedCategory) => {
    setPartCategory(selectedCategory);
    setPartName(''); // Reset part name khi đổi category
    fetchPartNames(selectedCategory);
  };

  // Mở modal thêm phụ tùng
  const handleOpenAddPartModal = (claim) => {
    setSelectedPartClaim(claim);
    setShowAddPartModal(true);
    setPartCategory('');
    setPartName('');
    setPartQuantity(1);
    setPartNote('');
    setAddPartError(null);
    setPartNames([]); // Reset part names
    
    // Fetch categories khi mở modal
    if (categories.length === 0) {
      fetchCategories();
    }
  };

  // Đóng modal thêm phụ tùng
  const handleCloseAddPartModal = () => {
    setShowAddPartModal(false);
    setSelectedPartClaim(null);
    setAddPartError(null);
  };

  // Gọi API thêm phụ tùng
  const handleAddPart = async () => {
    if (!partCategory || !partName || !partQuantity || !selectedPartClaim) {
      setAddPartError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    
    setAddingPart(true);
    setAddPartError(null);
    
    try {
      const vin = selectedPartClaim.vehicle?.vin || selectedPartClaim.vehicleVin;
      const url = `https://isiah-hyperhilarious-disheartenedly.ngrok-free.dev/api/v1/evm-staff/parts/attach?category=${encodeURIComponent(partCategory)}&partName=${encodeURIComponent(partName)}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          vin: vin,
          quantity: partQuantity,
          note: partNote
        })
      });

      if (!response.ok) {
        throw new Error('Thêm phụ tùng thất bại');
      }

      const result = await response.json();
      console.log('Add part result:', result);
      
      setShowAddPartModal(false);
      alert('Thêm phụ tùng thành công!');
    } catch (err) {
      console.error('Error adding part:', err);
      setAddPartError(err.message || 'Có lỗi xảy ra khi thêm phụ tùng');
    } finally {
      setAddingPart(false);
    }
  };

  // Phân loại yêu cầu bảo hành theo status
  const pendingApprovalClaims = warrantyClaims.filter(claim => 
    claim.claimStatus === 'PENDING'
  );

  const processedClaims = warrantyClaims.filter(claim => 
    claim.claimStatus === 'REJECTED' || 
    claim.claimStatus === 'APPROVED' || 
    claim.claimStatus === 'PROCESSING' || 
    claim.claimStatus === 'COMPLETED'
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'PROCESSING':
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
  const PendingApprovalTable = ({ claims, searchTerm, setSearchTerm, statusFilter, setStatusFilter, title, onOpenApproveModal, onOpenRejectModal, onViewClaim, onOpenAddPartModal }) => (
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
                    Báo cáo chẩn đoán
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
                    <td className="px-6 py-4 max-w-48">
                      <div className="text-sm text-gray-900 break-words" title={claim.issueDescription}>
                        {claim.issueDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-48">
                      <div className="text-sm text-gray-900 break-words" title={claim.diagnosisReport}>
                        {claim.diagnosisReport || 'N/A'}
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
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md bg-transparent"
                          title="Xem chi tiết"
                          onClick={() => onViewClaim(claim.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-md bg-transparent"
                          title="Thêm phụ tùng"
                          onClick={() => onOpenAddPartModal(claim)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md bg-transparent"
                          title="Duyệt"
                          onClick={() => onOpenApproveModal(claim)}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md bg-transparent"
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

            {/* Summary */}
            <div className="bg-gray-50 px-6 py-3">
              <div className="text-sm text-gray-500">
                Hiển thị {claims.length} yêu cầu chờ duyệt
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );

  // Component bảng yêu cầu đã xử lý
  const ProcessedTable = ({ claims, searchTerm, setSearchTerm, statusFilter, setStatusFilter, title, onViewClaim }) => (
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
                    Báo cáo chẩn đoán
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
                    <td className="px-6 py-4 max-w-48">
                      <div className="text-sm text-gray-900 break-words" title={claim.issueDescription}>
                        {claim.issueDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-48">
                      <div className="text-sm text-gray-900 break-words" title={claim.diagnosisReport}>
                        {claim.diagnosisReport || 'N/A'}
                      </div>
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
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md bg-transparent"
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

            {/* Summary */}
            <div className="bg-gray-50 px-6 py-3">
              <div className="text-sm text-gray-500">
                Hiển thị {claims.length} yêu cầu đã xử lý
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );

  const filteredPendingApprovalClaims = pendingApprovalClaims.filter((claim) => {
    const matchesSearch = 
      claim.claimNumber?.toLowerCase().includes(searchTermPendingApproval.toLowerCase()) ||
      claim.customer?.fullName?.toLowerCase().includes(searchTermPendingApproval.toLowerCase()) ||
      claim.vehicleVin?.toLowerCase().includes(searchTermPendingApproval.toLowerCase()) ||
      claim.vehicle?.vin?.toLowerCase().includes(searchTermPendingApproval.toLowerCase());
    
    const matchesStatus = statusFilterPendingApproval === 'all' || claim.claimStatus === statusFilterPendingApproval;
    
    return matchesSearch && matchesStatus;
  });

  const filteredProcessedClaims = processedClaims.filter((claim) => {
    const matchesSearch = 
      claim.claimNumber?.toLowerCase().includes(searchTermProcessed.toLowerCase()) ||
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
              onOpenAddPartModal={handleOpenAddPartModal}
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
                        Bạn có chắc chắn muốn phê duyệt yêu cầu bảo hành <strong>{selectedClaim.claimNumber}</strong> không?
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
                      <p className="text-gray-900">{selectedClaim.vehicle?.modelName || 'N/A'}</p>
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
                        Bạn có chắc chắn muốn từ chối yêu cầu bảo hành <strong>{selectedClaim.claimNumber}</strong> không?
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
                      <p className="text-gray-900">{selectedClaim.vehicle?.modelName || 'N/A'}</p>
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
                      <p className="text-sm text-gray-500">
                        Mã yêu cầu: {selectedViewClaim.claimNumber}
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
                            <span className="text-sm text-gray-900">{selectedViewClaim.claimNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Ngày yêu cầu:</span>
                            <span className="text-sm text-gray-900">{selectedViewClaim.requestDate}</span>
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
                          {selectedViewClaim.completionDate && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Ngày hoàn thành:</span>
                              <span className="text-sm text-gray-900">{selectedViewClaim.completionDate}</span>
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
                          <Car className="h-5 w-5 mr-2 text-purple-500" />
                          Thông tin xe
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">VIN:</span>
                            <span className="text-sm text-gray-900">{selectedViewClaim.vehicleVin || selectedViewClaim.vehicle?.vin || 'N/A'}</span>
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
                          <Shield className="h-5 w-5 mr-2 text-orange-500" />
                          Thông tin phụ tùng
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Tên phụ tùng:</span>
                            <span className="text-sm text-gray-900">{selectedViewClaim.partName || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Số serial:</span>
                            <span className="text-sm text-gray-900">{selectedViewClaim.partSerialNumber || 'N/A'}</span>
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
                        <p className="text-sm text-gray-900">{selectedViewClaim.issueDescription}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-blue-500" />
                          Báo cáo chẩn đoán
                        </h4>
                        <p className="text-sm text-gray-900">{selectedViewClaim.diagnosisReport}</p>
                      </div>
                    </div>

                    {/* Thông tin xử lý */}
                    {(selectedViewClaim.claimStatus === 'APPROVED' || 
                      selectedViewClaim.claimStatus === 'PROCESSING' || 
                      selectedViewClaim.claimStatus === 'COMPLETED' || 
                      selectedViewClaim.claimStatus === 'REJECTED') && (
                      <div className="mt-6">
                        {/* Người xử lý */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <User className="h-5 w-5 mr-2 text-blue-500" />
                            Người xử lý
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Tên:</span>
                              <span className="text-sm text-gray-900">
                                {selectedViewClaim.claimStatus === 'REJECTED' 
                                  ? (selectedViewClaim.rejectedBy?.fullName || selectedViewClaim.rejectedByName || 'N/A')
                                  : (selectedViewClaim.approvedBy?.fullName || selectedViewClaim.approvedByName || 'N/A')
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Username:</span>
                              <span className="text-sm text-gray-900">
                                {selectedViewClaim.claimStatus === 'REJECTED' 
                                  ? (selectedViewClaim.rejectedBy?.username || 'N/A')
                                  : (selectedViewClaim.approvedBy?.username || 'N/A')
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Vai trò:</span>
                              <span className="text-sm text-gray-900">
                                {selectedViewClaim.claimStatus === 'REJECTED' 
                                  ? (selectedViewClaim.rejectedBy?.role || 'N/A')
                                  : (selectedViewClaim.approvedBy?.role || 'N/A')
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ghi chú và lý do */}
                    {(selectedViewClaim.approvalNotes || selectedViewClaim.rejectionReason) && (
                      <div className="mt-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-yellow-500" />
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
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hình ảnh đính kèm */}
                    {selectedViewClaim.imageUrls && selectedViewClaim.imageUrls.length > 0 && (
                      <div className="mt-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <Image className="h-5 w-5 mr-2 text-purple-500" />
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

      {/* Modal thêm phụ tùng */}
      {showAddPartModal && selectedPartClaim && (
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Plus className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Thêm phụ tùng
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Thêm phụ tùng cho xe VIN: <strong>{selectedPartClaim.vehicle?.vin || selectedPartClaim.vehicleVin}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form inputs */}
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục phụ tùng <span className="text-red-500">*</span>
                    </label>
                    {loadingCategories ? (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        <span className="text-gray-500">Đang tải categories...</span>
                      </div>
                    ) : (
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={partCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                      >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên phụ tùng <span className="text-red-500">*</span>
                    </label>
                    {!partCategory ? (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                        Vui lòng chọn danh mục trước
                      </div>
                    ) : loadingPartNames ? (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        <span className="text-gray-500">Đang tải part names...</span>
                      </div>
                    ) : (
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={partName}
                        onChange={(e) => setPartName(e.target.value)}
                      >
                        <option value="">-- Chọn tên phụ tùng --</option>
                        {partNames.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={partQuantity}
                      onChange={(e) => setPartQuantity(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={partNote}
                      onChange={(e) => setPartNote(e.target.value)}
                      placeholder="Ghi chú thêm (tùy chọn)"
                    />
                  </div>

                  {/* Error message */}
                  {addPartError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{addPartError}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddPart}
                  disabled={addingPart}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingPart ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Đang thêm...
                    </>
                  ) : (
                    'Thêm phụ tùng'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCloseAddPartModal}
                  disabled={addingPart}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Hủy
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