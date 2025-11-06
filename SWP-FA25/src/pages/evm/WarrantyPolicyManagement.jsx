import React, { useState, useEffect } from 'react';
import { Search, Shield, Calendar, CheckCircle, XCircle, FileText, Loader2, AlertCircle, Clock, Plus, Eye, Edit, X, ToggleLeft, ToggleRight } from 'lucide-react';
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

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Vehicle models state
  const [vehicleModels, setVehicleModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  // Form data for adding policy
  const [formData, setFormData] = useState({
    policyName: '',
    description: '',
    warrantyPeriodMonths: '',
    warrantyMileageLimit: '',
    generalTerms: '',
    modelName: '',
    effectiveDate: '',
    expiryDate: ''
  });

  // Form data for editing policy
  const [editFormData, setEditFormData] = useState({
    policyName: '',
    description: '',
    warrantyPeriodMonths: '',
    warrantyMileageLimit: '',
    generalTerms: '',
    modelName: '',
    effectiveDate: '',
    expiryDate: '',
    isActive: true
  });

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

  // Fetch vehicle models from API
  const fetchVehicleModels = async () => {
    try {
      setModelsLoading(true);
      const response = await api.get('/admin/models');
      console.log('Vehicle Models Response:', response.data);
      
      if (Array.isArray(response.data)) {
        // Filter only active models
        const activeModels = response.data.filter(model => model.isActive);
        setVehicleModels(activeModels);
      } else {
        console.warn('Vehicle models API response is not an array:', response.data);
        setVehicleModels([]);
      }
    } catch (err) {
      console.error('Error fetching vehicle models:', err);
      setVehicleModels([]);
    } finally {
      setModelsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Handle view policy details
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

  // Handle edit policy
  const handleEditPolicy = async (policy) => {
    setSelectedPolicy(policy);
    
    // Fetch vehicle models if not already loaded
    if (vehicleModels.length === 0) {
      await fetchVehicleModels();
    }
    
    // Populate edit form with policy data
    setEditFormData({
      policyName: policy.policyName || '',
      description: policy.description || '',
      warrantyPeriodMonths: policy.warrantyPeriodMonths || '',
      warrantyMileageLimit: policy.warrantyMileageLimit || '',
      generalTerms: policy.generalTerms || '',
      modelName: policy.modelName || '',
      effectiveDate: policy.effectiveDate ? policy.effectiveDate.split('T')[0] : '',
      expiryDate: policy.expiryDate ? policy.expiryDate.split('T')[0] : '',
      isActive: policy.isActive !== undefined ? policy.isActive : true
    });
    
    setShowEditModal(true);
  };

  // Handle edit form input change
  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle edit form submit
  const handleSubmitEditPolicy = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!editFormData.policyName || !editFormData.description || 
        !editFormData.warrantyPeriodMonths || !editFormData.warrantyMileageLimit || 
        !editFormData.generalTerms || !editFormData.modelName || !editFormData.effectiveDate) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }

    setEditLoading(true);
    try {
      // Convert dates to ISO format
      const effectiveDateTime = new Date(editFormData.effectiveDate).toISOString();
      const expiryDateTime = editFormData.expiryDate ? new Date(editFormData.expiryDate).toISOString() : null;

      const requestBody = {
        policyName: editFormData.policyName,
        description: editFormData.description,
        warrantyPeriodMonths: parseInt(editFormData.warrantyPeriodMonths),
        warrantyMileageLimit: parseInt(editFormData.warrantyMileageLimit),
        generalTerms: editFormData.generalTerms,
        modelName: editFormData.modelName,
        effectiveDate: effectiveDateTime,
        expiryDate: expiryDateTime,
        isActive: editFormData.isActive
      };

      await api.put(`/admin/policies/${selectedPolicy.id}`, requestBody);
      alert('Cập nhật chính sách thành công!');
      setShowEditModal(false);
      fetchPolicies(); // Refresh the list
    } catch (error) {
      console.error('Error updating policy:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật chính sách!');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle add policy
  const handleAddPolicy = () => {
    setShowAddModal(true);
    fetchVehicleModels(); // Fetch models when opening modal
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle submit add policy
  const handleSubmitAddPolicy = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setAddLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.policyName.trim()) {
        setError('Vui lòng nhập tên chính sách');
        return;
      }
      if (!formData.modelName.trim()) {
        setError('Vui lòng nhập model xe');
        return;
      }
      if (!formData.warrantyPeriodMonths || formData.warrantyPeriodMonths <= 0) {
        setError('Vui lòng nhập thời hạn bảo hành hợp lệ');
        return;
      }
      if (!formData.warrantyMileageLimit || formData.warrantyMileageLimit <= 0) {
        setError('Vui lòng nhập km giới hạn hợp lệ');
        return;
      }
      if (!formData.effectiveDate) {
        setError('Vui lòng chọn ngày hiệu lực');
        return;
      }

      // Prepare request body
      const requestBody = {
        policyName: formData.policyName,
        description: formData.description,
        warrantyPeriodMonths: parseInt(formData.warrantyPeriodMonths),
        warrantyMileageLimit: parseInt(formData.warrantyMileageLimit),
        generalTerms: formData.generalTerms,
        modelName: formData.modelName,
        effectiveDate: new Date(formData.effectiveDate).toISOString(),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null
      };

      const response = await api.post('/admin/policies', requestBody);

      if (response.status === 200 || response.status === 201) {
        // Reset form
        setFormData({
          policyName: '',
          description: '',
          warrantyPeriodMonths: '',
          warrantyMileageLimit: '',
          generalTerms: '',
          modelName: '',
          effectiveDate: '',
          expiryDate: ''
        });
        setShowAddModal(false);
        
        // Refresh policies list
        fetchPolicies();
      }
    } catch (err) {
      console.error('Error adding policy:', err);
      setError(err.response?.data?.message || 'Không thể tạo chính sách bảo hành. Vui lòng thử lại.');
    } finally {
      setAddLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      policyName: '',
      description: '',
      warrantyPeriodMonths: '',
      warrantyMileageLimit: '',
      generalTerms: '',
      modelName: '',
      effectiveDate: '',
      expiryDate: ''
    });
    setError(null);
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
        <button 
          onClick={handleAddPolicy}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm chính sách
        </button>
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
                  Hiệu lực / Hết hạn
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewPolicy(policy)}
                        className="p-2 text-white hover:text-white hover:bg-blue-600 rounded-md bg-blue-500 border border-gray-500"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditPolicy(policy)}
                        className="p-2 text-white hover:text-white hover:bg-yellow-600 rounded-md bg-yellow-500 border border-gray-500"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
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

      {/* Modal thêm chính sách */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Thêm chính sách bảo hành mới</h3>
                    <p className="text-sm text-gray-500 mt-1">Điền thông tin để tạo chính sách bảo hành mới</p>
                  </div>
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
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmitAddPolicy}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Cột trái - Thông tin cơ bản */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-blue-500" />
                        Thông tin cơ bản
                      </h4>
                      <div className="space-y-4">
                        {/* Tên chính sách */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên chính sách <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="policyName"
                            value={formData.policyName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="Nhập tên chính sách bảo hành"
                          />
                        </div>

                        {/* Model xe */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Model xe <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="modelName"
                            value={formData.modelName}
                            onChange={handleInputChange}
                            required
                            disabled={modelsLoading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">
                              {modelsLoading ? 'Đang tải models...' : 'Chọn model xe'}
                            </option>
                            {vehicleModels.map((model) => (
                              <option key={model.id} value={model.modelName}>
                                {model.modelName} ({model.brand} - {model.year})
                              </option>
                            ))}
                          </select>
                          {modelsLoading && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Đang tải danh sách models...
                            </p>
                          )}
                        </div>

                        {/* Thời hạn bảo hành */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thời hạn bảo hành (tháng) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="warrantyPeriodMonths"
                            value={formData.warrantyPeriodMonths}
                            onChange={handleInputChange}
                            required
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="VD: 36"
                          />
                        </div>

                        {/* Km giới hạn */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Km giới hạn <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="warrantyMileageLimit"
                            value={formData.warrantyMileageLimit}
                            onChange={handleInputChange}
                            required
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="VD: 100000"
                          />
                        </div>

                        {/* Ngày hiệu lực */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày hiệu lực <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="effectiveDate"
                            value={formData.effectiveDate}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          />
                        </div>

                        {/* Ngày hết hạn */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày hết hạn
                          </label>
                          <input
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            min={formData.effectiveDate}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="Để trống nếu không giới hạn"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Để trống nếu chính sách không có ngày hết hạn
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cột phải - Mô tả & Điều khoản */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-green-500" />
                        Mô tả & Điều khoản
                      </h4>
                      <div className="space-y-4">
                        {/* Mô tả */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                          </label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="Nhập mô tả chính sách bảo hành..."
                          />
                        </div>

                        {/* Điều khoản chung */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Điều khoản chung
                          </label>
                          <textarea
                            name="generalTerms"
                            value={formData.generalTerms}
                            onChange={handleInputChange}
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="Nhập các điều khoản chung của chính sách..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer buttons */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmitAddPolicy}
                  disabled={addLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {addLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {addLoading ? 'Đang thêm...' : 'Thêm chính sách'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Policy Modal */}
      {showEditModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Cập nhật chính sách bảo hành
                  </h3>
                  <form onSubmit={handleSubmitEditPolicy}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Tên chính sách <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="policyName"
                            value={editFormData.policyName}
                            onChange={handleEditInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Model xe <span className="text-red-500">*</span>
                          </label>
                          {modelsLoading ? (
                            <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-400">
                              Đang tải...
                            </div>
                          ) : (
                            <select
                              name="modelName"
                              value={editFormData.modelName}
                              onChange={handleEditInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            >
                              <option value="">Chọn model xe</option>
                              {vehicleModels.map((model) => (
                                <option key={model.id} value={model.modelName}>
                                  {model.modelName} ({model.brand} - {model.year})
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Thời hạn bảo hành (tháng) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="warrantyPeriodMonths"
                            value={editFormData.warrantyPeriodMonths}
                            onChange={handleEditInputChange}
                            required
                            min="0"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Ngày hiệu lực <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="effectiveDate"
                            value={editFormData.effectiveDate}
                            onChange={handleEditInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Ngày hết hạn
                          </label>
                          <input
                            type="date"
                            name="expiryDate"
                            value={editFormData.expiryDate}
                            onChange={handleEditInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Mô tả <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditInputChange}
                            required
                            rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Điều khoản chung <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="generalTerms"
                            value={editFormData.generalTerms}
                            onChange={handleEditInputChange}
                            required
                            rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Km giới hạn <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="warrantyMileageLimit"
                            value={editFormData.warrantyMileageLimit}
                            onChange={handleEditInputChange}
                            required
                            min="0"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                          </label>
                          <button
                            type="button"
                            onClick={() => setEditFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                            className={`flex items-center space-x-2 px-4 py-1 rounded-lg transition-colors ${
                              editFormData.isActive 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {editFormData.isActive ? (
                              <>
                                <ToggleRight className="h-5 w-5" />
                                <span>Đang hoạt động</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="h-5 w-5" />
                                <span>Không hoạt động</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        disabled={editLoading}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:col-start-2 sm:text-sm disabled:bg-gray-400"
                      >
                        {editLoading ? (
                          <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                            Đang cập nhật...
                          </>
                        ) : (
                          'Cập nhật'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarrantyPolicy;
