import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { Link } from 'react-router-dom';
import { Shield, Check, X, Shirt, AlertCircle, Eye, Award } from 'lucide-react';

export default function AdminPanel() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [me, setMe] = useState(null);

  const load = async () => {
    setLoading(true);
    const { res: meRes, data: meData } = await apiFetch('/api/accounts/me/');
    if (!meRes.ok) {
      setError('Please login as admin');
      setLoading(false);
      return;
    }
    setMe(meData);
    if (!meData.is_staff) {
      setError('Not an admin. Please login with staff account.');
      setLoading(false);
      return;
    }
    const { res, data } = await apiFetch('/api/items/pending/');
    if (res.ok) setPending(Array.isArray(data) ? data : data.results || []);
    else setError(data?.detail || 'Failed to load pending items');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    const { res, data } = await apiFetch(`/api/items/${id}/approve/`, { method: 'POST' });
    if (res.ok) setPending(p => p.filter(i => i.id !== id));
    else alert(data?.detail || 'Approve failed');
  };
  const reject = async (id) => {
    const reason = prompt('Rejection reason:') || 'Does not meet quality standards - appears worn/damaged';
    const { res, data } = await apiFetch(`/api/items/${id}/reject/`, { method: 'POST', body: { reason } });
    if (res.ok) setPending(p => p.filter(i => i.id !== id));
    else alert(data?.detail || 'Reject failed');
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white">Loading...</div>;

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center text-white p-6">
      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <p className="text-xl mb-4">{error}</p>
      <Link to="/signin" className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full">Go to Login</Link>
      <Link to="/admin" className="mt-3 text-purple-300 underline">Create Admin Account</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Shirt className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ReWear Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm border border-green-400/30 flex items-center"><Shield className="w-4 h-4 mr-1"/>{me?.username}</span>
            <Link to="/landing" className="px-4 py-2 border border-white/20 rounded-full hover:bg-white/10">Browse</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center"><Award className="w-8 h-8 mr-3 text-yellow-400"/>Human Verification Queue</h1>
          <span className="bg-white/10 px-4 py-2 rounded-full">{pending.length} pending</span>
        </div>
        <p className="text-gray-300 mb-6">All listed items require <span className="text-green-300 font-semibold">human verification</span>. Approve only clean, reusable garments. Reject worn/damaged or unusable items with a reason. No AI model used.</p>

        {pending.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <Check className="w-12 h-12 mx-auto text-green-400 mb-3" />
            <p className="text-xl">No pending items. All caught up!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pending.map(item => (
              <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                <div className="h-56 bg-black/20 relative">
                  {item.image_url || item.image ? (
                    <img src={item.image_url || item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <span className="absolute top-3 left-3 bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full text-xs border border-yellow-400/30">Pending Review</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-2">{item.description}</p>
                  <div className="text-sm space-y-1 mb-3 text-gray-400">
                    <div>Category: <span className="text-white">{item.category}</span> • Type: <span className="text-white">{item.type}</span></div>
                    <div>Size: <span className="text-white">{item.size}</span> • Condition: <span className="text-green-300">{item.condition}</span></div>
                    <div>Points: <span className="text-purple-400 font-bold">{item.point_value}</span> • By: <span className="text-purple-300">{item.uploader_username}</span></div>
                    <div>Tags: {item.tags || '-'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approve(item.id)} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 py-2 rounded-lg font-semibold flex items-center justify-center"><Check className="w-4 h-4 mr-1"/>Approve</button>
                    <button onClick={() => reject(item.id)} className="flex-1 bg-red-500/20 border border-red-400/30 py-2 rounded-lg flex items-center justify-center hover:bg-red-500/30"><X className="w-4 h-4 mr-1"/>Reject</button>
                  </div>
                  <Link to={`/item/${item.id}`} className="mt-2 flex items-center justify-center text-sm text-purple-300 hover:text-white"><Eye className="w-4 h-4 mr-1"/>View Detail</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
