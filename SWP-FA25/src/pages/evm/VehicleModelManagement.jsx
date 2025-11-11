import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Car, X, Loader2, AlertCircle, CheckCircle, XCircle, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
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

const VehicleModelManagement = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Form data for adding model
  const [formData, setFormData] = useState({
    modelName: '',
    brand: '',
    year: ''
  });

  // Form data for editing model
  const [editFormData, setEditFormData] = useState({
    modelName: '',
    brand: '',
    year: ''
  });

  // Fetch models from API
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/models');
      setModels(response.data || []);
    } catch (err) {
      console.error('Error fetching models:', err);
      setError('Không thể tải danh sách model xe. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Filter models
  const filteredModels = models.filter(model => {
    const matchesSearch = 
      model.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.year?.toString().includes(searchTerm) ||
      model.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && model.isActive) ||
      (statusFilter === 'inactive' && !model.isActive);

    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Handle view model details
  const handleViewModel = async (model) => {
    try {
      setViewLoading(true);
      setShowViewModal(true);
      setSelectedModel(null);
      
      const response = await api.get(`/admin/models/${model.id}`);
      setSelectedModel(response.data);
    } catch (err) {
      console.error('Error fetching model details:', err);
      setError('Không thể tải chi tiết model. Vui lòng thử lại.');
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  // Handle edit model
  const handleEditModel = async (model) => {
    setSelectedModel(model);
    
    // Populate edit form with model data
    setEditFormData({
      modelName: model.modelName || '',
      brand: model.brand || '',
      year: model.year || ''
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
  const handleSubmitEditModel = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!editFormData.modelName || !editFormData.brand || !editFormData.year) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }

    setEditLoading(true);
    try {
      const requestBody = {
        modelName: editFormData.modelName,
        brand: editFormData.brand,
        year: parseInt(editFormData.year)
      };

      await api.put(`/admin/models/${selectedModel.id}`, requestBody);
      alert('Cập nhật model thành công!');
      setShowEditModal(false);
      fetchModels(); // Refresh the list
    } catch (error) {
      console.error('Error updating model:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật model!');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle add model
  const handleAddModel = () => {
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

  // Handle submit add model
  const handleSubmitAddModel = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setAddLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.modelName.trim()) {
        setError('Vui lòng nhập tên model');
        return;
      }
      if (!formData.brand.trim()) {
        setError('Vui lòng nhập hãng xe');
        return;
      }
      if (!formData.year || formData.year <= 0) {
        setError('Vui lòng nhập năm sản xuất hợp lệ');
        return;
      }

      // Prepare request body
      const requestBody = {
        modelName: formData.modelName,
        brand: formData.brand,
        year: parseInt(formData.year)
      };

      const response = await api.post('/admin/models', requestBody);

      if (response.status === 200 || response.status === 201) {
        // Reset form
        setFormData({
          modelName: '',
          brand: '',
          year: ''
        });
        setShowAddModal(false);
        
        // Refresh models list
        fetchModels();
      }
    } catch (err) {
      console.error('Error adding model:', err);
      setError(err.response?.data?.message || 'Không thể tạo model xe. Vui lòng thử lại.');
    } finally {
      setAddLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      modelName: '',
      brand: '',
      year: ''
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý model xe</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý và xem các model xe trong hệ thống
          </p>
        </div>
        <button 
          onClick={handleAddModel}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm Model
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
                placeholder="Tìm kiếm theo tên model, hãng, năm..."
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

      {/* Models Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredModels.length === 0 ? (
          <div className="text-center py-12">
            <Car className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có model xe</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Không tìm thấy model xe phù hợp với bộ lọc.'
                : 'Chưa có model xe nào trong hệ thống.'}
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
                  Tên Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hãng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Năm sản xuất
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
              {filteredModels.map((model) => (
                <tr key={model.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{model.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Car className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{model.modelName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{model.brand}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {model.year}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActiveStatusColor(model.isActive)}`}>
                      {model.isActive ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {getActiveStatusText(model.isActive)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewModel(model)}
                        className="p-2 text-white hover:text-white hover:bg-blue-600 rounded-md bg-blue-500 border border-gray-500"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditModel(model)}
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

      {/* View Model Modal */}
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
                  <p className="mt-2 text-gray-500">Đang tải thông tin model...</p>
                </div>
              </div>
            ) : selectedModel ? (
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                      <Car className="h-5 w-5 mr-2 text-blue-500" />
                      Chi tiết Model Xe
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
                      <span className="text-sm font-semibold text-gray-900">{selectedModel.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-500">Tên model:</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedModel.modelName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-500">Hãng:</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedModel.brand}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-500">Năm sản xuất:</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedModel.year}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActiveStatusColor(selectedModel.isActive)}`}>
                        {selectedModel.isActive ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {getActiveStatusText(selectedModel.isActive)}
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

      {/* Add Model Modal */}
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
                      <Car className="h-6 w-6 mr-2 text-green-500" />
                      Thêm model xe mới
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Điền thông tin để tạo model xe mới</p>
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
                <form onSubmit={handleSubmitAddModel}>
                  <div className="space-y-4">
                    {/* Tên model */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên Model <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="modelName"
                        value={formData.modelName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập tên model (VD: VF8, VF9)"
                      />
                    </div>

                    {/* Hãng */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hãng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập hãng xe (VD: VinFast)"
                      />
                    </div>

                    {/* Năm sản xuất */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Năm sản xuất <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        required
                        min="1900"
                        max="2100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VD: 2024"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer buttons */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmitAddModel}
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

      {/* Edit Model Modal */}
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
                    <Car className="h-5 w-5 mr-2 text-yellow-500" />
                    Cập nhật model xe
                  </h3>
                  <form onSubmit={handleSubmitEditModel}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tên Model <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="modelName"
                          value={editFormData.modelName}
                          onChange={handleEditInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Hãng <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={editFormData.brand}
                          onChange={handleEditInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Năm sản xuất <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="year"
                          value={editFormData.year}
                          onChange={handleEditInputChange}
                          required
                          min="1900"
                          max="2100"
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

export default VehicleModelManagement;