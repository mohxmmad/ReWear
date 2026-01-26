import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Plus, 
  Star, 
  Award, 
  Package, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  Heart, 
  Eye, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  TrendingUp,
  Calendar,
  MapPin,
  Settings,
  Camera,
  Upload,
  Target
} from 'lucide-react';

export default function ReWearUserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats] = useState({
    totalPoints: 1250,
    itemsListed: 12,
    successfulSwaps: 8,
    itemsWanted: 5,
    memberSince: 'January 2024',
    rating: 4.8,
    location: 'New York, NY'
  });

  const [userItems] = useState([
    {
      id: 1,
      title: "Vintage Denim Jacket",
      category: "Outerwear",
      points: 120,
      status: "active",
      views: 45,
      likes: 12,
      dateAdded: "2024-01-15",
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Silk Designer Scarf",
      category: "Accessories",
      points: 80,
      status: "pending",
      views: 23,
      likes: 8,
      dateAdded: "2024-01-10",
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Leather Boots",
      category: "Shoes",
      points: 150,
      status: "swapped",
      views: 67,
      likes: 19,
      dateAdded: "2024-01-05",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop"
    }
  ]);

  const [swapHistory] = useState([
    {
      id: 1,
      type: "swap",
      itemGiven: "Vintage Denim Jacket",
      itemReceived: "Cashmere Sweater",
      partner: "Sarah M.",
      date: "2024-01-20",
      status: "completed"
    },
    {
      id: 2,
      type: "points",
      itemGiven: "Silk Scarf",
      pointsEarned: 80,
      date: "2024-01-18",
      status: "completed"
    },
    {
      id: 3,
      type: "swap",
      itemGiven: "Summer Dress",
      itemReceived: "Formal Blazer",
      partner: "Emma L.",
      date: "2024-01-15",
      status: "in-progress"
    }
  ]);

  const [wishlist] = useState([
    {
      id: 1,
      title: "Vintage Leather Jacket",
      points: 200,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop",
      uploader: "Mike D."
    },
    {
      id: 2,
      title: "Designer Handbag",
      points: 180,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop",
      uploader: "Lisa H."
    }
  ]);

  const StatCard = ({ icon: Icon, label, value, color = "purple" }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color === 'purple' ? 'from-purple-500/20 to-pink-500/20' : 
          color === 'green' ? 'from-green-500/20 to-emerald-500/20' : 
          color === 'blue' ? 'from-blue-500/20 to-cyan-500/20' : 'from-orange-500/20 to-red-500/20'}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ItemCard = ({ item, showActions = true }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300">
      <div className="relative">
        <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
            item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
            'bg-gray-500/20 text-gray-300 border border-gray-400/30'
          }`}>
            {item.status}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1">{item.title}</h3>
        <p className="text-gray-400 text-sm mb-3">{item.category}</p>
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-purple-400 font-bold">{item.points} pts</span>
          <div className="flex items-center space-x-3 text-gray-400">
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              <span>{item.views}</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-3 h-3 mr-1" />
              <span>{item.likes}</span>
            </div>
          </div>
        </div>
        {showActions && (
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-sm hover:bg-blue-500/30 transition-colors border border-blue-400/30">
              <Edit className="w-3 h-3 mr-1 inline" />
              Edit
            </button>
            <button className="flex-1 bg-red-500/20 text-red-300 px-3 py-1 rounded-lg text-sm hover:bg-red-500/30 transition-colors border border-red-400/30">
              <Trash2 className="w-3 h-3 mr-1 inline" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const SwapCard = ({ swap }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            swap.status === 'completed' ? 'bg-green-400' : 
            swap.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-400'
          }`} />
          <span className="text-sm font-medium capitalize">{swap.type}</span>
        </div>
        <span className="text-xs text-gray-400">{new Date(swap.date).toLocaleDateString()}</span>
      </div>
      <div className="text-sm">
        <p className="text-white mb-1">
          <span className="text-gray-400">Gave:</span> {swap.itemGiven}
        </p>
        {swap.type === 'swap' ? (
          <p className="text-white mb-1">
            <span className="text-gray-400">Received:</span> {swap.itemReceived}
          </p>
        ) : (
          <p className="text-green-400 mb-1">
            <span className="text-gray-400">Earned:</span> {swap.pointsEarned} points
          </p>
        )}
        {swap.partner && (
          <p className="text-purple-300">
            <span className="text-gray-400">Partner:</span> {swap.partner}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl font-bold">
                JD
              </div>
              <div>
                <h1 className="text-xl font-bold">John Doe</h1>
                <p className="text-sm text-gray-400">Member since {userStats.memberSince}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-full border border-purple-400/30">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="font-semibold">{userStats.totalPoints}</span>
                <span className="text-sm text-gray-300">points</span>
              </div>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <Link to="/rewearadditem">Add Item</Link>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'items', label: 'My Items', icon: Package },
            { id: 'swaps', label: 'Swap History', icon: RefreshCw },
            { id: 'wishlist', label: 'Wishlist', icon: Heart },
            { id: 'profile', label: 'Profile', icon: User }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                  : 'hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Package} label="Items Listed" value={userStats.itemsListed} />
              <StatCard icon={RefreshCw} label="Successful Swaps" value={userStats.successfulSwaps} color="green" />
              <StatCard icon={Heart} label="Items Wanted" value={userStats.itemsWanted} color="blue" />
              <StatCard icon={Star} label="Rating" value={userStats.rating} color="orange" />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Items</h3>
                <div className="space-y-4">
                  {userItems.slice(0, 3).map(item => (
                    <ItemCard key={item.id} item={item} showActions={false} />
                  ))}
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Swaps</h3>
                <div className="space-y-4">
                  {swapHistory.slice(0, 3).map(swap => (
                    <SwapCard key={swap.id} swap={swap} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Items ({userItems.length})</h2>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'swaps' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Swap History ({swapHistory.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {swapHistory.map(swap => (
                <SwapCard key={swap.id} swap={swap} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Wishlist ({wishlist.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map(item => (
                <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300">
                  <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">by {item.uploader}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-400 font-bold">{item.points} pts</span>
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-lg text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                        Request
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Profile Settings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input type="text" value="John Doe" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" value="john.doe@example.com" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input type="text" value={userStats.location} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Account Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member Since</span>
                    <span>{userStats.memberSince}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Points</span>
                    <span className="text-purple-400 font-bold">{userStats.totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span>{userStats.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Successful Swaps</span>
                    <span>{userStats.successfulSwaps}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}