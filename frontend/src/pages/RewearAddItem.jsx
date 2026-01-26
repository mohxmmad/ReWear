import React, { useState } from 'react';
import {
  ArrowLeft,
  Upload,
  Camera,
  X,
  Plus,
  Tag,
  Package,
  MapPin,
  Star,
  Info,
  Check,
  AlertCircle,
  Eye,
  Heart
} from 'lucide-react';

export default function ReWearAddItem() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    brand: '',
    size: '',
    condition: '',
    description: '',
    point_value: '',
    color: '',
    material: '',
    tags: [],
    images: []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const categories = {
    'Clothing': ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Activewear', 'Swimwear', 'Underwear'],
    'Shoes': ['Sneakers', 'Boots', 'Heels', 'Flats', 'Sandals', 'Athletic'],
    'Accessories': ['Bags', 'Jewelry', 'Watches', 'Sunglasses', 'Belts', 'Scarves', 'Hats'],
    'Beauty': ['Makeup', 'Skincare', 'Fragrance', 'Hair Care', 'Tools']
  };

  const subcategories = {
    'Tops': ['T-Shirts', 'Blouses', 'Sweaters', 'Hoodies', 'Tank Tops'],
    'Bottoms': ['Jeans', 'Skirts', 'Shorts', 'Leggings', 'Trousers'],
  }

  const conditions = [
    { value: 'new', label: 'New with Tags', description: 'Never worn, tags attached' },
    { value: 'like-new', label: 'Like New', description: 'Worn once or twice, excellent condition' },
    { value: 'excellent', label: 'Excellent', description: 'Minor signs of wear, great condition' },
    { value: 'good', label: 'Good', description: 'Some wear, still in good shape' },
    { value: 'fair', label: 'Fair', description: 'Noticeable wear, but still wearable' }
  ];

  const sizes = {
    'Clothing': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20'],
    'Shoes': ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    'Accessories': ['One Size', 'Small', 'Medium', 'Large'],
    'Beauty': ['Travel Size', 'Full Size', 'Deluxe Sample']
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'category' ? { subcategory: '', size: '' } : {})
    }));
  };



  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 8) // Max 8 images
    }));
  };

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const calculatePointValue = () => {
    let basePoints = 50;

    // Condition multiplier
    const conditionMultiplier = {
      'new': 1.5,
      'like-new': 1.3,
      'excellent': 1.1,
      'good': 1.0,
      'fair': 0.8
    };

    // Category multiplier
    const categoryMultiplier = {
      'Clothing': 1.0,
      'Shoes': 1.2,
      'Accessories': 0.8,
      'Beauty': 0.6
    };

    const points = Math.round(basePoints *
      (conditionMultiplier[formData.condition] || 1) *
      (categoryMultiplier[formData.category] || 1));

    return points;
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
    // Validate required fields
    if (!formData.title || !formData.category || !formData.condition) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare form data for API
      const apiData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.subcategory,
        size: formData.size,
        condition: formData.condition,
        tags: formData.tags.join(','),
        point_value: calculatePointValue(),
        image: formData.images.length > 0 ? formData.images[0].url : null
      };

      const response = await fetch('http://localhost:8000/api/items/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken()
        },
        body: JSON.stringify(apiData),
        'credentials': 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitStatus({ type: 'success', message: 'Item published successfully!' });
        // Optionally reset form or redirect
        setTimeout(() => {
          // Reset form or navigate away
        }, 2000);
      } else {
        throw new Error('Failed to publish item');
      }
    } catch (error) {
      console.error('Error submitting item:', error);
      setSubmitStatus({ type: 'error', message: 'Failed to publish item. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ItemPreview = () => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      <div className="relative">
        {formData.images.length > 0 ? (
          <img src={formData.images[0].url} alt={formData.title} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Package className="w-16 h-16 text-white/50" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-400/30">
            new
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1">{formData.title || 'Item Title'}</h3>
        <p className="text-gray-400 text-sm mb-3">{formData.category || 'Category'}</p>
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-purple-400 font-bold">{calculatePointValue()} pts</span>
          <div className="flex items-center space-x-3 text-gray-400">
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              <span>0</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-3 h-3 mr-1" />
              <span>0</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-sm border border-blue-400/30">
            Preview
          </button>
        </div>
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
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">Add New Item</h1>
                <p className="text-sm text-gray-400">Share your fashion finds with the community</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Publish Item</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Status Message */}
      {submitStatus && (
        <div className={`max-w-7xl mx-auto px-6 pt-4`}>
          <div className={`p-4 rounded-lg border flex items-center space-x-3 ${submitStatus.type === 'success'
            ? 'bg-green-500/20 border-green-400/30 text-green-300'
            : 'bg-red-500/20 border-red-400/30 text-red-300'
            }`}>
            {submitStatus.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{submitStatus.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Photos ({formData.images.length}/8)
              </h3>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive
                  ? 'border-purple-400 bg-purple-500/10'
                  : 'border-white/20 hover:border-white/30'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-300 mb-2">Drag and drop images here, or click to browse</p>
                <p className="text-sm text-gray-400 mb-4">JPG, PNG, GIF up to 10MB each</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer inline-block"
                >
                  Choose Files
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {formData.images.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      {index === 0 && (
                        <div className="absolute top-1 left-1 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                          Main
                        </div>
                      )}
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Item Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Vintage Denim Jacket"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  {/* CATEGORY */}
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="" className="text-black bg-white">Select Category</option>
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat} className="text-black bg-white">
                        {cat}
                      </option>
                    ))}
                  </select>

                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subcategory</label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    disabled={!formData.category}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400 transition-colors disabled:opacity-50"
                  >
                    <option value="" className="text-black bg-white">Select Subcategory</option>

                    {(categories[formData.category] || []).map(sub => (
                      <option key={sub} value={sub} className="text-black bg-white">
                        {sub}
                      </option>
                    ))}
                  </select>


                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="e.g., Nike, Zara, Vintage"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Size</label>
                  <select
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="" className="text-black bg-white">Select Size</option>

                    {(sizes[formData.category] || []).map(size => (
                      <option key={size} value={size} className="text-black bg-white">
                        {size}
                      </option>
                    ))}
                  </select>

                </div>
              </div>
            </div>

            {/* Condition & Details */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Condition & Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Condition *</label>
                  <div className="space-y-2">
                    {conditions.map(condition => (
                      <label key={condition.value} className="flex items-center p-3 border border-white/20 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="condition"
                          value={condition.value}
                          checked={formData.condition === condition.value}
                          onChange={(e) => handleInputChange('condition', e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">{condition.label}</div>
                          <div className="text-sm text-gray-400">{condition.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="e.g., Navy Blue, Black, Multicolor"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Material</label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => handleInputChange('material', e.target.value)}
                      placeholder="e.g., Cotton, Denim, Leather"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your item, its fit, styling tips, or any special features..."
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Tags
              </h3>

              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map(tag => (
                  <span key={tag} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center border border-purple-400/30">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-red-300 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add tags (e.g., vintage, designer, summer)"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400 transition-colors"
                />
                <button
                  onClick={addTag}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <ItemPreview />
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Point Value</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {calculatePointValue()} pts
                </div>
                <p className="text-sm text-gray-400">
                  Estimated based on category and condition
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
                Tips for Success
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Use high-quality, well-lit photos</li>
                <li>• Include multiple angles and close-ups</li>
                <li>• Be honest about condition and flaws</li>
                <li>• Add detailed measurements if helpful</li>
                <li>• Use relevant tags for better discovery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}