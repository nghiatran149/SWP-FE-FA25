import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Phone, Mail, MapPin, Calendar, Car, CreditCard, User, Loader2, X, ToggleLeft, ToggleRight, AlertCircle, BookOpen, UserCheck, UserX } from 'lucide-react';
import api from '../../api/api';

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // State cho modal view detail
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedViewCustomer, setSelectedViewCustomer] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Form state cho thêm khách hàng
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    identityNumber: '',
    dateOfBirth: '',
    isActive: true
  });

  // Form state cho chỉnh sửa khách hàng
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    identityNumber: '',
    dateOfBirth: '',
    isActive: true
  });

  // Fetch customers từ API
  const fetchCustomers = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/customers?page=${page}&size=${size}&sort=id,desc`);
      console.log('API Response:', response.data);

      if (response.data && response.data.content) {
        setCustomers(response.data.content);
        setPagination({
          page: response.data.number,
          size: response.data.size,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages
        });
      } else {
        console.warn('API response structure unexpected:', response.data);
        setCustomers([]);
        setError('Dữ liệu API không đúng định dạng.');
      }
    } catch (err) {
      setError('Không thể tải danh sách khách hàng. Vui lòng thử lại.');
      console.error('Error fetching customers:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Hàm thêm khách hàng mới
  const handleAddCustomer = async (e) => {
    if (e) e.preventDefault();
    setAddLoading(true);

    try {
      const customerData = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await api.post('/customers', customerData);

      if (response.status === 201) {
        // Thêm thành công - refresh danh sách
        await fetchCustomers();
        setShowAddModal(false);
        resetForm();
        setError(null); // Clear any previous errors
        // Có thể thêm toast notification ở đây
      }
    } catch (err) {
      console.error('Error adding customer:', err);
      setError('Không thể thêm khách hàng. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setAddLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      address: '',
      identityNumber: '',
      dateOfBirth: '',
      isActive: true
    });
  };

  // Reset edit form
  const resetEditForm = () => {
    setEditFormData({
      fullName: '',
      phone: '',
      email: '',
      address: '',
      identityNumber: '',
      dateOfBirth: '',
      isActive: true
    });
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Xử lý thay đổi input cho edit form
  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Hàm mở modal edit
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setEditFormData({
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      identityNumber: customer.identityNumber,
      dateOfBirth: customer.dateOfBirth,
      isActive: customer.isActive
    });
    setShowEditModal(true);
  };

  // Hàm cập nhật khách hàng
  const handleUpdateCustomer = async (e) => {
    if (e) e.preventDefault();
    setEditLoading(true);

    try {
      const customerData = {
        ...editFormData,
        updatedAt: new Date().toISOString()
      };

      const response = await api.put(`/customers/${selectedCustomer.id}`, customerData);

      if (response.status === 200) {
        // Cập nhật thành công - refresh danh sách
        await fetchCustomers();
        setShowEditModal(false);
        resetEditForm();
        setSelectedCustomer(null);
        setError(null); // Clear any previous errors
      }
    } catch (err) {
      console.error('Error updating customer:', err);
      setError('Không thể cập nhật khách hàng. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setEditLoading(false);
    }
  };

  // Hàm toggle trạng thái active của khách hàng
  const handleToggleActive = async (customerId, currentStatus) => {
    try {
      setToggleLoading(prev => ({ ...prev, [customerId]: true }));

      const newStatus = !currentStatus;
      const response = await api.patch(`/customers/${customerId}/status?isActive=${newStatus}`);

      if (response.status === 200) {
        // Cập nhật state local
        setCustomers(prev =>
          prev.map(customer =>
            customer.id === customerId
              ? { ...customer, isActive: newStatus }
              : customer
          )
        );
      }
    } catch (err) {
      console.error('Error toggling customer status:', err);
      console.error('Error response:', err.response?.data);
      setError('Không thể cập nhật trạng thái khách hàng. Vui lòng thử lại.');
    } finally {
      setToggleLoading(prev => ({ ...prev, [customerId]: false }));
    }
  };

  // Hàm xem chi tiết customer
  const handleViewCustomer = async (customerId) => {
    try {
      setViewLoading(true);
      setSelectedViewCustomer(null);
      setShowViewModal(true);

      const response = await api.get(`/customers/${customerId}`);

      if (response.status === 200) {
        setSelectedViewCustomer(response.data);
      }
    } catch (err) {
      console.error('Error fetching customer details:', err);
      setError('Không thể tải chi tiết khách hàng.');
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Hoạt động' : 'Không hoạt động';
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.identityNumber?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && customer.isActive) ||
      (statusFilter === 'inactive' && !customer.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý thông tin khách hàng và lịch sử sử dụng dịch vụ
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm khách hàng
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng khách hàng</dt>
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
                <UserCheck className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Đang hoạt động</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {customers.filter(c => c.isActive).length}
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
                <UserX className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Không hoạt động</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {customers.filter(c => !c.isActive).length}
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
                <BookOpen className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Trang hiện tại</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {pagination.page + 1}/{pagination.totalPages}
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
                placeholder="Tìm kiếm theo tên, email, SĐT, CCCD, mã KH..."
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
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        ) : error ? (
          // <div className="text-center py-12">
          //   <div className="text-red-600 mb-2">{error}</div>
          //   <button 
          //     onClick={() => fetchCustomers()}
          //     className="text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          //   >
          //     Thử lại
          //   </button>
          // </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800">{error}</span>
              <button
                onClick={fetchCustomers}
                className="ml-auto px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Thử lại
              </button>
            </div>
          </div>

        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin cá nhân
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
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-white">
                          {customer.fullName?.charAt(0) || 'N'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.fullName}</div>
                        <div className="text-sm text-gray-500">{customer.id}</div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Tạo: {formatDate(customer.createdAt)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="truncate max-w-xs">{customer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-start">
                      <MapPin className="h-3 w-3 mr-1 text-gray-400 mt-1 flex-shrink-0" />
                      <span className="max-w-xs">{customer.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <CreditCard className="h-3 w-3 mr-1 text-gray-400" />
                        {customer.identityNumber}
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1 text-gray-400" />
                        {calculateAge(customer.dateOfBirth)} tuổi
                      </div>
                      <div className="text-xs text-gray-400">
                        Sinh: {formatDate(customer.dateOfBirth)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(customer.isActive)}`}>
                      {getStatusText(customer.isActive)}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      Cập nhật: {formatDate(customer.updatedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 items-center">
                      <button
                        onClick={() => handleViewCustomer(customer.id)}
                        className="p-2 text-white hover:text-white hover:bg-blue-600 rounded-md bg-blue-500 border border-gray-500"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditCustomer(customer)}
                        className="p-2 text-white hover:text-white hover:bg-yellow-600 rounded-md bg-yellow-500 border border-gray-500"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      {/* Toggle Active Status */}
                      <button
                        onClick={() => handleToggleActive(customer.id, customer.isActive)}
                        disabled={toggleLoading[customer.id]}
                        className={`p-2 rounded-md transition-colors ${customer.isActive
                          ? 'text-green-600 hover:text-green-800 bg-transparent hover:bg-green-50'
                          : 'text-gray-400 hover:text-gray-600 bg-transparent hover:bg-gray-50'
                          } ${toggleLoading[customer.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={customer.isActive ? 'Nhấn để vô hiệu hóa' : 'Nhấn để kích hoạt'}
                      >
                        {toggleLoading[customer.id] ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : customer.isActive ? (
                          <ToggleRight className="h-5 w-5" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination & Summary */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Hiển thị {customers.length} khách hàng trong trang {pagination.page + 1} / {pagination.totalPages}
            <br />
            Tổng số: {pagination.totalElements} khách hàng | Đã lọc: {filteredCustomers.length} khách hàng
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                disabled={pagination.page === 0}
                onClick={() => fetchCustomers(pagination.page - 1, pagination.size)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>

              <span className="text-sm text-gray-700">
                Trang {pagination.page + 1} / {pagination.totalPages}
              </span>

              <button
                disabled={pagination.page >= pagination.totalPages - 1}
                onClick={() => fetchCustomers(pagination.page + 1, pagination.size)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal thêm khách hàng */}
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
                    Thêm khách hàng mới
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
                <form onSubmit={handleAddCustomer}>
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
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Nhập họ và tên đầy đủ"
                          />
                        </div>

                        {/* Số CCCD */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số CCCD/CMND <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="identityNumber"
                            value={formData.identityNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="090909090909"
                          />
                        </div>

                        {/* Ngày sinh */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày sinh <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>

                        {/* Trạng thái */}
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="isActive"
                              checked={formData.isActive}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Khách hàng đang hoạt động</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-green-500" />
                        Thông tin liên hệ
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
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="0909090908"
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
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="example@gmail.com"
                          />
                        </div>

                        {/* Địa chỉ */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Nhập địa chỉ đầy đủ"
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
                  onClick={handleAddCustomer}
                  disabled={addLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {addLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {addLoading ? 'Đang thêm...' : 'Thêm khách hàng'}
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

      {/* Modal chỉnh sửa khách hàng */}
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
                    Chỉnh sửa khách hàng - {selectedCustomer?.id}
                  </h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetEditForm();
                      setSelectedCustomer(null);
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
                <form onSubmit={handleUpdateCustomer}>
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

                        {/* Số CCCD */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số CCCD/CMND <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="identityNumber"
                            value={editFormData.identityNumber}
                            onChange={handleEditInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="090909090909"
                          />
                        </div>

                        {/* Ngày sinh */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày sinh <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={editFormData.dateOfBirth}
                            onChange={handleEditInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>

                        {/* Trạng thái */}
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="isActive"
                              checked={editFormData.isActive}
                              onChange={handleEditInputChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Khách hàng đang hoạt động</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-green-500" />
                        Thông tin liên hệ
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

                        {/* Địa chỉ */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="address"
                            value={editFormData.address}
                            onChange={handleEditInputChange}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Nhập địa chỉ đầy đủ"
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
                  onClick={handleUpdateCustomer}
                  disabled={editLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editLoading ? 'Đang cập nhật...' : 'Cập nhật khách hàng'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetEditForm();
                    setSelectedCustomer(null);
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

      {/* Modal view customer detail */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between pb-3">
                  <h3 className="text-lg font-medium text-gray-900">Chi tiết khách hàng</h3>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedViewCustomer(null);
                    }}
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
                  ) : selectedViewCustomer ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Thông tin cá nhân */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Thông tin cá nhân</h4>

                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-start">
                            <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
                              <dd className="mt-1 text-sm text-gray-900">{selectedViewCustomer.fullName}</dd>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Email</dt>
                              <dd className="mt-1 text-sm text-gray-900">{selectedViewCustomer.email}</dd>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
                              <dd className="mt-1 text-sm text-gray-900">{selectedViewCustomer.phone}</dd>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <CreditCard className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <dt className="text-sm font-medium text-gray-500">CCCD/CMND</dt>
                              <dd className="mt-1 text-sm text-gray-900">{selectedViewCustomer.identityNumber}</dd>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Địa chỉ</dt>
                              <dd className="mt-1 text-sm text-gray-900">{selectedViewCustomer.address}</dd>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                              <dd className="mt-1">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedViewCustomer.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                                  }`}>
                                  {selectedViewCustomer.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                </span>
                              </dd>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Danh sách xe */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Danh sách xe sở hữu</h4>

                        {selectedViewCustomer.vehicles && selectedViewCustomer.vehicles.length > 0 ? (
                          <div className="space-y-3">
                            {selectedViewCustomer.vehicles.map((vehicle, index) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-start">
                                  <Car className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-sm font-medium text-gray-900">
                                        {vehicle.modelName} ({vehicle.year})
                                      </h5>
                                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${vehicle.vehicleStatus === 'ACTIVE'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {vehicle.vehicleStatus === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">VIN: {vehicle.vin}</p>
                                    <p className="text-sm text-gray-600">Màu sắc: {vehicle.color}</p>
                                    <p className="text-sm text-gray-600">ID xe: {vehicle.id}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Khách hàng chưa sở hữu xe nào</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                      <p className="text-gray-500">Không thể tải thông tin khách hàng</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedViewCustomer(null);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
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

export default CustomerManagement;
