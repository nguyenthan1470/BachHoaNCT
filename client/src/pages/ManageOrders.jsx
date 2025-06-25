import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { Select, SelectItem } from '@nextui-org/react'
import {
  Package, ShoppingCart, Clock, Truck, CheckCircle, XCircle,
  RotateCcw, User, Mail, Phone, DollarSign, Hash, Calendar,
  Search, Download
} from 'lucide-react'

const orderStatuses = ['Thanh Toán Khi Nhận', 'Chờ xử lý', 'Đang giao', 'Đã giao', 'Đã hủy', 'Hoàn trả']

const getStatusIcon = (status) => {
  switch (status) {
    case 'Thanh Toán Khi Nhận': return <DollarSign className="w-4 h-4" />
    case 'Chờ xử lý': return <Clock className="w-4 h-4" />
    case 'Đang giao': return <Truck className="w-4 h-4" />
    case 'Đã giao': return <CheckCircle className="w-4 h-4" />
    case 'Đã hủy': return <XCircle className="w-4 h-4" />
    case 'Hoàn trả': return <RotateCcw className="w-4 h-4" />
    default: return <Clock className="w-4 h-4" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Thanh Toán Khi Nhận': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Chờ xử lý': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Đang giao': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'Đã giao': return 'bg-green-100 text-green-800 border-green-200'
    case 'Đã hủy': return 'bg-red-100 text-red-800 border-red-200'
    case 'Hoàn trả': return 'bg-gray-100 text-gray-800 border-gray-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const ManageOrders = () => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await Axios(SummaryApi.getAllOrders)
      setOrders(res.data?.data || [])
    } catch (err) {
      toast.error("Lỗi tải đơn hàng")
    }
    setLoading(false)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await Axios({
        ...SummaryApi.updateOrderStatus,
        data: { orderId, status: newStatus }
      })
      toast.success("Cập nhật trạng thái thành công")
      fetchOrders()
    } catch (err) {
      toast.error("Lỗi cập nhật trạng thái")
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || order.payment_status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Quản lý đơn hàng
              </h1>
              <p className="text-gray-600 mt-1">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {['Tổng đơn hàng', 'Chờ xử lý', 'Đang giao', 'Đã giao'].map((label, idx) => (
              <div
                key={label}
                className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{label}</p>
                    <p className={`text-2xl font-bold ${['text-gray-800', 'text-yellow-600', 'text-purple-600', 'text-green-600'][idx]}`}>
                      {
                        idx === 0 ? orders.length :
                          orders.filter(o => o.payment_status === ['Chờ xử lý', 'Đang giao', 'Đã giao'][idx - 1]).length
                      }
                    </p>
                  </div>
                  {[<ShoppingCart />, <Clock />, <Truck />, <CheckCircle />][idx]}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn, tên khách hàng, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  {orderStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Xuất Excel</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Không có đơn hàng</h3>
              <p className="text-gray-500">Chưa có đơn hàng nào để hiển thị</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left">Mã đơn</th>
                    <th className="p-4 text-left">Khách hàng</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">SĐT</th>
                    <th className="p-4 text-left">Tổng tiền</th>
                    <th className="p-4 text-left">Trạng thái</th>
                    <th className="p-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order._id} className="border-t hover:bg-blue-50/30">
                      <td className="p-4 font-mono text-blue-600">{order.orderId || order._id.slice(-6).toUpperCase()}</td>
                      <td className="p-4">{order.userId?.name || "Không rõ"}</td>
                      <td className="p-4">{order.userId?.email || "Không rõ"}</td>
                      <td className="p-4">{order.userId?.mobile ? `0${order.userId.mobile}` : "Không rõ"}</td>
                      <td className="p-4 text-red-600 font-semibold">{order.totalAmt?.toLocaleString() || 0}₫</td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.payment_status || 'Chờ xử lý')}`}>
                          {getStatusIcon(order.payment_status)}
                          {order.payment_status || 'Chờ xử lý'}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Select
                          size="sm"
                          className="w-40 min-w-[180px] max-w-[200px] bg-white shadow-md border border-gray-200 rounded-lg"
                          selectedKeys={[order.payment_status || 'Chờ xử lý']}
                          onSelectionChange={(keys) => {
                            const newStatus = Array.from(keys)[0];
                            handleStatusChange(order._id, newStatus);
                          }}
                          popoverProps={{
                            classNames: {
                              base: "bg-white shadow-lg rounded-lg p-2",
                              content: "min-w-[160px] max-h-[200px] overflow-y-auto",
                            },
                          }}
                        >
                          {orderStatuses.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className="hover:bg-primary-100 rounded-md transition-colors flex items-center justify-center text-center"
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageOrders