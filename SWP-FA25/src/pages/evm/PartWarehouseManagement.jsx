import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit, Package, AlertTriangle, TrendingDown, TrendingUp, Loader2, Wrench, Warehouse} from 'lucide-react';
import api from '../../api/api';

const PartWarehouseManagement = () => {
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
      const response = await api.get('/evm/parts/warehouse');
      console.log('API Response:', response.data);
      
      if (Array.isArray(response.data)) {
        setParts(response.data);
      } else {
        console.warn('API response is not an array:', response.data);
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

  // Trạng thái mới dựa trên API
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
      case 'OUT_OF_STOCK':
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const filteredParts = parts.filter((part) => {
    const matchesSearch = 
      part.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.warehouseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || part.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || part.partStatus === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stockStats = {
    total: parts.length,
    inStock: parts.filter(p => p.partStatus === 'IN_STOCK').length,
    defective: parts.filter(p => p.partStatus === 'DEFECTIVE').length,
    outOfStock: parts.filter(p => p.partStatus === 'OUT_OF_STOCK').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý phụ tùng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi tồn kho và quản lý phụ tùng thay thế
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-500 hover:bg-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Bổ sung phụ tùng
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                <Wrench className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Đã lắp đặt</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stockStats.outOfStock}</dd>
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
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc nâng cao
            </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bảo hành (tháng)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kho
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
              {filteredParts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
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
                        <div className="text-xs text-gray-400">
                          Danh mục: {part.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{part.serialNumber}</div>
                      <div className="text-xs text-gray-500">ID: {part.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {part.warrantyPeriod ? `${part.warrantyPeriod} tháng` : 'Không có'}
                    </td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md bg-transparent">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md bg-transparent">
                          <Edit className="h-4 w-4" />
                        </button>
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

export default PartWarehouseManagement;
