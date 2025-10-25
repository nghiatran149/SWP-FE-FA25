import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit, Package, AlertTriangle, TrendingDown, TrendingUp, Loader2, Wrench, Warehouse, X } from 'lucide-react';
import api from '../../api/api';

const PartWarehouseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State cho API
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availablePartNames, setAvailablePartNames] = useState([]);

  // State cho modal bổ sung phụ tùng
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    partName: '',
    quantity: 1,
    note: ''
  });

  // State cho modal cung cấp phụ tùng
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [supplyLoading, setSupplyLoading] = useState(false);
  const [supplyFormData, setSupplyFormData] = useState({
    category: '',
    partName: '',
    quantity: 1,
    note: ''
  });
  const [supplyAvailablePartNames, setSupplyAvailablePartNames] = useState([]);

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
    fetchCategories();
  }, []);

  // Fetch categories từ API
  const fetchCategories = async () => {
    try {
      const response = await api.get('/evm/categories');
      console.log('Categories Response:', response.data);
      
      if (Array.isArray(response.data)) {
        setAvailableCategories(response.data);
      } else {
        console.warn('Categories response is not an array:', response.data);
        setAvailableCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setAvailableCategories([]);
    }
  };

  // Fetch part names theo category
  const fetchPartNamesByCategory = async (category) => {
    try {
      const response = await api.get(`/evm/parts/names?category=${encodeURIComponent(category)}`);
      console.log('Part Names Response:', response.data);
      
      if (Array.isArray(response.data)) {
        setAvailablePartNames(response.data);
      } else {
        console.warn('Part names response is not an array:', response.data);
        setAvailablePartNames([]);
      }
    } catch (err) {
      console.error('Error fetching part names:', err);
      setAvailablePartNames([]);
    }
  };

  // Hàm xử lý bổ sung phụ tùng
  const handleAddParts = async (e) => {
    if (e) e.preventDefault();
    setAddLoading(true);

    try {
      const partData = {
        category: formData.category,
        partName: formData.partName,
        quantity: parseInt(formData.quantity),
        note: formData.note
      };

      const response = await api.post('/evm/parts/batch', partData);

      if (response.status === 201 || response.status === 200) {
        // Thêm thành công - refresh danh sách
        await fetchParts();
        setShowAddModal(false);
        resetForm();
        setError(null);
      }
    } catch (err) {
      console.error('Error adding parts:', err);
      setError('Không thể bổ sung phụ tùng. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setAddLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      category: '',
      partName: '',
      quantity: 1,
      note: ''
    });
    setAvailablePartNames([]); // Reset danh sách tên phụ tùng
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Nếu thay đổi category, fetch part names và reset partName
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        partName: '' // Reset partName khi đổi category
      }));
      
      // Fetch part names nếu có category được chọn
      if (value) {
        fetchPartNamesByCategory(value);
      } else {
        setAvailablePartNames([]);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // ===== MODAL CUNG CẤP PHỤ TÙNG =====
  
  // Fetch part names theo category cho modal cung cấp
  const fetchSupplyPartNamesByCategory = async (category) => {
    try {
      const response = await api.get(`/evm/parts/names?category=${encodeURIComponent(category)}`);
      console.log('Supply Part Names Response:', response.data);
      
      if (Array.isArray(response.data)) {
        setSupplyAvailablePartNames(response.data);
      } else {
        console.warn('Supply part names response is not an array:', response.data);
        setSupplyAvailablePartNames([]);
      }
    } catch (err) {
      console.error('Error fetching supply part names:', err);
      setSupplyAvailablePartNames([]);
    }
  };

  // Hàm xử lý cung cấp phụ tùng
  const handleSupplyParts = async (e) => {
    if (e) e.preventDefault();
    setSupplyLoading(true);

    try {
      const partData = {
        category: supplyFormData.category,
        partName: supplyFormData.partName,
        quantity: parseInt(supplyFormData.quantity),
        note: supplyFormData.note
      };

      const response = await api.post('/evm/parts/supply', partData);

      if (response.status === 201 || response.status === 200) {
        // Cung cấp thành công - refresh danh sách
        await fetchParts();
        setShowSupplyModal(false);
        resetSupplyForm();
        setError(null);
      }
    } catch (err) {
      console.error('Error supplying parts:', err);
      setError('Không thể cung cấp phụ tùng. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setSupplyLoading(false);
    }
  };

  // Reset form cung cấp
  const resetSupplyForm = () => {
    setSupplyFormData({
      category: '',
      partName: '',
      quantity: 1,
      note: ''
    });
    setSupplyAvailablePartNames([]);
  };

  // Xử lý thay đổi input cho modal cung cấp
  const handleSupplyInputChange = (e) => {
    const { name, value } = e.target;
    
    // Nếu thay đổi category, fetch part names và reset partName
    if (name === 'category') {
      setSupplyFormData(prev => ({
        ...prev,
        category: value,
        partName: ''
      }));
      
      if (value) {
        fetchSupplyPartNamesByCategory(value);
      } else {
        setSupplyAvailablePartNames([]);
      }
    } else {
      setSupplyFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý kho phụ tùng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi tồn kho và quản lý phụ tùng thay thế
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-500 hover:bg-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Bổ sung phụ tùng
          </button>
          <button 
            onClick={() => setShowSupplyModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
          >
            <Package className="h-4 w-4 mr-2" />
            Cung cấp phụ tùng
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
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th> */}
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
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="p-2 text-white hover:text-white hover:bg-blue-600 rounded-md bg-blue-500 border border-gray-500">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-white hover:text-white hover:bg-yellow-600 rounded-md bg-yellow-500 border border-gray-500">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td> */}
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

      {/* Modal bổ sung phụ tùng */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Bổ sung phụ tùng
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

                {/* Form */}
                <form onSubmit={handleAddParts} className="space-y-4">
                  {/* Danh mục */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {availableCategories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tên phụ tùng */}
                  <div>
                    <label htmlFor="partName" className="block text-sm font-medium text-gray-700 mb-1">
                      Tên phụ tùng <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="partName"
                      name="partName"
                      required
                      value={formData.partName}
                      onChange={handleInputChange}
                      disabled={!formData.category}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!formData.category ? '-- Vui lòng chọn danh mục trước --' : '-- Chọn tên phụ tùng --'}
                      </option>
                      {availablePartNames.map((partName, index) => (
                        <option key={index} value={partName}>
                          {partName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Số lượng */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      required
                      min="1"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Nhập số lượng"
                    />
                  </div>

                  {/* Ghi chú */}
                  <div>
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      rows="3"
                      value={formData.note}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Nhập ghi chú (nếu có)"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 bg-transparent"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={addLoading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {addLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Bổ sung
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal cung cấp phụ tùng */}
      {showSupplyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Cung cấp phụ tùng
                  </h3>
                  <button
                    onClick={() => {
                      setShowSupplyModal(false);
                      resetSupplyForm();
                    }}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSupplyParts} className="space-y-4">
                  {/* Danh mục */}
                  <div>
                    <label htmlFor="supply-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="supply-category"
                      name="category"
                      required
                      value={supplyFormData.category}
                      onChange={handleSupplyInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {availableCategories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tên phụ tùng */}
                  <div>
                    <label htmlFor="supply-partName" className="block text-sm font-medium text-gray-700 mb-1">
                      Tên phụ tùng <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="supply-partName"
                      name="partName"
                      required
                      value={supplyFormData.partName}
                      onChange={handleSupplyInputChange}
                      disabled={!supplyFormData.category}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!supplyFormData.category ? '-- Vui lòng chọn danh mục trước --' : '-- Chọn tên phụ tùng --'}
                      </option>
                      {supplyAvailablePartNames.map((partName, index) => (
                        <option key={index} value={partName}>
                          {partName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Số lượng */}
                  <div>
                    <label htmlFor="supply-quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="supply-quantity"
                      name="quantity"
                      required
                      min="1"
                      value={supplyFormData.quantity}
                      onChange={handleSupplyInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      placeholder="Nhập số lượng"
                    />
                  </div>

                  {/* Ghi chú */}
                  <div>
                    <label htmlFor="supply-note" className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      id="supply-note"
                      name="note"
                      rows="3"
                      value={supplyFormData.note}
                      onChange={handleSupplyInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      placeholder="Nhập ghi chú (nếu có)"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSupplyModal(false);
                        resetSupplyForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 bg-transparent"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={supplyLoading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {supplyLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Package className="h-4 w-4 mr-2" />
                          Cung cấp
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartWarehouseManagement;
