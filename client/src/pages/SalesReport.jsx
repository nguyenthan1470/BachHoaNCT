import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import {
  TrendingUp, Package, DollarSign, Users, Calendar, Award
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SalesReport = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [newCustomers, setNewCustomers] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#f43f5e'];

  const fetchStatistics = async () => {
    try {
      const now = new Date();
      const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1);
      const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const fromDate = startDate || defaultFrom;
      const toDate = endDate || defaultTo;

      const from = fromDate.toISOString().split("T")[0];
      const to = toDate.toISOString().split("T")[0];

      const response = await Axios({
        ...SummaryApi.getSalesStatistics,
        params: { from, to }
      });

      const { data } = response;

      if (data.success) {
        const fullYearData = Array.from({ length: 12 }, (_, index) => {
          const month = index + 1;
          const match = data.revenueByMonth.find(item => item._id === month);
          return {
            name: `Tháng ${month}`,
            revenue: match ? match.totalRevenue : 0,
            orders: match ? match.totalOrders : 0
          };
        });

        setRevenueData(fullYearData);
        setTopProducts(data.topProducts);
        setCategoryData(data.categoryDistribution.map(item => ({
          name: item.name,
          value: item.value,
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        })))
        setNewCustomers(data.newCustomers ?? 0);
        setCompletionRate(data.completionRate ?? 0);
      }
    } catch (err) {
      console.error("Failed to fetch statistics", err);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);

  const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(value);

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = "text-green-600" }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color === "text-green-600" ? "from-green-50 to-green-100" :
          color === "text-blue-600" ? "from-blue-50 to-blue-100" :
            color === "text-purple-600" ? "from-purple-50 to-purple-100" :
              "from-orange-50 to-orange-100"}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Báo cáo doanh số</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Từ ngày"
                dateFormat="dd/MM/yyyy"
                className="border px-2 py-1 rounded"
              />
              <span>-</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="Đến ngày"
                dateFormat="dd/MM/yyyy"
                className="border px-2 py-1 rounded"
              />
              <button
                className="ml-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                onClick={fetchStatistics}
              >
                Lọc
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl shadow-lg">
            <p className="text-sm opacity-90">Tổng doanh thu</p>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={DollarSign} title="Doanh thu trung bình/đơn" value={formatCurrency(avgOrderValue)} trend={8.5} />
          <StatCard icon={Package} title="Tổng đơn hàng" value={formatNumber(totalOrders)} subtitle="đơn hàng" trend={12.3} color="text-blue-600" />
          <StatCard icon={Users} title="Khách hàng mới" value={formatNumber(newCustomers)} subtitle="khách hàng" trend={-2.1} color="text-purple-600" />
          <StatCard icon={Award} title="Tỷ lệ hoàn thành" value={`${completionRate.toFixed(1)}%`} subtitle="đơn hàng" trend={5.7} color="text-orange-600" />
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Doanh thu theo tháng</h2>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className="text-sm text-gray-500">Doanh thu</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" tickLine={false} />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} tickLine={false} />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Doanh thu']} />
              <Bar dataKey="revenue" fill="url(#greenGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top những sản phẩm bán chạy</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-2 text-sm font-semibold text-gray-600 text-left">#</th>
                  <th className="py-3 px-2 text-sm font-semibold text-gray-600 text-left">Tên sản phẩm</th>
                  <th className="py-3 px-2 text-sm font-semibold text-gray-600 text-left">Số lượng bán</th>
                  <th className="py-3 px-2 text-sm font-semibold text-gray-600 text-left">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">{index + 1}</td>
                    <td className="py-3 px-2 font-semibold text-gray-900">{product.name}</td>
                    <td className="py-3 px-2">{formatNumber(product.totalSold)}</td>
                    <td className="py-3 px-2 text-green-600">{formatCurrency(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SalesReport;