import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit, Star, Clock, CheckCircle, User, Phone, Mail, Award, Loader2, X, Calendar, Briefcase, AlertCircle } from 'lucide-react';
import api from '../../api/api';

const TechnicianManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [workloadFilter, setWorkloadFilter] = useState('all');
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // State cho modal view detail
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // State cho modal edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    isActive: true
  });

  // Fetch technicians from API
  useEffect(() => {
    fetchTechnicians();
  }, [pagination.page, pagination.size]);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/technicians?page=${pagination.page}&size=${pagination.size}`);
      
      if (response.data) {
        setTechnicians(response.data.content);
        setPagination(prev => ({
          ...prev,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages
        }));
      }
    } catch (err) {
      console.error('Error fetching technicians:', err);
      setError('Không thể tải danh sách kỹ thuật viên');
    } finally {
      setLoading(false);
    }
  };

  const getWorkloadStatus = (workload) => {
    if (!workload) return { text: 'Không rõ', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    
    switch (workload.status) {
      case 'AVAILABLE':
        return { text: 'Sẵn sàng', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'BUSY':
        return { text: 'Đang làm việc', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      default:
        return { text: workload.status, color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const getActiveStatusColor = (isActive) => {
    return isActive 
      ? 'bg-teal-100 text-teal-800 border-teal-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getActiveStatusText = (isActive) => {
    return isActive ? 'Hoạt động' : 'Ngưng hoạt động';
  };

  const filteredTechnicians = technicians.filter((tech) => {
    const matchesSearch = 
      tech.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && tech.isActive) || 
      (statusFilter === 'inactive' && !tech.isActive);
    
    const matchesWorkload = workloadFilter === 'all' || 
      tech.workload?.status === workloadFilter;
    
    return matchesSearch && matchesStatus && matchesWorkload;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Hàm xem chi tiết technician
  const handleViewTechnician = async (technicianId) => {
    try {
      setViewLoading(true);
      setShowViewModal(true);
      const response = await api.get(`/technicians/${technicianId}`);
      
      if (response.data) {
        setSelectedTechnician(response.data);
      }
    } catch (err) {
      console.error('Error fetching technician detail:', err);
      alert('Không thể tải thông tin kỹ thuật viên');
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedTechnician(null);
  };

  // Hàm mở modal edit
  const handleOpenEditModal = async (technicianId) => {
    try {
      setEditLoading(true);
      const response = await api.get(`/technicians/${technicianId}`);
      
      if (response.data) {
        setSelectedTechnician(response.data);
        setEditFormData({
          email: response.data.email || '',
          fullName: response.data.fullName || '',
          phone: response.data.phone || '',
          isActive: response.data.isActive
        });
        setShowEditModal(true);
      }
    } catch (err) {
      console.error('Error fetching technician for edit:', err);
      alert('Không thể tải thông tin kỹ thuật viên');
    } finally {
      setEditLoading(false);
    }
  };

  // Hàm xử lý thay đổi input trong form edit
  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Hàm submit update technician
  const handleUpdateTechnician = async (e) => {
    e.preventDefault();
    
    try {
      setEditLoading(true);
      setError(null);

      const response = await api.put(`/technicians/${selectedTechnician.id}`, editFormData);

      if (response.data) {
        alert('Cập nhật kỹ thuật viên thành công!');
        setShowEditModal(false);
        setSelectedTechnician(null);
        fetchTechnicians(); // Refresh danh sách
      }
    } catch (err) {
      console.error('Error updating technician:', err);
      setError(err.response?.data?.message || 'Không thể cập nhật kỹ thuật viên');
    } finally {
      setEditLoading(false);
    }
  };

  // Hàm đóng modal edit
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedTechnician(null);
    setEditFormData({
      email: '',
      fullName: '',
      phone: '',
      isActive: true
    });
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý kỹ thuật viên</h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi hiệu suất và phân công công việc cho kỹ thuật viên
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Thêm kỹ thuật viên
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={fetchTechnicians}
                className="mt-2 text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <User className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Tổng KTV</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{pagination.totalElements}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-teal-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Hoạt động</dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {technicians.filter(t => t.isActive).length}
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
                    <Star className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Sẵn sàng</dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {technicians.filter(t => t.workload?.status === 'AVAILABLE').length}
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
                    <Clock className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Công việc</dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {technicians.reduce((sum, t) => sum + (t.workload?.totalActiveAssignments || 0), 0)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, ..." 
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
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngưng hoạt động</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={workloadFilter}
              onChange={(e) => setWorkloadFilter(e.target.value)}
            >
              <option value="all">Tất cả công việc</option>
              <option value="AVAILABLE">Sẵn sàng</option>
              <option value="BUSY">Đang làm việc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTechnicians.map((tech) => (
          <div key={tech.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg font-medium text-white">
                    {tech.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{tech.fullName}</h3>
                  <p className="text-sm text-gray-500">{tech.username}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActiveStatusColor(tech.isActive)}`}>
                    {getActiveStatusText(tech.isActive)}
                  </span>
                  {tech.workload && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getWorkloadStatus(tech.workload).color}`}>
                      {getWorkloadStatus(tech.workload).text}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">ID:</span>
                  <span className="ml-1">{tech.id}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {tech.phone || 'N/A'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {tech.email}
                </div>

                <div className="border-t pt-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Vai trò</p>
                      <p className="text-sm font-semibold text-gray-900">{tech.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Công việc hiện tại</p>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-orange-400 mr-1" />
                        <span className="text-sm font-semibold text-gray-900">
                          {tech.workload?.totalActiveAssignments || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Tham gia: {formatDate(tech.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button 
                  onClick={() => handleViewTechnician(tech.id)}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Xem
                </button>
                <button 
                  onClick={() => handleOpenEditModal(tech.id)}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Sửa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-500">
          Hiển thị {filteredTechnicians.length} trong tổng số {pagination.totalElements} kỹ thuật viên
        </div>
      </div>
        </>
      )}

      {/* Modal xem chi tiết kỹ thuật viên */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Chi tiết kỹ thuật viên</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 bg-transparent hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mt-4">
                  {viewLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : selectedTechnician ? (
                    <div className="space-y-6">
                      {/* Header với avatar và thông tin cơ bản */}
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-3xl font-medium text-white">
                            {selectedTechnician.fullName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900">{selectedTechnician.fullName}</h4>
                          <p className="text-sm text-gray-500">@{selectedTechnician.username}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActiveStatusColor(selectedTechnician.isActive)}`}>
                              {getActiveStatusText(selectedTechnician.isActive)}
                            </span>
                            {selectedTechnician.workload && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getWorkloadStatus(selectedTechnician.workload).color}`}>
                                {getWorkloadStatus(selectedTechnician.workload).text}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Thông tin chi tiết */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cột trái */}
                        <div className="space-y-4">
                          <h5 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Thông tin cá nhân</h5>
                          
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <dt className="text-xs font-medium text-gray-500">Mã ID</dt>
                                <dd className="mt-1 text-sm text-gray-900 font-mono">{selectedTechnician.id}</dd>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <dt className="text-xs font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900">{selectedTechnician.email}</dd>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <dt className="text-xs font-medium text-gray-500">Số điện thoại</dt>
                                <dd className="mt-1 text-sm text-gray-900">{selectedTechnician.phone || 'N/A'}</dd>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Briefcase className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <dt className="text-xs font-medium text-gray-500">Vai trò</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                    {selectedTechnician.role}
                                  </span>
                                </dd>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <dt className="text-xs font-medium text-gray-500">Ngày tham gia</dt>
                                <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedTechnician.createdAt)}</dd>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Cột phải */}
                        <div className="space-y-4">
                          <h5 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Khối lượng công việc</h5>
                          
                          <div className={`rounded-lg p-4 border ${
                            selectedTechnician.workload?.status === 'AVAILABLE' 
                              ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                              : selectedTechnician.workload?.status === 'BUSY'
                              ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200'
                              : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <Clock className={`h-5 w-5 mr-2 ${
                                  selectedTechnician.workload?.status === 'AVAILABLE' 
                                    ? 'text-green-600' 
                                    : selectedTechnician.workload?.status === 'BUSY'
                                    ? 'text-yellow-600'
                                    : 'text-gray-600'
                                }`} />
                                <span className="text-sm font-medium text-gray-700">Trạng thái công việc</span>
                              </div>
                              {selectedTechnician.workload && (
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getWorkloadStatus(selectedTechnician.workload).color}`}>
                                  {getWorkloadStatus(selectedTechnician.workload).text}
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Công việc đang xử lý</span>
                                <span className={`text-2xl font-bold ${
                                  selectedTechnician.workload?.status === 'AVAILABLE' 
                                    ? 'text-green-600' 
                                    : selectedTechnician.workload?.status === 'BUSY'
                                    ? 'text-yellow-600'
                                    : 'text-gray-600'
                                }`}>
                                  {selectedTechnician.workload?.totalActiveAssignments || 0}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h6 className="text-xs font-semibold text-gray-700 uppercase mb-3">Thống kê</h6>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="text-center">
                                <div className="text-xs text-gray-500">Trạng thái</div>
                                <div className="text-lg font-semibold mt-1">
                                  {selectedTechnician.isActive ? (
                                    <span className="text-teal-600">Hoạt động</span>
                                  ) : (
                                    <span className="text-red-600">Ngưng</span>
                                  )}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-500">Công việc</div>
                                <div className="text-lg font-semibold text-orange-600 mt-1">
                                  {selectedTechnician.workload?.totalActiveAssignments || 0}
                                </div>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Không có dữ liệu
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa kỹ thuật viên */}
      {showEditModal && (
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
                    Chỉnh sửa kỹ thuật viên - {selectedTechnician?.id}
                  </h3>
                  <button
                    onClick={handleCloseEditModal}
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
                <form onSubmit={handleUpdateTechnician}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Thông tin cá nhân */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-500" />
                        Thông tin cá nhân
                      </h4>
                      <div className="space-y-4">
                        {/* Họ và tên */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={editFormData.fullName}
                            onChange={handleEditInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Nhập họ và tên đầy đủ"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={editFormData.email}
                            onChange={handleEditInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="example@gmail.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-green-500" />
                        Thông tin liên hệ & Trạng thái
                      </h4>
                      <div className="space-y-4">
                        {/* Số điện thoại */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={editFormData.phone}
                            onChange={handleEditInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="0909090908"
                          />
                        </div>

                        {/* Trạng thái */}
                        <div className="pt-2">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="isActive"
                              checked={editFormData.isActive}
                              onChange={handleEditInputChange}
                              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">
                              Kỹ thuật viên đang hoạt động
                            </span>
                          </label>
                          <p className="mt-1 text-xs text-gray-500 ml-6">
                            Bỏ chọn nếu muốn vô hiệu hóa tài khoản
                          </p>
                        </div>

                        {/* Thông tin bổ sung */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
                          <div className="flex items-start">
                            <Briefcase className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-blue-900">Vai trò</p>
                              <p className="text-sm text-blue-700 mt-1">
                                {selectedTechnician?.role || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCloseEditModal}
                      disabled={editLoading}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                    >
                      {editLoading ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Đang cập nhật...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="-ml-1 mr-2 h-4 w-4" />
                          Cập nhật
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianManagement;
