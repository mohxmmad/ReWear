import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight, Star, ArrowRight, Users, Recycle, Shield, Check, Shirt, Package, Heart } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function ReWearLandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const { res, data } = await apiFetch('/api/accounts/islogin/');
      if (res.ok && (data?.is_logged_in || data?.is_authenticated)) {
        navigate('/add-item');
      } else {
        navigate('/signup');
      }
    } catch (error) {
      navigate('/signup');
    }
  };

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Recycle className="w-8 h-8" />,
      title: "Sustainable Fashion",
      description: "Give your clothes a second life and reduce textile waste through community swapping"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Safe",
      description: "Safe transactions with verified users and moderated item listings"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Connect with fashion lovers in your area and build a sustainable wardrobe"
    }
  ];

  const featuredItems = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      condition: "Excellent",
      size: "M",
      category: "Outerwear",
      points: 120,
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300&h=400&fit=crop",
      uploader: "Sarah M."
    },
    {
      id: 2,
      title: "Designer Silk Scarf",
      condition: "Like New",
      size: "One Size",
      category: "Accessories",
      points: 80,
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=400&fit=crop",
      uploader: "Emma L."
    },
    {
      id: 3,
      title: "Casual Cotton Dress",
      condition: "Good",
      size: "L",
      category: "Dresses",
      points: 95,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop",
      uploader: "Maya K."
    },
    {
      id: 4,
      title: "Leather Ankle Boots",
      condition: "Very Good",
      size: "8",
      category: "Shoes",
      points: 150,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop",
      uploader: "Jessica R."
    }
  ];

  const testimonials = [
    {
      name: "Alexandra Chen",
      role: "Eco-Fashion Enthusiast",
      content: "ReWear has completely transformed my wardrobe! I've discovered amazing pieces while giving my old clothes new homes.",
      rating: 5
    },
    {
      name: "Marcus Thompson",
      role: "Sustainable Living Advocate",
      content: "The point system is brilliant. It's so satisfying to see my unused items earn points for new discoveries.",
      rating: 5
    },
    {
      name: "Isabella Rodriguez",
      role: "Fashion Student",
      content: "As a student, ReWear helps me stay stylish on a budget while being environmentally conscious.",
      rating: 5
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
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
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="hover:text-purple-300 transition-colors">How It Works</a>
              <a href="#featured" className="hover:text-purple-300 transition-colors">Featured Items</a>
              <a href="#community" className="hover:text-purple-300 transition-colors">Community</a>
            </div>
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Swap, Share,
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Sustain Style
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
              Transform your wardrobe sustainably through our community clothing exchange. 
              Discover new styles, earn points, and reduce textile waste together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25">
                Start Swapping
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
              <Link to="/landing">
                <button className="flex items-center px-8 py-4 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
                  <Package className="w-5 h-5 mr-2" />
                  Browse Items
                </button>
              </Link>
            </div>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>4.8/5 Rating</span>
              </div>
              <div>15,000+ Items Swapped</div>
              <div>Join 8,000+ Members</div>
            </div>
          </div>
        </div>
        
        {/* Animated scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/60" />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              How ReWear Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simple steps to start your sustainable fashion journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl backdrop-blur-sm border transition-all duration-500 hover:scale-105 cursor-pointer ${
                  activeFeature === index
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50 shadow-xl shadow-purple-500/10'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`mb-4 p-3 rounded-xl w-fit transition-all duration-300 ${
                  activeFeature === index ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/10'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={handleClick}
              className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 rounded-full font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
            >
              List an Item
              <Heart className="w-5 h-5 ml-2 inline" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section id="featured" className="py-20 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Featured Items
            </h2>
            <p className="text-xl text-gray-300">Discover amazing pieces from our community</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {featuredItems.map((item) => (
                  <div key={item.id} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div className="order-2 md:order-1">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-sm font-semibold">
                              {item.category}
                            </span>
                            <span className="text-2xl font-bold text-purple-400">{item.points} pts</span>
                          </div>
                          <h3 className="text-3xl font-bold mb-3">{item.title}</h3>
                          <div className="space-y-2 mb-6">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Condition:</span>
                              <span className="text-green-400">{item.condition}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Size:</span>
                              <span>{item.size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Shared by:</span>
                              <span className="text-purple-300">{item.uploader}</span>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                              Swap Request
                            </button>
                            <button className="flex-1 border border-white/20 px-6 py-3 rounded-full hover:border-white/40 transition-all duration-300">
                              Redeem via Points
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="order-1 md:order-2">
                        <div className="relative group">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-96 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={prevSlide}
              className="absolute -left-16 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 hover:bg-white/20 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute -right-16 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 hover:bg-white/20 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {featuredItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-purple-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Community Testimonials Section */}
      <section id="community" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our Community Stories
            </h2>
            <p className="text-xl text-gray-300">Real experiences from ReWear members</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">15,000+</div>
              <div className="text-gray-300">Items Swapped</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-400 mb-2">8,000+</div>
              <div className="text-gray-300">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">2.5M</div>
              <div className="text-gray-300">Points Earned</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">95%</div>
              <div className="text-gray-300">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Ready to Start Your Sustainable Fashion Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of fashion lovers making a difference, one swap at a time
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25">
              Start Swapping Today
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
            <Link to="/landing">
              <button className="flex items-center px-8 py-4 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
                <Package className="w-5 h-5 mr-2" />
                Browse Items
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shirt className="w-8 h-8 text-purple-400" />
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ReWear
              </div>
            </div>
            <div className="flex space-x-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Community Guidelines</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; 2025 ReWear. Sustainable fashion for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}