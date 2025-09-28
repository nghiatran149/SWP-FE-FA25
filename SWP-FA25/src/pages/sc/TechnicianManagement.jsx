import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Star, Clock, CheckCircle, User, Phone, Mail, Award } from 'lucide-react';

const TechnicianManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const technicians = [
    {
      id: 'KTV001',
      name: 'Trần Văn Minh',
      email: 'tranvanminh@company.com',
      phone: '0912345678',
      specialization: ['Pin', 'Động cơ điện'],
      level: 'senior',
      status: 'active',
      joinDate: '2022-01-15',
      completedCases: 156,
      avgRating: 4.8,
      avgCompletionTime: 3.2,
      currentWorkload: 5,
      maxWorkload: 8,
      location: 'TP.HCM',
      certifications: ['EV Specialist', 'Battery Expert'],
      lastActive: '2024-09-18',
    },
    {
      id: 'KTV002',
      name: 'Nguyễn Thị Lan',
      email: 'nguyenthilan@company.com',
      phone: '0987654321',
      specialization: ['Phần mềm', 'Hệ thống sạc'],
      level: 'mid',
      status: 'active',
      joinDate: '2023-03-20',
      completedCases: 89,
      avgRating: 4.6,
      avgCompletionTime: 4.1,
      currentWorkload: 3,
      maxWorkload: 6,
      location: 'Hà Nội',
      certifications: ['Software Diagnostic'],
      lastActive: '2024-09-18',
    },
    {
      id: 'KTV003',
      name: 'Lê Đức Thành',
      email: 'leducthanh@company.com',
      phone: '0901234567',
      specialization: ['Phanh', 'Hệ thống điện'],
      level: 'junior',
      status: 'training',
      joinDate: '2024-01-10',
      completedCases: 23,
      avgRating: 4.2,
      avgCompletionTime: 5.8,
      currentWorkload: 2,
      maxWorkload: 4,
      location: 'Đà Nẵng',
      certifications: ['Basic EV Maintenance'],
      lastActive: '2024-09-17',
    },
    {
      id: 'KTV004',
      name: 'Phạm Minh Hùng',
      email: 'phamminhhung@company.com',
      phone: '0934567890',
      specialization: ['Pin', 'Hệ thống sạc', 'Động cơ điện'],
      level: 'expert',
      status: 'active',
      joinDate: '2021-06-01',
      completedCases: 234,
      avgRating: 4.9,
      avgCompletionTime: 2.8,
      currentWorkload: 7,
      maxWorkload: 10,
      location: 'TP.HCM',
      certifications: ['Master EV Technician', 'Battery Expert', 'Charging Systems'],
      lastActive: '2024-09-18',
    },
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'expert':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'senior':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'junior':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'expert':
        return 'Chuyên gia';
      case 'senior':
        return 'Cao cấp';
      case 'mid':
        return 'Trung cấp';
      case 'junior':
        return 'Thực tập';
      default:
        return level;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'training':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'vacation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Đang làm việc';
      case 'training':
        return 'Đào tạo';
      case 'inactive':
        return 'Nghỉ việc';
      case 'vacation':
        return 'Nghỉ phép';
      default:
        return status;
    }
  };

  const getWorkloadColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const filteredTechnicians = technicians.filter((tech) => {
    const matchesSearch = 
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tech.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tech.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý kỹ thuật viên</h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi hiệu suất và phân công công việc cho kỹ thuật viên
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Thêm kỹ thuật viên
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng KTV</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{technicians.length}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Đang làm việc</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {technicians.filter(t => t.status === 'active').length}
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
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Đánh giá TB</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {(technicians.reduce((sum, t) => sum + t.avgRating, 0) / technicians.length).toFixed(1)}
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
                <Clock className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Thời gian TB</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {(technicians.reduce((sum, t) => sum + t.avgCompletionTime, 0) / technicians.length).toFixed(1)} ngày
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
                placeholder="Tìm kiếm theo tên, email, chuyên môn..."
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
              <option value="active">Đang làm việc</option>
              <option value="training">Đào tạo</option>
              <option value="vacation">Nghỉ phép</option>
              <option value="inactive">Nghỉ việc</option>
            </select>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTechnicians.map((tech) => (
          <div key={tech.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg font-medium text-gray-700">
                    {tech.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{tech.name}</h3>
                  <p className="text-sm text-gray-500">{tech.id}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelColor(tech.level)}`}>
                    {getLevelText(tech.level)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getStatusColor(tech.status)}`}>
                    {getStatusText(tech.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {tech.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {tech.email}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Chuyên môn:</p>
                  <div className="flex flex-wrap gap-1">
                    {tech.specialization.map((spec, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Chứng chỉ:</p>
                  <div className="flex flex-wrap gap-1">
                    {tech.certifications.map((cert, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Hoàn thành</p>
                    <p className="text-sm font-semibold text-gray-900">{tech.completedCases} case</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Đánh giá</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold text-gray-900">{tech.avgRating}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-gray-500">Khối lượng công việc</p>
                    <span className="text-xs text-gray-600">{tech.currentWorkload}/{tech.maxWorkload}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getWorkloadColor(tech.currentWorkload, tech.maxWorkload)}`}
                      style={{
                        width: `${(tech.currentWorkload / tech.maxWorkload) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Tham gia: {tech.joinDate}</span>
                  <span>Hoạt động: {tech.lastActive}</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600">
                  <Eye className="h-4 w-4 mr-1" />
                  Xem
                </button>
                <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Edit className="h-4 w-4 mr-1" />
                  Sửa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-500">
          Hiển thị {filteredTechnicians.length} trong tổng số {technicians.length} kỹ thuật viên
        </div>
      </div>
    </div>
  );
};

export default TechnicianManagement;
