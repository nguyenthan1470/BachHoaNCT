import React, { useState, useEffect } from 'react';
import { Clock, Tag, TrendingUp, Zap, ShoppingCart, Percent, Gift, Newspaper } from 'lucide-react';

const GroceryNewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - trong thực tế sẽ thay bằng API call
  const mockNews = [
    {
      id: 1,
      title: "Siêu khuyến mãi cuối tuần - Giảm đến 50% toàn bộ sản phẩm tươi sống",
      excerpt: "Chương trình khuyến mãi lớn nhất tháng với hàng trăm sản phẩm thực phẩm tươi sống, rau củ quả được giảm giá sâu...",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=250&fit=crop",
      category: "promotion",
      date: "2025-06-23",
      readTime: "3 phút đọc",
      featured: true
    },
    {
      id: 2,
      title: "Ra mắt dòng sản phẩm hữu cơ cao cấp từ Đà Lạt",
      excerpt: "Bổ sung thêm 50+ sản phẩm rau củ quả hữu cơ từ các trang trại uy tín tại Đà Lạt, đảm bảo chất lượng và an toàn thực phẩm...",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=250&fit=crop",
      category: "product",
      date: "2025-06-22",
      readTime: "4 phút đọc",
      featured: false
    },
    {
      id: 3,
      title: "Mở rộng dịch vụ giao hàng 24/7 trong nội thành",
      excerpt: "Từ tháng 7, khách hàng có thể đặt hàng và nhận giao hàng tận nơi 24/7 với phí ship ưu đãi chỉ từ 15.000đ...",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop",
      category: "service",
      date: "2025-06-21",
      readTime: "2 phút đọc",
      featured: false
    },
    {
      id: 4,
      title: "Xu hướng mua sắm thực phẩm organic tăng 200% trong năm 2025",
      excerpt: "Báo cáo mới nhất cho thấy người tiêu dùng Việt Nam ngày càng quan tâm đến sức khỏe và ưa chuộng thực phẩm sạch...",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop",
      category: "trend",
      date: "2025-06-20",
      readTime: "5 phút đọc",
      featured: false
    },
    {
      id: 5,
      title: "Chính sách đổi trả linh hoạt - Hoàn tiền 100% nếu không hài lòng",
      excerpt: "Cam kết mang đến trải nghiệm mua sắm tốt nhất với chính sách đổi trả trong 7 ngày, hoàn tiền nhanh chóng...",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      category: "policy",
      date: "2025-06-19",
      readTime: "3 phút đọc",
      featured: false
    },
    {
      id: 6,
      title: "Festival Ẩm thực Việt - Tuần lễ khuyến mãi đặc biệt",
      excerpt: "Tham gia Festival Ẩm thực Việt với nhiều hoạt động thú vị và cơ hội nhận quà tặng giá trị lên đến 5 triệu đồng...",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=250&fit=crop",
      category: "event",
      date: "2025-06-18",
      readTime: "4 phút đọc",
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', icon: Newspaper, color: 'text-green-600' },
    { id: 'promotion', name: 'Khuyến mãi', icon: Percent, color: 'text-red-500' },
    { id: 'product', name: 'Sản phẩm', icon: ShoppingCart, color: 'text-blue-500' },
    { id: 'service', name: 'Dịch vụ', icon: Zap, color: 'text-purple-500' },
    { id: 'trend', name: 'Xu hướng', icon: TrendingUp, color: 'text-orange-500' },
    { id: 'event', name: 'Sự kiện', icon: Gift, color: 'text-pink-500' },
    { id: 'policy', name: 'Chính sách', icon: Tag, color: 'text-gray-600' }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchNews = async () => {
      setLoading(true);
      // Trong thực tế, đây sẽ là API call
      // const response = await fetch('/api/news');
      // const data = await response.json();
      setTimeout(() => {
        setNews(mockNews);
        setLoading(false);
      }, 1000);
    };

    fetchNews();
  }, []);

  const filteredNews = activeCategory === 'all' 
    ? news 
    : news.filter(item => item.category === activeCategory);

  const featuredNews = news.find(item => item.featured);
  const regularNews = news.filter(item => !item.featured);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-700 font-medium">Đang tải tin tức mới nhất...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Tin Tức & Sự Kiện
            </h1>
            <p className="text-gray-600 text-lg">Cập nhật những thông tin mới nhất từ cửa hàng</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === category.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-md'
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured News */}
        {featuredNews && activeCategory === 'all' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Tin Nổi Bật</h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredNews.image}
                    alt={featuredNews.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      {getCategoryInfo(featuredNews.category).name}
                    </span>
                    <span className="text-gray-500 text-sm">•</span>
                    <span className="text-gray-500 text-sm">{formatDate(featuredNews.date)}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {featuredNews.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredNews.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock size={16} />
                      <span className="text-sm">{featuredNews.readTime}</span>
                    </div>
                    <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors font-medium">
                      Đọc thêm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(activeCategory === 'all' ? regularNews : filteredNews).map((article) => {
            const categoryInfo = getCategoryInfo(article.category);
            const IconComponent = categoryInfo.icon;

            return (
              <article
                key={article.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div className={`flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full ${categoryInfo.color}`}>
                      <IconComponent size={14} />
                      <span className="text-sm font-medium">{categoryInfo.name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <Clock size={14} />
                    <span>{formatDate(article.date)}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium">
                    Xem chi tiết
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 font-medium">
            Tải thêm tin tức
          </button>
        </div>
      </div>

    </div>
  );
};

export default GroceryNewsPage;
