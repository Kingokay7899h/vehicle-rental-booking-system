import React, { useState, useEffect, useMemo } from 'react';
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

// --- Vehicle Image URLs ---
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

  const getVehicleInfo = (id) => {
    return allVehicles.find(v => v.id === id);
  };

  // --- DYNAMIC STEP CONFIGURATION FOR PERSONALIZATION ---
  const allSteps = useMemo(() => {
    const selectedVehicle = getVehicleInfo(formData.specificModel);
    const rentalDays = (formData.startDateObj && formData.endDateObj && formData.endDateObj.isAfter(formData.startDateObj)) 
      ? formData.endDateObj.diff(formData.startDateObj, 'day') 
      : 0;
    const totalPrice = selectedVehicle && rentalDays > 0 ? selectedVehicle.price_per_day * rentalDays : 0;

    const steps = [
      {
        title: "What's your name?",
        subtitle: "Let's start with the basics.",
        component: () => (
          <div className="space-y-6 w-full max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input id="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className={`w-full px-4 py-3.5 rounded-lg border-2 bg-gray-100 transition-all duration-300 placeholder:text-gray-500 ${errors.firstName ? 'border-red-500 focus:border-red-500 ring-red-200' : 'border-gray-200 focus:border-black ring-gray-200'} focus:outline-none focus:ring-2`} />
              <input id="lastName" type="text" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className={`w-full px-4 py-3.5 rounded-lg border-2 bg-gray-100 transition-all duration-300 placeholder:text-gray-500 ${errors.lastName ? 'border-red-500 focus:border-red-500 ring-red-200' : 'border-gray-200 focus:border-black ring-gray-200'} focus:outline-none focus:ring-2`} />
            </div>
            {(errors.firstName || errors.lastName) && <p className="text-red-500 text-sm text-center pt-2">⚠️ Please fill out both first and last name.</p>}
          </div>
        )
      },
      {
        title: `Okay, ${formData.firstName || 'friend'}! What's your ride type?`,
        subtitle: "Choose your preferred number of wheels.",
        component: () => (
          <div className="w-full max-w-lg space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[ { value: '4', label: '4 Wheels', icon: '🚗', desc: 'Cars & SUVs' }, { value: '2', label: '2 Wheels', icon: '🏍️', desc: 'Motorcycles' } ].map((option) => (
                <div key={option.value} onClick={() => setFormData({...formData, wheels: option.value, vehicleType: '', specificModel: ''})} className={`p-6 rounded-lg border-2 text-center cursor-pointer transition-all duration-300 transform-gpu group ${ formData.wheels === option.value ? 'border-black bg-gray-100' : 'border-gray-200 bg-white hover:border-gray-400 hover:-translate-y-1 hover:shadow-lg' }`}>
                  <div className="text-5xl mb-3">{option.icon}</div>
                  <h3 className="font-bold text-lg text-black">{option.label}</h3>
                  <p className="text-gray-500 text-sm">{option.desc}</p>
                </div>
              ))}
            </div>
            {errors.wheels && <p className="text-red-500 text-sm flex items-center gap-1 justify-center pt-2">⚠️ {errors.wheels}</p>}
          </div>
        )
      },
      {
        title: "Vehicle Category",
        subtitle: "What style fits your journey?",
        component: () => (
          <div className="w-full max-w-2xl space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {vehicleTypes.filter(type => type.wheels == formData.wheels).map((type) => (
                <div key={type.id} onClick={() => setFormData({...formData, vehicleType: type.id, specificModel: ''})} className={`p-6 rounded-lg border-2 text-center cursor-pointer transition-all duration-300 transform-gpu group ${ formData.vehicleType === type.id ? 'border-black bg-gray-100' : 'border-gray-200 bg-white hover:border-gray-400 hover:-translate-y-1 hover:shadow-lg' }`}>
                  <h3 className="font-bold text-lg text-black">{type.name}</h3>
                </div>
              ))}
            </div>
            {errors.vehicleType && <p className="text-red-500 text-sm flex items-center gap-1 justify-center pt-2">⚠️ {errors.vehicleType}</p>}
          </div>
        )
      },
      {
        title: "Choose your ride",
        subtitle: "Pick the perfect vehicle for your trip.",
        component: () => (
          <div className="space-y-6 w-full max-w-4xl">
            {isLoading ? <div className="flex justify-center items-center h-48"><CircularProgress size={40} sx={{ color: '#000000' }} /></div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[450px] overflow-y-auto p-2">
                {vehicles.map((model) => (
                  <div key={model.id} onClick={() => setFormData({...formData, specificModel: model.id})} className={`rounded-lg border-2 cursor-pointer transition-all duration-300 group overflow-hidden ${ formData.specificModel === model.id ? 'border-black bg-gray-100' : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-lg hover:-translate-y-1'}`}>
                    <div className="bg-gray-100 overflow-hidden aspect-video"><img src={VEHICLE_IMAGES[model.name]} alt={model.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"/></div>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg text-black">{model.name}</h3>
                        <p className="text-gray-700 font-semibold">₹{model.price_per_day}/day</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${ formData.specificModel === model.id ? 'border-black bg-black' : 'border-gray-300 bg-white' }`}>{formData.specificModel === model.id && <Check className="w-4 h-4 text-white" />}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {errors.specificModel && <p className="text-red-500 text-sm flex items-center gap-1 justify-center pt-2">⚠️ {errors.specificModel}</p>}
          </div>
        )
      },
      {
        title: `Almost there, ${formData.firstName || 'friend'}!`,
        subtitle: "Select your rental dates.",
        component: () => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="space-y-6 w-full max-w-xl">
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                <DatePicker label="Start Date" value={formData.startDateObj} onChange={(newValue) => setFormData({ ...formData, startDateObj: newValue, startDate: newValue ? newValue.format('YYYY-MM-DD') : '', endDateObj: (formData.endDateObj && newValue && formData.endDateObj.isBefore(newValue)) ? null : formData.endDateObj, endDate: (formData.endDateObj && newValue && formData.endDateObj.isBefore(newValue)) ? '' : formData.endDate })} minDate={dayjs()} slotProps={{ textField: { error: !!errors.startDate, helperText: errors.startDate, fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#f3f4f6' } } } }}/>
                <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}> → </Typography>
                <DatePicker label="End Date" value={formData.endDateObj} onChange={(newValue) => setFormData({ ...formData, endDateObj: newValue, endDate: newValue ? newValue.format('YYYY-MM-DD') : '' })} minDate={formData.startDateObj ? formData.startDateObj.add(1, 'day') : dayjs()} disabled={!formData.startDateObj} slotProps={{ textField: { error: !!errors.endDate, helperText: errors.endDate, fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#f3f4f6' } } } }}/>
              </Box>
              {rentalDays > 0 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#f3f4f6' }}>
                    <Typography variant="body1" color="text.secondary">
                      Total Duration: <span className="font-bold text-black">{rentalDays} day(s)</span>
                    </Typography>
                    {totalPrice > 0 && (
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold', color: 'black' }}>
                        Estimated Price: ₹{totalPrice.toLocaleString()}
                      </Typography>
                    )}
                  </Paper>
                </Box>
              )}
              {errors.dateRange && <p className="text-red-500 text-sm flex items-center gap-1 justify-center pt-2">⚠️ {errors.dateRange}</p>}
            </div>
          </LocalizationProvider>
        )
      },
      {
        title: "Confirm Your Booking",
        subtitle: "One last check before we go.",
        component: () => (
          <div className="text-center space-y-4 w-full max-w-2xl">
              <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', textAlign: 'left' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
                      <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Full Name</p><p className="font-semibold text-black">{formData.firstName} {formData.lastName}</p></div>
                      <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Vehicle</p><p className="font-semibold text-black">{selectedVehicle?.name || 'N/A'}</p></div>
                      <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Start Date</p><p className="font-semibold text-black">{dayjs(formData.startDate).format('MMM DD, YYYY')}</p></div>
                      <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">End Date</p><p className="font-semibold text-black">{dayjs(formData.endDate).format('MMM DD, YYYY')}</p></div>
                      <div className="sm:col-span-2 mt-2 pt-3 border-t">
                        <p className="text-center text-lg text-gray-600">Total Duration: <span className="font-bold text-black">{rentalDays} days</span></p>
                        <p className="text-center text-xl font-bold text-black">Total Price: ₹{totalPrice.toLocaleString()}</p>
                      </div>
                  </div>
              </Paper>
          </div>
        )
      },
      {
        title: "Booking Confirmed!",
        subtitle: "Get ready for your adventure.",
        component: () => (
          <div className="text-center space-y-4 py-8">
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-12 h-12 text-green-600" />
              </div>
              <p className="text-gray-500 text-lg max-w-md mx-auto">Thank you, {formData.firstName}! Your booking for the {selectedVehicle?.name} is complete.</p>
          </div>
        )
      }
    ];
    return steps;
  }, [formData, errors, isLoading, vehicleTypes, vehicles, allVehicles]);


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans antialiased">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
            Book Your Ride
          </h1>
          <p className="text-gray-500 text-lg">Simple, fast, and reliable rentals.</p>
        </div>
        
        {/* -- Progress Bar -- */}
        <div className="mb-10 px-4 hidden sm:block">
            <div className="flex items-center">
                {allSteps.slice(0, 6).map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center z-10">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ${ index < currentStep ? 'bg-green-500 text-white' : index === currentStep ? 'bg-black text-white scale-110' : 'bg-gray-200 text-gray-500' }`}>
                                {index < currentStep ? <Check className="w-5 h-5" /> : <span className="font-semibold text-md">{index + 1}</span>}
                            </div>
                        </div>
                        {index < 5 && ( <div className={`flex-auto h-1 -mx-1 transition-all duration-500 ${index < currentStep ? 'bg-black' : 'bg-gray-200'}`}></div> )}
                    </React.Fragment>
                ))}
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-gray-900/10 p-6 sm:p-10">
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-black mb-1">
                {allSteps[currentStep]?.title}
              </h2>
              <p className="text-gray-500 text-lg">{allSteps[currentStep]?.subtitle}</p>
            </div>
            <div className="mb-8 min-h-[300px] flex items-center justify-center">
              {allSteps[currentStep]?.component()}
            </div>
            
            {/* --- NAVIGATION BUTTONS --- */}
            {currentStep < allSteps.length - 1 && (
                 <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-100">
                 <Button onClick={handlePrev} disabled={currentStep === 0} variant="text" sx={{ textTransform: 'none', fontSize: '16px', fontWeight: 600, color: '#000000', borderRadius: '8px', padding: '12px 24px', '&:disabled': { color: '#9ca3af' } }}>
                   Back
                 </Button>
                 {currentStep < allSteps.length - 2 ? (
                   <Button onClick={handleNext} endIcon={<ChevronRight className="w-5 h-5" />} variant="contained" sx={{ textTransform: 'none', fontSize: '16px', fontWeight: 600, color: 'white', backgroundColor: '#000000', borderRadius: '8px', padding: '12px 32px', boxShadow: 'none', '&:hover': { backgroundColor: '#333333', transform: 'translateY(-2px)' } }}>
                     Next
                   </Button>
                 ) : (
                   <Button onClick={handleSubmit} disabled={isLoading} endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Check className="w-5 h-5" />} variant="contained" sx={{ textTransform: 'none', fontSize: '16px', fontWeight: 600, color: 'white', backgroundColor: '#000000', borderRadius: '8px', padding: '12px 32px', boxShadow: 'none', '&:hover': { backgroundColor: '#333333', transform: 'translateY(-2px)' }, '&:disabled': { backgroundColor: '#9ca3af' } }}>
                     {isLoading ? 'Booking...' : 'Confirm & Book'}
                   </Button>
                 )}
               </div>
            )}
          </div>
        </div>
        <footer className="text-center mt-8">
            <p className="text-gray-400 text-sm">Powered by Gemini Rentals</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
