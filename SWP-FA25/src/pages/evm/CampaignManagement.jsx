import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Users, Settings2, Cog, Calendar, AlertTriangle, AlertCircle, CheckCircle, Car, Loader2, Briefcase, LandPlot, X, FileText, Phone, User } from 'lucide-react';
import api from '../../api/api';

const CampaignManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // View modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Campaign vehicles state
  const [campaignVehicles, setCampaignVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);

  // Analytics state
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'RECALL',
    description: '',
    vehicleModel: '',
    yearFrom: '',
    yearTo: '',
    startDate: '',
    endDate: ''
  });
  const [vehicleModels, setVehicleModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    vehicleModel: '',
    yearFrom: '',
    yearTo: '',
    startDate: '',
    endDate: '',
    status: 'DRAFT'
  });

  // Status change modal state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusCampaign, setStatusCampaign] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Filter state
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Fetch campaigns from API
  const fetchCampaigns = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/campaigns?page=${page}&size=${size}`);

      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        setCampaigns(response.data.content);
        setCurrentPage(response.data.number);
        setPageSize(response.data.size);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else {
        setCampaigns([]);
        setError('Dữ liệu API không đúng định dạng.');
      }
    } catch (err) {
      setError('Không thể tải danh sách chiến dịch. Vui lòng thử lại.');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics from API
  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await api.get('/campaigns/analytics');

      if (response.data && response.data.overview) {
        setAnalytics(response.data.overview);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(currentPage, pageSize);
    fetchAnalytics();
  }, [currentPage, pageSize]);

  // Fetch vehicle models from API
  const fetchVehicleModels = async () => {
    try {
      setModelsLoading(true);
      const response = await api.get('/admin/models');
      
      if (response.status === 200 && Array.isArray(response.data)) {
        // Lọc các model đang active
        const activeModels = response.data.filter(model => model.isActive);
        setVehicleModels(activeModels);
      }
    } catch (err) {
      console.error('Error fetching vehicle models:', err);
    } finally {
      setModelsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-brown-100 text-brown-800 border-brown-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang thực hiện';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'DRAFT':
        return 'Bản nháp';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'RECALL':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'SERVICE':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'MAINTENANCE':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'RECALL':
        return 'Triệu hồi';
      case 'SERVICE':
        return 'Dịch vụ';
      case 'MAINTENANCE':
        return 'Bảo dưỡng';
      default:
        return type;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'LOW':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.campaignId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === '' || campaign.type === filterType;
    const matchesStatus = filterStatus === '' || campaign.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getCompletionPercentage = (completionRate) => {
    return completionRate || 0;
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  // View campaign detail
  const handleViewCampaign = async (campaignId) => {
    try {
      setViewLoading(true);
      setSelectedCampaign(null);
      setCampaignVehicles([]);
      setShowViewModal(true);

      const response = await api.get(`/campaigns/${campaignId}`);

      if (response.status === 200) {
        setSelectedCampaign(response.data);
        // Fetch vehicles for this campaign
        fetchCampaignVehicles(campaignId);
      }
    } catch (err) {
      console.error('Error fetching campaign details:', err);
      setError('Không thể tải chi tiết chiến dịch.');
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  // Fetch campaign vehicles
  const fetchCampaignVehicles = async (campaignId) => {
    try {
      setVehiclesLoading(true);
      const response = await api.get(`/campaigns/${campaignId}/vehicles?page=0&size=2147483647`);

      if (response.status === 200 && response.data.content) {
        setCampaignVehicles(response.data.content);
      }
    } catch (err) {
      console.error('Error fetching campaign vehicles:', err);
    } finally {
      setVehiclesLoading(false);
    }
  };

  // Get vehicle status color
  const getVehicleStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SCHEDULED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'NOTIFIED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'IDENTIFIED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get vehicle status text
  const getVehicleStatusText = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'SCHEDULED':
        return 'Đã lên lịch';
      case 'NOTIFIED':
        return 'Đã thông báo';
      case 'IDENTIFIED':
        return 'Đã xác định';
      default:
        return status;
    }
  };

  // Group vehicles by customer
  const groupVehiclesByCustomer = (vehicles) => {
    const grouped = vehicles.reduce((acc, vehicle) => {
      const key = `${vehicle.customerName}-${vehicle.customerPhone}`;
      if (!acc[key]) {
        acc[key] = {
          customerName: vehicle.customerName,
          customerPhone: vehicle.customerPhone,
          vehicles: []
        };
      }
      acc[key].vehicles.push(vehicle);
      return acc;
    }, {});
    return Object.values(grouped);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle edit form input change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle add campaign
  const handleAddCampaign = async () => {
    try {
      setAddLoading(true);
      setError(null);

      // Validate form
      if (!formData.name.trim()) {
        setError('Vui lòng nhập tên chiến dịch');
        return;
      }
      if (!formData.startDate || !formData.endDate) {
        setError('Vui lòng chọn ngày bắt đầu và kết thúc');
        return;
      }
      if (!formData.vehicleModel) {
        setError('Vui lòng chọn model xe');
        return;
      }

      const requestBody = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        vehicleModels: [formData.vehicleModel],
        yearFrom: formData.yearFrom ? parseInt(formData.yearFrom) : 0,
        yearTo: formData.yearTo ? parseInt(formData.yearTo) : 0,
        startDate: formData.startDate,
        endDate: formData.endDate
      };

      const response = await api.post('/campaigns', requestBody);

      if (response.status === 200 || response.status === 201) {
        // Reset form
        setFormData({
          name: '',
          type: 'RECALL',
          description: '',
          vehicleModel: '',
          yearFrom: '',
          yearTo: '',
          startDate: '',
          endDate: ''
        });
        setShowAddModal(false);
        
        // Refresh campaigns list
        fetchCampaigns(currentPage, pageSize);
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Error adding campaign:', err);
      setError(err.response?.data?.message || 'Không thể tạo chiến dịch. Vui lòng thử lại.');
    } finally {
      setAddLoading(false);
    }
  };

  // Handle edit campaign - open modal and load data
  const handleEditCampaign = async (campaign) => {
    try {
      setEditingCampaign(campaign);
      setEditFormData({
        name: campaign.name || '',
        description: campaign.description || '',
        vehicleModel: campaign.vehicleModel || '',
        yearFrom: campaign.yearFrom || '',
        yearTo: campaign.yearTo || '',
        startDate: campaign.startDate || '',
        endDate: campaign.endDate || '',
        status: campaign.status || 'DRAFT'
      });
      setShowEditModal(true);
      await fetchVehicleModels();
    } catch (err) {
      console.error('Error opening edit modal:', err);
      setError('Không thể mở form chỉnh sửa.');
    }
  };

  // Handle update campaign
  const handleUpdateCampaign = async () => {
    try {
      setEditLoading(true);
      setError(null);

      // Validate form
      if (!editFormData.name.trim()) {
        setError('Vui lòng nhập tên chiến dịch');
        return;
      }
      if (!editFormData.startDate || !editFormData.endDate) {
        setError('Vui lòng chọn ngày bắt đầu và kết thúc');
        return;
      }
      if (!editFormData.vehicleModel) {
        setError('Vui lòng chọn model xe');
        return;
      }

      const requestBody = {
        name: editFormData.name,
        description: editFormData.description,
        vehicleModels: [editFormData.vehicleModel],
        yearFrom: editFormData.yearFrom ? parseInt(editFormData.yearFrom) : 0,
        yearTo: editFormData.yearTo ? parseInt(editFormData.yearTo) : 0,
        startDate: editFormData.startDate,
        endDate: editFormData.endDate,
        status: editFormData.status
      };

      const response = await api.put(`/campaigns/${editingCampaign.campaignId}`, requestBody);

      if (response.status === 200 || response.status === 204) {
        // Reset form
        setEditFormData({
          name: '',
          description: '',
          vehicleModel: '',
          yearFrom: '',
          yearTo: '',
          startDate: '',
          endDate: '',
          status: 'DRAFT'
        });
        setShowEditModal(false);
        setEditingCampaign(null);
        
        // Refresh campaigns list
        fetchCampaigns(currentPage, pageSize);
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Error updating campaign:', err);
      setError(err.response?.data?.message || 'Không thể cập nhật chiến dịch. Vui lòng thử lại.');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle open status modal
  const handleOpenStatusModal = (campaign) => {
    setStatusCampaign(campaign);
    setNewStatus(''); // Don't pre-select, force user to choose
    setShowStatusModal(true);
  };

  // Get available status options based on current status
  const getAvailableStatuses = (currentStatus) => {
    switch (currentStatus) {
      case 'ACTIVE':
        return ['COMPLETED'];
      case 'DRAFT':
        return ['ACTIVE', 'CANCELLED'];
      case 'CANCELLED':
      case 'COMPLETED':
        return []; // No changes allowed
      default:
        return [];
    }
  };

  // Handle change status
  const handleChangeStatus = async () => {
    try {
      setStatusLoading(true);
      setError(null);

      if (!newStatus) {
        setError('Vui lòng chọn trạng thái');
        return;
      }

      const requestBody = {
        status: newStatus
      };

      const response = await api.put(`/campaigns/${statusCampaign.campaignId}/status`, requestBody);

      if (response.status === 200 || response.status === 204) {
        setShowStatusModal(false);
        setStatusCampaign(null);
        setNewStatus('');
        
        // Refresh campaigns list
        fetchCampaigns(currentPage, pageSize);
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Error changing status:', err);
      setError(err.response?.data?.message || 'Không thể thay đổi trạng thái. Vui lòng thử lại.');
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chiến dịch & dịch vụ</h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi các chiến dịch triệu hồi, dịch vụ và bảo dưỡng
          </p>
        </div>
        <button 
          onClick={() => {
            setShowAddModal(true);
            fetchVehicleModels();
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo chiến dịch mới
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
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
                onClick={() => fetchCampaigns(currentPage, pageSize)}
                className="mt-2 text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
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
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm chiến dịch, dịch vụ..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter by Type */}
              <div className="w-full md:w-48">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả loại</option>
                  <option value="SERVICE">Dịch vụ</option>
                  <option value="RECALL">Triệu hồi</option>
                </select>
              </div>

              {/* Filter by Status */}
              <div className="w-full md:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="DRAFT">Bản nháp</option>
                  <option value="ACTIVE">Đang thực hiện</option>
                  <option value="COMPLETED">Đã hoàn thành</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <LandPlot className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tổng chiến dịch
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {analyticsLoading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        ) : (
                          analytics?.totalCampaigns || 0
                        )}
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
                    <Cog className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Đang thực hiện
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {analyticsLoading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        ) : (
                          analytics?.statusStatistics?.ACTIVE || 0
                        )}
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
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Đã hoàn thành
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {analyticsLoading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        ) : (
                          analytics?.statusStatistics?.COMPLETED || 0
                        )}
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
                    <Briefcase className="h-6 w-6 text-teal-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Dịch vụ
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {analyticsLoading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        ) : (
                          analytics?.typeStatistics?.SERVICE || 0
                        )}
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
                    <AlertTriangle className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Triệu hồi
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {analyticsLoading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        ) : (
                          analytics?.typeStatistics?.RECALL || 0
                        )}
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
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Bản nháp
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {analyticsLoading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        ) : (
                          analytics?.statusStatistics?.DRAFT || 0
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaigns List */}
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.campaignId} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                        {getStatusText(campaign.status)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(campaign.type)}`}>
                        {getTypeText(campaign.type)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">Mã chiến dịch: {campaign.campaignId}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {campaign.startDate} - {campaign.endDate}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Car className="h-4 w-4 mr-2" />
                        {(campaign.totalVehicles || 0).toLocaleString()} xe bị ảnh hưởng
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {(campaign.completedVehicles || 0).toLocaleString()} xe đã hoàn thành
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Tiến độ hoàn thành</span>
                        <span>{getCompletionPercentage(campaign.completionRate)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${campaign.status === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-400'
                            }`}
                          style={{
                            width: `${getCompletionPercentage(campaign.completionRate)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleViewCampaign(campaign.campaignId)}
                      className="p-2 text-white hover:text-white hover:bg-blue-600 rounded-md bg-blue-500 border border-gray-500"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {/* Chỉ hiển thị nút Edit khi status không phải CANCELLED */}
                    {campaign.status !== 'CANCELLED' && (
                      <button 
                        onClick={() => handleEditCampaign(campaign)}
                        className="p-2 text-white hover:text-white hover:bg-yellow-600 rounded-md bg-yellow-500 border border-gray-500"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {/* Chỉ hiển thị nút Settings khi status không phải CANCELLED hoặc COMPLETED */}
                    {campaign.status !== 'CANCELLED' && campaign.status !== 'COMPLETED' && (
                      <button 
                        onClick={() => handleOpenStatusModal(campaign)}
                        className="p-2 text-white hover:text-white hover:bg-green-600 rounded-md bg-green-500 border border-gray-500"
                      >
                        <Settings2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy chiến dịch</h3>
              <p className="mt-1 text-sm text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200 rounded-lg">
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
                    <span className="font-medium">{totalElements}</span> chiến dịch
                  </p>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={5}>5 / trang</option>
                    <option value={10}>10 / trang</option>
                    <option value={20}>20 / trang</option>
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
          )}
        </>
      )}

      {/* Modal xem chi tiết chiến dịch */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 sm:align-middle sm:max-w-7xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 mr-4">
                    {selectedCampaign && (
                      <>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {selectedCampaign.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Mã chiến dịch: {selectedCampaign.campaignId}
                        </p>
                      </>
                    )}
                    {!selectedCampaign && (
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Chi tiết chiến dịch
                      </h3>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedCampaign(null);
                    }}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none flex-shrink-0"
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
                ) : selectedCampaign ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Cột trái - Thông tin chiến dịch */}
                    <div className="overflow-y-auto pr-4 max-h-[600px]">
                      {/* Description section */}
                      {selectedCampaign.description && (
                        <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h4 className="text-md font-semibold text-gray-900 mb-2 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-blue-500" />
                            Mô tả chiến dịch
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{selectedCampaign.description}</p>
                        </div>
                      )}

                      <div className="space-y-6">
                        {/* Thông tin cơ bản */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-blue-500" />
                            Thông tin cơ bản
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Loại:</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(selectedCampaign.type)}`}>
                                {getTypeText(selectedCampaign.type)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedCampaign.status)}`}>
                                {getStatusText(selectedCampaign.status)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Ngày bắt đầu:</span>
                              <span className="text-sm text-gray-900">{selectedCampaign.startDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Ngày kết thúc:</span>
                              <span className="text-sm text-gray-900">{selectedCampaign.endDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Ngày tạo:</span>
                              <span className="text-sm text-gray-900">{new Date(selectedCampaign.createdAt).toLocaleString('vi-VN')}</span>
                            </div>
                            {selectedCampaign.updatedAt && (
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-700">Cập nhật lần cuối:</span>
                                <span className="text-sm text-gray-900">{new Date(selectedCampaign.updatedAt).toLocaleString('vi-VN')}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Thông tin xe */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <Car className="h-5 w-5 mr-2 text-teal-500" />
                            Thông tin xe bị ảnh hưởng
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Model xe:</span>
                              <span className="text-sm text-gray-900 text-right ml-2">{selectedCampaign.vehicleModel || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Năm sản xuất:</span>
                              <span className="text-sm text-gray-900">
                                {selectedCampaign.yearFrom && selectedCampaign.yearTo
                                  ? `${selectedCampaign.yearFrom} - ${selectedCampaign.yearTo}`
                                  : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Thống kê tiến độ */}
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
                            Thống kê tiến độ
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Tổng số xe</div>
                              <div className="text-lg font-semibold text-gray-900">{selectedCampaign.totalVehicles || 0}</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Đã xác định</div>
                              <div className="text-lg font-semibold text-blue-600">{selectedCampaign.identifiedVehicles || 0}</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Đã thông báo</div>
                              <div className="text-lg font-semibold text-purple-600">{selectedCampaign.notifiedVehicles || 0}</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Đã lên lịch</div>
                              <div className="text-lg font-semibold text-yellow-600">{selectedCampaign.scheduledVehicles || 0}</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Hoàn thành</div>
                              <div className="text-lg font-semibold text-green-600">{selectedCampaign.completedVehicles || 0}</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Tỷ lệ</div>
                              <div className="text-lg font-semibold text-teal-600">
                                {selectedCampaign.totalVehicles > 0
                                  ? Math.round((selectedCampaign.completedVehicles / selectedCampaign.totalVehicles) * 100)
                                  : 0}%
                              </div>
                            </div>
                          </div>

                          {/* Progress visualization */}
                          {selectedCampaign.totalVehicles > 0 && (
                            <div className="mt-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Tiến độ thực hiện</span>
                                <span className="font-semibold">
                                  {selectedCampaign.completedVehicles} / {selectedCampaign.totalVehicles} xe
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.round((selectedCampaign.completedVehicles / selectedCampaign.totalVehicles) * 100)}%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cột phải - Danh sách xe */}
                    <div className="bg-green-50 rounded-lg border border-green-200 overflow-y-auto max-h-[600px]">
                      <div className="sticky top-0 bg-green-50 px-4 pt-4 pb-3 border-b border-green-300 z-10">
                        <h4 className="text-md font-semibold text-gray-900 flex items-center justify-between">
                          <span className="flex items-center">
                            <Car className="h-5 w-5 mr-2 text-green-500" />
                            Danh sách xe
                          </span>
                          <span className="text-sm font-normal text-gray-600">
                            {campaignVehicles.length} xe
                          </span>
                        </h4>
                      </div>
                      
                      <div className="p-4">

                        {vehiclesLoading ? (
                          <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-green-500" />
                            <span className="ml-3 text-sm text-gray-600">Đang tải...</span>
                          </div>
                        ) : campaignVehicles.length > 0 ? (
                          <div className="space-y-4">
                            {groupVehiclesByCustomer(campaignVehicles).map((group, groupIndex) => (
                              <div key={groupIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                {/* Customer Header */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="bg-blue-500 rounded-full p-2">
                                        <User className="h-4 w-4 text-white" />
                                      </div>
                                      <div>
                                        <h5 className="font-semibold text-gray-900 text-sm">{group.customerName}</h5>
                                        <div className="flex items-center text-xs text-gray-600 mt-0.5">
                                          <Phone className="h-3 w-3 mr-1" />
                                          {group.customerPhone}
                                        </div>
                                      </div>
                                    </div>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-200">
                                      {group.vehicles.length} xe
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Vehicles List */}
                                <div className="divide-y divide-gray-100">
                                  {group.vehicles.map((vehicle) => (
                                    <div key={vehicle.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-2">
                                            <Car className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <span className="font-semibold text-gray-900 text-sm truncate">{vehicle.vin}</span>
                                          </div>
                                          <div className="ml-6 space-y-1 text-xs text-gray-600">
                                            <div className="flex items-center">
                                              <span className="font-medium">{vehicle.modelName}</span>
                                              <span className="mx-1">•</span>
                                              <span>{vehicle.year}</span>
                                            </div>
                                            {vehicle.serviceDate && (
                                              <div className="flex items-center">
                                                <Calendar className="h-3 w-3 mr-1.5 text-gray-400" />
                                                <span>Dịch vụ: {vehicle.serviceDate}</span>
                                              </div>
                                            )}
                                            {vehicle.notificationSentAt && (
                                              <div className="flex items-center">
                                                <CheckCircle className="h-3 w-3 mr-1.5 text-gray-400" />
                                                <span>Thông báo: {new Date(vehicle.notificationSentAt).toLocaleDateString('vi-VN')}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getVehicleStatusColor(vehicle.status)}`}>
                                          {getVehicleStatusText(vehicle.status)}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Car className="mx-auto h-10 w-10 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">Chưa có xe nào</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Không thể tải thông tin chiến dịch</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedCampaign(null);
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

      {/* Modal thêm chiến dịch mới */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Tạo chiến dịch mới</h3>
                    <p className="text-sm text-gray-500 mt-1">Điền thông tin để tạo chiến dịch mới</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({
                        name: '',
                        type: 'RECALL',
                        description: '',
                        vehicleModel: '',
                        yearFrom: '',
                        yearTo: '',
                        startDate: '',
                        endDate: ''
                      });
                    }}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Form - 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cột trái */}
                  <div className="space-y-6">
                    {/* Tên chiến dịch */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên chiến dịch <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nhập tên chiến dịch"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    {/* Loại chiến dịch */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại chiến dịch <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="RECALL">Triệu hồi</option>
                        <option value="SERVICE">Dịch vụ</option>
                        {/* <option value="MAINTENANCE">Bảo dưỡng</option> */}
                      </select>
                    </div>

                    {/* Model xe */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model xe <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="vehicleModel"
                        value={formData.vehicleModel}
                        onChange={handleInputChange}
                        disabled={modelsLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {modelsLoading ? 'Đang tải...' : 'Chọn model xe'}
                        </option>
                        {vehicleModels.map((model) => (
                          <option key={model.id} value={model.modelName}>
                            {model.modelName} ({model.brand} - {model.year})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Năm sản xuất */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Năm từ
                        </label>
                        <input
                          type="number"
                          name="yearFrom"
                          value={formData.yearFrom}
                          onChange={handleInputChange}
                          min="2000"
                          max="2100"
                          placeholder="2020"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Năm đến
                        </label>
                        <input
                          type="number"
                          name="yearTo"
                          value={formData.yearTo}
                          onChange={handleInputChange}
                          min="2000"
                          max="2100"
                          placeholder="2025"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cột phải */}
                  <div className="space-y-6">
                    {/* Mô tả */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        placeholder="Nhập mô tả chi tiết về chiến dịch"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    {/* Ngày bắt đầu và kết thúc */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày bắt đầu <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày kết thúc <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  onClick={handleAddCampaign}
                  disabled={addLoading}
                  className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Tạo chiến dịch
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      name: '',
                      type: 'RECALL',
                      description: '',
                      vehicleModel: '',
                      yearFrom: '',
                      yearTo: '',
                      startDate: '',
                      endDate: ''
                    });
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

      {/* Modal chỉnh sửa chiến dịch */}
      {showEditModal && editingCampaign && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa chiến dịch</h3>
                    <p className="text-sm text-gray-500 mt-1">Mã: {editingCampaign.campaignId}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingCampaign(null);
                      setEditFormData({
                        name: '',
                        description: '',
                        vehicleModel: '',
                        yearFrom: '',
                        yearTo: '',
                        startDate: '',
                        endDate: '',
                        status: 'DRAFT'
                      });
                    }}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Form - 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cột trái */}
                  <div className="space-y-6">
                    {/* Tên chiến dịch */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên chiến dịch <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditInputChange}
                        placeholder="Nhập tên chiến dịch"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>

                    {/* Trạng thái */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        value={editFormData.status}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        <option value="DRAFT">Bản nháp</option>
                        <option value="ACTIVE">Đang thực hiện</option>
                        <option value="COMPLETED">Hoàn thành</option>
                        <option value="CANCELLED">Đã hủy</option>
                      </select>
                    </div>

                    {/* Model xe */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model xe <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="vehicleModel"
                        value={editFormData.vehicleModel}
                        onChange={handleEditInputChange}
                        disabled={modelsLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {modelsLoading ? 'Đang tải...' : 'Chọn model xe'}
                        </option>
                        {vehicleModels.map((model) => (
                          <option key={model.id} value={model.modelName}>
                            {model.modelName} ({model.brand} - {model.year})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Năm sản xuất */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Năm từ
                        </label>
                        <input
                          type="number"
                          name="yearFrom"
                          value={editFormData.yearFrom}
                          onChange={handleEditInputChange}
                          min="2000"
                          max="2100"
                          placeholder="2020"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Năm đến
                        </label>
                        <input
                          type="number"
                          name="yearTo"
                          value={editFormData.yearTo}
                          onChange={handleEditInputChange}
                          min="2000"
                          max="2100"
                          placeholder="2025"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cột phải */}
                  <div className="space-y-6">
                    {/* Mô tả */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả
                      </label>
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditInputChange}
                        rows={6}
                        placeholder="Nhập mô tả chi tiết về chiến dịch"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>

                    {/* Ngày bắt đầu và kết thúc */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày bắt đầu <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={editFormData.startDate}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày kết thúc <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={editFormData.endDate}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  onClick={handleUpdateCampaign}
                  disabled={editLoading}
                  className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Cập nhật
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCampaign(null);
                    setEditFormData({
                      name: '',
                      description: '',
                      vehicleModel: '',
                      yearFrom: '',
                      yearTo: '',
                      startDate: '',
                      endDate: '',
                      status: 'DRAFT'
                    });
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

      {/* Modal thay đổi trạng thái */}
      {showStatusModal && statusCampaign && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                        <Settings2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-900">Thay đổi trạng thái</h3>
                        <p className="text-sm text-gray-500 mt-1">{statusCampaign.name}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowStatusModal(false);
                      setStatusCampaign(null);
                      setNewStatus('');
                    }}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Current Status */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Trạng thái hiện tại:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(statusCampaign.status)}`}>
                      {getStatusText(statusCampaign.status)}
                    </span>
                  </div>
                </div>

                {/* New Status Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Chọn trạng thái mới <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {getAvailableStatuses(statusCampaign.status).includes('DRAFT') && (
                      <label className="relative flex items-center p-4 cursor-pointer bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="status"
                          value="DRAFT"
                          checked={newStatus === 'DRAFT'}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">Bản nháp</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                              DRAFT
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Chiến dịch đang được chuẩn bị</p>
                        </div>
                      </label>
                    )}

                    {getAvailableStatuses(statusCampaign.status).includes('ACTIVE') && (
                      <label className="relative flex items-center p-4 cursor-pointer bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="status"
                          value="ACTIVE"
                          checked={newStatus === 'ACTIVE'}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">Đang thực hiện</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              ACTIVE
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Chiến dịch đang được triển khai</p>
                        </div>
                      </label>
                    )}

                    {getAvailableStatuses(statusCampaign.status).includes('COMPLETED') && (
                      <label className="relative flex items-center p-4 cursor-pointer bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="status"
                          value="COMPLETED"
                          checked={newStatus === 'COMPLETED'}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">Hoàn thành</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              COMPLETED
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Chiến dịch đã kết thúc thành công</p>
                        </div>
                      </label>
                    )}

                    {getAvailableStatuses(statusCampaign.status).includes('CANCELLED') && (
                      <label className="relative flex items-center p-4 cursor-pointer bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="status"
                          value="CANCELLED"
                          checked={newStatus === 'CANCELLED'}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">Đã hủy</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              CANCELLED
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Chiến dịch đã bị hủy bỏ</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  onClick={handleChangeStatus}
                  disabled={statusLoading || !newStatus}
                  className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {statusLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Xác nhận thay đổi
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStatusModal(false);
                    setStatusCampaign(null);
                    setNewStatus('');
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
    </div>
  );
};

export default CampaignManagement;
