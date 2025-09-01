import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Car, Bike, Calendar, User, Check, Building, Shapes, NotebookPen } from 'lucide-react';
import { CircularProgress } from '@mui/material';
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

// --- Custom Components for Clean UI ---

const FormInput = ({ id, placeholder, value, onChange, error }) => (
    <div className="relative">
        <input 
            id={id} 
            type="text" 
            placeholder={placeholder} 
            value={value} 
            onChange={onChange}
            className={`w-full px-4 py-3.5 rounded-lg bg-gray-800/50 border-2 text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-cyan-400 focus:ring-cyan-400'}`} 
        />
    </div>
);

const SelectionCard = ({ isSelected, onClick, children }) => (
    <div 
        onClick={onClick} 
        className={`relative p-6 rounded-xl border-2 text-center cursor-pointer transition-all duration-300 transform-gpu group ${ 
            isSelected 
            ? 'border-cyan-400 bg-gray-800/60 ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-gray-900' 
            : 'border-gray-700 bg-gray-800/40 hover:border-gray-500 hover:-translate-y-1 hover:bg-gray-800/80' 
        }`}
    >
        {children}
        {isSelected && (
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center border-2 border-gray-900">
                <Check className="w-4 h-4 text-black" />
            </div>
        )}
    </div>
);

const VehicleCard = ({ model, isSelected, onClick }) => (
    <div 
        onClick={onClick}
        className={`relative rounded-xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden ${
            isSelected 
            ? 'border-cyan-400 bg-gray-800/60 ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-gray-900' 
            : 'border-gray-700 bg-gray-800/40 hover:border-gray-500 hover:-translate-y-1'
        }`}
    >
        <div className="bg-gray-900/50 overflow-hidden aspect-video">
            <img 
                src={VEHICLE_IMAGES[model.name] || 'https://placehold.co/400x225/111827/FFF?text=Image'} 
                alt={model.name} 
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-in-out"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x225/111827/FFF?text=Image+Not+Found'; }}
            />
        </div>
        <div className="p-4 bg-gray-800/40">
            <h3 className="font-bold text-lg text-white">{model.name}</h3>
            <p className="text-cyan-300 font-semibold text-base">₹{model.price_per_day.toLocaleString()}/day</p>
        </div>
        {isSelected && (
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center border-2 border-gray-900">
                <Check className="w-4 h-4 text-black" />
            </div>
        )}
    </div>
);

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
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);

  // --- LOGIC FROM ORIGINAL CODE (UNCHANGED) ---
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
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setErrors({});
        setIsAnimatingOut(false);
      }, 300);
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
          handleNext();
        } else {
          alert(`Booking Failed: ${result.message}`);
        }
      } catch (error) {
        setIsLoading(false);
        alert('An error occurred during booking. Please try again.');
      }
    }
  };

  const getVehicleInfo = (id) => allVehicles.find(v => v.id === id);

  // --- DYNAMIC STEP CONFIGURATION FOR NEW UI ---
  const allSteps = useMemo(() => {
    const selectedVehicle = getVehicleInfo(formData.specificModel);
    const rentalDays = (formData.startDateObj && formData.endDateObj && formData.endDateObj.isAfter(formData.startDateObj)) 
      ? formData.endDateObj.diff(formData.startDateObj, 'day') + 1
      : 0;
    const totalPrice = selectedVehicle && rentalDays > 0 ? selectedVehicle.price_per_day * rentalDays : 0;

    const steps = [
      {
        icon: User,
        label: "Details",
        title: "Let's start with your name.",
        subtitle: "We need this to personalize your booking.",
        component: () => (
          <div className="space-y-6 w-full max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput id="firstName" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} error={errors.firstName} />
              <FormInput id="lastName" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} error={errors.lastName} />
            </div>
            {(errors.firstName || errors.lastName) && <p className="text-red-400 text-sm text-center pt-2">Please fill out both first and last name.</p>}
          </div>
        )
      },
      {
        icon: Shapes,
        label: "Type",
        title: `Hi ${formData.firstName}! Choose your ride style.`,
        subtitle: "How many wheels will you be needing?",
        component: () => (
          <div className="w-full max-w-lg space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectionCard isSelected={formData.wheels === '4'} onClick={() => setFormData({...formData, wheels: '4', vehicleType: '', specificModel: ''})}>
                    <Car className="w-12 h-12 mx-auto mb-3 text-cyan-300"/>
                    <h3 className="font-bold text-lg text-white">4 Wheels</h3>
                    <p className="text-gray-400 text-sm">Cars & SUVs</p>
                </SelectionCard>
                <SelectionCard isSelected={formData.wheels === '2'} onClick={() => setFormData({...formData, wheels: '2', vehicleType: '', specificModel: ''})}>
                    <Bike className="w-12 h-12 mx-auto mb-3 text-cyan-300"/>
                    <h3 className="font-bold text-lg text-white">2 Wheels</h3>
                    <p className="text-gray-400 text-sm">Motorcycles</p>
                </SelectionCard>
            </div>
            {errors.wheels && <p className="text-red-400 text-sm text-center pt-2">{errors.wheels}</p>}
          </div>
        )
      },
      {
        icon: Building,
        label: "Category",
        title: "What kind of vehicle fits?",
        subtitle: "Select the category that suits your journey.",
        component: () => (
          <div className="w-full max-w-2xl space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {vehicleTypes.filter(type => type.wheels == formData.wheels).map((type) => (
                <SelectionCard key={type.id} isSelected={formData.vehicleType === type.id} onClick={() => setFormData({...formData, vehicleType: type.id, specificModel: ''})}>
                  <h3 className="font-bold text-lg text-white py-4">{type.name}</h3>
                </SelectionCard>
              ))}
            </div>
            {errors.vehicleType && <p className="text-red-400 text-sm text-center pt-2">{errors.vehicleType}</p>}
          </div>
        )
      },
      {
        icon: Car,
        label: "Model",
        title: "Choose your specific ride.",
        subtitle: "Here are the available models in this category.",
        component: () => (
          <div className="space-y-6 w-full max-w-4xl">
            {isLoading ? <div className="flex justify-center items-center h-48"><CircularProgress sx={{ color: '#67e8f9' }} /></div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[450px] overflow-y-auto p-2 -mr-2 pr-4">
                {vehicles.map((model) => (
                  <VehicleCard key={model.id} model={model} isSelected={formData.specificModel === model.id} onClick={() => setFormData({...formData, specificModel: model.id})} />
                ))}
              </div>
            )}
            {errors.specificModel && <p className="text-red-400 text-sm text-center pt-2">{errors.specificModel}</p>}
          </div>
        )
      },
      {
        icon: Calendar,
        label: "Dates",
        title: "When do you need it?",
        subtitle: "Select your rental start and end dates.",
        component: () => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="space-y-6 w-full max-w-xl">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <DatePicker label="Start Date" value={formData.startDateObj} onChange={(newValue) => setFormData({ ...formData, startDateObj: newValue, startDate: newValue ? newValue.format('YYYY-MM-DD') : '', endDateObj: (formData.endDateObj && newValue && formData.endDateObj.isBefore(newValue)) ? null : formData.endDateObj, endDate: (formData.endDateObj && newValue && formData.endDateObj.isBefore(newValue)) ? '' : formData.endDate })} minDate={dayjs()} slotProps={{ textField: { fullWidth: true } }}/>
                <DatePicker label="End Date" value={formData.endDateObj} onChange={(newValue) => setFormData({ ...formData, endDateObj: newValue, endDate: newValue ? newValue.format('YYYY-MM-DD') : '' })} minDate={formData.startDateObj ? formData.startDateObj.add(1, 'day') : dayjs().add(1, 'day')} disabled={!formData.startDateObj} slotProps={{ textField: { fullWidth: true } }}/>
              </div>
              {rentalDays > 0 && (
                <div className="text-center mt-2">
                  <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 inline-block">
                    <p className="text-gray-300">
                      Total Duration: <span className="font-bold text-white">{rentalDays} day(s)</span>
                    </p>
                    {totalPrice > 0 && (
                      <p className="text-xl mt-1 font-bold text-cyan-300">
                        Estimated Price: ₹{totalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {errors.dateRange && <p className="text-red-400 text-sm text-center pt-2">{errors.dateRange}</p>}
            </div>
          </LocalizationProvider>
        )
      },
      {
        icon: NotebookPen,
        label: "Confirm",
        title: "Confirm Your Booking",
        subtitle: "One final check before we finalize your ride.",
        component: () => (
          <div className="w-full max-w-2xl">
              <div className="p-6 sm:p-8 rounded-xl bg-gray-800/50 border border-gray-700 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 text-gray-300">
                      <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Full Name</p><p className="font-semibold text-white text-lg">{formData.firstName} {formData.lastName}</p></div>
                      <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Vehicle</p><p className="font-semibold text-white text-lg">{selectedVehicle?.name || 'N/A'}</p></div>
                      <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Start Date</p><p className="font-semibold text-white text-lg">{dayjs(formData.startDate).format('MMM DD, YYYY')}</p></div>
                      <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">End Date</p><p className="font-semibold text-white text-lg">{dayjs(formData.endDate).format('MMM DD, YYYY')}</p></div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                    <p className="text-gray-400">Total Duration: <span className="font-bold text-white">{rentalDays} days</span></p>
                    <p className="text-2xl font-bold text-cyan-300 mt-1">Total Price: ₹{totalPrice.toLocaleString()}</p>
                  </div>
              </div>
          </div>
        )
      },
      {
        icon: Check,
        label: "Done",
        title: "Booking Confirmed!",
        subtitle: `Get ready for your adventure, ${formData.firstName}.`,
        component: () => (
          <div className="text-center space-y-4 py-8">
              <div className="w-24 h-24 mx-auto bg-green-500/10 rounded-full flex items-center justify-center ring-4 ring-green-500/20">
                  <Check className="w-12 h-12 text-green-400" />
              </div>
              <p className="text-gray-300 text-lg max-w-md mx-auto">Your booking for the <span className="font-bold text-white">{selectedVehicle?.name}</span> is complete. We've sent the details to your email.</p>
          </div>
        )
      }
    ];
    return steps;
  }, [formData, errors, isLoading, vehicleTypes, vehicles, allVehicles]);


  return (
    <>
    <style>{`
      .MuiOutlinedInput-root {
        background-color: rgba(31, 41, 55, 0.5) !important;
        border-radius: 8px !important;
      }
      .MuiOutlinedInput-notchedOutline {
        border-color: #4b5563 !important;
      }
      .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
        border-color: #6b7280 !important;
      }
      .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: #22d3ee !important;
      }
      .MuiInputLabel-root {
        color: #9ca3af !important;
      }
      .MuiInputLabel-root.Mui-focused {
        color: #22d3ee !important;
      }
      .MuiSvgIcon-root {
        color: #9ca3af !important;
      }
      .MuiInputBase-input {
        color: white !important;
      }
      .MuiDateCalendar-root {
        background-color: #1f2937 !important;
        color: white !important;
      }
      .MuiDayCalendar-weekDayLabel {
        color: #9ca3af !important;
      }
      .MuiPickersDay-root {
        color: white !important;
      }
      .MuiPickersDay-root:not(.Mui-selected) {
        border-color: #4b5563 !important;
      }
      .MuiPickersDay-root.Mui-selected {
        background-color: #06b6d4 !important;
        color: black !important;
      }
      .MuiPickersDay-today {
        border-color: #22d3ee !important;
      }
      .MuiDialogActions-root .MuiButton-text {
        color: #22d3ee !important;
      }
    `}</style>
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 font-sans antialiased overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-gray-700/[0.2] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      <div className="relative max-w-5xl mx-auto z-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tighter">
            Book Your Perfect Ride
          </h1>
          <p className="text-gray-400 text-lg">Fast, Simple, and Secure Rentals.</p>
        </header>
        
        {/* -- Progress Bar -- */}
        <div className="mb-10 px-4 hidden sm:block">
            <div className="flex items-center">
                {allSteps.slice(0, 6).map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center z-10 text-center">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 border-2 ${ index < currentStep ? 'bg-cyan-400 border-cyan-400' : index === currentStep ? 'bg-gray-800 border-cyan-400 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-gray-800 border-gray-700' }`}>
                                {index < currentStep ? <Check className="w-6 h-6 text-black" /> : <step.icon className={`w-6 h-6 transition-colors ${index === currentStep ? 'text-cyan-400' : 'text-gray-500'}`} />}
                            </div>
                            <p className={`mt-2 text-xs font-semibold transition-colors ${index === currentStep ? 'text-white' : 'text-gray-500'}`}>{step.label}</p>
                        </div>
                        {index < 5 && ( <div className={`flex-auto h-0.5 -mx-1 transition-all duration-500 ${index < currentStep ? 'bg-cyan-400' : 'bg-gray-700'}`}></div> )}
                    </React.Fragment>
                ))}
            </div>
        </div>

        <main className="bg-gray-800/40 rounded-2xl shadow-2xl shadow-black/20 p-6 sm:p-10 border border-gray-700 backdrop-blur-sm">
          <div className={`transition-all duration-300 ease-in-out ${isAnimatingOut ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <header className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">
                {allSteps[currentStep]?.title}
              </h2>
              <p className="text-gray-400 text-lg">{allSteps[currentStep]?.subtitle}</p>
            </header>
            <div className="mb-8 min-h-[300px] flex items-center justify-center">
              {allSteps[currentStep]?.component()}
            </div>
            
            {/* --- NAVIGATION BUTTONS --- */}
            {currentStep < allSteps.length - 1 && (
                 <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-700/50">
                    <button 
                        onClick={handlePrev} 
                        disabled={currentStep === 0} 
                        className="mt-4 sm:mt-0 text-gray-400 font-semibold rounded-lg px-6 py-3 transition-colors hover:text-white disabled:opacity-30 disabled:hover:text-gray-400"
                    >
                        Back
                    </button>
                    {currentStep < allSteps.length - 2 ? (
                        <button 
                            onClick={handleNext} 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-400 text-black font-bold rounded-lg px-8 py-3.5 transition-all duration-300 ease-in-out hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transform hover:-translate-y-1"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit} 
                            disabled={isLoading} 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 text-black font-bold rounded-lg px-8 py-3.5 transition-all duration-300 ease-in-out hover:bg-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.5)] transform hover:-translate-y-1 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <><CircularProgress size={20} sx={{color: 'black'}} /><span>Booking...</span></> : <><span>Confirm & Book</span><Check className="w-5 h-5" /></>}
                        </button>
                    )}
               </div>
            )}
          </div>
        </main>
        <footer className="text-center mt-8">
            <p className="text-gray-600 text-sm">Powered by Gemini Rentals</p>
        </footer>
      </div>
    </div>
    </>
  );
};

export default App;
