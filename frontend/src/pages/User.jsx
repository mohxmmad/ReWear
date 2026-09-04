import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Plus, Award, Package, RefreshCw, CheckCircle, Heart, Eye, Trash2, Star } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function ReWearUserDashboard(){
  const [activeTab, setActiveTab]=useState('overview');
  const [me, setMe]=useState(null);
  const [myItems, setMyItems]=useState([]);
  const [swaps, setSwaps]=useState([]);
  const [redemptions, setRedemptions]=useState([]);
  const [loading, setLoading]=useState(true);

  const load = async ()=>{
    setLoading(true);
    const { res: r1, data: d1} = await apiFetch('/api/accounts/me/');
    if (r1.ok) setMe(d1);
    const { res: r2, data: d2} = await apiFetch('/api/items/my/');
    if (r2.ok) setMyItems(Array.isArray(d2)? d2: d2.results||[]);
    const { res: r3, data: d3} = await apiFetch('/api/swaps/');
    if (r3.ok) setSwaps(Array.isArray(d3)? d3: d3.results||[]);
    const { res: r4, data: d4} = await apiFetch('/api/redeem/');
    if (r4.ok) setRedemptions(Array.isArray(d4)? d4: d4.results||[]);
    setLoading(false);
  };
  useEffect(()=>{ load(); },[]);

  const deleteItem = async(id)=>{
    if(!confirm('Delete this item?')) return;
    const { res } = await apiFetch(`/api/items/${id}/`, { method:'DELETE'});
    if(res.ok) setMyItems(p=>p.filter(i=>i.id!==id));
    else alert('Delete failed');
  };

  const logout = async()=>{
    await apiFetch('/api/accounts/logout/', { method:'POST'});
    window.location.href='/';
  };

  if(loading) return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white">Loading dashboard...</div>;
  if(!me) return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center text-white p-6"><p className="text-xl mb-4">Please login</p><Link to="/signin" className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full">Login</Link></div>;

  const stats = {
    totalPoints: me.points,
    itemsListed: myItems.length,
    approved: myItems.filter(i=>i.approved).length,
    pending: myItems.filter(i=>!i.approved && i.status==='pending').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ReWear</Link>
          <div className="flex items-center gap-4">
            <div className="bg-purple-500/20 px-4 py-2 rounded-full border border-purple-400/30 flex items-center"><Award className="w-4 h-4 mr-2"/>{me.points} pts</div>
            <button onClick={logout} className="px-4 py-2 border border-white/20 rounded-full">Logout</button>
            <Link to="/add-item" className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg flex items-center"><Plus className="w-4 h-4 mr-1"/>Add Item</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl font-bold">{me.username[0].toUpperCase()}</div>
          <div>
            <h1 className="text-2xl font-bold">{me.username}</h1>
            <p className="text-gray-400">{me.email} • {me.is_staff? 'Admin': 'Member'}</p>
          </div>
          {me.is_staff && <Link to="/admin/panel" className="ml-auto bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 px-4 py-2 rounded-full text-sm">Admin Panel</Link>}
        </div>

        <div className="flex gap-2 mb-8 bg-white/5 p-2 rounded-xl border border-white/10 w-fit flex-wrap">
          {[{id:'overview',label:'Overview'},{id:'items',label:'My Items'},{id:'swaps',label:'Swaps'},{id:'redemptions',label:'Redemptions'}].map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)} className={`px-4 py-2 rounded-lg ${activeTab===t.id? 'bg-purple-500/20 text-purple-300 border border-purple-400/30': 'hover:bg-white/5'}`}>{t.label}</button>
          ))}
        </div>

        {activeTab==='overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6"><div className="text-gray-400 text-sm">Points</div><div className="text-2xl font-bold text-purple-400">{stats.totalPoints}</div></div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6"><div className="text-gray-400 text-sm">Total Items</div><div className="text-2xl font-bold">{stats.itemsListed}</div></div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6"><div className="text-gray-400 text-sm">Approved</div><div className="text-2xl font-bold text-green-400">{stats.approved}</div></div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6"><div className="text-gray-400 text-sm">Pending Review</div><div className="text-2xl font-bold text-yellow-400">{stats.pending}</div></div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold mb-3">Recent Items</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {myItems.slice(0,3).map(it=>(
                  <div key={it.id} className="bg-black/20 rounded-xl p-3">
                    <img src={it.image_url || it.image} alt={it.title} className="w-full h-32 object-cover rounded-lg mb-2"/>
                    <div className="font-semibold truncate">{it.title}</div>
                    <div className="text-sm text-gray-400">{it.category} • {it.point_value} pts • <span className={it.approved? 'text-green-400':'text-yellow-400'}>{it.approved? 'Approved': it.status}</span></div>
                  </div>
                ))}
                {myItems.length===0 && <p className="text-gray-400">No items yet. <Link to="/add-item" className="text-purple-400 underline">List one</Link></p>}
              </div>
            </div>
          </div>
        )}

        {activeTab==='items' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center"><h2 className="text-xl font-bold">My Items ({myItems.length})</h2><Link to="/add-item" className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg">Add New</Link></div>
            <div className="grid md:grid-cols-3 gap-4">
              {myItems.map(it=>(
                <div key={it.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <img src={it.image_url || it.image || 'https://via.placeholder.com/300'} alt={it.title} className="w-full h-40 object-cover"/>
                  <div className="p-4">
                    <h3 className="font-semibold">{it.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{it.category} • {it.size} • {it.condition}</p>
                    <div className="flex justify-between text-sm mb-2"><span className="text-purple-400 font-bold">{it.point_value} pts</span><span className={`px-2 py-1 rounded-full text-xs border ${it.approved? 'bg-green-500/20 text-green-300 border-green-400/30': it.status==='rejected'? 'bg-red-500/20 text-red-300 border-red-400/30':'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'}`}>{it.approved? 'Approved': it.status}</span></div>
                    {it.rejection_reason && <div className="text-xs text-red-300 mb-2">Reason: {it.rejection_reason}</div>}
                    <div className="flex gap-2">
                      <Link to={`/item/${it.id}`} className="flex-1 bg-white/10 py-1 rounded-lg text-center text-sm flex items-center justify-center"><Eye className="w-3 h-3 mr-1"/>View</Link>
                      <button onClick={()=>deleteItem(it.id)} className="flex-1 bg-red-500/20 text-red-300 py-1 rounded-lg text-sm flex items-center justify-center"><Trash2 className="w-3 h-3 mr-1"/>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab==='swaps' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Swaps ({swaps.length})</h2>
            {swaps.length===0? <p className="text-gray-400">No swaps yet</p> : swaps.map(s=>(
              <div key={s.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between"><span>{s.from_username} → {s.to_username}</span><span className={`px-2 py-1 rounded-full text-xs ${s.status==='pending'?'bg-yellow-500/20 text-yellow-300': s.status==='accepted'?'bg-green-500/20 text-green-300':'bg-red-500/20 text-red-300'}`}>{s.status}</span></div>
                <div className="text-sm text-gray-300">Offered: {s.item_offered_title} • Requested: {s.item_requested_title}</div>
                {s.to_username===me.username && s.status==='pending' && (
                  <div className="mt-2 flex gap-2">
                    <button onClick={async()=>{ const {res}= await apiFetch(`/api/swaps/${s.id}/status/`,{method:'POST',body:{status:'accepted'}}); if(res.ok) load(); }} className="bg-green-500/20 border border-green-400/30 px-4 py-1 rounded-lg text-sm">Accept</button>
                    <button onClick={async()=>{ const {res}= await apiFetch(`/api/swaps/${s.id}/status/`,{method:'POST',body:{status:'declined'}}); if(res.ok) load(); }} className="bg-red-500/20 border border-red-400/30 px-4 py-1 rounded-lg text-sm">Decline</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab==='redemptions' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Redemptions ({redemptions.length})</h2>
            {redemptions.length===0? <p className="text-gray-400">No redemptions</p> : redemptions.map(r=>(
              <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between">
                <div><div className="font-semibold">{r.item_title}</div><div className="text-sm text-gray-400">{new Date(r.created_at).toLocaleDateString()}</div></div>
                <div className="text-purple-400 font-bold">{r.points_spent} pts</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
