import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Mail, Phone, User, Calendar, Shield, Wrench, UserStar, UserRoundCog, Settings, Users, ToggleLeft, ToggleRight, UserCheck, UserX, BookOpen, Loader2, X, AlertCircle } from 'lucide-react';
import api from '../../api/api';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'EVM_STAFF',
    isActive: true
  });

  // Fetch users từ API
  const fetchUsers = async (page = 0, size = 20) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/admin/users?page=${page}&size=${size}&sortBy=createdAt&sortDirection=desc`);
      console.log('API Response:', response.data);

      if (response.data && response.data.users) {
        setUsers(response.data.users);
        setPagination({
          page: response.data.currentPage,
          size: size,
          totalElements: response.data.totalItems,
          totalPages: response.data.totalPages
        });
      } else {
        console.warn('API response structure unexpected:', response.data);
        setUsers([]);
        setError('Dữ liệu API không đúng định dạng.');
      }
    } catch (err) {
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại.');
      console.error('Error fetching users:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Role definitions
  const roles = [
    { value: 'ADMIN', label: 'ADMIN', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Shield },
    { value: 'EVM_STAFF', label: 'EVM STAFF', color: 'bg-teal-100 text-teal-800 border-teal-200', icon: UserRoundCog },
    { value: 'SC_STAFF', label: 'SC STAFF', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: UserStar },
    { value: 'SC_TECHNICIAN', label: 'SC TECHNICIAN', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Wrench }
  ];

  // Roles cho form (không bao gồm ADMIN)
  const formRoles = roles.filter(role => role.value !== 'ADMIN');

  const getRoleInfo = (roleValue) => {
    return roles.find(r => r.value === roleValue) || { label: roleValue, color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Shield };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Hoạt động' : 'Không hoạt động';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      phone: '',
      role: 'EVM_STAFF',
      isActive: true
    });
  };

  const handleAddUser = async (e) => {
    if (e) e.preventDefault();
    setAddLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        role: formData.role
      };

      console.log('Creating user:', userData);
      const response = await api.post('/admin/users', userData);
      console.log('User created successfully:', response.data);

      alert('Thêm người dùng thành công!');

      // Đóng modal và reset form
      setShowAddModal(false);
      resetForm();

      // Refresh danh sách users
      fetchUsers(pagination.page, pagination.size);
    } catch (error) {
      console.error('Error creating user:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng');
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    if (e) e.preventDefault();
    setEditLoading(true);

    try {
      const userData = {
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive
      };

      console.log('Updating user:', selectedUser.id, userData);
      const response = await api.put(`/admin/users/${selectedUser.id}`, userData);
      console.log('Update response:', response.data);

      if (response.status === 200) {
        alert('Cập nhật người dùng thành công!');

        // Cập nhật thành công - refresh danh sách
        await fetchUsers(pagination.page, pagination.size);
        setShowEditModal(false);
        resetForm();
        setSelectedUser(null);
        setError(null);
      }
    } catch (err) {
      console.error('Error updating user:', err);
      console.error('Error response:', err.response?.data);
      setError('Không thể cập nhật người dùng. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleToggleActive = (userId, currentStatus) => {
    // TODO: API call để toggle status
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, isActive: !currentStatus }
          : user
      )
    );
  };

  const filteredUsers = users.filter((user) => {
    // Loại bỏ user có role ADMIN
    if (user.role === 'ADMIN') return false;

    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm) ||
      user.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý tài khoản người dùng và phân quyền hệ thống
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
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
                    {users.filter(u => u.isActive).length}
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
                    {users.filter(u => !u.isActive).length}
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
                <UserStar className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">SC STAFF</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {users.filter(u => u.role === 'SC_STAFF').length}
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
                <Wrench className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">SC TECHNICIAN</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {users.filter(u => u.role === 'SC_TECHNICIAN').length}
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
                <UserRoundCog className="h-6 w-6 text-teal-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">EVM STAFF</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {users.filter(u => u.role === 'EVM_STAFF').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
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
                onClick={() => fetchUsers()}
                className="mt-2 text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Thử lại
              </button>
            </div>
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
                placeholder="Tìm kiếm theo tên, email, SĐT, mã người dùng..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tất cả vai trò</option>
              {formRoles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
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
      )}

      {/* Users Table */}
      {!loading && !error && (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tạo / Cập nhật
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
            {filteredUsers.map((user) => {
              const roleInfo = getRoleInfo(user.role);
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-white">
                          {user.fullName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {user.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="truncate max-w-xs">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleInfo.color}`}>
                      {roleInfo.icon && <roleInfo.icon className="h-3 w-3 mr-1" />}
                      {roleInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Calendar className="h-3 w-3 mr-1 text-green-500" />
                        <span className="text-xs text-gray-500">Tạo:</span>
                        <span className="ml-1">{formatDate(user.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-blue-500" />
                        <span className="text-xs text-gray-500">CN:</span>
                        <span className="ml-1">{formatDate(user.updatedAt)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.isActive)}`}>
                      {getStatusText(user.isActive)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 items-center">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="p-2 text-white hover:text-white hover:bg-blue-600 rounded-md bg-blue-500 border border-gray-500"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-white hover:text-white hover:bg-yellow-600 rounded-md bg-yellow-500 border border-gray-500"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {/* <button
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                        className={`p-2 rounded-md transition-colors ${user.isActive
                          ? 'text-green-600 hover:text-green-800 bg-transparent hover:bg-green-50'
                          : 'text-gray-400 hover:text-gray-600 bg-transparent hover:bg-gray-50'
                          }`}
                        title={user.isActive ? 'Nhấn để vô hiệu hóa' : 'Nhấn để kích hoạt'}
                      >
                        {user.isActive ? (
                          <ToggleRight className="h-5 w-5" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                      </button> */}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}

      {/* Pagination & Summary */}
      {!loading && !error && (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Hiển thị {users.length} người dùng trong trang {pagination.page + 1} / {pagination.totalPages}
            <br />
            Tổng số: {pagination.totalElements} người dùng | Đã lọc: {filteredUsers.length} người dùng
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                disabled={pagination.page === 0}
                onClick={() => fetchUsers(pagination.page - 1, pagination.size)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>

              <span className="text-sm text-gray-700">
                Trang {pagination.page + 1} / {pagination.totalPages}
              </span>

              <button
                disabled={pagination.page >= pagination.totalPages - 1}
                onClick={() => fetchUsers(pagination.page + 1, pagination.size)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Modal thêm người dùng */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Thêm người dùng mới
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

                <form onSubmit={handleAddUser}>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Cột 1 */}
                    <div className="space-y-4">
                      {/* Username */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên đăng nhập <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Nhập tên đăng nhập"
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Nhập mật khẩu"
                        />
                      </div>

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
                    </div>

                    {/* Cột 2 */}
                    <div className="space-y-4">
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
                          placeholder="example@vinfast.vn"
                        />
                      </div>

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
                          placeholder="0909090909"
                        />
                      </div>

                      {/* Vai trò */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vai trò <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        >
                          {formRoles.map(role => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddUser}
                  disabled={addLoading}
                  className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {addLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Thêm người dùng'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  disabled={addLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa người dùng */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Chỉnh sửa người dùng - {selectedUser?.id}
                  </h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                      setSelectedUser(null);
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

                <form onSubmit={handleUpdateUser}>
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
                        placeholder="example@vinfast.vn"
                      />
                    </div>

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
                        placeholder="0909090909"
                      />
                    </div>

                    {/* Vai trò */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vai trò <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      >
                        {formRoles.map(role => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Trạng thái */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          formData.isActive 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {formData.isActive ? (
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
                </form>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleUpdateUser}
                  disabled={editLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editLoading ? 'Đang cập nhật...' : 'Cập nhật người dùng'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                    setSelectedUser(null);
                  }}
                  disabled={editLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết người dùng */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between pb-3">
                  <h3 className="text-lg font-medium text-gray-900">Chi tiết người dùng</h3>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedUser(null);
                    }}
                    className="text-gray-400 bg-transparent hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Thông tin cá nhân */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Thông tin cá nhân</h4>

                      <div className="space-y-3">
                        <div className="flex items-start">
                          <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedUser.fullName}</dd>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedUser.email}</dd>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedUser.phone}</dd>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Shield className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Vai trò</dt>
                            <dd className="mt-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleInfo(selectedUser.role).color}`}>
                                {getRoleInfo(selectedUser.role).label}
                              </span>
                            </dd>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin hệ thống */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Thông tin hệ thống</h4>

                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Mã người dùng</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedUser.id}</dd>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Ngày tạo</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</dd>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Cập nhật lần cuối</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.updatedAt)}</dd>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Đăng nhập lần cuối</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.lastLogin)}</dd>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                            <dd className="mt-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.isActive)}`}>
                                {getStatusText(selectedUser.isActive)}
                              </span>
                            </dd>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedUser(null);
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

export default UserManagement;
