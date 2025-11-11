import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Package, X, Loader2, AlertCircle, CheckCircle, XCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../../api/api';

// Helper function for active status
const getActiveStatusColor = (isActive) => {
  return isActive 
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-gray-100 text-gray-800 border-gray-200';
};

const getActiveStatusText = (isActive) => {
  return isActive ? 'Đang hoạt động' : 'Không hoạt động';
};

const PartModelManagement = () => {
  const [partModels, setPartModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPartModel, setSelectedPartModel] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Form data for adding part model
  const [formData, setFormData] = useState({
    partName: '',
    partNumber: '',
    description: '',
    category: '',
    cost: ''
  });

  // Form data for editing part model
  const [editFormData, setEditFormData] = useState({
    partName: '',
    partNumber: '',
    description: '',
    category: '',
    cost: '',
    isActive: true
  });

  // Fetch part models from API (will be implemented later)
  useEffect(() => {
    fetchPartModels();
  }, []);

  const fetchPartModels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/parts/models');
      
      // Transform API response to match component structure
      const transformedData = response.data.map(item => ({
        id: item.partModelId,
        partName: item.partName,
        partNumber: item.partNumber,
        category: item.category,
        cost: item.cost,
        description: item.description || '',
        isActive: item.isActive !== undefined ? item.isActive : true
      }));
      
      setPartModels(transformedData);
    } catch (err) {
      console.error('Error fetching part models:', err);
      setError('Không thể tải danh sách model phụ tùng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Filter part models
  const filteredPartModels = partModels.filter(partModel => {
    const matchesSearch = 
      partModel.partName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partModel.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partModel.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partModel.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && partModel.isActive) ||
      (statusFilter === 'inactive' && !partModel.isActive);

    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Handle view part model details
  const handleViewPartModel = async (partModel) => {
    try {
      setViewLoading(true);
      setShowViewModal(true);
      setSelectedPartModel(null);
      
      // Use the partModel data directly since API doesn't have detail endpoint
      setSelectedPartModel(partModel);
    } catch (err) {
      console.error('Error fetching part model details:', err);
      setError('Không thể tải chi tiết model phụ tùng. Vui lòng thử lại.');
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  // Handle edit part model
  const handleEditPartModel = async (partModel) => {
    setSelectedPartModel(partModel);
    
    // Populate edit form with part model data
    setEditFormData({
      partName: partModel.partName || '',
      partNumber: partModel.partNumber || '',
      description: partModel.description || '',
      category: partModel.category || '',
      cost: partModel.cost || '',
      isActive: partModel.isActive !== undefined ? partModel.isActive : true
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
  const handleSubmitEditPartModel = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!editFormData.partName || !editFormData.partNumber || !editFormData.category || !editFormData.cost) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }
    
    if (editFormData.cost <= 0) {
      alert('Chi phí phải lớn hơn 0!');
      return;
    }

    setEditLoading(true);
    try {
      // Prepare request body
      const requestBody = {
        partNumber: editFormData.partNumber,
        partName: editFormData.partName,
        category: editFormData.category,
        cost: parseFloat(editFormData.cost)
      };

      const response = await api.put(`/parts/models/${selectedPartModel.id}`, requestBody);

      if (response.status === 200 || response.status === 204) {
        alert('Cập nhật model phụ tùng thành công!');
        setShowEditModal(false);
        fetchPartModels(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating part model:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật model phụ tùng!');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle add part model
  const handleAddPartModel = () => {
    setShowAddModal(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle submit add part model
  const handleSubmitAddPartModel = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setAddLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.partName.trim()) {
        setError('Vui lòng nhập tên phụ tùng');
        return;
      }
      if (!formData.partNumber.trim()) {
        setError('Vui lòng nhập mã phụ tùng');
        return;
      }
      if (!formData.category.trim()) {
        setError('Vui lòng nhập danh mục');
        return;
      }
      if (!formData.cost || formData.cost <= 0) {
        setError('Vui lòng nhập chi phí hợp lệ');
        return;
      }

      // Prepare request body
      const requestBody = {
        partNumber: formData.partNumber,
        partName: formData.partName,
        category: formData.category,
        cost: parseFloat(formData.cost)
      };

      const response = await api.post('/parts/models', requestBody);

      if (response.status === 200 || response.status === 201) {
        alert('Thêm model phụ tùng thành công!');
        
        // Reset form
        setFormData({
          partName: '',
          partNumber: '',
          description: '',
          category: '',
          cost: ''
        });
        setShowAddModal(false);
        
        // Refresh part models list
        fetchPartModels();
      }
    } catch (err) {
      console.error('Error adding part model:', err);
      setError(err.response?.data?.message || 'Không thể tạo model phụ tùng. Vui lòng thử lại.');
    } finally {
      setAddLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      partName: '',
      partNumber: '',
      description: '',
      category: '',
      cost: ''
    });
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý model phụ tùng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý và xem các model phụ tùng trong hệ thống
          </p>
        </div>
        <button 
          onClick={handleAddPartModel}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm Model phụ tùng
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
                placeholder="Tìm kiếm theo tên, mã phụ tùng, danh mục..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      {/* Part Models Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredPartModels.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có model phụ tùng</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Không tìm thấy model phụ tùng phù hợp với bộ lọc.'
                : 'Chưa có model phụ tùng nào trong hệ thống.'}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên phụ tùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã phụ tùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh Mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chi Phí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPartModels.map((partModel) => (
                <tr key={partModel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{partModel.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{partModel.partName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{partModel.partNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{partModel.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${partModel.cost}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActiveStatusColor(partModel.isActive)}`}>
                      {partModel.isActive ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {getActiveStatusText(partModel.isActive)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewPartModel(partModel)}
                        className="p-2 text-white hover:text-white hover:bg-blue-600 rounded-md bg-blue-500 border border-gray-500"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditPartModel(partModel)}
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

      {/* View Part Model Modal */}
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
                  <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
                  <p className="mt-2 text-gray-500">Đang tải thông tin model phụ tùng...</p>
                </div>
              </div>
            ) : selectedPartModel ? (
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-blue-500" />
                      Chi tiết Model phụ tùng
                    </h3>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-500">Mã model:</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedPartModel.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-500">Tên phụ tùng:</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedPartModel.partName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-500">Mã phụ tùng:</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedPartModel.partNumber}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-500">Danh mục:</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedPartModel.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-500">Chi phí:</span>
                      <span className="text-sm font-semibold text-gray-900">${selectedPartModel.cost}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-500">Mô tả:</span>
                      <span className="text-sm text-gray-900">{selectedPartModel.description || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActiveStatusColor(selectedPartModel.isActive)}`}>
                        {selectedPartModel.isActive ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {getActiveStatusText(selectedPartModel.isActive)}
                      </span>
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

      {/* Add Part Model Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <Package className="h-6 w-6 mr-2 text-green-500" />
                      Thêm model phụ tùng mới
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Điền thông tin để tạo model phụ tùng mới</p>
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
                <form onSubmit={handleSubmitAddPartModel}>
                  <div className="space-y-4">
                    {/* Tên phụ tùng */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên phụ tùng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="partName"
                        value={formData.partName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập tên phụ tùng"
                      />
                    </div>

                    {/* Mã phụ tùng */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã phụ tùng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="partNumber"
                        value={formData.partNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VD: BAT-VF8-001"
                      />
                    </div>

                    {/* Danh mục */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Danh Mục <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VD: Pin, Động cơ, Sạc..."
                      />
                    </div>

                    {/* Chi phí */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chi Phí <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VD: 100"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer buttons */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmitAddPartModel}
                  disabled={addLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {addLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {addLoading ? 'Đang thêm...' : 'Thêm Model'}
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

      {/* Edit Part Model Modal */}
      {showEditModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
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
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-yellow-500" />
                    Cập nhật model phụ tùng
                  </h3>
                  <form onSubmit={handleSubmitEditPartModel}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tên phụ tùng <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="partName"
                          value={editFormData.partName}
                          onChange={handleEditInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Mã phụ tùng <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="partNumber"
                          value={editFormData.partNumber}
                          onChange={handleEditInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Danh Mục <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={editFormData.category}
                          onChange={handleEditInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Chi Phí <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="cost"
                          value={editFormData.cost}
                          onChange={handleEditInputChange}
                          required
                          min="0"
                          step="0.01"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        disabled={editLoading}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none sm:col-start-2 sm:text-sm disabled:bg-gray-400"
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

export default PartModelManagement;
