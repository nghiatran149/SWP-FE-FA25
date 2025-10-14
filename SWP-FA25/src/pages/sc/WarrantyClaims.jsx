import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Calendar, User, Car, X, Upload, FileText } from 'lucide-react';
import api from '../../api/api';

const WarrantyClaims = () => {
  // State cho API và loading
  const [warrantyClaims, setWarrantyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho tìm kiếm và filter
  const [searchTermSentToManufacturer, setSearchTermSentToManufacturer] = useState('');
  const [statusFilterSentToManufacturer, setStatusFilterSentToManufacturer] = useState('all');
  const [searchTermProcessing, setSearchTermProcessing] = useState('');
  const [statusFilterProcessing, setStatusFilterProcessing] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  
  // State cho phụ tùng
  const [partQuantity, setPartQuantity] = useState(1);

  // Fetch warranty claims từ API
  const fetchWarrantyClaims = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/v1/warranty/claims');
      console.log('API Response:', response.data);
      
      if (Array.isArray(response.data)) {
        setWarrantyClaims(response.data);
      } else {
        console.warn('API response is not an array:', response.data);
        setWarrantyClaims([]);
        setError('Dữ liệu API không đúng định dạng.');
      }
    } catch (err) {
      setError('Không thể tải danh sách yêu cầu bảo hành. Vui lòng thử lại.');
      console.error('Error fetching warranty claims:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarrantyClaims();
  }, []);
  
  // Danh sách phụ tùng có sẵn
  const availableParts = [
    { id: 'battery-cell', name: 'Pin cell lithium-ion', category: 'Battery' },
    { id: 'battery-module', name: 'Module pin', category: 'Battery' },
    { id: 'battery-pack', name: 'Bộ pin hoàn chỉnh', category: 'Battery' },
    { id: 'motor-front', name: 'Động cơ điện trước', category: 'Motor' },
    { id: 'motor-rear', name: 'Động cơ điện sau', category: 'Motor' },
    { id: 'inverter', name: 'Bộ nghịch lưu', category: 'Electronics' },
    { id: 'onboard-charger', name: 'Bộ sạc tích hợp', category: 'Charging' },
    { id: 'dc-converter', name: 'Bộ chuyển đổi DC-DC', category: 'Electronics' },
    { id: 'display-center', name: 'Màn hình trung tâm 15.6 inch', category: 'Infotainment' },
    { id: 'display-cluster', name: 'Màn hình taplo', category: 'Infotainment' },
    { id: 'camera-rear', name: 'Camera lùi', category: 'Sensors' },
    { id: 'camera-front', name: 'Camera trước', category: 'Sensors' },
    { id: 'sensor-pressure', name: 'Cảm biến áp suất lốp', category: 'Sensors' },
    { id: 'sensor-proximity', name: 'Cảm biến khoảng cách', category: 'Sensors' },
    { id: 'cable-charging', name: 'Dây cáp sạc', category: 'Charging' },
    { id: 'cable-data', name: 'Dây cáp kết nối dữ liệu', category: 'Electronics' },
    { id: 'ecu-main', name: 'Hộp điều khiển trung tâm (ECU)', category: 'Electronics' },
    { id: 'door-handle', name: 'Tay nắm cửa thông minh', category: 'Body' },
    { id: 'mirror-side', name: 'Gương chiếu hậu', category: 'Body' },
    { id: 'light-headlight', name: 'Đèn pha LED', category: 'Body' },
    { id: 'light-taillight', name: 'Đèn hậu LED', category: 'Body' }
  ];
  
  // Form state cho modal tạo yêu cầu bảo hành
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    vehicleModel: '',
    vin: '',
    licensePlate: '',
    purchaseDate: '',
    warrantyType: 'standard',
    issueCategory: '',
    issueDescription: '',
    urgencyLevel: 'medium',
    requestedParts: [],
    attachments: []
  });

  // Phân loại yêu cầu bảo hành theo status
  const sentToManufacturerClaims = useMemo(() => {
    return warrantyClaims.filter(claim => 
      claim.claimStatus === 'PENDING' || claim.claimStatus === 'REJECTED'
    );
  }, [warrantyClaims]);

  const processingClaims = useMemo(() => {
    return warrantyClaims.filter(claim => 
      claim.claimStatus === 'APPROVED' || 
      claim.claimStatus === 'PROCESSING' || 
      claim.claimStatus === 'COMPLETED'
    );
  }, [warrantyClaims]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'APPROVED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'PROCESSING':
        return 'Đang xử lý';
      case 'APPROVED':
        return 'Chờ phân công';
      case 'REJECTED':
        return 'Từ chối';
      case 'PENDING':
        return 'Chờ duyệt';
      default:
        return status;
    }
  };

  // Handlers cho modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      customerName: '',
      phoneNumber: '',
      email: '',
      vehicleModel: '',
      vin: '',
      licensePlate: '',
      purchaseDate: '',
      warrantyType: 'standard',
      issueCategory: '',
      issueDescription: '',
      urgencyLevel: 'medium',
      requestedParts: [],
      attachments: []
    });
    // Reset part selection
    setPartQuantity(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const addRequestedPart = useCallback((selectedPart) => {
    if (selectedPart && partQuantity > 0) {
      const part = availableParts.find(p => p.id === selectedPart);
      if (part) {
        const existingPartIndex = formData.requestedParts.findIndex(p => p.id === selectedPart);
        
        if (existingPartIndex !== -1) {
          // Nếu phụ tùng đã tồn tại, cập nhật số lượng
          const updatedParts = [...formData.requestedParts];
          updatedParts[existingPartIndex].quantity += partQuantity;
          setFormData(prev => ({
            ...prev,
            requestedParts: updatedParts
          }));
        } else {
          // Thêm phụ tùng mới
          setFormData(prev => ({
            ...prev,
            requestedParts: [...prev.requestedParts, {
              id: part.id,
              name: part.name,
              category: part.category,
              quantity: partQuantity
            }]
          }));
        }
        
        // Reset quantity
        setPartQuantity(1);
        
        // Giữ vị trí scroll
        if (modalRef.current) {
          const scrollTop = modalRef.current.scrollTop;
          setTimeout(() => {
            if (modalRef.current) {
              modalRef.current.scrollTop = scrollTop;
            }
          }, 0);
        }
      }
    }
  }, [formData.requestedParts, partQuantity]);

  const removeRequestedPart = useCallback((index) => {
    // Giữ vị trí scroll trước khi xóa
    const scrollTop = modalRef.current?.scrollTop;
    
    setFormData(prev => ({
      ...prev,
      requestedParts: prev.requestedParts.filter((_, i) => i !== index)
    }));
    
    // Khôi phục vị trí scroll sau khi xóa
    setTimeout(() => {
      if (modalRef.current && scrollTop !== undefined) {
        modalRef.current.scrollTop = scrollTop;
      }
    }, 0);
  }, []);

  const updatePartQuantity = useCallback((index, newQuantity) => {
    if (newQuantity > 0) {
      // Giữ vị trí scroll trước khi cập nhật
      const scrollTop = modalRef.current?.scrollTop;
      
      const updatedParts = [...formData.requestedParts];
      updatedParts[index].quantity = newQuantity;
      setFormData(prev => ({
        ...prev,
        requestedParts: updatedParts
      }));
      
      // Khôi phục vị trí scroll sau khi cập nhật
      setTimeout(() => {
        if (modalRef.current && scrollTop !== undefined) {
          modalRef.current.scrollTop = scrollTop;
        }
      }, 0);
    }
  }, [formData.requestedParts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic xử lý submit form
    console.log('Form data:', formData);
    // Reset form và đóng modal
    handleCloseModal();
  };

  // Component chọn phụ tùng riêng biệt
  const PartSelector = React.memo(({ onAddPart, partQuantity, setPartQuantity }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPart, setSelectedPart] = useState('');

    const handleAddPart = useCallback(() => {
      if (selectedPart) {
        onAddPart(selectedPart);
        setSelectedPart('');
        setSearchTerm('');
      }
    }, [selectedPart, onAddPart]);

    const filteredParts = useMemo(() => {
      return availableParts.filter((part) => 
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [searchTerm]);

    return (
      <div className="space-y-4">
        {/* Thanh tìm kiếm */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tìm kiếm phụ tùng
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập tên phụ tùng hoặc danh mục..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Danh sách phụ tùng */}
        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
          {filteredParts.map((part) => (
            <div
              key={part.id}
              className={`p-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                selectedPart === part.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => setSelectedPart(part.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{part.name}</div>
                  <div className="text-sm text-gray-500">{part.category}</div>
                </div>
                {selectedPart === part.id && (
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredParts.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">
              Không tìm thấy phụ tùng phù hợp
            </div>
          )}
        </div>

        {/* Số lượng và nút thêm */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng
            </label>
            <input
              type="number"
              min="1"
              value={partQuantity}
              onChange={(e) => setPartQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleAddPart}
            disabled={!selectedPart}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
          >
            Thêm phụ tùng
          </button>
        </div>
      </div>
    );
  });

  // Component con để render bảng yêu cầu gửi sang hãng
  const SentToManufacturerTable = ({ claims, searchTerm, setSearchTerm, statusFilter, setStatusFilter, title }) => (
    <>
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã, tên khách hàng, VIN..."
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
              <option value="PENDING">Chờ duyệt</option>
              <option value="REJECTED">Từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {claims.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có yêu cầu bảo hành</h3>
            <p className="mt-1 text-sm text-gray-500">Chưa có yêu cầu bảo hành nào trong danh sách này.</p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã yêu cầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Xe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vấn đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phụ tùng yêu cầu
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
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {claim.claimNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{claim.customer?.fullName || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{claim.customer?.phone || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {claim.requestDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Car className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{claim.vehicle?.modelName || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{claim.vehicle?.vin || claim.vehicleVin}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={claim.issueDescription}>
                        {claim.issueDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={claim.partName}>
                        {claim.partName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(claim.claimStatus)}`}>
                        {getStatusText(claim.claimStatus)}
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
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className="bg-gray-50 px-6 py-3">
              <div className="text-sm text-gray-500">
                Hiển thị {claims.length} yêu cầu bảo hành
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );

  // Component con để render bảng yêu cầu đang xử lí
  const ProcessingClaimsTable = ({ claims, searchTerm, setSearchTerm, statusFilter, setStatusFilter, title }) => (
    <>
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã, tên khách hàng, VIN..."
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
              <option value="APPROVED">Chờ phân công</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="COMPLETED">Hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {claims.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có yêu cầu bảo hành</h3>
            <p className="mt-1 text-sm text-gray-500">Chưa có yêu cầu bảo hành nào trong danh sách này.</p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã yêu cầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Xe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vấn đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kỹ thuật viên
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
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {claim.claimNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{claim.customer?.fullName || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{claim.customer?.phone || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {claim.requestDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Car className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{claim.vehicle?.modelName || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{claim.vehicle?.vin || claim.vehicleVin}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={claim.issueDescription}>
                        {claim.issueDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {claim.technician?.fullName || 'Chưa phân công'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(claim.claimStatus)}`}>
                        {getStatusText(claim.claimStatus)}
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
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className="bg-gray-50 px-6 py-3">
              <div className="text-sm text-gray-500">
                Hiển thị {claims.length} yêu cầu bảo hành
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );

  const filteredSentToManufacturerClaims = sentToManufacturerClaims.filter((claim) => {
    const matchesSearch = 
      claim.claimNumber?.toLowerCase().includes(searchTermSentToManufacturer.toLowerCase()) ||
      claim.customer?.fullName?.toLowerCase().includes(searchTermSentToManufacturer.toLowerCase()) ||
      claim.vehicleVin?.toLowerCase().includes(searchTermSentToManufacturer.toLowerCase()) ||
      claim.vehicle?.vin?.toLowerCase().includes(searchTermSentToManufacturer.toLowerCase());
    
    const matchesStatus = statusFilterSentToManufacturer === 'all' || claim.claimStatus === statusFilterSentToManufacturer;
    
    return matchesSearch && matchesStatus;
  });

  const filteredProcessingClaims = processingClaims.filter((claim) => {
    const matchesSearch = 
      claim.claimNumber?.toLowerCase().includes(searchTermProcessing.toLowerCase()) ||
      claim.customer?.fullName?.toLowerCase().includes(searchTermProcessing.toLowerCase()) ||
      claim.vehicleVin?.toLowerCase().includes(searchTermProcessing.toLowerCase()) ||
      claim.vehicle?.vin?.toLowerCase().includes(searchTermProcessing.toLowerCase());
    
    const matchesStatus = statusFilterProcessing === 'all' || claim.claimStatus === statusFilterProcessing;
    
    return matchesSearch && matchesStatus;
  });

  // Modal Component
  const CreateWarrantyClaimModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          ref={modalRef}
          className="bg-white border border-gray-600 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Tạo yêu cầu bảo hành mới</h2>
            <button
              onClick={handleCloseModal}
              className="p-2 bg-red-600 hover:bg-red-800 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Thông tin khách hàng */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Thông tin khách hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên khách hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên khách hàng"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập địa chỉ email"
                  />
                </div>
              </div>
            </div>

            {/* Thông tin xe */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Thông tin xe
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model xe <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Chọn model xe</option>
                    <option value="VF8">VinFast VF8</option>
                    <option value="VF9">VinFast VF9</option>
                    <option value="VF5">VinFast VF5</option>
                    <option value="VF6">VinFast VF6</option>
                    <option value="VF7">VinFast VF7</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập số VIN"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biển số xe
                  </label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập biển số xe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày mua xe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Thông tin bảo hành */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Thông tin bảo hành
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại bảo hành
                  </label>
                  <select
                    name="warrantyType"
                    value={formData.warrantyType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="standard">Bảo hành tiêu chuẩn</option>
                    <option value="extended">Bảo hành mở rộng</option>
                    <option value="goodwill">Thiện chí</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục vấn đề <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="issueCategory"
                    value={formData.issueCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="battery">Hệ thống pin</option>
                    <option value="motor">Động cơ điện</option>
                    <option value="electronics">Hệ thống điện tử</option>
                    <option value="infotainment">Hệ thống giải trí</option>
                    <option value="sensors">Cảm biến</option>
                    <option value="charging">Hệ thống sạc</option>
                    <option value="body">Thân vỏ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mức độ ưu tiên
                  </label>
                  <select
                    name="urgencyLevel"
                    value={formData.urgencyLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                    <option value="urgent">Khẩn cấp</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả vấn đề <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả chi tiết vấn đề cần bảo hành..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phụ tùng yêu cầu
                </label>
                
                {/* Form thêm phụ tùng */}
                <div className="border border-gray-300 rounded-md p-4">
                  <PartSelector 
                    onAddPart={addRequestedPart}
                    partQuantity={partQuantity}
                    setPartQuantity={setPartQuantity}
                  />
                </div>

                {/* Danh sách phụ tùng đã chọn */}
                {formData.requestedParts.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Phụ tùng đã chọn:</h4>
                    <div className="space-y-2">
                      {formData.requestedParts.map((part, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{part.name}</div>
                            <div className="text-sm text-gray-500">{part.category}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-600">Số lượng:</label>
                            <input
                              type="number"
                              min="1"
                              value={part.quantity}
                              onChange={(e) => updatePartQuantity(index, parseInt(e.target.value) || 1)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeRequestedPart(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* File đính kèm */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Tài liệu đính kèm
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh/Tài liệu
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Nhấp để tải lên tệp
                        </span>
                        <span className="text-sm text-gray-500">
                          hoặc kéo và thả tệp vào đây
                        </span>
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, PDF, DOC lên tới 10MB
                    </p>
                  </div>
                </div>

                {/* Hiển thị file đã upload */}
                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Tệp đã tải lên:</p>
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                          <span className="text-xs text-gray-500 ml-2">({Math.round(file.size / 1024)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Tạo yêu cầu
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý yêu cầu bảo hành</h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi và xử lý các yêu cầu bảo hành từ khách hàng
          </p>
        </div>
        <button 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
          onClick={handleOpenModal}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo yêu cầu mới
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchWarrantyClaims}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
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
          {/* Yêu cầu gửi sang hãng */}
          <div className="space-y-6">
            <SentToManufacturerTable 
              claims={filteredSentToManufacturerClaims}
              searchTerm={searchTermSentToManufacturer}
              setSearchTerm={setSearchTermSentToManufacturer}
              statusFilter={statusFilterSentToManufacturer}
              setStatusFilter={setStatusFilterSentToManufacturer}
              title="Yêu cầu gửi sang hãng"
            />
          </div>

          {/* Yêu cầu đang xử lí */}
          <div className="space-y-6">
            <ProcessingClaimsTable 
              claims={filteredProcessingClaims}
              searchTerm={searchTermProcessing}
              setSearchTerm={setSearchTermProcessing}
              statusFilter={statusFilterProcessing}
              setStatusFilter={setStatusFilterProcessing}
              title="Yêu cầu đang xử lí"
            />
          </div>
        </>
      )}

      {/* Modal tạo yêu cầu bảo hành */}
      <CreateWarrantyClaimModal />
    </div>
  );
};

export default WarrantyClaims;
