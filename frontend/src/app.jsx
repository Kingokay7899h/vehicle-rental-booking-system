import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Car, Bike, Calendar, User, Check, MapPin } from 'lucide-react';
import {
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// --- Configuration & API ---
// NOTE: Replace this with your actual backend URL if it's different.
const API_BASE_URL = 'http://localhost:5000/api';

// --- Vehicle Image URLs from your second code ---
const VEHICLE_IMAGES = {
    'Swift': 'https://i.postimg.cc/wxRHBsQ4/Picsart-25-09-01-10-13-14-464.png',
    'Alto': 'https://i.postimg.cc/Znj0KcnC/Picsart-25-09-01-14-13-16-323.png',
    'Tiago': 'https://i.postimg.cc/43TGqc4M/Picsart-25-09-01-14-12-12-034.jpg',
    'Scorpio': 'https://i.postimg.cc/Dw040tqF/Picsart-25-09-01-14-13-29-281.jpg',
    'XUV500': 'https://i.postimg.cc/rFKqrcYh/Picsart-25-09-01-14-12-28-028.png',
    'Creta': 'https://i.postimg.cc/nrwZPwMY/Picsart-25-09-01-14-12-52-696.jpg',
    'City': 'https://i.postimg.cc/TPczsH4L/Picsart-25-09-01-14-11-50-815.png',
    'Verna': 'https://i.postimg.cc/HnRfQ30v/Picsart-25-09-01-10-17-09-430.png',
    'Ciaz': 'https://i.postimg.cc/qR55VfXR/Picsart-25-09-01-14-11-34-415.png',
    'Royal Enfield Classic 350': 'https://i.postimg.cc/8cczBkvt/Picsart-25-09-01-14-57-17-934.png',
    'Avenger 220 Cruise': 'https://i.postimg.cc/m28Fbb18/Picsart-25-09-01-14-13-45-020.png',
    'Jawa Perak': 'https://i.postimg.cc/RVfMgn3J/Picsart-25-09-01-10-09-53-588.png'
};

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    wheels: '',
    vehicleType: '',
    specificModel: '',
    startDate: '',
    endDate: '',
    startDateObj: null,
    endDateObj: null
  });
  const [errors, setErrors] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);

  // --- LOGIC FROM FIRST CODE (UNCHANGED) ---
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/vehicle-types`);
        const data = await response.json();
        setVehicleTypes(data);
      } catch (error) {
        console.error('Error fetching vehicle types:', error);
      }
    };
    fetchVehicleTypes();
  }, []);

  useEffect(() => {
    if (formData.vehicleType) {
      const fetchVehicles = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/vehicles/${formData.vehicleType}`);
          const data = await response.json();
          setVehicles(data);
          setAllVehicles(prev => {
            const newVehicles = [...prev];
            data.forEach(v => {
              if (!newVehicles.find(nv => nv.id === v.id)) {
                newVehicles.push(v);
              }
            });
            return newVehicles;
          });
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
          setIsLoading(false);
        }
      };
      fetchVehicles();
    }
  }, [formData.vehicleType]);

  const validateStep = (step) => {
    const newErrors = {};
    switch(step) {
      case 0:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        break;
      case 1:
        if (!formData.wheels) newErrors.wheels = 'Please select number of wheels';
        break;
      case 2:
        if (!formData.vehicleType) newErrors.vehicleType = 'Please select vehicle type';
        break;
      case 3:
        if (!formData.specificModel) newErrors.specificModel = 'Please select a specific model';
        break;
      case 4:
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
          newErrors.dateRange = 'End date must be after start date';
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(currentStep - 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleSubmit = async () => {
    if (validateStep(4)) {
      setIsLoading(true);
      try {
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          vehicleId: formData.specificModel,
          startDate: formData.startDate,
          endDate: formData.endDate
        };
        const response = await fetch(`${API_BASE_URL}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        setIsLoading(false);
        if (response.ok) {
          alert('Booking submitted successfully! 🎉');
          console.log('Booking Result:', result);
          setCurrentStep(currentStep + 1); 
        } else {
          alert(`Booking Failed: ${result.message}`);
          console.error('Booking failed:', result.message);
        }
      } catch (error) {
        setIsLoading(false);
        alert('An error occurred during booking. Please try again.');
        console.error('Error submitting booking:', error);
      }
    }
  };

  const getVehicleName = (id) => {
    const vehicle = allVehicles.find(v => v.id === id);
    return vehicle ? vehicle.name : 'Unknown Vehicle';
  };

  // --- UI COMPONENTS (IMPROVED STYLING & IMAGES) ---
  const steps = [
    {
      title: "What's your name?",
      subtitle: "Let's start with the basics",
      icon: <User className="w-8 h-8" />,
      component: () => (
        <div className="space-y-6 w-full max-w-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <input id="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className={`w-full px-4 py-3.5 rounded-xl border-2 bg-gray-50 transition-all duration-300 placeholder:text-gray-500 ${errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'} focus:outline-none focus:ring-4`} />
             <input id="lastName" type="text" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className={`w-full px-4 py-3.5 rounded-xl border-2 bg-gray-50 transition-all duration-300 placeholder:text-gray-500 ${errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'} focus:outline-none focus:ring-4`} />
          </div>
           {(errors.firstName || errors.lastName) && <p className="text-red-500 text-sm text-center">⚠️ Please fill out both first and last name.</p>}
        </div>
      )
    },
    {
      title: "How many wheels?",
      subtitle: "Choose your ride preference",
      icon: <Car className="w-8 h-8" />,
      component: () => (
        <div className="w-full max-w-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { value: '4', label: '4 Wheeler', icon: '🚗', desc: 'Cars & SUVs' },
              { value: '2', label: '2 Wheeler', icon: '🏍️', desc: 'Bikes & Motorcycles' }
            ].map((option) => (
              <div
                key={option.value}
                onClick={() => setFormData({...formData, wheels: option.value, vehicleType: '', specificModel: ''})}
                className={`p-6 rounded-2xl border-2 text-center cursor-pointer transition-all duration-300 transform-gpu group ${
                  formData.wheels === option.value
                    ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-100'
                    : 'border-gray-200 bg-white hover:border-indigo-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10'
                }`}
              >
                <div className="text-5xl mb-3">{option.icon}</div>
                <h3 className="font-bold text-lg text-gray-800">{option.label}</h3>
                <p className="text-gray-500 text-sm">{option.desc}</p>
              </div>
            ))}
          </div>
          {errors.wheels && <p className="text-red-500 text-sm flex items-center gap-1 justify-center">⚠️ {errors.wheels}</p>}
        </div>
      )
    },
    {
      title: "Type of vehicle",
      subtitle: "What style fits your journey?",
      icon: formData.wheels === '2' ? <Bike className="w-8 h-8" /> : <Car className="w-8 h-8" />,
      component: () => (
         <div className="w-full max-w-2xl space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vehicleTypes.filter(type => type.wheels == formData.wheels).map((type) => (
              <div
                key={type.id}
                onClick={() => setFormData({...formData, vehicleType: type.id, specificModel: ''})}
                className={`p-6 rounded-2xl border-2 text-center cursor-pointer transition-all duration-300 transform-gpu group ${
                  formData.vehicleType === type.id
                    ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-100'
                    : 'border-gray-200 bg-white hover:border-indigo-400 hover:-translate-y-1 hover:shadow-lg'
                }`}
              >
                <h3 className="font-bold text-lg text-gray-800">{type.name}</h3>
              </div>
            ))}
          </div>
          {errors.vehicleType && <p className="text-red-500 text-sm flex items-center gap-1 justify-center">⚠️ {errors.vehicleType}</p>}
        </div>
      )
    },
    {
      title: "Choose your ride",
      subtitle: "Pick the perfect vehicle for your trip",
      icon: <MapPin className="w-8 h-8" />,
      component: () => (
        <div className="space-y-6 w-full max-w-4xl">
          {isLoading ? (
            <div className="flex justify-center items-center h-48"><CircularProgress size={40} sx={{ color: '#4f46e5' }} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[450px] overflow-y-auto p-2">
              {vehicles.map((model) => (
                <div
                  key={model.id}
                  onClick={() => setFormData({...formData, specificModel: model.id})}
                  className={`rounded-2xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden ${
                    formData.specificModel === model.id
                      ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-100'
                      : 'border-gray-200 bg-white hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1'
                  }`}
                >
                  <div className="bg-gray-100 overflow-hidden">
                    
                    <img src={VEHICLE_IMAGES[model.name]} alt={model.name} className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-500 ease-in-out"/>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{model.name}</h3>
                      <p className="text-indigo-600 font-medium">₹{model.price_per_day}/day</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      formData.specificModel === model.id ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 bg-white'
                    }`}>
                      {formData.specificModel === model.id && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {errors.specificModel && <p className="text-red-500 text-sm flex items-center gap-1 justify-center">⚠️ {errors.specificModel}</p>}
        </div>
      )
    },
    {
      title: "When do you need it?",
      subtitle: "Select your travel dates",
      icon: <Calendar className="w-8 h-8" />,
      component: () => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="space-y-6 w-full max-w-xl">
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center', justifyContent: 'center' }}>
              <DatePicker
                label="Start Date"
                value={formData.startDateObj}
                onChange={(newValue) => {
                  setFormData({
                    ...formData, 
                    startDateObj: newValue,
                    startDate: newValue ? newValue.format('YYYY-MM-DD') : '',
                    endDateObj: (formData.endDateObj && newValue && formData.endDateObj.isBefore(newValue)) ? null : formData.endDateObj,
                    endDate: (formData.endDateObj && newValue && formData.endDateObj.isBefore(newValue)) ? '' : formData.endDate
                  });
                }}
                minDate={dayjs()}
                slotProps={{ textField: { error: !!errors.startDate, helperText: errors.startDate, fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: '12px' } } } }}
              />
               <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}> to </Typography>
              <DatePicker
                label="End Date"
                value={formData.endDateObj}
                onChange={(newValue) => {
                  setFormData({
                    ...formData, 
                    endDateObj: newValue,
                    endDate: newValue ? newValue.format('YYYY-MM-DD') : ''
                  });
                }}
                minDate={formData.startDateObj ? formData.startDateObj.add(1, 'day') : dayjs()}
                disabled={!formData.startDateObj}
                slotProps={{ textField: { error: !!errors.endDate, helperText: errors.endDate, fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: '12px' } } } }}
              />
            </Box>
            {(formData.startDateObj && formData.endDateObj && formData.endDateObj.isAfter(formData.startDateObj)) && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Typography variant="body1" color="text.secondary">
                    Total Duration: <span className="font-bold text-gray-800">{formData.endDateObj.diff(formData.startDateObj, 'day')} day(s)</span>
                  </Typography>
                </Paper>
              </Box>
            )}
            {errors.dateRange && <p className="text-red-500 text-sm flex items-center gap-1 justify-center">⚠️ {errors.dateRange}</p>}
          </div>
        </LocalizationProvider>
      )
    }
  ];

  const ConfirmationStep = () => (
    <div className="text-center space-y-4 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Review Your Booking</h2>
        <p className="text-gray-500 text-lg">Please confirm the details below before booking.</p>
        <Paper 
            elevation={0} 
            sx={{ p: { xs: 2, sm: 4 }, borderRadius: '16px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', textAlign: 'left' }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
                <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Full Name</p><p className="font-semibold text-gray-900">{formData.firstName} {formData.lastName}</p></div>
                <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Vehicle</p><p className="font-semibold text-gray-900">{getVehicleName(formData.specificModel)}</p></div>
                <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Start Date</p><p className="font-semibold text-gray-900">{dayjs(formData.startDate).format('MMM DD, YYYY')}</p></div>
                <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">End Date</p><p className="font-semibold text-gray-900">{dayjs(formData.endDate).format('MMM DD, YYYY')}</p></div>
                <div className="md:col-span-2 mt-2 pt-3 border-t"><p className="text-center text-lg">Total Duration: <span className="font-bold text-indigo-600">{dayjs(formData.endDate).diff(dayjs(formData.startDate), 'day')} days</span></p></div>
            </div>
        </Paper>
    </div>
  );

  const SuccessStep = () => (
    <div className="text-center space-y-4 py-8">
        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h2>
        <p className="text-gray-500 text-lg max-w-md mx-auto">Thank you, {formData.firstName}! Your booking for the {getVehicleName(formData.specificModel)} is complete. We've sent a confirmation to your email.</p>
    </div>
  );
  
  const allSteps = [...steps, 
    { title: "Confirm", subtitle: "Almost there!", icon: <Check className="w-8 h-8" />, component: ConfirmationStep },
    { title: "Done!", subtitle: "Enjoy your ride!", icon: <Check className="w-8 h-8" />, component: SuccessStep }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans antialiased">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Vehicle Rental Booking
          </h1>
          <p className="text-gray-500 text-lg">Find your perfect ride in just a few steps</p>
        </div>
        
        <div className="mb-10 px-4 hidden sm:block">
            <div className="flex items-center">
                {allSteps.slice(0, 6).map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 z-10 ${
                                index < currentStep ? 'bg-green-500 text-white' : index === currentStep ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' : 'bg-gray-200 text-gray-400'
                                }`}
                            >
                                {index < currentStep ? <Check className="w-6 h-6" /> : <span className="font-semibold text-lg">{index + 1}</span>}
                            </div>
                            <p className={`mt-2 text-sm text-center font-semibold ${index <= currentStep ? 'text-indigo-600' : 'text-gray-500'}`}>{step.title}</p>
                        </div>
                        {index < 5 && (
                            <div className={`flex-auto border-t-2 transition-all duration-500 ${index < currentStep ? 'border-indigo-600' : 'border-gray-200'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-900/10 p-6 sm:p-10">
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600">
                  {allSteps[currentStep]?.icon}
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">
                {allSteps[currentStep]?.title}
              </h2>
              <p className="text-gray-500 text-lg">{allSteps[currentStep]?.subtitle}</p>
            </div>
            <div className="mb-8 min-h-[300px] flex items-center justify-center">
              {allSteps[currentStep]?.component()}
            </div>
            
            {/* --- NAVIGATION BUTTONS --- */}
            {currentStep < allSteps.length - 1 && (
                 <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200">
                 <Button
                   onClick={handlePrev}
                   disabled={currentStep === 0}
                   startIcon={<ChevronLeft className="w-5 h-5" />}
                   variant="text"
                   sx={{ textTransform: 'none', fontSize: '16px', fontWeight: 600, color: '#4b5563', borderRadius: '12px', padding: '10px 20px', '&:hover': { backgroundColor: '#f3f4f6' }, '&:disabled': { color: '#d1d5db' } }}
                 >
                   Back
                 </Button>
                 {currentStep < allSteps.length - 2 ? (
                   <Button
                     onClick={handleNext}
                     endIcon={<ChevronRight className="w-5 h-5" />}
                     variant="contained"
                     sx={{ 
                         textTransform: 'none', fontSize: '16px', fontWeight: 600, 
                         backgroundColor: '#4f46e5', borderRadius: '12px', 
                         padding: '12px 32px', boxShadow: '0 4px 14px 0 rgb(79 70 229 / 39%)',
                         '&:hover': { backgroundColor: '#4338ca', transform: 'translateY(-2px)', boxShadow: '0 6px 20px 0 rgb(79 70 229 / 39%)' } 
                     }}
                   >
                     Next Step
                   </Button>
                 ) : (
                   <Button
                     onClick={handleSubmit}
                     disabled={isLoading}
                     endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Check className="w-5 h-5" />}
                     variant="contained"
                     sx={{ 
                         textTransform: 'none', fontSize: '16px', fontWeight: 600, 
                         backgroundColor: '#10b981', borderRadius: '12px',
                         padding: '12px 32px', boxShadow: '0 4px 14px 0 rgb(16 185 129 / 39%)',
                         '&:hover': { backgroundColor: '#059669', transform: 'translateY(-2px)', boxShadow: '0 6px 20px 0 rgb(16 185 129 / 39%)' }, 
                         '&:disabled': { backgroundColor: '#a7f3d0' } 
                     }}
                   >
                     {isLoading ? 'Booking...' : 'Confirm & Book'}
                   </Button>
                 )}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
