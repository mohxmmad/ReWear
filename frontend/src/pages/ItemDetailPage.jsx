import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Star, Heart, Package, Shield, Truck, CheckCircle, Clock, AlertCircle, Eye, Share2 } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myItems, setMyItems] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState('');
  const [msg, setMsg] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [swapping, setSwapping] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await apiFetch('/api/accounts/islogin/');
      const logged = !!data?.is_authenticated;
      setIsLoggedIn(logged);
      if (logged) {
        const { res, data: me } = await apiFetch('/api/accounts/me/');
        if (res.ok) setUserPoints(me.points);
        const { res: r2, data: d2 } = await apiFetch('/api/items/my/');
        if (r2.ok) setMyItems(Array.isArray(d2)? d2 : d2.results||[]);
      }
      const { res, data: it } = await apiFetch(`/api/items/${id}/`);
      if (res.ok) setItem(it);
      setLoading(false);
    };
    init();
  }, [id]);

  const handleRedeem = async () => {
    if (!isLoggedIn) { navigate('/signin'); return; }
    setRedeeming(true);
    setMsg('');
    const { res, data } = await apiFetch('/api/redeem/redeem/', { method:'POST', body:{ item_id: item.id }});
    if (res.ok) { setMsg('Redeemed successfully! Check dashboard.'); setItem({ ...item, status:'redeemed'}); }
    else setMsg(data?.detail || 'Redeem failed');
    setRedeeming(false);
  };
  const handleSwap = async () => {
    if (!isLoggedIn) { navigate('/signin'); return; }
    if (!selectedOffer) { setMsg('Select an item to offer'); return; }
    setSwapping(true);
    const { res, data } = await apiFetch('/api/swaps/request/', { method:'POST', body:{ item_offered: Number(selectedOffer), item_requested: item.id }});
    if (res.ok) setMsg('Swap request sent!');
    else setMsg(data?.detail || JSON.stringify(data) || 'Swap failed');
    setSwapping(false);
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white">Loading...</div>;
  if (!item) return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white">Item not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={()=>window.history.back()} className="p-2 hover:bg-white/10 rounded-full"><ArrowLeft className="w-5 h-5"/></button>
            <Link to="/" className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-purple-400"/>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ReWear</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {isLoggedIn && <div className="bg-purple-500/20 px-4 py-2 rounded-full border border-purple-400/30 flex items-center"><Award className="w-4 h-4 mr-2 text-purple-400"/>{userPoints} pts</div>}
            <Link to="/landing" className="px-4 py-2 border border-white/20 rounded-full">Browse</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <img src={item.image_url || item.image || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600'} alt={item.title} className="w-full h-[500px] object-cover rounded-xl"/>
          <div className="mt-4 flex gap-2">
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-400/30">{item.category}</span>
            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">{item.condition}</span>
            <span className={`px-3 py-1 rounded-full text-sm border ${item.status==='available' ? 'bg-green-500/20 text-green-300 border-green-400/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'}`}>{item.status}</span>
          </div>
          {!item.approved && <div className="mt-3 bg-yellow-500/10 border border-yellow-400/20 p-3 rounded-xl text-sm text-yellow-200 flex items-center"><Clock className="w-4 h-4 mr-2"/>Pending human verification</div>}
          {item.status==='redeemed' && <div className="mt-3 bg-red-500/10 border border-red-400/20 p-3 rounded-xl text-sm text-red-200">Redeemed / Swapped – not available</div>}
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
            <p className="text-gray-300 mb-4">{item.description || 'No description'}</p>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="bg-white/5 p-3 rounded-xl"><div className="text-gray-400">Size</div><div className="font-semibold">{item.size}</div></div>
              <div className="bg-white/5 p-3 rounded-xl"><div className="text-gray-400">Type</div><div className="font-semibold">{item.type}</div></div>
              <div className="bg-white/5 p-3 rounded-xl"><div className="text-gray-400">Points</div><div className="font-bold text-purple-400 text-xl">{item.point_value}</div></div>
              <div className="bg-white/5 p-3 rounded-xl"><div className="text-gray-400">Uploader</div><div className="font-semibold text-purple-300">{item.uploader_username}</div></div>
            </div>
            <div className="text-sm text-gray-400 mb-4">Tags: {item.tags || '-'}</div>
            <div className="flex items-center gap-2 text-sm text-green-300"><Shield className="w-4 h-4"/>Human verified • Quality checked</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            {!isLoggedIn ? (
              <div className="text-center py-4">
                <p className="mb-4">Please login to swap or redeem</p>
                <Link to="/signin" className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-full inline-block">Login</Link>
              </div>
            ) : item.status !== 'available' ? (
              <div className="text-center text-yellow-300 py-4">Item not available</div>
            ) : (
              <>
                <h3 className="font-semibold mb-3">Actions</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <button onClick={handleRedeem} disabled={redeeming} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 py-3 rounded-xl font-semibold disabled:opacity-50">{redeeming? 'Processing...': `Redeem for ${item.point_value} pts`}</button>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <label className="text-sm font-medium">Offer item for swap</label>
                    <select value={selectedOffer} onChange={e=>setSelectedOffer(e.target.value)} className="w-full mt-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                      <option value="" className="text-black">Select your item</option>
                      {myItems.filter(mi=> mi.status==='available' && mi.approved).map(mi=> <option key={mi.id} value={mi.id} className="text-black">{mi.title} ({mi.point_value} pts)</option>)}
                    </select>
                    {myItems.length===0 && <p className="text-xs text-gray-400 mt-2">You have no approved items to offer. <Link to="/add-item" className="text-purple-400 underline">List one</Link></p>}
                    <button onClick={handleSwap} disabled={swapping} className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-xl font-semibold disabled:opacity-50">{swapping? 'Sending...': 'Send Swap Request'}</button>
                  </div>
                  {msg && <div className="bg-white/10 p-3 rounded-xl text-sm">{msg}</div>}
                </div>
              </>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-2 flex items-center"><Truck className="w-4 h-4 mr-2"/>Details</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Free shipping • 7-day return</li>
              <li>• Human verified – admin approved</li>
              <li>• Points credited on approval & redemption</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
