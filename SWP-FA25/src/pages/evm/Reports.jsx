import React, { useState, useEffect } from 'react';
import { FileChartColumn, FileChartLine, FileCheck, Banknote, Percent, Clock8, Filter, FileText, Activity, Car, Package, AlertCircle } from 'lucide-react';
import api from '../../api/api';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('warranty_overview');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with default date range (last 30 days)
  const getDefaultDates = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return {
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
  };

  const [startDate, setStartDate] = useState(getDefaultDates().startDate);
  const [endDate, setEndDate] = useState(getDefaultDates().endDate);

  // const reportTypes = [
  //   { value: 'warranty_overview', label: 'Tổng quan bảo hành' },
  //   { value: 'service_campaigns', label: 'Chiến dịch dịch vụ' },
  //   { value: 'parts_inventory', label: 'Tồn kho phụ tùng' },
  //   { value: 'technician_performance', label: 'Hiệu suất kỹ thuật viên' },
  //   { value: 'customer_satisfaction', label: 'Hài lòng khách hàng' },
  // ];

  // Fetch failure statistics
  useEffect(() => {
    fetchFailureStatistics();
  }, []);

  const fetchFailureStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/reports/failure-statistics', {
        params: {
          startDate,
          endDate,
          groupBy: 'BOTH'
        }
      });
      setReportData(response.data);
    } catch (err) {
      console.error('Error fetching failure statistics:', err);
      setError('Không thể tải dữ liệu báo cáo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        setError('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
        return;
      }
      fetchFailureStatistics();
    } else {
      setError('Vui lòng chọn ngày bắt đầu và ngày kết thúc');
    }
  };

  const getCategoryColor = (index) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
    return colors[index % colors.length];
  };

  const formatChangePercent = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const renderWarrantyOverview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      );
    }

    if (!reportData) return null;

    const { summary, byVehicleModel, byPartModel, period } = reportData;

    return (
      <div className="space-y-6">
        {/* Period Info */}
        {/* Moved to filter section */}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Car className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng số xe đang hoạt động</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{summary.activeVehicles.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div> */}

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileChartColumn className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Số yêu cầu trong kỳ</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{summary.claimsInPeriod.toLocaleString()}</dd>
                    {/* {summary.claimsChangePercent !== null && (
                      <dd className={`text-sm ${summary.claimsChangePercent >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatChangePercent(summary.claimsChangePercent)}
                      </dd>
                    )} */}
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileChartLine className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Yêu cầu đang chờ xử lý</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{summary.pendingClaims.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileCheck className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Yêu cầu hoàn thành trong kỳ</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{summary.completedClaimsInPeriod.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Banknote className="h-6 w-6 text-teal-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng chi phí</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{formatCurrency(summary.totalCost)}</dd>
                    {/* {summary.costChangePercent !== null && (
                      <dd className={`text-sm ${summary.costChangePercent >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatChangePercent(summary.costChangePercent)}
                      </dd>
                    )} */}
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Percent className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">TB chi phí/yêu cầu</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{formatCurrency(summary.averageCostPerClaim)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock8 className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">TB giờ sửa chữa</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {summary.averageRepairHours !== null ? `${summary.averageRepairHours}h` : 'N/A'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics by Model */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center">
            <Car className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Thống kê theo mẫu xe</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mẫu xe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hãng/Năm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Xe hoạt động
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yêu cầu BH
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng chi phí
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TB chi phí/Yêu cầu
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thay đổi
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {byVehicleModel && byVehicleModel.length > 0 ? (
                  byVehicleModel.map((model) => (
                    <tr key={model.modelId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{model.modelName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{model.brand}</div>
                        <div className="text-xs text-gray-500">{model.year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {model.activeVehicles}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {model.claimsInPeriod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(model.totalCost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(model.averageCostPerClaim)}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {model.claimsChangePercent !== null ? (
                          <span className={model.claimsChangePercent >= 0 ? 'text-red-600' : 'text-green-600'}>
                            {formatChangePercent(model.claimsChangePercent)}
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics by Part */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center">
            <Package className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Thống kê theo phụ tùng</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã PT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên phụ tùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số yêu cầu cần dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số PT đã dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng chi phí
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TB chi phí/Yêu cầu
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thay đổi
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {byPartModel && byPartModel.length > 0 ? (
                  byPartModel.map((part) => (
                    <tr key={part.partModelId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{part.partNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{part.partName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {part.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {part.uniqueClaims}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {part.totalInstances}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(part.totalCost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(part.averageCostPerClaim)}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {part.claimsChangePercent !== null ? (
                          <span className={part.claimsChangePercent >= 0 ? 'text-red-600' : 'text-green-600'}>
                            {formatChangePercent(part.claimsChangePercent)}
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Phân tích</h1>
          <p className="mt-1 text-sm text-gray-500">
            Thống kê và phân tích dữ liệu hệ thống
          </p>
        </div>
        {/* <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Xuất báo cáo
        </button> */}
      </div>

      {/* Filters and Period Info */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          {/* Period Info */}
          {reportData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 lg:w-1/2">
              <h3 className="text-sm font-medium text-blue-900">Kỳ báo cáo</h3>
              <p className="text-sm text-blue-700 mt-1">
                {new Date(reportData.period.startDate).toLocaleDateString('vi-VN')} - {new Date(reportData.period.endDate).toLocaleDateString('vi-VN')}
                <span className="ml-2 text-xs">({reportData.periodLengthDays} ngày)</span>
              </p>
            </div>
          )}

          {/* Date Filters */}
          <div className="flex gap-3 lg:w-1/2 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kết thúc
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <button
              onClick={handleApplyFilter}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-2" />
              {loading ? 'Đang tải...' : 'Áp dụng'}
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {renderWarrantyOverview()}
    </div>
  );
};

export default Reports;