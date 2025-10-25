import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit, Package, AlertTriangle, TrendingDown, TrendingUp, Loader2, Wrench, Warehouse } from 'lucide-react';
import api from '../../api/api';

const AvailablePartManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State cho API
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch parts từ API
  const fetchParts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/sc/parts/available?page=0&size=100');
      console.log('API Response:', response.data);
      
      // API trả về object có content array (pagination)
      if (response.data && Array.isArray(response.data.content)) {
        setParts(response.data.content);
      } else if (Array.isArray(response.data)) {
        // Fallback nếu API trả về array trực tiếp
        setParts(response.data);
      } else {
        console.warn('API response không đúng định dạng:', response.data);
        setParts([]);
        setError('Dữ liệu API không đúng định dạng.');
      }
    } catch (err) {
      setError('Không thể tải danh sách phụ tùng. Vui lòng thử lại.');
      console.error('Error fetching parts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  // Lấy danh mục từ API data
  const categories = [
    { value: 'all', label: 'Tất cả danh mục' },
    ...Array.from(new Set(parts.map(part => part.category)))
      .map(category => ({ value: category, label: category }))
  ];

  // Trạng thái dựa trên API
  const statuses = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'IN_STOCK', label: 'Trong kho' },
    { value: 'DEFECTIVE', label: 'Lỗi' },
    { value: 'INSTALLED', label: 'Đã lắp đặt' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'IN_STOCK':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DEFECTIVE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'INSTALLED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'IN_STOCK':
        return 'Trong kho';
      case 'DEFECTIVE':
        return 'Lỗi';
      case 'INSTALLED':
        return 'Đã lắp đặt';
      default:
        return status;
    }
  };

  const getCategoryColor = (category) => {
    // Tạo màu dựa trên hash của tên danh mục để màu nhất quán
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bg-cyan-100 text-cyan-800 border-cyan-200',
      'bg-teal-100 text-teal-800 border-teal-200',
      'bg-emerald-100 text-emerald-800 border-emerald-200',
      'bg-amber-100 text-amber-800 border-amber-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-rose-100 text-rose-800 border-rose-200',
    ];
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const filteredParts = parts.filter((part) => {
    const matchesSearch = 
      part.partName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.warehouseName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || part.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || part.partStatus === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stockStats = {
    total: parts.length,
    inStock: parts.filter(p => p.partStatus === 'IN_STOCK').length,
    defective: parts.filter(p => p.partStatus === 'DEFECTIVE').length,
    installed: parts.filter(p => p.partStatus === 'INSTALLED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý phụ tùng có sẵn</h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi và quản lý phụ tùng có sẵn trong kho
          </p>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng phụ tùng</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stockStats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Warehouse className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Trong kho</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stockStats.inStock}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Lỗi</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stockStats.defective}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Wrench className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Đã lắp đặt</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stockStats.installed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã phụ tùng, serial number, kho..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {/* <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select> */}
          </div>
        </div>
      </div>

      {/* Parts Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
              <button 
                onClick={fetchParts}
                className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
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
                  Phụ tùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial Number
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bảo hành (tháng)
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Không tìm thấy phụ tùng nào</p>
                  </td>
                </tr>
              ) : (
                filteredParts.map((part) => (
                  <tr key={part.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{part.partName}</div>
                        <div className="text-sm text-gray-500">{part.partNumber}</div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(part.category)}`}>
                            Danh mục: {part.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{part.serialNumber}</div>
                      <div className="text-xs text-gray-500">ID: {part.id}</div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {part.warrantyPeriod ? `${part.warrantyPeriod} tháng` : 'Không có'}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{part.warehouseName}</div>
                      <div className="text-xs text-gray-500">ID: {part.warehouseId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(part.partStatus)}`}>
                        {getStatusText(part.partStatus)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {part.inStock ? 'Trong kho' : 'Không trong kho'} • {part.installed ? 'Đã lắp' : 'Chưa lắp'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-500">
          Hiển thị {filteredParts.length} trong tổng số {parts.length} phụ tùng
        </div>
      </div>
    </div>
  );
};

export default AvailablePartManagement;