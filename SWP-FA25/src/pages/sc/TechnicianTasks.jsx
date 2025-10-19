import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, Clock, AlertCircle, Calendar, User, Car, Wrench, Loader2, X, FileText, UserCheck } from 'lucide-react';
import api from '../../api/api';

const TechnicianTasks = () => {
  const [searchTermAssigned, setSearchTermAssigned] = useState('');
  const [statusFilterAssigned, setStatusFilterAssigned] = useState('all');
  const [searchTermCompleted, setSearchTermCompleted] = useState('');
  const [statusFilterCompleted, setStatusFilterCompleted] = useState('all');

  // State cho API và loading
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho modal xem chi tiết
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // State cho modal bắt đầu công việc
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedTaskToStart, setSelectedTaskToStart] = useState(null);
  const [startLoading, setStartLoading] = useState(false);
  const [startNotes, setStartNotes] = useState('');

  // State cho modal hoàn thành công việc
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedTaskToComplete, setSelectedTaskToComplete] = useState(null);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [actualHours, setActualHours] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');

  // Fetch tasks từ API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/assignments/tasks');
      console.log('API Response:', response.data);

      if (response.data && Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.warn('API response is not in expected format:', response.data);
        setTasks([]);
        setError('Dữ liệu API không đúng định dạng.');
      }
    } catch (err) {
      setError('Không thể tải danh sách công việc. Vui lòng thử lại.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Hàm xem chi tiết task
  const handleViewTask = async (taskId) => {
    try {
      setViewLoading(true);
      setSelectedTask(null);
      setShowViewModal(true);

      const response = await api.get(`/assignments/${taskId}`);

      if (response.status === 200) {
        setSelectedTask(response.data);
      }
    } catch (err) {
      console.error('Error fetching task details:', err);
      setError('Không thể tải chi tiết công việc.');
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  // Hàm mở modal bắt đầu công việc
  const handleOpenStartModal = (task) => {
    setSelectedTaskToStart(task);
    setStartNotes('');
    setShowStartModal(true);
  };

  // Hàm bắt đầu công việc
  const handleStartWork = async () => {
    if (!selectedTaskToStart) return;

    try {
      setStartLoading(true);
      const response = await api.post(`/assignments/${selectedTaskToStart.id}/start`, {
        notes: startNotes
      });

      if (response.status === 200 || response.status === 201) {
        // Refresh danh sách tasks
        await fetchTasks();
        setShowStartModal(false);
        setSelectedTaskToStart(null);
        setStartNotes('');
      }
    } catch (err) {
      console.error('Error starting work:', err);
      setError('Không thể bắt đầu công việc. Vui lòng thử lại.');
    } finally {
      setStartLoading(false);
    }
  };

  // Hàm mở modal hoàn thành công việc
  const handleOpenCompleteModal = (task) => {
    setSelectedTaskToComplete(task);
    setActualHours(task.estimatedHours || '');
    setCompletionNotes('');
    setShowCompleteModal(true);
  };

  // Hàm hoàn thành công việc
  const handleCompleteWork = async () => {
    if (!selectedTaskToComplete) return;

    if (!actualHours || actualHours <= 0) {
      setError('Vui lòng nhập số giờ thực tế hợp lệ.');
      return;
    }

    try {
      setCompleteLoading(true);
      const response = await api.post(`/assignments/${selectedTaskToComplete.id}/complete`, {
        actualHours: parseInt(actualHours),
        completionNotes: completionNotes
      });

      if (response.status === 200 || response.status === 201) {
        // Refresh danh sách tasks
        await fetchTasks();
        setShowCompleteModal(false);
        setSelectedTaskToComplete(null);
        setActualHours('');
        setCompletionNotes('');
      }
    } catch (err) {
      console.error('Error completing work:', err);
      setError('Không thể hoàn thành công việc. Vui lòng thử lại.');
    } finally {
      setCompleteLoading(false);
    }
  };

  // Phân loại công việc theo status
  const assignedTasks = tasks.filter(task => 
    task.status === 'ASSIGNED' || task.status === 'IN_PROGRESS'
  );

  const completedTasks = tasks.filter(task => 
    task.status === 'COMPLETED'
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ASSIGNED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'IN_PROGRESS':
        return 'Đang xử lý';
      case 'ASSIGNED':
        return 'Đã phân công';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'LOW':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'Cao';
      case 'MEDIUM':
        return 'Trung bình';
      case 'LOW':
        return 'Thấp';
      default:
        return priority;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'MEDIUM':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'LOW':
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
              <option value="ASSIGNED">Đã phân công</option>
              <option value="IN_PROGRESS">Đang xử lý</option>
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
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Car className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{task.vehicleModel}</div>
                      <div className="text-sm text-gray-500">{task.vehicleVin}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-48">
                  <div className="text-sm text-gray-900 break-words">
                    {task.workDescription}
                  </div>
                  {task.notes && (
                    <div className="text-xs text-gray-500 mt-1 break-words whitespace-pre-line">
                      <span className="font-semibold">Lưu ý:</span> {task.notes}
                    </div>
                  )}
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
                    {task.dueDate}
                  </div>
                  <div className="text-xs text-gray-400">
                    Giao: {task.assignmentDate}
                  </div>
                  {task.estimatedHours && (
                    <div className="text-xs text-blue-500 mt-1">
                      Ước tính: {task.estimatedHours}h
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {getStatusText(task.status)}
                  </span>
                  {task.overdue && (
                    <div className="text-xs text-red-600 mt-1 font-semibold">
                      Quá hạn
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewTask(task.id)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md bg-transparent"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {task.status === 'ASSIGNED' && (
                      <button 
                        onClick={() => handleOpenStartModal(task)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md bg-transparent"
                        title="Bắt đầu công việc"
                      >
                        <Wrench className="h-4 w-4" />
                      </button>
                    )}
                    {task.status === 'IN_PROGRESS' && (
                      <button 
                        onClick={() => handleOpenCompleteModal(task)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md bg-transparent"
                        title="Hoàn thành công việc"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
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
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Car className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{task.vehicleModel}</div>
                      <div className="text-sm text-gray-500">{task.vehicleVin}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-48">
                  <div className="text-sm text-gray-900 break-words">
                    {task.workDescription}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {task.completedAt ? new Date(task.completedAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </div>
                  {task.actualHours && (
                    <div className="text-xs text-green-600 mt-1">
                      Thực tế: {task.actualHours}h
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 max-w-48">
                  <div className="text-sm text-gray-900 break-words whitespace-pre-line">
                    {task.notes || 'Không có ghi chú'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewTask(task.id)}
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
      task.vehicleVin.toLowerCase().includes(searchTermAssigned.toLowerCase());
    
    const matchesStatus = statusFilterAssigned === 'all' || task.status === statusFilterAssigned;
    
    return matchesSearch && matchesStatus;
  });

  const filteredCompletedTasks = completedTasks.filter((task) => {
    const matchesSearch = 
      task.id.toLowerCase().includes(searchTermCompleted.toLowerCase()) ||
      task.customerName.toLowerCase().includes(searchTermCompleted.toLowerCase()) ||
      task.vehicleVin.toLowerCase().includes(searchTermCompleted.toLowerCase());
    
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
            <div className="text-sm font-medium text-gray-900">
              {tasks.length > 0 && tasks[0].assignedTo ? tasks[0].assignedTo.fullName : 'Kỹ thuật viên'}
            </div>
            <div className="text-sm text-gray-500">
              {tasks.length > 0 && tasks[0].assignedTo ? tasks[0].assignedTo.role : 'SC_TECHNICIAN'}
            </div>
          </div>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Wrench className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
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
                onClick={fetchTasks}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
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
        </>
      )}

      {/* Modal hoàn thành công việc */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex items-start mb-4">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Hoàn thành công việc
                    </h3>
                    {selectedTaskToComplete && (
                      <p className="mt-1 text-sm text-gray-500">
                        Mã công việc: <span className="font-semibold">{selectedTaskToComplete.id}</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowCompleteModal(false);
                      setSelectedTaskToComplete(null);
                      setActualHours('');
                      setCompletionNotes('');
                    }}
                    disabled={completeLoading}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="mt-4">
                  {selectedTaskToComplete && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Khách hàng:</span>
                          <span className="font-medium text-gray-900">{selectedTaskToComplete.customerName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Xe:</span>
                          <span className="font-medium text-gray-900">{selectedTaskToComplete.vehicleModel}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Mô tả công việc:</span>
                          <p className="font-medium text-gray-900 mt-1">{selectedTaskToComplete.workDescription}</p>
                        </div>
                        {selectedTaskToComplete.notes && (
                          <div className="text-sm">
                            <span className="text-gray-600">Ghi chú:</span>
                            <p className="font-medium text-gray-900 mt-1">{selectedTaskToComplete.notes}</p>
                          </div>
                        )}
                        {selectedTaskToComplete.estimatedHours && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Thời gian ước tính:</span>
                            <span className="font-medium text-blue-600">{selectedTaskToComplete.estimatedHours}h</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số giờ thực tế <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={actualHours}
                      onChange={(e) => setActualHours(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      placeholder="Nhập số giờ thực tế để hoàn thành công việc..."
                      disabled={completeLoading}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú hoàn thành
                    </label>
                    <textarea
                      value={completionNotes}
                      onChange={(e) => setCompletionNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      placeholder="Nhập ghi chú khi hoàn thành công việc..."
                      disabled={completeLoading}
                    />
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          Bạn có chắc chắn muốn hoàn thành công việc này không? Hệ thống sẽ ghi nhận thời gian hoàn thành và chuyển trạng thái công việc sang "Hoàn thành".
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCompleteWork}
                  disabled={completeLoading || !actualHours}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {completeLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {completeLoading ? 'Đang xử lý...' : 'Hoàn thành công việc'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCompleteModal(false);
                    setSelectedTaskToComplete(null);
                    setActualHours('');
                    setCompletionNotes('');
                  }}
                  disabled={completeLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal bắt đầu công việc */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex items-start mb-4">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Wrench className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Bắt đầu công việc
                    </h3>
                    {selectedTaskToStart && (
                      <p className="mt-1 text-sm text-gray-500">
                        Mã công việc: <span className="font-semibold">{selectedTaskToStart.id}</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowStartModal(false);
                      setSelectedTaskToStart(null);
                      setStartNotes('');
                    }}
                    disabled={startLoading}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="mt-4">
                  {selectedTaskToStart && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Khách hàng:</span>
                          <span className="font-medium text-gray-900">{selectedTaskToStart.customerName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Xe:</span>
                          <span className="font-medium text-gray-900">{selectedTaskToStart.vehicleModel}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Mô tả công việc:</span>
                          <p className="font-medium text-gray-900 mt-1">{selectedTaskToStart.workDescription}</p>
                        </div>
                        {selectedTaskToStart.notes && (
                          <div className="text-sm">
                            <span className="text-gray-600">Ghi chú:</span>
                            <p className="font-medium text-gray-900 mt-1">{selectedTaskToStart.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      value={startNotes}
                      onChange={(e) => setStartNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      placeholder="Nhập ghi chú khi bắt đầu công việc..."
                      disabled={startLoading}
                    />
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Bạn có chắc chắn muốn bắt đầu công việc này không? Hệ thống sẽ ghi nhận thời gian bắt đầu và chuyển trạng thái công việc sang "Đang xử lý".
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleStartWork}
                  disabled={startLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {startLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {startLoading ? 'Đang xử lý...' : 'Bắt đầu công việc'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStartModal(false);
                    setSelectedTaskToStart(null);
                    setStartNotes('');
                  }}
                  disabled={startLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết công việc */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Chi tiết công việc
                    </h3>
                    {selectedTask && (
                      <p className="text-sm font-semibold text-gray-500">
                        Mã công việc: {selectedTask.id}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedTask(null);
                    }}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Loading state */}
                {viewLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-3 text-gray-600">Đang tải chi tiết...</span>
                  </div>
                ) : selectedTask ? (
                  <div className="max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Thông tin cơ bản */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-blue-500" />
                          Thông tin cơ bản
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Mã công việc:</span>
                            <span className="text-sm font-semibold text-gray-900">{selectedTask.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Mã yêu cầu bảo hành:</span>
                            <span className="text-sm font-semibold text-blue-600">{selectedTask.warrantyClaimId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Ngày phân công:</span>
                            <span className="text-sm text-gray-900">{selectedTask.assignmentDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Thời hạn:</span>
                            <span className="text-sm text-gray-900">{selectedTask.dueDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedTask.status)}`}>
                              {getStatusText(selectedTask.status)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Độ ưu tiên:</span>
                            <div className="flex items-center">
                              {getPriorityIcon(selectedTask.priority)}
                              <span className={`ml-2 text-sm font-medium ${getPriorityColor(selectedTask.priority)}`}>
                                {getPriorityText(selectedTask.priority)}
                              </span>
                            </div>
                          </div>
                          {selectedTask.overdue && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Cảnh báo:</span>
                              <span className="text-sm font-semibold text-red-600">Quá hạn</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Thông tin khách hàng và xe */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <User className="h-5 w-5 mr-2 text-green-500" />
                          Thông tin khách hàng & xe
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Tên khách hàng:</span>
                            <span className="text-sm text-gray-900">{selectedTask.customerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Model xe:</span>
                            <span className="text-sm text-gray-900">{selectedTask.vehicleModel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">VIN:</span>
                            <span className="text-sm font-semibold text-gray-900">{selectedTask.vehicleVin}</span>
                          </div>
                        </div>
                      </div>

                      {/* Thông tin phân công */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <UserCheck className="h-5 w-5 mr-2 text-purple-500" />
                          Người phân công
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Tên:</span>
                            <span className="text-sm text-gray-900">{selectedTask.assignedBy?.fullName || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Username:</span>
                            <span className="text-sm text-gray-900">{selectedTask.assignedBy?.username || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Vai trò:</span>
                            <span className="text-sm text-gray-900">{selectedTask.assignedBy?.role || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Kỹ thuật viên */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <Wrench className="h-5 w-5 mr-2 text-orange-500" />
                          Kỹ thuật viên
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Tên:</span>
                            <span className="text-sm text-gray-900">{selectedTask.assignedTo?.fullName || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Username:</span>
                            <span className="text-sm text-gray-900">{selectedTask.assignedTo?.username || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Vai trò:</span>
                            <span className="text-sm text-gray-900">{selectedTask.assignedTo?.role || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin thời gian */}
                    <div className="mt-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-teal-500" />
                          Thông tin thời gian
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Thời gian ước tính:</span>
                            <span className="text-sm text-gray-900">{selectedTask.estimatedHours ? `${selectedTask.estimatedHours}h` : 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Thời gian thực tế:</span>
                            <span className="text-sm text-gray-900">{selectedTask.actualHours ? `${selectedTask.actualHours}h` : 'Chưa có'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Bắt đầu lúc:</span>
                            <span className="text-sm text-gray-900">
                              {selectedTask.startedAt ? new Date(selectedTask.startedAt).toLocaleString('vi-VN') : 'Chưa bắt đầu'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Hoàn thành lúc:</span>
                            <span className="text-sm text-gray-900">
                              {selectedTask.completedAt ? new Date(selectedTask.completedAt).toLocaleString('vi-VN') : 'Chưa hoàn thành'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Tạo lúc:</span>
                            <span className="text-sm text-gray-900">
                              {selectedTask.createdAt ? new Date(selectedTask.createdAt).toLocaleString('vi-VN') : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Cập nhật lúc:</span>
                            <span className="text-sm text-gray-900">
                              {selectedTask.updatedAt ? new Date(selectedTask.updatedAt).toLocaleString('vi-VN') : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mô tả công việc */}
                    <div className="mt-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                          Mô tả công việc
                        </h4>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedTask.workDescription}</p>
                      </div>
                    </div>

                    {/* Ghi chú */}
                    {selectedTask.notes && (
                      <div className="mt-6">
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
                            Ghi chú
                          </h4>
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedTask.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Không thể tải thông tin công việc</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedTask(null);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianTasks;