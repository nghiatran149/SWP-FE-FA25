import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit, Package, AlertTriangle, TrendingDown, TrendingUp, Loader2, Wrench, Warehouse, RotateCcw, X } from 'lucide-react';
import api from '../../api/api';

const DefectivePartManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State cho API
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availablePartNames, setAvailablePartNames] = useState([]);

  // State cho modal thêm phụ tùng lỗi
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [formData, setFormData] = useState({
    serialNumber: '',
    vin: '',
    note: '',
    category: '',
    partName: ''
  });

  // Fetch parts từ API
  const fetchParts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/sc/parts/repair');
      console.log('API Response:', response.data);
      
      // API trả về array trực tiếp
      if (Array.isArray(response.data)) {
        setParts(response.data);
      } else if (response.data && Array.isArray(response.data.content)) {
        // Fallback nếu API trả về object có content array (pagination)
        setParts(response.data.content);
      } else {
        console.warn('API response không đúng định dạng:', response.data);
        setParts([]);
        setError('Dữ liệu API không đúng định dạng.');
      }
    } catch (err) {
      setError('Không thể tải danh sách phụ tùng lỗi. Vui lòng thử lại.');
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

  // Hàm xử lý thêm phụ tùng lỗi
  const handleAddDefectivePart = async (e) => {
    if (e) e.preventDefault();
    setAddLoading(true);

    try {
      const partData = {
        serialNumber: formData.serialNumber,
        vin: formData.vin,
        note: formData.note
      };

      const response = await api.post(`/sc/parts?category=${encodeURIComponent(formData.category)}&partName=${encodeURIComponent(formData.partName)}`, partData);

      if (response.status === 201 || response.status === 200) {
        // Thêm thành công - refresh danh sách
        await fetchParts();
        setShowAddModal(false);
        resetForm();
        setError(null);
      }
    } catch (err) {
      console.error('Error adding defective part:', err);
      setError('Không thể thêm phụ tùng lỗi. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setAddLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      serialNumber: '',
      vin: '',
      note: '',
      category: '',
      partName: ''
    });
    setAvailablePartNames([]);
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Nếu thay đổi category, fetch part names và reset partName
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        partName: ''
      }));
      
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
      part.vehicleVin?.toLowerCase().includes(searchTerm.toLowerCase());
    
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý phụ tùng lỗi</h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi và quản lý phụ tùng lỗi cần sửa chữa
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-500 hover:bg-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm phụ tùng lỗi
          </button>
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
                placeholder="Tìm kiếm theo tên, mã phụ tùng, serial number, VIN xe..."
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
                  Xe
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
                    <p className="text-gray-500">Không tìm thấy phụ tùng lỗi nào</p>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{part.vehicleVin || 'Không có'}</div>
                      <div className="text-xs text-gray-500">ID: {part.vehicleId || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(part.partStatus)}`}>
                        {getStatusText(part.partStatus)}
                      </span>
                      {/* <div className="text-xs text-gray-500 mt-1">
                        {part.inStock ? 'Trong kho' : 'Không trong kho'} • {part.installed ? 'Đã lắp' : 'Chưa lắp'}
                      </div>
                      {part.active !== undefined && (
                        <div className="text-xs text-gray-500">
                          {part.active ? '✓ Đang hoạt động' : '✗ Không hoạt động'}
                        </div>
                      )} */}
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
          Hiển thị {filteredParts.length} trong tổng số {parts.length} phụ tùng lỗi
        </div>
      </div>

      {/* Modal thêm phụ tùng lỗi */}
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
                    Thêm phụ tùng lỗi
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
                <form onSubmit={handleAddDefectivePart} className="space-y-4">
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

                  {/* Serial Number */}
                  <div>
                    <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Serial Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="serialNumber"
                      name="serialNumber"
                      required
                      value={formData.serialNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Nhập serial number"
                    />
                  </div>

                  {/* VIN */}
                  <div>
                    <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-1">
                      VIN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="vin"
                      name="vin"
                      required
                      value={formData.vin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Nhập VIN xe"
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
                          Thêm
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

export default DefectivePartManagement;