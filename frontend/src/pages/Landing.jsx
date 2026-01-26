import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Heart,
  ShoppingCart,
  User,
  Bell,
  ChevronDown,
  MapPin,
  Package,
  Shirt,
  X,
  Plus,
  Minus,
  SlidersHorizontal,
  ArrowUpDown,
  Eye,
  Share2,
  MessageCircle,
  TrendingUp,
  Clock,
  Award,
  Zap
} from 'lucide-react';

export default function ReWearDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [userPoints, setUserPoints] = useState(1250);
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const [isLoggedIn, setIsLoggedIn] = useState(null); // null: loading, true/false: state

  useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      // Get CSRF token from cookie
      const getCsrfToken = () => {
        const name = 'csrftoken';
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
          const trimmed = cookie.trim();
          if (trimmed.startsWith(name + '=')) {
            return trimmed.substring(name.length + 1);
          }
        }
        return null;
      };
      
      const csrfToken = getCsrfToken();
      console.log('CSRF Token:', csrfToken);
      
      const res = await fetch('http://localhost:8000/api/accounts/islogin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRFToken': csrfToken })
        },
        credentials: 'include' // Important for cookies if using cookie-based auth
      });
      
      const data = await res.json();
      setIsLoggedIn(data?.is_authenticated || false);
    } catch (error) {
      console.error('Error checking login:', error);
      setIsLoggedIn(false);
    }
  };

  checkLoginStatus();
}, []);

  if (isLoggedIn === null) {
    return null; // Or show a loading spinner if needed
  }

  // Sample items data
  const allItems = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      description: "Classic vintage denim jacket in excellent condition. Perfect for layering.",
      category: "outerwear",
      type: "jacket",
      size: "M",
      condition: "excellent",
      points: 120,
      swapAvailable: true,
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop",
      uploader: "Sarah M.",
      uploaderRating: 4.8,
      location: "New York, NY",
      dateAdded: "2 days ago",
      views: 45,
      tags: ["vintage", "denim", "classic"],
      brand: "Levi's",
      originalPrice: 89
    },
    {
      id: 2,
      title: "Designer Silk Scarf",
      description: "Luxurious silk scarf with beautiful floral pattern. Barely used.",
      category: "accessories",
      type: "scarf",
      size: "one-size",
      condition: "like-new",
      points: 80,
      swapAvailable: true,
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=500&fit=crop",
      uploader: "Emma L.",
      uploaderRating: 4.9,
      location: "San Francisco, CA",
      dateAdded: "1 day ago",
      views: 32,
      tags: ["silk", "designer", "luxury"],
      brand: "Hermès",
      originalPrice: 340
    },
    {
      id: 3,
      title: "Casual Cotton Dress",
      description: "Comfortable cotton dress perfect for summer. Worn only a few times.",
      category: "dresses",
      type: "casual-dress",
      size: "L",
      condition: "good",
      points: 95,
      swapAvailable: false,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
      uploader: "Maya K.",
      uploaderRating: 4.7,
      location: "Chicago, IL",
      dateAdded: "3 days ago",
      views: 67,
      tags: ["cotton", "summer", "casual"],
      brand: "Zara",
      originalPrice: 49
    },
    {
      id: 4,
      title: "Leather Ankle Boots",
      description: "Genuine leather ankle boots with minimal wear. Very comfortable.",
      category: "shoes",
      type: "boots",
      size: "8",
      condition: "very-good",
      points: 150,
      swapAvailable: true,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop",
      uploader: "Jessica R.",
      uploaderRating: 4.8,
      location: "Austin, TX",
      dateAdded: "4 days ago",
      views: 89,
      tags: ["leather", "boots", "comfort"],
      brand: "Dr. Martens",
      originalPrice: 160
    },
    {
      id: 5,
      title: "Cashmere Sweater",
      description: "Soft cashmere sweater in beautiful burgundy color. Excellent quality.",
      category: "tops",
      type: "sweater",
      size: "S",
      condition: "excellent",
      points: 200,
      swapAvailable: true,
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop",
      uploader: "Sophia T.",
      uploaderRating: 5.0,
      location: "Boston, MA",
      dateAdded: "5 days ago",
      views: 123,
      tags: ["cashmere", "luxury", "warm"],
      brand: "Burberry",
      originalPrice: 450
    },
    {
      id: 6,
      title: "Formal Blazer",
      description: "Professional blazer perfect for office wear. Tailored fit.",
      category: "outerwear",
      type: "blazer",
      size: "M",
      condition: "like-new",
      points: 110,
      swapAvailable: true,
      image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=500&fit=crop",
      uploader: "Rachel P.",
      uploaderRating: 4.6,
      location: "Seattle, WA",
      dateAdded: "6 days ago",
      views: 41,
      tags: ["formal", "office", "professional"],
      brand: "Hugo Boss",
      originalPrice: 280
    },
    {
      id: 7,
      title: "Vintage Band T-Shirt",
      description: "Authentic vintage band t-shirt from the 90s. Rare find!",
      category: "tops",
      type: "t-shirt",
      size: "L",
      condition: "good",
      points: 75,
      swapAvailable: true,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      uploader: "Mike D.",
      uploaderRating: 4.5,
      location: "Portland, OR",
      dateAdded: "1 week ago",
      views: 156,
      tags: ["vintage", "band", "90s"],
      brand: "Vintage",
      originalPrice: 120
    },
    {
      id: 8,
      title: "Summer Maxi Dress",
      description: "Flowy maxi dress perfect for summer events. Beautiful floral print.",
      category: "dresses",
      type: "maxi-dress",
      size: "M",
      condition: "excellent",
      points: 130,
      swapAvailable: false,
      image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&h=500&fit=crop",
      uploader: "Lisa H.",
      uploaderRating: 4.9,
      location: "Miami, FL",
      dateAdded: "1 week ago",
      views: 78,
      tags: ["summer", "floral", "maxi"],
      brand: "Free People",
      originalPrice: 180
    }
  ];

  // Filter and search logic
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSize = selectedSize === 'all' || item.size.toLowerCase() === selectedSize.toLowerCase();
    const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
    
    return matchesSearch && matchesCategory && matchesSize && matchesCondition;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      case 'oldest':
        return new Date(a.dateAdded) - new Date(b.dateAdded);
      case 'points-low':
        return a.points - b.points;
      case 'points-high':
        return b.points - a.points;
      case 'popular':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const toggleWishlist = (itemId) => {
    setWishlist(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const categories = [
    { id: 'all', label: 'All Categories', count: allItems.length },
    { id: 'outerwear', label: 'Outerwear', count: allItems.filter(item => item.category === 'outerwear').length },
    { id: 'tops', label: 'Tops', count: allItems.filter(item => item.category === 'tops').length },
    { id: 'dresses', label: 'Dresses', count: allItems.filter(item => item.category === 'dresses').length },
    { id: 'shoes', label: 'Shoes', count: allItems.filter(item => item.category === 'shoes').length },
    { id: 'accessories', label: 'Accessories', count: allItems.filter(item => item.category === 'accessories').length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shirt className="w-8 h-8 text-purple-400" />
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ReWear
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for items, brands, or styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* User Actions */}
          {isLoggedIn === false && (
            <div className="flex space-x-4">
              <Link to="/signin">
                <button className="px-6 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {isLoggedIn && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-full border border-purple-400/30">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="font-semibold">{userPoints}</span>
                <span className="text-sm text-gray-300">pts</span>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <Link to="/user">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <User className="w-5 h-5" />
                </button>
              </Link>
            </div>
          )}


          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === category.id
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className="text-sm text-gray-400">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Size</h3>
              <div className="space-y-2">
                {['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedSize === size
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {size === 'all' ? 'All Sizes' : size}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Condition</h3>
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'All Conditions' },
                  { id: 'like-new', label: 'Like New' },
                  { id: 'excellent', label: 'Excellent' },
                  { id: 'very-good', label: 'Very Good' },
                  { id: 'good', label: 'Good' }
                ].map(condition => (
                  <button
                    key={condition.id}
                    onClick={() => setSelectedCondition(condition.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCondition === condition.id
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {condition.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold">
                  {filteredItems.length} Items Found
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="points-low">Points: Low to High</option>
                    <option value="points-high">Points: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Items Grid/List */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
             {currentItems.map(item => (
                <div key={item.id} className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:scale-105 ${viewMode === 'list' ? 'flex' : ''}`}>
                  
                  <Link to={`/itemDetailPage/${item.id}`} className="block flex-1">
                    <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'h-64'}`}>
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(item.id);
                          }}
                          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                            wishlist.includes(item.id)
                              ? 'bg-red-500/20 text-red-400 border border-red-400/30'
                              : 'bg-black/20 text-white/70 hover:bg-black/30'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${wishlist.includes(item.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button className="p-2 rounded-full bg-black/20 text-white/70 hover:bg-black/30 backdrop-blur-sm transition-all duration-300">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 rounded-full text-xs font-semibold capitalize">
                          {item.category}
                        </span>
                      </div>
                      {!item.swapAvailable && (
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs border border-orange-400/30">
                            Points Only
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4 flex-1">
                    <Link to={`/itemDetailPage/${item.id}`} className="block">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <div className="text-right">
                          <div className="text-xl font-bold text-purple-400">{item.points}</div>
                          <div className="text-xs text-gray-400">points</div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{item.description}</p>
                    </Link>

                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-400">Size: <span className="text-white">{item.size}</span></span>
                        <span className="text-gray-400">Condition: <span className="text-green-400 capitalize">{item.condition.replace('-', ' ')}</span></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold">
                          {item.uploader.charAt(0)}
                        </div>
                        <span className="text-purple-300">{item.uploader}</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-yellow-400">{item.uploaderRating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Eye className="w-3 h-3 mr-1" />
                        <span>{item.views}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {item.swapAvailable && (
                        <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm">
                          Swap Request
                        </button>
                      )}
                      <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-sm">
                        Use Points
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                        : 'bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}