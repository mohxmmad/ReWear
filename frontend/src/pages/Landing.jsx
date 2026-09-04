import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Star, Heart, User, Bell, Shirt, ArrowUpDown, Eye, Share2, Award } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function ReWearDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [userPoints, setUserPoints] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedSize !== 'all') params.set('size', selectedSize);
    if (selectedCondition !== 'all') params.set('condition', selectedCondition);
    const q = params.toString() ? `?${params.toString()}` : '';
    const { res, data } = await apiFetch(`/api/items/${q}`);
    if (res.ok) {
      const list = Array.isArray(data) ? data : data.results || [];
      setItems(list.map(it => ({
        id: it.id,
        title: it.title,
        description: it.description,
        category: it.category,
        type: it.type,
        size: it.size,
        condition: it.condition,
        points: it.point_value,
        image: it.image_url || it.image || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop',
        uploader: it.uploader_username || 'User',
        dateAdded: it.created_at,
        tags: it.tags ? it.tags.split(',') : [],
        status: it.status
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);
  useEffect(() => {
    const t = setTimeout(fetchItems, 400);
    return () => clearTimeout(t);
  }, [searchQuery, selectedCategory, selectedSize, selectedCondition]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { data } = await apiFetch('/api/accounts/islogin/');
        setIsLoggedIn(!!data?.is_authenticated);
        if (data?.points !== undefined) setUserPoints(data.points);
        if (data?.is_authenticated) {
          const { res: r2, data: d2 } = await apiFetch('/api/accounts/me/');
          if (r2.ok) setUserPoints(d2.points);
        }
      } catch { setIsLoggedIn(false); }
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white">Loading...</div>;

  const sortedItems = [...items].sort((a,b)=>{
    switch(sortBy){
      case 'points-low': return a.points - b.points;
      case 'points-high': return b.points - a.points;
      case 'oldest': return new Date(a.dateAdded) - new Date(b.dateAdded);
      case 'newest':
      default: return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
  });
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = sortedItems.slice(indexOfLast - itemsPerPage, indexOfLast);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const toggleWishlist = (id) => setWishlist(p=> p.includes(id)? p.filter(x=>x!==id): [...p,id]);
  const handleRedeem = async (id) => {
    if (!isLoggedIn) { alert('Please login to redeem'); return; }
    setRedeeming(id);
    const { res, data } = await apiFetch('/api/redeem/redeem/', { method:'POST', body:{ item_id:id }});
    if (res.ok) { alert('Redeemed successfully!'); fetchItems(); }
    else alert(data?.detail || 'Redeem failed');
    setRedeeming(null);
  };
  const categories = [
    { id:'all', label:'All Categories'},
    { id:'Clothing', label:'Clothing'},{ id:'Shoes', label:'Shoes'},{ id:'Accessories', label:'Accessories'},{ id:'Other', label:'Other'},{ id:'Shirt', label:'Shirt'},{ id:'Pant', label:'Pant'},{ id:'Dress', label:'Dress'},
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Shirt className="w-8 h-8 text-purple-400" />
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ReWear</div>
          </Link>
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search for items, brands, or styles..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full focus:outline-none focus:border-purple-400 text-white placeholder-gray-400" />
            </div>
          </div>
          {isLoggedIn===false && (
            <div className="flex space-x-4">
              <Link to="/signin"><button className="px-6 py-2 rounded-full border border-white/20">Login</button></Link>
              <Link to="/signup"><button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full font-semibold">Sign Up</button></Link>
            </div>
          )}
          {isLoggedIn && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-full border border-purple-400/30">
                <Award className="w-4 h-4 text-purple-400" /><span className="font-semibold">{userPoints}</span><span className="text-sm text-gray-300">pts</span>
              </div>
              <Link to="/user"><button className="p-2 hover:bg-white/10 rounded-full"><User className="w-5 h-5"/></button></Link>
              <Link to="/add-item" className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-full text-sm">+ Add Item</Link>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <div className="w-64 space-y-6 hidden lg:block">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-4 flex items-center"><Filter className="w-4 h-4 mr-2"/>Categories</h3>
            <div className="space-y-2">
              {categories.map(c=>(
                <button key={c.id} onClick={()=>setSelectedCategory(c.id)} className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${selectedCategory===c.id ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30': 'hover:bg-white/5'}`}>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Size</h3>
            <div className="space-y-2">
              {['all','XS','S','M','L','XL','XXL','One Size'].map(s=>(
                <button key={s} onClick={()=>setSelectedSize(s)} className={`w-full text-left px-3 py-2 rounded-lg ${selectedSize===s? 'bg-purple-500/20 text-purple-300 border border-purple-400/30':'hover:bg-white/5'}`}>{s==='all'?'All Sizes':s}</button>
              ))}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Condition</h3>
            <div className="space-y-2">
              {[{id:'all',label:'All'},{id:'New',label:'New'},{id:'Good',label:'Good'},{id:'Worn',label:'Worn'}].map(c=>(
                <button key={c.id} onClick={()=>setSelectedCondition(c.id)} className={`w-full text-left px-3 py-2 rounded-lg ${selectedCondition===c.id? 'bg-purple-500/20 text-purple-300 border border-purple-400/30':'hover:bg-white/5'}`}>{c.label}</button>
              ))}
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-4 text-sm text-green-200">
            <p className="font-semibold mb-1">Human Verified ✅</p>
            <p>Every item is manually reviewed by admins before listing. No AI gimmicks — real people ensure quality.</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{loading? 'Loading...': `${sortedItems.length} Items Found`}</h2>
            <div className="flex items-center space-x-2">
              <button onClick={()=>setViewMode('grid')} className={`p-2 rounded-lg ${viewMode==='grid'? 'bg-purple-500/20 text-purple-300': 'hover:bg-white/5'}`}><Grid className="w-4 h-4"/></button>
              <button onClick={()=>setViewMode('list')} className={`p-2 rounded-lg ${viewMode==='list'? 'bg-purple-500/20 text-purple-300': 'hover:bg-white/5'}`}><List className="w-4 h-4"/></button>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                <option value="newest" className="text-black">Newest</option>
                <option value="points-low" className="text-black">Points Low</option>
                <option value="points-high" className="text-black">Points High</option>
              </select>
            </div>
          </div>

          <div className="md:hidden mb-4">
            <input type="text" placeholder="Search..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400"/>
          </div>

          {loading ? <div className="text-center py-20 text-gray-300">Fetching verified items...</div> : currentItems.length===0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-xl mb-2">No items yet</p>
              <p className="text-gray-400 mb-4">Be the first to list! Items appear after admin approval.</p>
              {isLoggedIn && <Link to="/add-item" className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full inline-block">List an Item</Link>}
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode==='grid'? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3':'grid-cols-1'}`}>
              {currentItems.map(item=>(
                <div key={item.id} className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all ${viewMode==='list'? 'flex':''}`}>
                  <Link to={`/item/${item.id}`} className="block flex-1">
                    <div className={`relative ${viewMode==='list'? 'w-48 h-48':'h-64'}`}>
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover"/>
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 rounded-full text-xs font-semibold capitalize">{item.category}</div>
                    </div>
                  </Link>
                  <div className="p-4 flex-1">
                    <Link to={`/item/${item.id}`}><h3 className="font-semibold text-lg">{item.title}</h3></Link>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-400">Size: <span className="text-white">{item.size}</span></span>
                      <span className="text-green-400 capitalize">{item.condition}</span>
                      <span className="text-purple-400 font-bold">{item.points} pts</span>
                    </div>
                    <div className="text-sm text-purple-300 mb-3">by {item.uploader}</div>
                    <div className="flex gap-2">
                      <Link to={`/item/${item.id}`} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 rounded-lg text-center text-sm">View & Swap</Link>
                      <button onClick={()=>handleRedeem(item.id)} disabled={redeeming===item.id} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-2 rounded-lg text-sm disabled:opacity-50">{redeeming===item.id?'...':'Use Points'}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {totalPages>1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50">Prev</button>
              <span className="px-4 py-2 bg-purple-500/20 rounded-lg">{currentPage}/{totalPages}</span>
              <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
