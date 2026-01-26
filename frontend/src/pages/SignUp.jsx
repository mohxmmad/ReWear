import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft, User, Sparkles } from 'lucide-react';

export default function ReWearRegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/accounts/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken()
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
        'credentials': 'include'
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Welcome to ReWear!');
        window.location.href = 'http://localhost:5173/landing';
        // Redirect or store token here
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shirt className="w-8 h-8 text-purple-400" />
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ReWear</div>
          </div>
          <Link to="/">
            <button className="flex items-center px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300">
              <ChevronLeft className="w-4 h-4 mr-2" /> Back to Home
            </button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-400 mr-2" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Join ReWear
              </h1>
              <Sparkles className="w-8 h-8 text-pink-400 ml-2" />
            </div>
            <p className="text-xl text-gray-300 mb-2">Welcome to the future of sustainable fashion!</p>
            <p className="text-lg text-purple-300">✨ Start your eco-friendly wardrobe journey today ✨</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your first name"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your last name"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Choose a username"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Create a password"
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start">
              <input type="checkbox" required className="w-4 h-4 mt-1 bg-white/10 border border-white/20 rounded" />
              <span className="ml-2 text-sm text-gray-300">
                I agree to the{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              )}
            </button>
          </div>

          {/* Already have account */}
          <div className="text-center mt-8 text-gray-300">
            Already have an account?{' '}
            <Link to="/signin" className="text-purple-400 hover:text-purple-300 font-semibold">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
