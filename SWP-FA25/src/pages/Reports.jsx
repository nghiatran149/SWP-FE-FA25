import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Filter, FileText, Activity } from 'lucide-react';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedReport, setSelectedReport] = useState('warranty_overview');

  const reportTypes = [
    { value: 'warranty_overview', label: 'Tổng quan bảo hành' },
    { value: 'service_campaigns', label: 'Chiến dịch dịch vụ' },
    { value: 'parts_inventory', label: 'Tồn kho phụ tùng' },
    { value: 'technician_performance', label: 'Hiệu suất kỹ thuật viên' },
    { value: 'customer_satisfaction', label: 'Hài lòng khách hàng' },
  ];

  const periods = [
    { value: 'this_week', label: 'Tuần này' },
    { value: 'this_month', label: 'Tháng này' },
    { value: 'this_quarter', label: 'Quý này' },
    { value: 'this_year', label: 'Năm này' },
    { value: 'custom', label: 'Tùy chọn' },
  ];

  // Sample data for charts
  const warrantyStats = {
    totalClaims: 1234,
    pendingClaims: 89,
    completedClaims: 1145,
    rejectedClaims: 23,
    avgProcessingTime: 5.2,
    customerSatisfaction: 4.6,
  };

  const monthlyData = [
    { month: 'T1', claims: 98, completed: 92, pending: 6 },
    { month: 'T2', claims: 112, completed: 108, pending: 4 },
    { month: 'T3', claims: 125, completed: 119, pending: 6 },
    { month: 'T4', claims: 108, completed: 102, pending: 6 },
    { month: 'T5', claims: 134, completed: 128, pending: 6 },
    { month: 'T6', claims: 145, completed: 138, pending: 7 },
    { month: 'T7', claims: 156, completed: 149, pending: 7 },
    { month: 'T8', claims: 142, completed: 135, pending: 7 },
    { month: 'T9', claims: 167, completed: 158, pending: 9 },
  ];

  const issueCategories = [
    { category: 'Pin', count: 458, percentage: 37 },
    { category: 'Động cơ', count: 295, percentage: 24 },
    { category: 'Hệ thống sạc', count: 221, percentage: 18 },
    { category: 'Phần mềm', count: 148, percentage: 12 },
    { category: 'Khác', count: 112, percentage: 9 },
  ];

  const topTechnicians = [
    { name: 'Trần Thị B', completed: 45, avgTime: 4.2, rating: 4.8 },
    { name: 'Phạm Văn D', completed: 42, avgTime: 4.5, rating: 4.7 },
    { name: 'Nguyễn Văn E', completed: 38, avgTime: 4.8, rating: 4.6 },
    { name: 'Lê Thị F', completed: 35, avgTime: 5.1, rating: 4.5 },
    { name: 'Hoàng Văn G', completed: 33, avgTime: 5.3, rating: 4.4 },
  ];

  const getCategoryColor = (index) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
    return colors[index % colors.length];
  };

  const renderWarrantyOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng yêu cầu</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{warrantyStats.totalClaims.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Thời gian xử lý TB</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{warrantyStats.avgProcessingTime} ngày</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Hài lòng KH</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{warrantyStats.customerSatisfaction}/5</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Xu hướng theo tháng</h3>
          <div className="h-64">
            <div className="flex items-end justify-between h-48 space-x-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="relative w-full">
                    <div
                      className="bg-blue-500 rounded-t"
                      style={{ height: `${(data.completed / 170) * 100}%` }}
                    ></div>
                    <div
                      className="bg-yellow-500"
                      style={{ height: `${(data.pending / 170) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Hoàn thành</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Đang xử lý</span>
              </div>
            </div>
          </div>
        </div>

        {/* Issue Categories */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Phân loại vấn đề</h3>
          <div className="space-y-3">
            {issueCategories.map((category, index) => (
              <div key={category.category} className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900">{category.category}</span>
                    <span className="text-gray-600">{category.count} ({category.percentage}%)</span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getCategoryColor(index)}`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Technicians */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Kỹ thuật viên xuất sắc</h3>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hoàn thành
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian TB
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topTechnicians.map((tech, index) => (
                <tr key={tech.name}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{tech.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tech.completed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tech.avgTime} ngày
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1">{tech.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

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
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Xuất báo cáo
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại báo cáo
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Áp dụng
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {selectedReport === 'warranty_overview' && renderWarrantyOverview()}
      
      {selectedReport !== 'warranty_overview' && (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Báo cáo {reportTypes.find(t => t.value === selectedReport)?.label}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Báo cáo này đang được phát triển và sẽ có sẵn sớm.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
