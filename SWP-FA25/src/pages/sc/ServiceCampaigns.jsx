import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Users, Cog, Calendar, AlertTriangle, AlertCircle, CheckCircle, Car, Loader2, Briefcase, LandPlot, X, FileText } from 'lucide-react';
import api from '../../api/api';

const ServiceCampaigns = () => {
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

  // Analytics state
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

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

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.campaignId.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      setShowViewModal(true);

      const response = await api.get(`/campaigns/${campaignId}`);

      if (response.status === 200) {
        setSelectedCampaign(response.data);
      }
    } catch (err) {
      console.error('Error fetching campaign details:', err);
      setError('Không thể tải chi tiết chiến dịch.');
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
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
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600">
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
          {/* Search */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm chiến dịch, dịch vụ..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
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
                    <LandPlot className="h-6 w-6 text-green-400" />
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
                          className={`h-2 rounded-full ${
                            campaign.status === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-400'
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
                    <button className="p-2 text-white hover:text-white hover:bg-yellow-600 rounded-md bg-yellow-500 border border-gray-500">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy chiến dịch</h3>
              <p className="mt-1 text-sm text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc tạo chiến dịch mới.</p>
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
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Chi tiết chiến dịch
                    </h3>
                    {selectedCampaign && (
                      <p className="text-sm font-semibold text-gray-500 mt-1">
                        Mã chiến dịch: {selectedCampaign.campaignId}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedCampaign(null);
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
                ) : selectedCampaign ? (
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
                            <span className="text-sm font-medium text-gray-700">Tên chiến dịch:</span>
                            <span className="text-sm font-semibold text-gray-900 text-right ml-2">{selectedCampaign.name}</span>
                          </div>
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
                    </div>

                    {/* Thống kê tiến độ */}
                    <div className="mt-6">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
                          Thống kê tiến độ
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Tổng số xe</div>
                            <div className="text-xl font-semibold text-gray-900">{selectedCampaign.totalVehicles || 0}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Xe đã xác định</div>
                            <div className="text-xl font-semibold text-blue-600">{selectedCampaign.identifiedVehicles || 0}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Xe đã thông báo</div>
                            <div className="text-xl font-semibold text-purple-600">{selectedCampaign.notifiedVehicles || 0}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Xe đã lên lịch</div>
                            <div className="text-xl font-semibold text-yellow-600">{selectedCampaign.scheduledVehicles || 0}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Xe đã hoàn thành</div>
                            <div className="text-xl font-semibold text-green-600">{selectedCampaign.completedVehicles || 0}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Tỷ lệ hoàn thành</div>
                            <div className="text-xl font-semibold text-teal-600">
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
    </div>
  );
};

export default ServiceCampaigns;
