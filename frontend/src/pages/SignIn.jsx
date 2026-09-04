import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shirt, Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function ReWearLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { res, data } = await apiFetch('/api/accounts/login/', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        navigate('/landing');
      } else {
        setError(data?.detail || data?.message || 'Login failed. Please try again.');
      }
    } catch (e) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shirt className="w-8 h-8 text-purple-400" />
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ReWear
              </div>
            </div>
            <div className="flex items-center space-x-4">


            <Link to="/">
              <button className="flex items-center px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Home
              </button>
            </Link>

            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-xl text-gray-300">
              Continue your sustainable fashion journey
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="space-y-6">
              {/* username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-300">
                  username 
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="username"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 text-white placeholder-gray-400"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 text-white placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-white/10 border border-white/20 rounded focus:ring-purple-400 focus:ring-2 text-purple-400"
                  />
                  <span className="ml-2 text-sm text-gray-300">Remember me</span>
                </label>
                <a href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link to="/signup" className="text-purple-400 hover:text-purple-300 transition-colors font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-pulse"></div>
    </div>
  );
}