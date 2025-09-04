import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Car, Bike, Calendar, User, Check, Building, Shapes, 
  ClipboardCheck, XCircle, MapPin, Star, Shield, Zap, Clock, CreditCard, 
  Phone, Mail, MessageCircle, Bell, Filter, Search, Heart, Share2, 
  Navigation, Fuel, Users, Luggage, Wifi, Bluetooth, Camera, GPS,
  Award, TrendingUp, BarChart3, Eye, CheckCircle2, AlertTriangle,
  Download, FileText, Headphones, Globe
} from 'lucide-react';
import { CircularProgress, Chip, Badge, Avatar, Tooltip, Fab, Zoom, Slide } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Enhanced Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const SUPPORT_PHONE = '+91 98765 43210';
const SUPPORT_EMAIL = 'support@rideease.com';

// Enhanced Vehicle Images with Premium Variants
const VEHICLE_IMAGES = {
  'Swift': 'https://i.postimg.cc/wxRHBsQ4/Picsart-25-09-01-10-13-14-464.png',
  'Alto': 'https://i.postimg.cc/25GhSvZd/Picsart-25-09-01-21-21-37-456.png',
  'Tiago': 'https://i.postimg.cc/0NP7vZb2/Picsart-25-09-01-21-22-38-483.png',
  'Scorpio': 'https://i.postimg.cc/YCsv9H29/Picsart-25-09-01-21-20-16-626.png',
  'XUV500': 'https://i.postimg.cc/LXZLRsz2/Picsart-25-09-01-21-20-35-263.png',
  'Creta': 'https://i.postimg.cc/vmKfpnx0/Picsart-25-09-01-21-20-46-904.png',
  'City': 'https://i.postimg.cc/c1B63Y1P/Picsart-25-09-01-21-19-54-562.png',
  'Verna': 'https://i.postimg.cc/HnRfQ30v/Picsart-25-09-01-10-17-09-430.png',
  'Ciaz': 'https://i.postimg.cc/28H6cDZw/Picsart-25-09-01-21-19-33-817.png',
  'Royal Enfield Classic 350': 'https://i.postimg.cc/8cczBkvt/Picsart-25-09-01-14-57-17-934.png',
  'Avenger 220 Cruise': 'https://i.postimg.cc/DwVqj7hG/Picsart-25-09-01-21-23-05-676.png',
  'Jawa Perak': 'https://i.postimg.cc/RVfMgn3J/Picsart-25-09-01-10-09-53-588.png'
};

// Premium Features Data
const PREMIUM_FEATURES = {
  'Swift': ['GPS Navigation', 'Bluetooth', 'AC', 'Power Steering'],
  'Alto': ['AC', 'Power Steering', 'Central Locking'],
  'Tiago': ['Touchscreen', 'GPS', 'Bluetooth', 'AC', 'Power Windows'],
  'Scorpio': ['4WD', 'Premium Audio', 'Climate Control', 'Leather Seats'],
  'XUV500': ['Sunroof', 'Premium Sound', '4WD', 'Climate Control', 'Touchscreen'],
  'Creta': ['Sunroof', 'Wireless Charging', 'Premium Audio', 'Auto AC'],
  'City': ['Honda Sensing', 'Touchscreen', 'Premium Audio', 'Auto AC'],
  'Verna': ['Ventilated Seats', 'Wireless Charging', 'Premium Audio', 'Auto AC'],
  'Ciaz': ['Smart Hybrid', 'Touchscreen', 'Auto AC', 'Premium Audio'],
  'Royal Enfield Classic 350': ['Classic Design', 'Chrome Finish', 'Single Channel ABS'],
  'Avenger 220 Cruise': ['Cruiser Design', 'Digital Console', 'LED DRL'],
  'Jawa Perak': ['Bobber Style', 'LED Lighting', 'Digital Instrument']
};

// Smart Pricing Algorithm
const DYNAMIC_PRICING = {
  weekend: 1.2,
  holiday: 1.3,
  peak_season: 1.15,
  early_bird: 0.9,
  loyalty: 0.85,
  long_term: 0.8
};

// Smart Notifications System
const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  return { notifications, addNotification };
};

// Enhanced Form Components
const SmartFormInput = ({ id, placeholder, value, onChange, error, icon: Icon, suggestions = [] }) => {
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="relative">
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
        <input 
          id={id} 
          type="text" 
          placeholder={placeholder} 
          value={value} 
          onChange={onChange}
          onFocus={() => { setFocused(true); setShowSuggestions(suggestions.length > 0); }}
          onBlur={() => { setFocused(false); setTimeout(() => setShowSuggestions(false), 200); }}
          className={`w-full ${Icon ? 'pl-10' : ''} pr-4 py-3.5 rounded-lg border-2 bg-gray-50 transition-all duration-300 placeholder:text-gray-500 ${
            error ? 'border-red-500 focus:border-red-500 ring-red-200' : 
            focused ? 'border-blue-500 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
          } focus:outline-none focus:ring-2`}
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
              onClick={() => {
                onChange({ target: { value: suggestion } });
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Premium Vehicle Card with Enhanced Features
const PremiumVehicleCard = ({ model, isSelected, onClick, onFavorite, isFavorite, onShare, viewCount = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const features = PREMIUM_FEATURES[model.name] || [];
  
  const rating = 4.2 + Math.random() * 0.6; // Simulated ratings
  const reviewCount = Math.floor(Math.random() * 200) + 50;

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-xl border-2 cursor-pointer transition-all duration-500 group overflow-hidden transform-gpu ${
        isSelected 
        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 ring-offset-2 shadow-xl scale-[1.02]' 
        : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-2xl hover:-translate-y-2'
      }`}
    >
      {/* Premium Badge */}
      {model.price_per_day > 2000 && (
        <div className="absolute top-3 left-3 z-20">
          <Chip label="Premium" size="small" sx={{ backgroundColor: '#fbbf24', color: 'white', fontWeight: 'bold' }} />
        </div>
      )}
      
      {/* Action Buttons */}
      <div className={`absolute top-3 right-3 z-20 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <Tooltip title="Add to Favorites">
          <div
            onClick={(e) => { e.stopPropagation(); onFavorite(); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </div>
        </Tooltip>
        <Tooltip title="Share">
          <div
            onClick={(e) => { e.stopPropagation(); onShare(); }}
            className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
          </div>
        </Tooltip>
      </div>

      {/* Vehicle Image */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden aspect-video relative">
        <img 
          src={VEHICLE_IMAGES[model.name] || 'https://placehold.co/400x225/e5e7eb/374151?text=Image'} 
          alt={model.name} 
          className={`w-full h-full object-contain p-2 transition-all duration-700 ease-out ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src='https://placehold.co/400x225/e5e7eb/374151?text=Image+Not+Found'; 
            setImageLoaded(true);
          }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <CircularProgress size={40} sx={{ color: '#6b7280' }} />
          </div>
        )}
        
        {/* View Counter */}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {viewCount + Math.floor(Math.random() * 50)}
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-black group-hover:text-blue-600 transition-colors">
              {model.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              </div>
              <span className="text-gray-400 text-sm">({reviewCount} reviews)</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-800 font-bold text-xl">₹{model.price_per_day.toLocaleString()}</p>
            <p className="text-gray-500 text-sm">per day</p>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {features.slice(0, 3).map((feature, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
              {feature}
            </span>
          ))}
          {features.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 font-medium">
              +{features.length - 3} more
            </span>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{Math.floor(Math.random() * 3) + 4} seats</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span>{Math.floor(Math.random() * 5) + 15} km/l</span>
          </div>
          <div className="flex items-center gap-1">
            <Luggage className="w-4 h-4" />
            <span>{Math.floor(Math.random() * 3) + 2} bags</span>
          </div>
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Hover Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent transition-all duration-300 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  );
};

// Smart Notifications Component
const NotificationCenter = ({ notifications }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Slide key={notification.id} direction="left" in timeout={300}>
          <div className={`p-4 rounded-lg shadow-lg backdrop-blur-sm border-l-4 ${
            notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
            notification.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
            'bg-blue-50 border-blue-500 text-blue-800'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {notification.type === 'error' && <XCircle className="w-5 h-5" />}
              {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
              {notification.type === 'info' && <Bell className="w-5 h-5" />}
              <span className="font-medium text-sm">{notification.message}</span>
            </div>
          </div>
        </Slide>
      ))}
    </div>
  );
};

// Enhanced Floating Action Button
const SmartFAB = ({ onContact }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`flex flex-col-reverse gap-3 transition-all duration-300 ${expanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <Tooltip title="Call Support" placement="left">
          <Fab
            size="medium"
            onClick={() => window.open(`tel:${SUPPORT_PHONE}`)}
            sx={{ bgcolor: 'green', color: 'white', '&:hover': { bgcolor: 'darkgreen' } }}
          >
            <Phone className="w-5 h-5" />
          </Fab>
        </Tooltip>
        
        <Tooltip title="Email Support" placement="left">
          <Fab
            size="medium"
            onClick={() => window.open(`mailto:${SUPPORT_EMAIL}`)}
            sx={{ bgcolor: 'blue', color: 'white', '&:hover': { bgcolor: 'darkblue' } }}
          >
            <Mail className="w-5 h-5" />
          </Fab>
        </Tooltip>
        
        <Tooltip title="Live Chat" placement="left">
          <Fab
            size="medium"
            onClick={onContact}
            sx={{ bgcolor: 'purple', color: 'white', '&:hover': { bgcolor: 'darkmagenta' } }}
          >
            <MessageCircle className="w-5 h-5" />
          </Fab>
        </Tooltip>
      </div>
      
      <Fab
        onClick={() => setExpanded(!expanded)}
        sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'gray.800' } }}
        className="relative"
      >
        <Headphones className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </Fab>
    </div>
  );
};

// Main Application
const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  wheels: '',
  vehicleType: '',
  specificModel: '',
  startDate: '',
  endDate: '',
  startDateObj: null,
  endDateObj: null,
  location: '',
  specialRequests: ''
};

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [bookingError, setBookingError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [viewCounts, setViewCounts] = useState({});
  
  const { notifications, addNotification } = useNotifications();

  // Enhanced data fetching with caching
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const cached = localStorage.getItem('vehicleTypes');
        if (cached) {
          setVehicleTypes(JSON.parse(cached));
          return;
        }

        const response = await fetch(`${API_BASE_URL}/vehicle-types`);
        let data = await response.json();
        
        const filteredData = data.filter(type => type.name.toLowerCase() !== 'sports');
        const uniqueTypes = Array.from(new Map(filteredData.map(item => [item.id, item])).values());
        
        setVehicleTypes(uniqueTypes);
        localStorage.setItem('vehicleTypes', JSON.stringify(uniqueTypes));
        
        addNotification('Vehicle data loaded successfully', 'success');
      } catch (error) {
        console.error('Error fetching vehicle types:', error);
        addNotification('Failed to load vehicle types', 'error');
      }
    };
    fetchVehicleTypes();
  }, [addNotification]);

  // Smart vehicle filtering
  const filteredVehicles = useMemo(() => {
    let filtered = vehicles;
    
    if (searchQuery) {
      filtered = filtered.filter(vehicle => 
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    filtered = filtered.filter(vehicle => 
      vehicle.price_per_day >= priceRange[0] && vehicle.price_per_day <= priceRange[1]
    );
    
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter(vehicle => {
        const vehicleFeatures = PREMIUM_FEATURES[vehicle.name] || [];
        return selectedFeatures.every(feature => vehicleFeatures.includes(feature));
      });
    }
    
    return filtered.sort((a, b) => {
      if (favorites.has(a.id) && !favorites.has(b.id)) return -1;
      if (!favorites.has(a.id) && favorites.has(b.id)) return 1;
      return 0;
    });
  }, [vehicles, searchQuery, priceRange, selectedFeatures, favorites]);

  // Enhanced vehicle fetching with analytics
  useEffect(() => {
    if (formData.vehicleType) {
      const fetchVehicles = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/vehicles/${formData.vehicleType}`);
          let data = await response.json();

          const duplicatesToRemove = ['Maruti Swift', 'Mahindra Scorpio', 'Honda City'];
          let cleanedData = data.filter(vehicle => !duplicatesToRemove.includes(vehicle.name));
          const uniqueVehicles = Array.from(new Map(cleanedData.map(item => [item.name, item])).values());

          setVehicles(uniqueVehicles);
          setAllVehicles(prev => {
            const newVehicles = [...prev];
            uniqueVehicles.forEach(v => {
              if (!newVehicles.find(nv => nv.id === v.id)) {
                newVehicles.push(v);
              }
            });
            return newVehicles;
          });

          // Initialize view counts
          const counts = {};
          uniqueVehicles.forEach(v => {
            counts[v.id] = Math.floor(Math.random() * 100) + 50;
          });
          setViewCounts(counts);
          
          addNotification(`Found ${uniqueVehicles.length} vehicles`, 'success');
        } catch (error) {
          console.error('Error fetching vehicles:', error);
          addNotification('Failed to load vehicles', 'error');
        } finally {
          setIsLoading(false);
        }
      };
      fetchVehicles();
    }
  }, [formData.vehicleType, addNotification]);

  // Enhanced validation
  const validateStep = (step) => {
    const newErrors = {};
    switch(step) {
      case 0:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^[+]?[\d\s-()]{10,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone format';
        break;
      case 1:
        if (!formData.wheels) newErrors.wheels = 'Please select the number of wheels';
        break;
      case 2:
        if (!formData.vehicleType) newErrors.vehicleType = 'Please select a vehicle type';
        break;
      case 3:
        if (!formData.specificModel) newErrors.specificModel = 'Please select a specific model';
        break;
      case 4:
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (formData.startDate && formData.endDate && dayjs(formData.startDate).isAfter(dayjs(formData.endDate))) {
          newErrors.dateRange = 'End date must be after start date';
        }
        if (!formData.location.trim()) newErrors.location = 'Pickup location is required';
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced navigation with analytics
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setBookingError(null);
      setIsAnimatingOut(true);
      
      // Track step completion
      addNotification(`Step ${currentStep + 1} completed!`, 'success', 2000);
      
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setErrors({});
        setIsAnimatingOut(false);
      }, 300);
    } else {
      addNotification('Please fill all required fields', 'warning');
    }
  };

  const handlePrev = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setCurrentStep(currentStep - 1);
      setErrors({});
      setIsAnimatingOut(false);
    }, 300);
  };
  
  const handleReset = () => {
    setFormData(initialState);
    setCurrentStep(0);
    setErrors({});
    setBookingError(null);
    setFavorites(new Set());
    addNotification('Ready for a new booking!', 'info');
  };

  // Enhanced submission with smart pricing
  const handleSubmit = async () => {
    if (validateStep(4)) {
      setIsLoading(true);
      try {
        const selectedVehicle = getVehicleInfo(formData.specificModel);
        const rentalDays = formData.endDateObj.diff(formData.startDateObj, 'day') + 1;
        
        // Apply dynamic pricing
        let finalPrice = selectedVehicle.price_per_day * rentalDays;
        if (rentalDays >= 7) finalPrice *= DYNAMIC_PRICING.long_term;
        if (dayjs(formData.startDate).day() === 0 || dayjs(formData.startDate).day() === 6) {
          finalPrice *= DYNAMIC_PRICING.weekend;
        }
        
        const payload = {
          ...formData,
          vehicleId: formData.specificModel,
          estimatedPrice: Math.round(finalPrice),
          bookingId: `BK${Date.now()}`,
          timestamp: new Date().toISOString()
        };
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock response
        const success = Math.random() > 0.1; // 90% success rate
        
        if (success) {
          addNotification('Booking confirmed successfully!', 'success');
          handleNext();
        } else {
          setBookingError('Vehicle temporarily unavailable. Please try another vehicle or different dates.');
        }
      } catch (error) {
        setBookingError('An unexpected error occurred. Please try again.');
        addNotification('Booking failed. Please try again.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Utility functions
  const getVehicleInfo = (id) => allVehicles.find(v => v.id === id);
  
  const toggleFavorite = (vehicleId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(vehicleId)) {
        newFavorites.delete(vehicleId);
        addNotification('Removed from favorites', 'info', 2000);
      } else {
        newFavorites.add(vehicleId);
        addNotification('Added to favorites', 'success', 2000);
      }
      return newFavorites;
    });
  };

  const handleShare = (vehicle) => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this ${vehicle.name}`,
        text: `Amazing ${vehicle.name} for rent at ₹${vehicle.price_per_day}/day`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addNotification('Link copied to clipboard!', 'success', 2000);
    }
  };

  // Smart location suggestions
  const locationSuggestions = [
    'Mumbai Airport', 'Delhi NCR', 'Bangalore City Center', 'Pune Station',
    'Hyderabad Tech City', 'Chennai Central', 'Kolkata Airport', 'Goa Beach Road',
    'Jaipur City Palace', 'Kochi Marine Drive', 'Ahmedabad Railway Station'
  ];

  // Advanced step configuration with enterprise features
  const allSteps = useMemo(() => {
    const selectedVehicle = getVehicleInfo(formData.specificModel);
    const rentalDays = (formData.startDateObj && formData.endDateObj && formData.endDateObj.isAfter(formData.startDateObj, 'day')) 
      ? formData.endDateObj.diff(formData.startDateObj, 'day') + 1
      : 0;
    
    let basePrice = selectedVehicle && rentalDays > 0 ? selectedVehicle.price_per_day * rentalDays : 0;
    let finalPrice = basePrice;
    let discounts = [];
    
    // Apply smart pricing
    if (rentalDays >= 7) {
      const discount = basePrice * (1 - DYNAMIC_PRICING.long_term);
      finalPrice = basePrice * DYNAMIC_PRICING.long_term;
      discounts.push({ name: 'Long-term discount (7+ days)', amount: discount });
    }
    
    if (favorites.has(formData.specificModel)) {
      const loyaltyDiscount = finalPrice * (1 - DYNAMIC_PRICING.loyalty);
      finalPrice *= DYNAMIC_PRICING.loyalty;
      discounts.push({ name: 'Loyalty customer discount', amount: loyaltyDiscount });
    }

    const steps = [
      {
        icon: User,
        label: "Profile",
        title: "Welcome! Let's get your details.",
        subtitle: "We need this information to create your personalized booking experience.",
        component: () => (
          <div className="space-y-6 w-full max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <SmartFormInput 
                  id="firstName" 
                  placeholder="First Name" 
                  value={formData.firstName} 
                  onChange={e => setFormData({...formData, firstName: e.target.value})} 
                  error={errors.firstName}
                  icon={User}
                />
                <SmartFormInput 
                  id="lastName" 
                  placeholder="Last Name" 
                  value={formData.lastName} 
                  onChange={e => setFormData({...formData, lastName: e.target.value})} 
                  error={errors.lastName}
                  icon={User}
                />
              </div>
              <div className="space-y-4">
                <SmartFormInput 
                  id="email" 
                  placeholder="Email Address" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  error={errors.email}
                  icon={Mail}
                />
                <SmartFormInput 
                  id="phone" 
                  placeholder="Phone Number" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  error={errors.phone}
                  icon={Phone}
                />
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2 text-green-700">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Verified Secure</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">Instant Booking</span>
                </div>
                <div className="flex items-center gap-2 text-purple-700">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">Premium Service</span>
                </div>
              </div>
            </div>
            
            {Object.keys(errors).length > 0 && (
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-600 font-medium">Please fill out all required fields correctly</p>
              </div>
            )}
          </div>
        )
      },
      {
        icon: Shapes,
        label: "Type",
        title: `Hi ${formData.firstName}! Choose your adventure style.`,
        subtitle: "What type of journey are you planning?",
        component: () => (
          <div className="w-full max-w-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => setFormData({...formData, wheels: '4', vehicleType: '', specificModel: ''})}
                className={`relative p-8 rounded-2xl border-2 text-center cursor-pointer transition-all duration-500 transform-gpu group ${
                  formData.wheels === '4' 
                  ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-200 scale-105 shadow-xl' 
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:-translate-y-2 hover:shadow-2xl'
                }`}
              >
                <div className="relative">
                  <Car className="w-16 h-16 mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform duration-300"/>
                  <h3 className="font-bold text-2xl text-black mb-2">4 Wheels</h3>
                  <p className="text-gray-600 text-lg">Cars & SUVs</p>
                  <p className="text-sm text-gray-500 mt-2">Perfect for families, long trips, and comfort</p>
                </div>
                {formData.wheels === '4' && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              
              <div 
                onClick={() => setFormData({...formData, wheels: '2', vehicleType: '', specificModel: ''})}
                className={`relative p-8 rounded-2xl border-2 text-center cursor-pointer transition-all duration-500 transform-gpu group ${
                  formData.wheels === '2' 
                  ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-200 scale-105 shadow-xl' 
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:-translate-y-2 hover:shadow-2xl'
                }`}
              >
                <div className="relative">
                  <Bike className="w-16 h-16 mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform duration-300"/>
                  <h3 className="font-bold text-2xl text-black mb-2">2 Wheels</h3>
                  <p className="text-gray-600 text-lg">Motorcycles</p>
                  <p className="text-sm text-gray-500 mt-2">Ideal for city rides, adventure, and freedom</p>
                </div>
                {formData.wheels === '2' && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </div>
            
            {errors.wheels && (
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-red-500 font-medium">{errors.wheels}</p>
              </div>
            )}
          </div>
        )
      },
      {
        icon: Building,
        label: "Category",
        title: "What style matches your vibe?",
        subtitle: "Choose the category that perfectly fits your journey and budget.",
        component: () => (
          <div className="w-full max-w-4xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicleTypes.filter(type => type.wheels == formData.wheels).map((type) => (
                <div 
                  key={type.id}
                  onClick={() => setFormData({...formData, vehicleType: type.id, specificModel: ''})}
                  className={`relative p-6 rounded-xl border-2 text-center cursor-pointer transition-all duration-500 transform-gpu group ${
                    formData.vehicleType === type.id 
                    ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-200 scale-105 shadow-xl' 
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:-translate-y-2 hover:shadow-2xl'
                  }`}
                >
                  <div className="relative">
                    <Building className="w-12 h-12 mx-auto mb-3 text-blue-600 group-hover:scale-110 transition-transform duration-300"/>
                    <h3 className="font-bold text-xl text-black mb-2">{type.name}</h3>
                    <p className="text-gray-500 text-sm">Premium {type.name.toLowerCase()} collection</p>
                  </div>
                  {formData.vehicleType === type.id && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.vehicleType && (
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-red-500 font-medium">{errors.vehicleType}</p>
              </div>
            )}
          </div>
        )
      },
      {
        icon: Car,
        label: "Vehicle",
        title: "Choose your perfect ride.",
        subtitle: `${filteredVehicles.length} premium vehicles available in this category.`,
        component: () => (
          <div className="space-y-8 w-full max-w-6xl">
            {/* Advanced Filters */}
            <div className="flex flex-col sm:flex-row gap-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vehicles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
                  filterOpen ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
                {favorites.size > 0 && (
                  <Badge badgeContent={favorites.size} color="error">
                    <Heart className="w-5 h-5" />
                  </Badge>
                )}
              </button>
            </div>

            {/* Vehicle Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <CircularProgress size={50} sx={{ color: '#3b82f6' }} />
                <p className="text-gray-600 font-medium">Loading premium vehicles...</p>
              </div>
            ) : (
              <>
                {filteredVehicles.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No vehicles found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search terms</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVehicles.map((model) => (
                      <PremiumVehicleCard 
                        key={model.id} 
                        model={model} 
                        isSelected={formData.specificModel === model.id} 
                        onClick={() => {
                          setFormData({...formData, specificModel: model.id});
                          setViewCounts(prev => ({...prev, [model.id]: (prev[model.id] || 0) + 1}));
                        }}
                        onFavorite={() => toggleFavorite(model.id)}
                        isFavorite={favorites.has(model.id)}
                        onShare={() => handleShare(model)}
                        viewCount={viewCounts[model.id] || 0}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            
            {errors.specificModel && (
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-500 font-medium">{errors.specificModel}</p>
              </div>
            )}
          </div>
        )
      },
      {
        icon: Calendar,
        label: "Schedule",
        title: "When do you need your ride?",
        subtitle: "Select your rental dates and pickup location for the best experience.",
        component: () => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="space-y-8 w-full max-w-4xl">
              {/* Date Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Rental Period
                  </h3>
                  <div className="space-y-4">
                    <DatePicker 
                      label="Start Date" 
                      value={formData.startDateObj} 
                      onChange={(newValue) => setFormData({ 
                        ...formData, 
                        startDateObj: newValue, 
                        startDate: newValue ? newValue.format('YYYY-MM-DD') : '',
                        endDateObj: (formData.endDateObj && newValue && formData.endDateObj.isBefore(newValue)) ? null : formData.endDateObj,
                        endDate: (formData.endDateObj && newValue && formData.endDateObj.isBefore(newValue)) ? '' : formData.endDate 
                      })} 
                      minDate={dayjs()} 
                      slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                    />
                    <DatePicker 
                      label="End Date" 
                      value={formData.endDateObj} 
                      onChange={(newValue) => setFormData({ 
                        ...formData, 
                        endDateObj: newValue, 
                        endDate: newValue ? newValue.format('YYYY-MM-DD') : '' 
                      })} 
                      minDate={formData.startDateObj ? formData.startDateObj.add(1, 'day') : dayjs().add(1, 'day')} 
                      disabled={!formData.startDateObj} 
                      slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Pickup Location
                  </h3>
                  <SmartFormInput
                    id="location"
                    placeholder="Enter pickup location"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    error={errors.location}
                    icon={Navigation}
                    suggestions={locationSuggestions.filter(loc => 
                      loc.toLowerCase().includes(formData.location.toLowerCase())
                    )}
                  />
                  <textarea
                    placeholder="Special requests or preferences (optional)"
                    value={formData.specialRequests}
                    onChange={e => setFormData({...formData, specialRequests: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                    rows="3"
                  />
                </div>
              </div>

              {/* Pricing Summary */}
              {rentalDays > 0 && selectedVehicle && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <ClipboardCheck className="w-5 h-5" />
                        Booking Summary
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vehicle:</span>
                          <span className="font-medium text-gray-800">{selectedVehicle.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium text-gray-800">{rentalDays} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Rate:</span>
                          <span className="font-medium text-gray-800">₹{selectedVehicle.price_per_day}/day</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Pricing Breakdown
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">₹{basePrice.toLocaleString()}</span>
                        </div>
                        {discounts.map((discount, index) => (
                          <div key={index} className="flex justify-between text-green-600">
                            <span>{discount.name}:</span>
                            <span>-₹{Math.round(discount.amount).toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between text-lg font-bold text-blue-600">
                            <span>Total Price:</span>
                            <span>₹{Math.round(finalPrice).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {discounts.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-blue-300">
                      <p className="text-sm text-blue-700 font-medium flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        You're saving ₹{Math.round(basePrice - finalPrice).toLocaleString()} with our smart pricing!
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {(errors.dateRange || errors.location) && (
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-500 font-medium">
                    {errors.dateRange || errors.location}
                  </p>
                </div>
              )}
            </div>
          </LocalizationProvider>
        )
      },
      {
        icon: ClipboardCheck,
        label: "Review",
        title: "Almost there! Review your booking.",
        subtitle: "Double-check everything looks perfect before we confirm your premium ride.",
        component: () => (
          <div className="w-full max-w-4xl space-y-8">
            {/* Main Booking Card */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Booking Confirmation</h3>
                    <p className="text-blue-100">Reference: BK{Date.now().toString().slice(-6)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">₹{Math.round(finalPrice).toLocaleString()}</p>
                    <p className="text-blue-100 text-sm">{rentalDays} days total</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Details */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      <User className="w-6 h-6 text-blue-600" />
                      Personal Information
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider font-medium text-gray-500 mb-1">Full Name</p>
                        <p className="font-semibold text-gray-800">{formData.firstName} {formData.lastName}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider font-medium text-gray-500 mb-1">Phone</p>
                        <p className="font-semibold text-gray-800">{formData.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs uppercase tracking-wider font-medium text-gray-500 mb-1">Email</p>
                        <p className="font-semibold text-gray-800">{formData.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      <Car className="w-6 h-6 text-blue-600" />
                      Vehicle Information
                    </div>
                    {selectedVehicle && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={VEHICLE_IMAGES[selectedVehicle.name]} 
                            alt={selectedVehicle.name}
                            className="w-20 h-12 object-contain rounded-lg border border-gray-200"
                            onError={(e) => e.target.src = 'https://placehold.co/80x48/e5e7eb/374151?text=Car'}
                          />
                          <div>
                            <h4 className="font-bold text-lg text-gray-800">{selectedVehicle.name}</h4>
                            <p className="text-gray-600">₹{selectedVehicle.price_per_day}/day</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(PREMIUM_FEATURES[selectedVehicle.name] || []).slice(0, 4).map((feature, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rental Details */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-6">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    Rental Schedule
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                      <p className="text-xs uppercase tracking-wider font-medium text-gray-500">Pickup Date</p>
                      <p className="font-bold text-lg text-gray-800">{dayjs(formData.startDate).format('MMM DD, YYYY')}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <MapPin className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                      <p className="text-xs uppercase tracking-wider font-medium text-gray-500">Pickup Location</p>
                      <p className="font-bold text-lg text-gray-800">{formData.location}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                      <p className="text-xs uppercase tracking-wider font-medium text-gray-500">Return Date</p>
                      <p className="font-bold text-lg text-gray-800">{dayjs(formData.endDate).format('MMM DD, YYYY')}</p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {formData.specialRequests && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Special Requests:</h4>
                    <p className="text-gray-700">{formData.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {bookingError && (
              <div className="p-6 rounded-xl bg-red-50 border-2 border-red-200 text-center space-y-4">
                <div className="flex items-center justify-center text-red-600">
                  <XCircle className="w-8 h-8 mr-3" />
                  <div>
                    <h3 className="font-bold text-lg">Booking Issue</h3>
                    <p className="text-red-700 mt-1">{bookingError}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => setBookingError(null)} 
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => setCurrentStep(3)} 
                    className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Change Vehicle
                  </button>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-sm text-gray-700 space-y-2">
                  <p className="font-semibold text-gray-800">Terms & Conditions</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Valid driving license required for pickup</li>
                    <li>• Security deposit will be collected at pickup</li>
                    <li>• Full tank to full tank fuel policy</li>
                    <li>• 24/7 roadside assistance included</li>
                    <li>• Comprehensive insurance coverage provided</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        icon: CheckCircle2,
        label: "Success",
        title: `Congratulations ${formData.firstName}!`,
        subtitle: "Your booking has been confirmed. Get ready for an amazing ride!",
        component: () => (
          <div className="text-center space-y-8 w-full max-w-2xl">
            {/* Success Animation */}
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <div className="absolute inset-0 w-24 h-24 bg-green-200 rounded-full mx-auto animate-ping opacity-25"></div>
            </div>
            
            {/* Booking Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Confirmed!</h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-semibold">BK{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-semibold">{selectedVehicle?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-green-600">₹{Math.round(finalPrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup Date:</span>
                  <span className="font-semibold">{formData.startDate}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-3">What's Next?</h4>
              <div className="space-y-2 text-sm text-gray-700 text-left">
                <p>✓ Confirmation email sent to {formData.email}</p>
                <p>✓ SMS with pickup details sent to {formData.phone}</p>
                <p>✓ Our team will contact you 2 hours before pickup</p>
                <p>✓ Don't forget to bring your driving license!</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.print()} 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Receipt
              </button>
              <button 
                onClick={handleReset} 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Car className="w-5 h-5" />
                Book Another
              </button>
            </div>

            {/* Support Contact */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Need help? Contact our 24/7 support</p>
              <div className="flex justify-center gap-4">
                <a 
                  href={`tel:${SUPPORT_PHONE}`} 
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Us
                </a>
                <a 
                  href={`mailto:${SUPPORT_EMAIL}`} 
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email Us
                </a>
              </div>
            </div>
          </div>
        )
      }
    ];

    return allSteps;
  }, [formData, selectedVehicle, rentalDays, finalPrice, basePrice, discounts, filteredVehicles, isLoading, errors, bookingError, favorites, searchQuery, filterOpen, viewCounts, locationSuggestions]);

  const currentStepData = allSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">RideEase Premium</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep + 1} of {allSteps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / allSteps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / allSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4 overflow-x-auto">
            <div className="flex items-center space-x-1 sm:space-x-4">
              {allSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={index} className="flex items-center">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive ? 'bg-blue-100 text-blue-700' : 
                      isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive ? 'bg-blue-600 text-white' : 
                        isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                    </div>
                    {index < allSteps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-gray-300 mx-1 sm:mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-500 transform ${
            isAnimatingOut ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
          }`}>
            {/* Step Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                {React.createElement(currentStepData.icon, { 
                  className: "w-12 h-12 text-blue-600" 
                })}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {currentStepData.subtitle}
              </p>
            </div>

            {/* Step Content */}
            <div className="flex justify-center">
              {currentStepData.component()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center mt-12">
              <div className="flex gap-4">
                {currentStep > 0 && (
                  <button 
                    onClick={handlePrev}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>
                )}
                
                {currentStep < allSteps.length - 1 ? (
                  <button 
                    onClick={currentStep === allSteps.length - 2 ? handleSubmit : handleNext}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : currentStep === allSteps.length - 2 ? (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Confirm Booking
                      </>
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                ) : (
                  <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Car className="w-5 h-5" />
                    Book Another Ride
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notifications */}
      <NotificationCenter notifications={notifications} />

      {/* Floating Action Button */}
      <SmartFAB onContact={() => addNotification('Chat support coming soon!', 'info')} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">RideEase Premium</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted partner for premium vehicle rentals across India.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Fleet Overview</p>
                <p>Pricing Plans</p>
                <p>Booking History</p>
                <p>Support Center</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Contact Info</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {SUPPORT_PHONE}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {SUPPORT_EMAIL}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  24/7 Support Available
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Comprehensive Insurance
                </p>
                <p className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Instant Booking
                </p>
                <p className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Premium Fleet
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 RideEase Premium. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
