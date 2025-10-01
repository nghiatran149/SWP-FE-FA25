import React, { useState } from 'react';
import { Search, Eye, CheckCircle, Clock, AlertCircle, Calendar, User, Car, Wrench } from 'lucide-react';

const TechnicianTasks = () => {
  const [searchTermAssigned, setSearchTermAssigned] = useState('');
  const [statusFilterAssigned, setStatusFilterAssigned] = useState('all');
  const [searchTermCompleted, setSearchTermCompleted] = useState('');
  const [statusFilterCompleted, setStatusFilterCompleted] = useState('all');

  // Công việc được giao (đang xử lý hoặc chờ xử lý)
  const assignedTasks = [
    {
      id: 'WC001',
      customerName: 'Nguyễn Văn A',
      vehicle: 'VinFast VF8',
      vin: 'VF8XXXXXXX123456',
      issue: 'Lỗi pin không sạc được',
      status: 'processing',
      priority: 'high',
      assignedDate: '2024-09-10',
      estimatedCompletion: '2024-09-15',
      description: 'Kiểm tra hệ thống sạc và thay thế pin nếu cần thiết',
      assignedBy: 'Trần Văn Staff',
      customerPhone: '0901234567',
    },
    {
      id: 'WC009',
      customerName: 'Lý Văn B',
      vehicle: 'VinFast VF9',
      vin: 'VF9XXXXXXX654321',
      issue: 'Lỗi hệ thống phanh ABS',
      status: 'pending',
      priority: 'high',
      assignedDate: '2024-09-14',
      estimatedCompletion: '2024-09-16',
      description: 'Chẩn đoán và sửa chữa hệ thống phanh ABS',
      assignedBy: 'Trần Văn Staff',
      customerPhone: '0912345678',
    },
    {
      id: 'WC010',
      customerName: 'Phạm Thị C',
      vehicle: 'VinFast VF8',
      vin: 'VF8XXXXXXX987654',
      issue: 'Lỗi cảm biến đỗ xe',
      status: 'pending',
      priority: 'medium',
      assignedDate: '2024-09-15',
      estimatedCompletion: '2024-09-18',
      description: 'Kiểm tra và thay thế cảm biến đỗ xe',
      assignedBy: 'Trần Văn Staff',
      customerPhone: '0923456789',
    },
  ];

  // Công việc đã hoàn thành
  const completedTasks = [
    {
      id: 'WC003',
      customerName: 'Hoàng Thị E',
      vehicle: 'VinFast VF8',
      vin: 'VF8XXXXXXX345678',
      issue: 'Lỗi phần mềm điều khiển',
      status: 'completed',
      priority: 'low',
      assignedDate: '2024-09-08',
      completedDate: '2024-09-12',
      estimatedCompletion: '2024-09-20',
      description: 'Cập nhật phần mềm hệ thống điều khiển',
      assignedBy: 'Trần Văn Staff',
      customerPhone: '0934567890',
      workNotes: 'Đã cập nhật firmware thành công. Hệ thống hoạt động bình thường.',
      partsUsed: 'Không cần thay phụ tùng',
    },
    {
      id: 'WC011',
      customerName: 'Đặng Văn D',
      vehicle: 'VinFast VF9',
      vin: 'VF9XXXXXXX111222',
      issue: 'Thay thế lốp xe bị hỏng',
      status: 'completed',
      priority: 'medium',
      assignedDate: '2024-09-05',
      completedDate: '2024-09-06',
      estimatedCompletion: '2024-09-07',
      description: 'Thay thế lốp trước bên phải',
      assignedBy: 'Trần Văn Staff',
      customerPhone: '0945678901',
      workNotes: 'Đã thay lốp mới. Kiểm tra cân bằng lốp OK.',
      partsUsed: 'Lốp VinFast 235/55R19',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'processing':
        return 'Đang xử lý';
      case 'pending':
        return 'Chờ xử lý';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
      default:
        return priority;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Component bảng công việc được giao
  const AssignedTasksTable = ({ tasks, searchTerm, setSearchTerm, statusFilter, setStatusFilter, title }) => (
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
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
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
                Xe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vấn đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ưu tiên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời hạn
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
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {task.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{task.customerName}</div>
                      <div className="text-sm text-gray-500">{task.customerPhone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Car className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{task.vehicle}</div>
                      <div className="text-sm text-gray-500">{task.vin}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-48">
                  <div className="text-sm text-gray-900 break-words">
                    {task.issue}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 break-words">
                    {task.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getPriorityIcon(task.priority)}
                    <span className={`ml-2 text-sm font-medium ${getPriorityColor(task.priority)}`}>
                      {getPriorityText(task.priority)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {task.estimatedCompletion}
                  </div>
                  <div className="text-xs text-gray-400">
                    Giao: {task.assignedDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {getStatusText(task.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md bg-transparent"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md bg-transparent"
                      title="Cập nhật tiến độ"
                    >
                      <Wrench className="h-4 w-4" />
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
            Hiển thị {tasks.length} công việc được giao
          </div>
        </div>
      </div>
    </>
  );

  // Component bảng công việc đã hoàn thành
  const CompletedTasksTable = ({ tasks, searchTerm, setSearchTerm, statusFilter, setStatusFilter, title }) => (
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
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
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
                Xe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vấn đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày hoàn thành
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ghi chú công việc
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {task.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{task.customerName}</div>
                      <div className="text-sm text-gray-500">{task.customerPhone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Car className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{task.vehicle}</div>
                      <div className="text-sm text-gray-500">{task.vin}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-48">
                  <div className="text-sm text-gray-900 break-words">
                    {task.issue}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {task.completedDate}
                  </div>
                </td>
                <td className="px-6 py-4 max-w-48">
                  <div className="text-sm text-gray-900 break-words">
                    {task.workNotes}
                  </div>
                  {task.partsUsed && (
                    <div className="text-xs text-gray-500 mt-1">
                      Phụ tùng: {task.partsUsed}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md bg-transparent"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
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
            Hiển thị {tasks.length} công việc đã hoàn thành
          </div>
        </div>
      </div>
    </>
  );

  const filteredAssignedTasks = assignedTasks.filter((task) => {
    const matchesSearch = 
      task.id.toLowerCase().includes(searchTermAssigned.toLowerCase()) ||
      task.customerName.toLowerCase().includes(searchTermAssigned.toLowerCase()) ||
      task.vin.toLowerCase().includes(searchTermAssigned.toLowerCase());
    
    const matchesStatus = statusFilterAssigned === 'all' || task.status === statusFilterAssigned;
    
    return matchesSearch && matchesStatus;
  });

  const filteredCompletedTasks = completedTasks.filter((task) => {
    const matchesSearch = 
      task.id.toLowerCase().includes(searchTermCompleted.toLowerCase()) ||
      task.customerName.toLowerCase().includes(searchTermCompleted.toLowerCase()) ||
      task.vin.toLowerCase().includes(searchTermCompleted.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Công việc của tôi</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý các công việc bảo hành được giao cho kỹ thuật viên
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">Trần Thị B</div>
            <div className="text-sm text-gray-500">Kỹ thuật viên</div>
          </div>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Wrench className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Công việc được giao */}
      <div className="space-y-6">
        <AssignedTasksTable 
          tasks={filteredAssignedTasks}
          searchTerm={searchTermAssigned}
          setSearchTerm={setSearchTermAssigned}
          statusFilter={statusFilterAssigned}
          setStatusFilter={setStatusFilterAssigned}
          title="Công việc được giao"
        />
      </div>

      {/* Công việc đã hoàn thành */}
      <div className="space-y-6">
        <CompletedTasksTable 
          tasks={filteredCompletedTasks}
          searchTerm={searchTermCompleted}
          setSearchTerm={setSearchTermCompleted}
          statusFilter={statusFilterCompleted}
          setStatusFilter={setStatusFilterCompleted}
          title="Công việc đã hoàn thành"
        />
      </div>
    </div>
  );
};

export default TechnicianTasks;