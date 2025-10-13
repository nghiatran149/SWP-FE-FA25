import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Package, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

const PartManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const parts = [
    {
      id: 'PT001',
      name: 'Pin Lithium 75kWh',
      partNumber: 'VF8-BAT-75K',
      category: 'battery',
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      unitPrice: 120000000,
      supplier: 'CATL',
      location: 'Kho A1-B2',
      lastUpdated: '2024-09-10',
      status: 'active',
      compatibility: ['VF8', 'VF9'],
    },
    {
      id: 'PT002',
      name: 'Động cơ điện 150kW',
      partNumber: 'VF-MOT-150K',
      category: 'motor',
      currentStock: 8,
      minStock: 5,
      maxStock: 20,
      unitPrice: 85000000,
      supplier: 'Bosch',
      location: 'Kho B1-A3',
      lastUpdated: '2024-09-09',
      status: 'active',
      compatibility: ['VF8'],
    },
    {
      id: 'PT003',
      name: 'Bộ sạc nhanh 11kW',
      partNumber: 'VF-CHG-11K',
      category: 'charger',
      currentStock: 3,
      minStock: 5,
      maxStock: 15,
      unitPrice: 15000000,
      supplier: 'ABB',
      location: 'Kho C2-D1',
      lastUpdated: '2024-09-08',
      status: 'low_stock',
      compatibility: ['VF8', 'VF9'],
    },
    {
      id: 'PT004',
      name: 'Hệ thống phanh ABS',
      partNumber: 'VF-BRK-ABS',
      category: 'brake',
      currentStock: 15,
      minStock: 8,
      maxStock: 25,
      unitPrice: 25000000,
      supplier: 'Continental',
      location: 'Kho A2-C1',
      lastUpdated: '2024-09-07',
      status: 'active',
      compatibility: ['VF8', 'VF9'],
    },
    {
      id: 'PT005',
      name: 'Màn hình cảm ứng 15.6"',
      partNumber: 'VF-SCR-156',
      category: 'electronics',
      currentStock: 0,
      minStock: 3,
      maxStock: 12,
      unitPrice: 18000000,
      supplier: 'Samsung',
      location: 'Kho D1-E2',
      lastUpdated: '2024-09-06',
      status: 'out_of_stock',
      compatibility: ['VF8', 'VF9'],
    },
  ];

  const categories = [
    { value: 'all', label: 'Tất cả danh mục' },
    { value: 'battery', label: 'Pin' },
    { value: 'motor', label: 'Động cơ' },
    { value: 'charger', label: 'Bộ sạc' },
    { value: 'brake', label: 'Phanh' },
    { value: 'electronics', label: 'Điện tử' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'discontinued':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Có sẵn';
      case 'low_stock':
        return 'Sắp hết';
      case 'out_of_stock':
        return 'Hết hàng';
      case 'discontinued':
        return 'Ngừng sản xuất';
      default:
        return status;
    }
  };

  const getStockStatus = (current, min, max) => {
    if (current === 0) return 'out_of_stock';
    if (current <= min) return 'low_stock';
    return 'active';
  };

  const filteredParts = parts.filter((part) => {
    const matchesSearch = 
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || part.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const stockStats = {
    total: parts.length,
    active: parts.filter(p => getStockStatus(p.currentStock, p.minStock, p.maxStock) === 'active').length,
    lowStock: parts.filter(p => getStockStatus(p.currentStock, p.minStock, p.maxStock) === 'low_stock').length,
    outOfStock: parts.filter(p => getStockStatus(p.currentStock, p.minStock, p.maxStock) === 'out_of_stock').length,
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
          Thêm phụ tùng
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
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Có sẵn</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stockStats.active}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Sắp hết</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stockStats.lowStock}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Hết hàng</dt>
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
                placeholder="Tìm kiếm theo tên, mã phụ tùng, nhà cung cấp..."
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
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc nâng cao
            </button>
          </div>
        </div>
      </div>

      {/* Parts Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phụ tùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá đơn vị
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhà cung cấp
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vị trí
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredParts.map((part) => {
              const stockStatus = getStockStatus(part.currentStock, part.minStock, part.maxStock);
              return (
                <tr key={part.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{part.name}</div>
                      <div className="text-sm text-gray-500">{part.partNumber}</div>
                      <div className="text-xs text-gray-400">
                        Tương thích: {part.compatibility.join(', ')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className={stockStatus === 'out_of_stock' ? 'text-red-600 font-medium' : stockStatus === 'low_stock' ? 'text-yellow-600 font-medium' : ''}>
                        {part.currentStock}
                      </span>
                      <span className="text-gray-500"> / {part.maxStock}</span>
                    </div>
                    <div className="text-xs text-gray-500">Tối thiểu: {part.minStock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(part.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {part.supplier}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {part.location}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(stockStatus)}`}>
                      {getStatusText(stockStatus)}
                    </span>
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
              );
            })}
          </tbody>
        </table>
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

export default PartManagement;
