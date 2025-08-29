import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { Select, SelectItem } from '@nextui-org/react'
import {
  Package, ShoppingCart, Clock, Truck, CheckCircle, XCircle,
  RotateCcw, User, Mail, Phone, DollarSign, Hash, Calendar,
  Search, Download, Filter, ArrowUpDown
} from 'lucide-react'

const orderStatuses = [ 'Chờ xử lý', 'Đang giao', 'Đã giao', 'Đã hủy', 'Hoàn trả']

const getStatusIcon = (status) => {
  switch (status) {
  
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            
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

              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-600 mt-4 text-lg">Đang tải dữ liệu...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gray-200 rounded-full blur opacity-50"></div>
                <div className="relative p-6 bg-gray-100 rounded-full">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Không có đơn hàng</h3>
              <p className="text-gray-500 text-lg">Chưa có đơn hàng nào phù hợp với tiêu chí tìm kiếm</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/50">
                    <th className="p-6 text-left font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Mã đơn
                      </div>
                    </th>
                    <th className="p-6 text-left font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Thông tin khách hàng
                      </div>
                    </th>

                    <th className="p-6 text-left font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Sản phẩm
                      </div>
                    </th>

                    <th className="p-6 text-left font-semibold text-gray-700">Trạng thái</th>
                    <th className="p-6 text-center font-semibold text-gray-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr key={order._id} className={`border-b border-gray-100/50 hover:bg-blue-50/30 transition-all duration-300 ${index % 2 === 0 ? 'bg-white/40' : 'bg-gray-50/40'}`}>
                      <td className="p-2">
                        <div className="flex flex-col">
                          <span className="font-mono text-blue-600 font-semibold text-sm">
                            {order.orderId || order._id.slice(-6).toUpperCase()}
                          </span>
                          <span className="text-gray-500 text-sm mt-1">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-800">{order.userId?.name || "Không rõ"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 text-sm">{order.userId?.email || "Không rõ"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 text-sm">{order.userId?.mobile ? `0${order.userId.mobile}` : "Không rõ"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-3 max-w-sm">
                          {Array.isArray(order.product_details) ? (
                            order.product_details.slice(0, 2).map((product, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-gray-100/50">
                                <div className="relative">
                                  <img
                                    src={product.image?.[0] || "/assets/placeholder.jpg"}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                  />
                                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                                    {product.quantity || 1}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-800 truncate">{product.name || "Không rõ"}</p>
                                  <p className="text-sm text-gray-500">SL: {product.quantity || 1}</p>
                                  <p className="text-sm font-bold text-red-500 mt-1">
                                    Tổng: {order.totalAmt?.toLocaleString() || 0}₫
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-gray-100/50">
                              <div className="relative">
                                <img
                                  src={order.product_details?.image?.[0] || "/assets/placeholder.jpg"}
                                  alt={order.product_details?.name}
                                  className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                />
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                                  {order.product_details?.quantity || 1}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 truncate">{order.product_details?.name || "Không rõ"}</p>
                                <p className="text-sm text-gray-500">SL: {order.product_details?.quantity || 1}</p>
                                <p className="text-sm font-bold text-red-500 mt-1">
                                  Tổng: {order.totalAmt?.toLocaleString() || 0}₫
                                </p>
                              </div>
                            </div>
                          )}
                          {Array.isArray(order.product_details) && order.product_details.length > 2 && (
                            <div className="text-center">
                              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                +{order.product_details.length - 2} sản phẩm khác
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-2">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold border shadow-sm ${getStatusColor(order.payment_status || 'Chờ xử lý')}`}>
                          {getStatusIcon(order.payment_status)}
                          {order.payment_status || 'Chờ xử lý'}
                        </div>
                      </td>
                      <td className="p-11 text-center">
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
                              className="flex items-center justify-center text-center hover:bg-blue-50 rounded-md transition-colors p-3"
                            >
                              <div className="flex items-center justify-center gap-2">
                                {getStatusIcon(status)}
                                {status}
                              </div>
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