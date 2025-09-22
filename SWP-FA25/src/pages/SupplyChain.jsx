import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Truck, Package, Clock, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';

const SupplyChain = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const suppliers = [
    {
      id: 'NCC001',
      name: 'CATL Battery Co.',
      contactPerson: 'Lý Minh Tuấn',
      email: 'contact@catl.com',
      phone: '+86 123 456 7890',
      address: 'Thâm Quyến, Trung Quốc',
      specialties: ['Pin Lithium', 'Hệ thống quản lý pin'],
      rating: 4.8,
      status: 'active',
      contractStart: '2023-01-01',
      contractEnd: '2025-12-31',
      totalOrders: 45,
      onTimeDelivery: 96,
      qualityScore: 4.9,
      lastDelivery: '2024-09-15',
    },
    {
      id: 'NCC002',
      name: 'Bosch Vietnam',
      contactPerson: 'Nguyễn Văn Hùng',
      email: 'vietnam@bosch.com',
      phone: '+84 28 1234 5678',
      address: 'TP.HCM, Việt Nam',
      specialties: ['Động cơ điện', 'Hệ thống phanh'],
      rating: 4.7,
      status: 'active',
      contractStart: '2022-06-01',
      contractEnd: '2024-12-31',
      totalOrders: 78,
      onTimeDelivery: 94,
      qualityScore: 4.8,
      lastDelivery: '2024-09-16',
    },
    {
      id: 'NCC003',
      name: 'ABB Charging Solutions',
      contactPerson: 'Maria Rodriguez',
      email: 'charging@abb.com',
      phone: '+41 43 317 7111',
      address: 'Zurich, Thụy Sĩ',
      specialties: ['Bộ sạc nhanh', 'Hạ tầng sạc'],
      rating: 4.9,
      status: 'active',
      contractStart: '2023-03-15',
      contractEnd: '2026-03-15',
      totalOrders: 23,
      onTimeDelivery: 98,
      qualityScore: 4.9,
      lastDelivery: '2024-09-10',
    },
    {
      id: 'NCC004',
      name: 'Continental Automotive',
      contactPerson: 'Thomas Mueller',
      email: 'info@continental.com',
      phone: '+49 511 938 01',
      address: 'Hannover, Đức',
      specialties: ['Hệ thống phanh ABS', 'Cảm biến'],
      rating: 4.6,
      status: 'contract_expired',
      contractStart: '2022-01-01',
      contractEnd: '2024-01-01',
      totalOrders: 34,
      onTimeDelivery: 89,
      qualityScore: 4.5,
      lastDelivery: '2024-08-20',
    },
  ];

  const orders = [
    {
      id: 'ĐH001',
      supplierId: 'NCC001',
      supplierName: 'CATL Battery Co.',
      items: [
        { name: 'Pin Lithium 75kWh', quantity: 50, unitPrice: 120000000 },
        { name: 'BMS Controller', quantity: 50, unitPrice: 15000000 }
      ],
      orderDate: '2024-09-01',
      expectedDelivery: '2024-09-25',
      status: 'in_transit',
      totalValue: 6750000000,
      trackingNumber: 'TRK001234567',
    },
    {
      id: 'ĐH002',
      supplierId: 'NCC002',
      supplierName: 'Bosch Vietnam',
      items: [
        { name: 'Động cơ điện 150kW', quantity: 25, unitPrice: 85000000 }
      ],
      orderDate: '2024-09-05',
      expectedDelivery: '2024-09-20',
      status: 'delivered',
      totalValue: 2125000000,
      trackingNumber: 'TRK001234568',
    },
    {
      id: 'ĐH003',
      supplierId: 'NCC003',
      supplierName: 'ABB Charging Solutions',
      items: [
        { name: 'Bộ sạc nhanh 11kW', quantity: 15, unitPrice: 15000000 }
      ],
      orderDate: '2024-09-10',
      expectedDelivery: '2024-09-30',
      status: 'processing',
      totalValue: 225000000,
      trackingNumber: 'TRK001234569',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'contract_expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Đang hoạt động';
      case 'contract_expired':
        return 'Hợp đồng hết hạn';
      case 'pending':
        return 'Chờ xử lý';
      case 'inactive':
        return 'Ngừng hoạt động';
      default:
        return status;
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_transit':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case 'processing':
        return 'Đang xử lý';
      case 'in_transit':
        return 'Đang vận chuyển';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chuỗi cung ứng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi nhà cung cấp và đơn hàng phụ tùng
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Plus className="h-4 w-4 mr-2" />
            Tạo đơn hàng
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Thêm nhà cung cấp
          </button>
        </div>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Nhà cung cấp</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{suppliers.length}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Đang hoạt động</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {suppliers.filter(s => s.status === 'active').length}
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
                <Truck className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Đơn hàng tháng này</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{orders.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Giao hàng đúng hẹn</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {Math.round(suppliers.reduce((sum, s) => sum + s.onTimeDelivery, 0) / suppliers.length)}%
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
                placeholder="Tìm kiếm nhà cung cấp..."
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
              <option value="active">Đang hoạt động</option>
              <option value="contract_expired">Hợp đồng hết hạn</option>
              <option value="pending">Chờ xử lý</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suppliers List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Nhà cung cấp</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Package className="h-5 w-5 text-gray-400 mr-2" />
                      <h4 className="text-sm font-medium text-gray-900">{supplier.name}</h4>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(supplier.status)}`}>
                        {getStatusText(supplier.status)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <div className="flex items-center mb-1">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        {supplier.address}
                      </div>
                      <div>Liên hệ: {supplier.contactPerson}</div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {supplier.specialties.map((specialty, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                          {specialty}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Đơn hàng:</span>
                        <div className="font-medium">{supplier.totalOrders}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Đúng hẹn:</span>
                        <div className="font-medium">{supplier.onTimeDelivery}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Chất lượng:</span>
                        <div className="font-medium">⭐ {supplier.qualityScore}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button className="text-primary-600 hover:text-primary-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Đơn hàng gần đây</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center mb-1">
                      <Truck className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{order.id}</span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusText(order.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{order.supplierName}</div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(order.totalValue)}
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {item.name} x{item.quantity}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <span>Đặt hàng: {order.orderDate}</span>
                  </div>
                  <div>
                    <span>Dự kiến: {order.expectedDelivery}</span>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="mt-2 text-xs text-gray-500">
                    Mã theo dõi: {order.trackingNumber}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChain;
