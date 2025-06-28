import React, { useState } from 'react';

const CustomerAccounts = () => {
  // Sample user data
  const [users, setUsers] = useState([
    { id: 1, name: 'Nguyễn Văn A', email: 'nva@example.com', access: 'VIP', lastPurchase: '2025-06-20', totalSpent: 15000000 },
    { id: 2, name: 'Trần Thị B', email: 'ttb@example.com', access: 'Thường', lastPurchase: '2025-06-15', totalSpent: 5000000 },
    { id: 3, name: 'Lê Văn C', email: 'lvc@example.com', access: 'Thường', lastPurchase: '2025-06-10', totalSpent: 8000000 },
  ]);

  // Handle access level change
  const handleAccessChange = (id, newAccess) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, access: newAccess } : user
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Tài khoản khách hàng</h1>
        <p className="text-gray-600 mb-8">Quản lý lịch sử mua hàng và phân quyền truy cập (VIP, Thường) của khách hàng.</p>
        
        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <input 
            type="text" 
            placeholder="Tìm kiếm khách hàng..." 
            className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả quyền truy cập</option>
            <option value="VIP">VIP</option>
            <option value="Thường">Thường</option>
          </select>
        </div>

        {/* User Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quyền truy cập</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lần mua cuối</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng chi tiêu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.access === 'VIP' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.access}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastPurchase}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.totalSpent.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select 
                      value={user.access}
                      onChange={(e) => handleAccessChange(user.id, e.target.value)}
                      className="p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="VIP">VIP</option>
                      <option value="Thường">Thường</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccounts;