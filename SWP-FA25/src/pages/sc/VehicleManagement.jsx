import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit, Car, Calendar, CalendarOff, User, MapPin, Battery, Settings, AlertCircle, X, Package, Wrench } from 'lucide-react';
import api from '../../api/api';

const VehicleManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modelFilter, setModelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [warrantyFilter, setWarrantyFilter] = useState('all');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  
  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Form state cho thêm xe
  const [formData, setFormData] = useState({
    vin: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    warrantyStartDate: '',
    warrantyEndDate: '',
    identityNumber: '',
    odometerKm: 0,
    purchaseDate: ''
  });

  // Form state cho edit xe
  const [editFormData, setEditFormData] = useState({
    model: '',
    year: new Date().getFullYear(),
    color: '',
    warrantyStartDate: '',
    warrantyEndDate: '',
    vehicleStatus: 'ACTIVE',
    odometerKm: 0,
    purchaseDate: ''
  });

  // Fetch vehicles từ API
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/vehicles');
      console.log('API Response:', response.data);
      console.log('Response type:', typeof response.data);
      console.log('Is Array:', Array.isArray(response.data));
      
      // Kiểm tra nếu response là HTML thay vì JSON
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        throw new Error('API trả về HTML page thay vì JSON. Có thể ngrok chưa setup đúng.');
      }
      
      // Xử lý response mới với pagination structure
      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        setVehicles(response.data.content);
        console.log('Loaded vehicles from paginated response:', response.data.content.length);
      } else if (Array.isArray(response.data)) {
        // Fallback cho trường hợp API vẫn trả về array trực tiếp
        setVehicles(response.data);
      } else {
        console.warn('API response is not in expected format:', response.data);
        setVehicles([]);
        setError('Dữ liệu API không đúng định dạng.');
      }
    } catch (err) {
      setError('Không thể tải danh sách xe. Vui lòng thử lại.');
      console.error('Error fetching vehicles:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchVehicleModels(); // Fetch models khi component mount để dùng cho filter
  }, []);

  // Fetch vehicle models từ API
  const fetchVehicleModels = async () => {
    try {
      setModelsLoading(true);
      const response = await api.get('/admin/models');
      console.log('Vehicle Models Response:', response.data);
      
      if (Array.isArray(response.data)) {
        // Lọc chỉ những model đang active
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

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value
    }));
  };

  // Handle edit input change
  const handleEditInputChange = (e) => {
    const { name, value, type } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      vin: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      warrantyStartDate: '',
      warrantyEndDate: '',
      identityNumber: '',
      odometerKm: 0,
      purchaseDate: ''
    });
    setError(null);
  };

  // Reset edit form
  const resetEditForm = () => {
    setEditFormData({
      model: '',
      year: new Date().getFullYear(),
      color: '',
      warrantyStartDate: '',
      warrantyEndDate: '',
      vehicleStatus: 'ACTIVE',
      odometerKm: 0,
      purchaseDate: ''
    });
    setEditingVehicle(null);
    setError(null);
  };

  // Hàm thêm xe mới
  const handleAddVehicle = async (e) => {
    if (e) e.preventDefault();
    setAddLoading(true);
    
    try {
      const vehicleData = {
        vin: formData.vin,
        model: formData.model, // Đây sẽ là modelName từ dropdown
        year: formData.year,
        color: formData.color,
        warrantyStartDate: formData.warrantyStartDate,
        warrantyEndDate: formData.warrantyEndDate,
        identityNumber: formData.identityNumber,
        odometerKm: formData.odometerKm,
        purchaseDate: formData.purchaseDate
      };
      
      console.log('Sending vehicle data:', vehicleData);
      const response = await api.post('/vehicles', vehicleData);
      
      if (response.status === 201) {
        // Thêm thành công - refresh danh sách
        await fetchVehicles();
        setShowAddModal(false);
        resetForm();
        setError(null);
        console.log('Vehicle added successfully:', response.data);
      }
    } catch (err) {
      console.error('Error adding vehicle:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Không thể thêm xe. Vui lòng thử lại.');
    } finally {
      setAddLoading(false);
    }
  };

  // Hàm mở modal edit và load thông tin xe
  const handleEditVehicle = async (vehicle) => {
    setEditingVehicle(vehicle);
    
    // Load vehicle models nếu chưa có
    if (vehicleModels.length === 0) {
      await fetchVehicleModels();
    }
    
    // Set form data với thông tin hiện tại của xe
    setEditFormData({
      model: vehicle.model || '',
      year: vehicle.year || new Date().getFullYear(),
      color: vehicle.color || '',
      warrantyStartDate: vehicle.warrantyStartDate ? vehicle.warrantyStartDate.split('T')[0] : '',
      warrantyEndDate: vehicle.warrantyEndDate ? vehicle.warrantyEndDate.split('T')[0] : '',
      vehicleStatus: vehicle.vehicleStatus || 'ACTIVE',
      odometerKm: vehicle.odometerKm || 0,
      purchaseDate: vehicle.purchaseDate ? vehicle.purchaseDate.split('T')[0] : ''
    });
    
    setShowEditModal(true);
    setError(null);
  };

  // Hàm cập nhật xe
  const handleUpdateVehicle = async (e) => {
    if (e) e.preventDefault();
    if (!editingVehicle) return;
    
    setEditLoading(true);
    
    try {
      const updateData = {
        model: editFormData.model,
        year: editFormData.year,
        color: editFormData.color,
        warrantyStartDate: editFormData.warrantyStartDate,
        warrantyEndDate: editFormData.warrantyEndDate,
        vehicleStatus: editFormData.vehicleStatus,
        odometerKm: editFormData.odometerKm,
        purchaseDate: editFormData.purchaseDate
      };
      
      console.log('Updating vehicle:', editingVehicle.id, updateData);
      const response = await api.put(`/vehicles/${editingVehicle.id}`, updateData);
      
      if (response.status === 200) {
        // Cập nhật thành công - refresh danh sách
        await fetchVehicles();
        setShowEditModal(false);
        resetEditForm();
        setError(null);
        console.log('Vehicle updated successfully:', response.data);
      }
    } catch (err) {
      console.error('Error updating vehicle:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Không thể cập nhật xe. Vui lòng thử lại.');
    } finally {
      setEditLoading(false);
    }
  };

  // Fetch vehicle detail by VIN
  const fetchVehicleDetail = async (vin) => {
    try {
      setModalLoading(true);
      const response = await api.get(`/vehicles/${vin}`);
      console.log('Vehicle Detail Response:', response.data);
      setSelectedVehicle(response.data);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching vehicle detail:', err);
      alert('Không thể tải thông tin chi tiết xe');
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVehicle(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'RECALLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'Hoạt động';
      case 'MAINTENANCE':
        return 'Bảo dưỡng';
      case 'INACTIVE':
        return 'Không hoạt động';
      case 'RECALLED':
        return 'Triệu hồi';
      default:
        return status || 'N/A';
    }
  };

  const getWarrantyStatusColor = (isActive, isExpired) => {
    if (isExpired) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (isActive) {
      return 'bg-teal-100 text-teal-800 border-teal-200';
    } else {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getWarrantyStatusText = (isActive, isExpired) => {
    if (isExpired) {
      return 'Hết hạn';
    } else if (isActive) {
      return 'Còn hiệu lực';
    } else {
      return 'Sắp hết hạn';
    }
  };

  // Hàm format ngày
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Function cho part status colors
  const getPartStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'INSTALLED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_STOCK':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REPLACED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPartStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'INSTALLED':
        return 'Đã lắp đặt';
      case 'IN_STOCK':
        return 'Trong kho';
      case 'MAINTENANCE':
        return 'Bảo dưỡng';
      case 'REPLACED':
        return 'Đã thay thế';
      default:
        return status || 'N/A';
    }
  };

  const filteredVehicles = Array.isArray(vehicles) ? vehicles.filter((vehicle) => {
    const matchesSearch = 
      vehicle.vin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModel = modelFilter === 'all' || vehicle.model?.includes(modelFilter);
    
    const matchesStatus = statusFilter === 'all' || vehicle.vehicleStatus?.toUpperCase() === statusFilter;
    
    const matchesWarranty = warrantyFilter === 'all' || 
      (warrantyFilter === 'active' && vehicle.warrantyActive && !vehicle.warrantyExpired) ||
      (warrantyFilter === 'expired' && vehicle.warrantyExpired);
    
    return matchesSearch && matchesModel && matchesStatus && matchesWarranty;
  }) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý xe</h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi thông tin xe và lịch sử bảo dưỡng
          </p>
        </div>
        <button 
          onClick={async () => {
            setShowAddModal(true);
            if (vehicleModels.length === 0) {
              await fetchVehicleModels(); // Fetch models when opening modal if not already loaded
            }
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Đăng ký xe mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Car className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng số xe</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{Array.isArray(vehicles) ? vehicles.length : 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Settings className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Đang hoạt động</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {Array.isArray(vehicles) ? vehicles.filter(v => v.vehicleStatus?.toUpperCase() === 'ACTIVE').length : 0}
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
                <Calendar className="h-6 w-6 text-teal-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">BH còn hiệu lực</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {Array.isArray(vehicles) ? vehicles.filter(v => v.warrantyActive).length : 0}
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
                <CalendarOff className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">BH hết hạn</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {Array.isArray(vehicles) ? vehicles.filter(v => v.warrantyExpired).length : 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Đang tải danh sách xe...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-800">{error}</span>
            <button
              onClick={fetchVehicles}
              className="ml-auto px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      {!loading && !error && (
        <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo VIN, model, chủ xe..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            {/* Filter dòng xe */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              disabled={modelsLoading}
            >
              <option value="all">Tất cả dòng xe</option>
              {vehicleModels.map((model) => (
                <option key={model.id} value={model.modelName}>
                  {model.modelName}
                </option>
              ))}
            </select>
            
            {/* Filter trạng thái xe */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              {/* <option value="MAINTENANCE">Bảo dưỡng</option> */}
              <option value="INACTIVE">Không hoạt động</option>
              {/* <option value="RECALLED">Triệu hồi</option> */}
            </select>
            
            {/* Filter trạng thái bảo hành */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={warrantyFilter}
              onChange={(e) => setWarrantyFilter(e.target.value)}
            >
              <option value="all">Tất cả bảo hành</option>
              <option value="active">Còn hiệu lực</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>
        </div>
        </div>
      )}

      {/* Vehicles Table */}
      {!loading && !error && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thông tin xe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chủ sở hữu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thông số kỹ thuật
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bảo hành
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
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Car className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{vehicle.model}</div>
                      <div className="text-sm text-gray-500">{vehicle.vin}</div>
                      <div className="text-xs text-gray-400">
                        {vehicle.year} • {vehicle.color}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{vehicle.customerName}</div>
                      <div className="text-sm text-gray-500">{vehicle.customerId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center mb-1">
                      <Settings className="h-3 w-3 mr-1 text-gray-400" />
                      {vehicle.year} • {vehicle.color}
                    </div>
                    <div className="text-xs text-gray-500">
                      Km đã đi: {vehicle.odometerKm?.toLocaleString() || 'N/A'} km
                    </div>
                    <div className="text-xs text-gray-500">
                      Linh kiện: {vehicle.parts?.length || 0} item
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getWarrantyStatusColor(vehicle.warrantyActive, vehicle.warrantyExpired)}`}>
                      {getWarrantyStatusText(vehicle.warrantyActive, vehicle.warrantyExpired)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Bắt đầu: {formatDate(vehicle.warrantyStartDate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Kết thúc: {formatDate(vehicle.warrantyEndDate)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(vehicle.vehicleStatus)}`}>
                    {getStatusText(vehicle.vehicleStatus)}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    ID: {vehicle.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => fetchVehicleDetail(vehicle.vin)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md bg-transparent"
                      disabled={modalLoading}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditVehicle(vehicle)}
                      className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-md bg-transparent"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      {/* Vehicle Detail Modal */}
      {(showModal || modalLoading) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {modalLoading ? (
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Đang tải thông tin xe...</p>
                </div>
              </div>
            ) : selectedVehicle ? (
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Chi tiết xe {selectedVehicle.model}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Vehicle Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                      <Car className="h-5 w-5 mr-2 text-blue-500" />
                      Thông tin xe
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">VIN:</span>
                        <span className="font-medium">{selectedVehicle.vin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Model:</span>
                        <span className="font-medium">{selectedVehicle.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Năm sản xuất:</span>
                        <span className="font-medium">{selectedVehicle.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Màu sắc:</span>
                        <span className="font-medium">{selectedVehicle.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Số km:</span>
                        <span className="font-medium">{selectedVehicle.odometerKm?.toLocaleString() || 'N/A'} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Trạng thái:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedVehicle.vehicleStatus)}`}>
                          {getStatusText(selectedVehicle.vehicleStatus)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="h-5 w-5 mr-2 text-green-500" />
                      Thông tin chủ sở hữu
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tên khách hàng:</span>
                        <span className="font-medium">{selectedVehicle.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Mã khách hàng:</span>
                        <span className="font-medium">{selectedVehicle.customerId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Warranty Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-yellow-500" />
                      Thông tin bảo hành
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngày bắt đầu:</span>
                        <span className="font-medium">{formatDate(selectedVehicle.warrantyStartDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngày kết thúc:</span>
                        <span className="font-medium">{formatDate(selectedVehicle.warrantyEndDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Trạng thái:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getWarrantyStatusColor(selectedVehicle.warrantyActive, selectedVehicle.warrantyExpired)}`}>
                          {getWarrantyStatusText(selectedVehicle.warrantyActive, selectedVehicle.warrantyExpired)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Parts Section */}
                  <div className="lg:col-span-2">
                    <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-purple-500" />
                      Linh kiện đã bảo trì ({selectedVehicle.parts?.length || 0})
                    </h4>
                    {selectedVehicle.parts && selectedVehicle.parts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedVehicle.parts.map((part) => (
                          <div key={part.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center">
                                <Wrench className="h-4 w-4 text-gray-400 mr-2" />
                                <h5 className="font-medium text-gray-900">{part.partName}</h5>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPartStatusColor(part.partStatus)}`}>
                                {getPartStatusText(part.partStatus)}
                              </span>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex justify-between">
                                <span>Mã linh kiện:</span>
                                <span className="font-mono text-xs">{part.partNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Serial Number:</span>
                                <span className="font-mono text-xs">{part.serialNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Danh mục:</span>
                                <span>{part.category}</span>
                              </div>
                              {part.installDate && (
                                <div className="flex justify-between">
                                  <span>Ngày lắp đặt:</span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(part.installDate)}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Trạng thái:</span>
                                <div className="flex gap-2">
                                  {part.installed && (
                                    <span className="px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                      Đã lắp
                                    </span>
                                  )}
                                  {part.active && (
                                    <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                      Hoạt động
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>Chưa có linh kiện nào được bảo trì</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Đóng
                </button>
              </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Modal thêm xe mới */}
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
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Đăng ký xe mới
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
                <form onSubmit={handleAddVehicle}>
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
                            Số VIN <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="vin"
                            value={formData.vin}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="VIN1234567890TEST333"
                          />
                        </div>

                        {/* Model */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Model xe <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="model"
                            value={formData.model}
                            onChange={handleInputChange}
                            required
                            disabled={modelsLoading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                              <Settings className="h-3 w-3 mr-1 animate-spin" />
                              Đang tải danh sách models...
                            </p>
                          )}
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
                            min="2015"
                            max="2030"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>

                        {/* Màu sắc */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Màu sắc <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Đỏ, Trắng, Đen..."
                          />
                        </div>

                        {/* Số km hiện tại */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số km hiện tại
                          </label>
                          <input
                            type="number"
                            name="odometerKm"
                            value={formData.odometerKm}
                            onChange={handleInputChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Thông tin bảo hành & mua xe */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-green-500" />
                        Thông tin bảo hành & mua xe
                      </h4>
                      <div className="space-y-4">
                        {/* Số CCCD chủ xe */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số CCCD chủ xe <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="identityNumber"
                            value={formData.identityNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="090909090900"
                          />
                        </div>

                        {/* Ngày mua xe */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày mua xe <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="purchaseDate"
                            value={formData.purchaseDate}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>

                        {/* Ngày bắt đầu bảo hành */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày bắt đầu bảo hành <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="warrantyStartDate"
                            value={formData.warrantyStartDate}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>

                        {/* Ngày kết thúc bảo hành */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày kết thúc bảo hành <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="warrantyEndDate"
                            value={formData.warrantyEndDate}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
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
                  onClick={handleAddVehicle}
                  disabled={addLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {addLoading && <Settings className="h-4 w-4 mr-2 animate-spin" />}
                  {addLoading ? 'Đang đăng ký...' : 'Đăng ký xe'}
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

      {/* Modal edit xe */}
      {showEditModal && (
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
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Cập nhật thông tin xe {editingVehicle?.vin}
                  </h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetEditForm();
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
                <form onSubmit={handleUpdateVehicle}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Thông tin xe */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Car className="h-5 w-5 mr-2 text-blue-500" />
                        Thông tin xe
                      </h4>
                      <div className="space-y-4">
                        {/* Model */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Model xe <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="model"
                            value={editFormData.model}
                            onChange={handleEditInputChange}
                            required
                            disabled={modelsLoading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                              <Settings className="h-3 w-3 mr-1 animate-spin" />
                              Đang tải danh sách models...
                            </p>
                          )}
                        </div>

                        {/* Năm sản xuất */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Năm sản xuất <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="year"
                            value={editFormData.year}
                            onChange={handleEditInputChange}
                            required
                            min="2020"
                            max="2030"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>

                        {/* Màu sắc */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Màu sắc <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="color"
                            value={editFormData.color}
                            onChange={handleEditInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Đen"
                          />
                        </div>

                        {/* Số km */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số km đã đi
                          </label>
                          <input
                            type="number"
                            name="odometerKm"
                            value={editFormData.odometerKm}
                            onChange={handleEditInputChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="0"
                          />
                        </div>

                        {/* Trạng thái xe */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái xe <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="vehicleStatus"
                            value={editFormData.vehicleStatus}
                            onChange={handleEditInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                          >
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="MAINTENANCE">Bảo dưỡng</option>
                            <option value="INACTIVE">Không hoạt động</option>
                            <option value="RECALLED">Triệu hồi</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin bảo hành và mua */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-green-500" />
                        Thông tin bảo hành
                      </h4>
                      <div className="space-y-4">
                        {/* Ngày bắt đầu bảo hành */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày bắt đầu bảo hành <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="warrantyStartDate"
                            value={editFormData.warrantyStartDate}
                            onChange={handleEditInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>

                        {/* Ngày kết thúc bảo hành */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày kết thúc bảo hành <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="warrantyEndDate"
                            value={editFormData.warrantyEndDate}
                            onChange={handleEditInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>

                        {/* Ngày mua xe */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày mua xe <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="purchaseDate"
                            value={editFormData.purchaseDate}
                            onChange={handleEditInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleUpdateVehicle}
                  disabled={editLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editLoading && <Settings className="h-4 w-4 mr-2 animate-spin" />}
                  {editLoading ? 'Đang cập nhật...' : 'Cập nhật xe'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetEditForm();
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

      {/* Summary */}
      {!loading && !error && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">
            Hiển thị {filteredVehicles.length} trong tổng số {Array.isArray(vehicles) ? vehicles.length : 0} xe
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
