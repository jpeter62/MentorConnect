import React, { useState, useEffect } from 'react';
import { Users, Search, MoreVertical, Ban, Trash2, AlertCircle, Edit, Mail, Phone, Building, BookOpen, GraduationCap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; 
import Cookies from 'js-cookie';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatedUser, setUpdatedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [studentsRes, teachersRes] = await Promise.all([
        fetch('http://localhost:8080/api/admin/students'),
        fetch('http://localhost:8080/api/admin/teachers')
      ]);

      if (!studentsRes.ok || !teachersRes.ok) {
        throw new Error('Failed to fetch users');
      }

      const students = await studentsRes.json();
      const teachers = await teachersRes.json();

      const transformedUsers = [
        ...students.map(student => ({
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          role: 'student',
          status: student.status || 'active',
          rollNo: student.rollNo,
          course: student.course,
          yearOfStudy: student.yearOfStudy,
          fieldOfInterest: student.fieldOfInterest
        })),
        ...teachers.map(teacher => ({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          phone: teacher.phone,
          role: 'mentor',
          status: teacher.status || 'active',
          teachingId: teacher.teachingId,
          department: teacher.department,
          expertise: teacher.expertise,
          experience: teacher.experience
        }))
      ];

      setUsers(transformedUsers);
      toast.success('Users loaded successfully');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    if (action === 'update') {
      setUpdatedUser({ ...user });
      setShowUpdateModal(true);
    } else {
      setShowConfirmDialog(true);
    }
  };
  const handleLogout = () => {
       sessionStorage.clear(); // Clear session storage
       Cookies.remove('loggedInEmail'); // Remove cookies for session
       Cookies.remove('userRole');
       navigate('/'); // Redirect to the home page
     };

  const handleUpdate = async () => {
    try {
      const userToUpdate = { ...updatedUser };
      // Remove frontend-only fields
      delete userToUpdate.role;
      delete userToUpdate.status;
      
      const endpoint = `http://localhost:8080/api/admin/${updatedUser.role === 'student' ? 'students' : 'teachers'}/${updatedUser.id}`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userToUpdate)
      });
  
      if (!response.ok) throw new Error('Update failed');
      
      const updated = await response.json();
      setUsers(users.map(u => u.id === updated.id ? {
        ...updated,
        role: updatedUser.role,
        status: updatedUser.status
      } : u));
      setShowUpdateModal(false);
      toast.success('Updated successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };
  

  const executeAction = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    
    try {
      const endpoint = `${selectedUser.role === 'student' ? 'students' : 'teachers'}/${selectedUser.id}`;
      
      if (actionType === 'delete') {
        await fetch(`http://localhost:8080/api/admin/${endpoint}`, {
          method: 'DELETE'
        });
        setUsers(users.filter(u => u.id !== selectedUser.id));
        toast.success('User deleted successfully');
      } else if (actionType === 'block') {
        const response = await fetch(`http://localhost:8080/api/admin/${endpoint}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: selectedUser.status === 'active' ? 'blocked' : 'active'
          })
        });
        
        if (!response.ok) throw new Error('Failed to update user status');
        
        const updatedUser = await response.json();
        setUsers(users.map(u => u.id === selectedUser.id ? {
          ...u,
          status: updatedUser.status
        } : u));
        toast.success(`User ${updatedUser.status === 'active' ? 'unblocked' : 'blocked'} successfully`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'mentors' && user.role === 'mentor') ||
      (activeTab === 'students' && user.role === 'student');
    
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const renderTable = () => {
    const columns = activeTab === 'students' ? [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'rollNo', label: 'Roll No' },
      { key: 'course', label: 'Course' },
      { key: 'yearOfStudy', label: 'Year of Study' },
      { key: 'fieldOfInterest', label: 'Field of Interest' },
      { key: 'status', label: 'Status' },
      { key: 'actions', label: 'Actions' }
    ] : activeTab === 'mentors' ? [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'teachingId', label: 'Teaching ID' },
      { key: 'department', label: 'Department' },
      { key: 'expertise', label: 'Expertise' },
      { key: 'experience', label: 'Experience' },
      { key: 'status', label: 'Status' },
      { key: 'actions', label: 'Actions' }
    ] : [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'role', label: 'Role' },
      { key: 'status', label: 'Status' },
      { key: 'actions', label: 'Actions' }
    ];

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#EFEDE8]">
              {columns.map(column => (
                <th key={column.key} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {columns.map(column => {
                  if (column.key === 'actions') {
                    return (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(user, 'update')}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-[#0BB8AE] text-white hover:bg-[#09a19a]"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(user, 'block')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium ${
                              user.status === 'active'
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                          >
                            {user.status === 'active' ? 'Block' : 'Unblock'}
                          </button>
                          <button
                            onClick={() => handleAction(user, 'delete')}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    );
                  } else if (column.key === 'status') {
                    return (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    );
                  } else if (column.key === 'role') {
                    return (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          user.role === 'mentor'
                            ? 'bg-[#0BB8AE]/20 text-[#0BB8AE]'
                            : 'bg-[#9DC2C8]/20 text-[#9DC2C8]'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    );
                  }
                  return (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user[column.key]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#EFEDE8] p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0BB8AE] to-[#9DC2C8] rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-white/90">Manage users and platform activity</p>
            <button className="btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-6 py-3 rounded-lg">
              <span className="font-medium">Total Users: {users.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-wrap gap-6 justify-between items-center">
            <div className="flex gap-4">
              {['all', 'mentors', 'students'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg transition-all duration-200 text-base font-semibold shadow-sm
                    ${activeTab === tab 
                      ? 'bg-[#0BB8AE] text-white transform scale-105 shadow-md' 
                      : 'bg-[#EFEDE8] text-gray-700 hover:bg-[#9DC2C8] hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </div>
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0BB8AE] focus:border-[#0BB8AE] w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-[#0BB8AE] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-gray-600">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-4 px-6 py-3 bg-[#0BB8AE] text-white rounded-lg hover:bg-[#9DC2C8] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            renderTable()
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {actionType === 'delete' ? 'Delete User' : 'Block User'}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {actionType} {selectedUser?.name}? 
              This action {actionType === 'delete' ? 'cannot' : 'can'} be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update User Modal */}
      {showUpdateModal && updatedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Update User</h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Common Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    value={updatedUser.name}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0BB8AE] focus:border-[#0BB8AE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={updatedUser.email}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0BB8AE] focus:border-[#0BB8AE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    value={updatedUser.phone}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, phone: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0BB8AE] focus:border-[#0BB8AE]"
                  />
                </div>
              </div>

              {/* Role Specific Fields */}
              <div className="space-y-4">
                {updatedUser.role === 'student' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                      <input
                        value={updatedUser.rollNo}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, rollNo: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0BB8AE] focus:border-[#0BB8AE]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                      <input
                        value={updatedUser.course}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, course: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0BB8AE] focus:border-[#0BB8AE]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                      <input
                        value={updatedUser.yearOfStudy}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, yearOfStudy: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0BB8AE] focus:border-[#0BB8AE]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field of Interest</label>
                      <input
                        value={updatedUser.fieldOfInterest}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, fieldOfInterest: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0BB8AE] focus:border-[#0BB8AE]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teaching ID</label>
                      <input
                        value={updatedUser.teachingId}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, teachingId: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0BB8AE] focus:border-[#0BB8AE]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input
                        value={updatedUser.department}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, department: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0BB8AE] focus:border-[#0BB8AE]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
                      <input
                        value={updatedUser.expertise}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, expertise: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0BB8AE] focus:border-[#0BB8AE]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      <input
                        value={updatedUser.experience}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, experience: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0BB8AE] focus:border-[#0BB8AE]"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-3 bg-[#0BB8AE] text-white rounded-lg hover:bg-[#9DC2C8] transition-colors"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;