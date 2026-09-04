import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp'
import Landing from './pages/Landing';
import User from './pages/User';
import Cart from './pages/cart';
import ReWearAddItem from './pages/RewearAddItem';
import ItemDetailPage from './pages/ItemDetailPage';
import ReWearAdminSignup from './pages/ReWearAdminSignup';
import AdminPanel from './pages/AdminPanel';

const App = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/browse" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user" element={<User />} />
        <Route path="/dashboard" element={<User />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/add-item" element={<ReWearAddItem />} />
        <Route path="/rewearadditem" element={<ReWearAddItem />} />
        <Route path="/admin" element={<ReWearAdminSignup />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
        <Route path="/itemDetailPage/:id" element={<ItemDetailPage />} />
        <Route path="*" element={<Navigate to="/" />} />  
      </Routes>
    </div>
  );
};

export default App;
