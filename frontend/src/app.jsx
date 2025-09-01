import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Car, Bike, Calendar, User, Check, Building, Shapes, ClipboardCheck } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// --- Configuration & API ---
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
            className={`w-full px-4 py-3.5 rounded-lg border-2 bg-gray-50 transition-all duration-300 placeholder:text-gray-500 ${error ? 'border-red-500 focus:border-red-500 ring-red-200' : 'border-gray-200 focus:border-black ring-gray-200'} focus:outline-none focus:ring-2`} 
        />
    </div>
);

const SelectionCard = ({ isSelected, onClick, children }) => (
    <div 
        onClick={onClick} 
        className={`relative p-6 rounded-xl border-2 text-center cursor-pointer transition-all duration-300 transform-gpu group ${ 
            isSelected 
            ? 'border-black bg-gray-100 ring-2 ring-gray-900/10 ring-offset-2' 
            : 'border-gray-200 bg-white hover:border-gray-400 hover:-translate-y-1 hover:shadow-lg' 
        }`}
    >
        {children}
        {isSelected && (
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-black rounded-full flex items-center justify-center border-2 border-white">
                <Check className="w-4 h-4 text-white" />
            </div>
        )}
    </div>
);

const VehicleCard = ({ model, isSelected, onClick }) => (
    <div 
        onClick={onClick}
        className={`relative rounded-xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden ${
            isSelected 
            ? 'border-black bg-gray-100 ring-2 ring-gray-900/10 ring-offset-2' 
            : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-lg hover:-translate-y-1'
        }`}
    >
        <div className="bg-gray-100 overflow-hidden aspect-video">
            <img 
                src={VEHICLE_IMAGES[model.name] || 'https://placehold.co/400x225/e5e7eb/374151?text=Image'} 
                alt={model.name} 
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-in-out"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x225/e5e7eb/374151?text=Image+Not+Found'; }}
            />
        </div>
        <div className="p-4">
            <h3 className="font-bold text-lg text-black">{model.name}</h3>
            <p className="text-gray-800 font-semibold text-base">₹{model.price_per_day.toLocaleString()}/day</p>
        </div>
         {isSelected && (
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-black rounded-full flex items-center justify-center border-2 border-white">
                <Check className="w-4 h-4 text-white" />
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

  // --- DATA FETCHING & CLEANING LOGIC ---
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/vehicle-types`);
        let data = await response.json();
        
        // 1. Filter out the "Sports" category
        const filteredData = data.filter(type => type.name.toLowerCase() !== 'sports');

        // 2. De-duplicate the types to ensure each appears only once
        const uniqueTypes = Array.from(new Map(filteredData.map(item => [item.id, item])).values());
        
        setVehicleTypes(uniqueTypes);
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
          let data = await response.json();

          // 1. Define duplicate names to remove
          const duplicatesToRemove = ['Maruti Swift', 'Mahindra Scorpio', 'Honda City'];
          let cleanedData = data.filter(vehicle => !duplicatesToRemove.includes(vehicle.name));

          // 2. De-duplicate any remaining items by name (handles Royal Enfield)
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

  // --- DYNAMIC STEP CONFIGURATION FOR UI ---
  const allSteps = useMemo(() => {
    const selectedVehicle = getVehicleInfo(formData.specificModel);
    const rentalDays = (formData.startDateObj && formData.endDateObj && formData.endDateObj.isAfter(formData.startDateObj, 'day')) 
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
            {(errors.firstName || errors.lastName) && <p className="text-red-500 text-sm text-center pt-2">Please fill out both first and last name.</p>}
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
                    <Car className="w-12 h-12 mx-auto mb-3 text-gray-800"/>
                    <h3 className="font-bold text-lg text-black">4 Wheels</h3>
                    <p className="text-gray-500 text-sm">Cars & SUVs</p>
                </SelectionCard>
                <SelectionCard isSelected={formData.wheels === '2'} onClick={() => setFormData({...formData, wheels: '2', vehicleType: '', specificModel: ''})}>
                    <Bike className="w-12 h-12 mx-auto mb-3 text-gray-800"/>
                    <h3 className="font-bold text-lg text-black">2 Wheels</h3>
                    <p className="text-gray-500 text-sm">Motorcycles</p>
                </SelectionCard>
            </div>
            {errors.wheels && <p className="text-red-500 text-sm text-center pt-2">{errors.wheels}</p>}
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
                  <h3 className="font-bold text-lg text-black py-4">{type.name}</h3>
                </SelectionCard>
              ))}
            </div>
            {errors.vehicleType && <p className="text-red-500 text-sm text-center pt-2">{errors.vehicleType}</p>}
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
            {isLoading ? <div className="flex justify-center items-center h-48"><CircularProgress sx={{ color: '#000000' }} /></div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[450px] overflow-y-auto p-2 -mr-2 pr-4">
                {vehicles.map((model) => (
                  <VehicleCard key={model.id} model={model} isSelected={formData.specificModel === model.id} onClick={() => setFormData({...formData, specificModel: model.id})} />
                ))}
              </div>
            )}
            {errors.specificModel && <p className="text-red-500 text-sm text-center pt-2">{errors.specificModel}</p>}
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
                <div className="text-center mt-4">
                  <div className="p-4 rounded-lg bg-gray-100 border border-gray-200 inline-block">
                    <p className="text-gray-600">
                      Total Duration: <span className="font-bold text-black">{rentalDays} day(s)</span>
                    </p>
                    {totalPrice > 0 && (
                      <p className="text-xl mt-1 font-bold text-black">
                        Estimated Price: ₹{totalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {errors.dateRange && <p className="text-red-500 text-sm text-center pt-2">{errors.dateRange}</p>}
            </div>
          </LocalizationProvider>
        )
      },
      {
        icon: ClipboardCheck,
        label: "Confirm",
        title: "Confirm Your Booking",
        subtitle: "One final check before we finalize your ride.",
        component: () => (
          <div className="w-full max-w-2xl">
              <div className="p-6 sm:p-8 rounded-xl bg-white border border-gray-200 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 text-gray-700">
                      <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Full Name</p><p className="font-semibold text-black text-lg">{formData.firstName} {formData.lastName}</p></div>
                      <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Vehicle</p><p className="font-semibold text-black text-lg">{selectedVehicle?.name || 'N/A'}</p></div>
                      <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Start Date</p><p className="font-semibold text-black text-lg">{dayjs(formData.startDate).format('MMM DD, YYYY')}</p></div>
                      <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">End Date</p><p className="font-semibold text-black text-lg">{dayjs(formData.endDate).format('MMM DD, YYYY')}</p></div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <p className="text-gray-500">Total Duration: <span className="font-bold text-black">{rentalDays} days</span></p>
                    <p className="text-2xl font-bold text-black mt-1">Total Price: ₹{totalPrice.toLocaleString()}</p>
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
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center ring-4 ring-green-200">
                  <Check className="w-12 h-12 text-green-600" />
              </div>
              <p className="text-gray-600 text-lg max-w-md mx-auto">Your booking for the <span className="font-bold text-black">{selectedVehicle?.name}</span> is complete. We've sent the details to your email.</p>
          </div>
        )
      }
    ];
    return steps;
  }, [formData, errors, isLoading, vehicleTypes, vehicles, allVehicles]);


  return (
    <>
    <style>{`
      /* MUI DatePicker Light Theme Override */
      .MuiOutlinedInput-root {
        background-color: #f9fafb !important;
        border-radius: 8px !important;
      }
      .MuiOutlinedInput-notchedOutline {
        border-color: #d1d5db !important;
      }
      .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
        border-color: #9ca3af !important;
      }
      .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: #000000 !important;
      }
      .MuiInputLabel-root {
        color: #6b7280 !important;
      }
      .MuiInputLabel-root.Mui-focused {
        color: #000000 !important;
      }
      .MuiSvgIcon-root {
        color: #6b7280 !important;
      }
      .MuiInputBase-input {
        color: #111827 !important;
      }
      /* Calendar pop-up styles */
      .MuiDateCalendar-root {
        background-color: #ffffff !important;
        color: #111827 !important;
      }
      .MuiDayCalendar-weekDayLabel {
        color: #6b7280 !important;
      }
      .MuiPickersDay-root {
        color: #111827 !important;
      }
      .MuiPickersDay-root:not(.Mui-selected) {
        border-color: #e5e7eb !important;
      }
      .MuiPickersDay-root.Mui-selected {
        background-color: #000000 !important;
        color: #ffffff !important;
      }
      .MuiPickersDay-today {
        border-color: #000000 !important;
      }
      .MuiDialogActions-root .MuiButton-text {
        color: #000000 !important;
      }
    `}</style>
    <div className="min-h-screen bg-gray-100 text-gray-900 py-10 px-4 font-sans antialiased">
      <div className="relative max-w-5xl mx-auto z-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-2 tracking-tighter">
            Book Your Perfect Ride
          </h1>
          <p className="text-gray-500 text-lg">Fast, Simple, and Secure Rentals.</p>
        </header>
        
        {/* -- Progress Bar -- */}
        <div className="mb-10 px-4 hidden sm:block">
            <div className="flex items-center">
                {allSteps.slice(0, 6).map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center z-10 text-center">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 border-2 ${ index < currentStep ? 'bg-black border-black text-white' : index === currentStep ? 'bg-white border-black scale-110 shadow-lg' : 'bg-gray-200 border-gray-300' }`}>
                                {index < currentStep ? <Check className="w-6 h-6" /> : <step.icon className={`w-6 h-6 transition-colors ${index === currentStep ? 'text-black' : 'text-gray-500'}`} />}
                            </div>
                            <p className={`mt-2 text-xs font-semibold transition-colors ${index === currentStep ? 'text-black' : 'text-gray-400'}`}>{step.label}</p>
                        </div>
                        {index < 5 && ( <div className={`flex-auto h-0.5 -mx-1 transition-all duration-500 ${index < currentStep ? 'bg-black' : 'bg-gray-200'}`}></div> )}
                    </React.Fragment>
                ))}
            </div>
        </div>

        <main className="bg-white rounded-2xl shadow-xl shadow-gray-900/10 p-6 sm:p-10 border border-gray-200">
          <div className={`transition-all duration-300 ease-in-out ${isAnimatingOut ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <header className="text-center mb-8">
              <h2 className="text-3xl font-bold text-black mb-1 tracking-tight">
                {allSteps[currentStep]?.title}
              </h2>
              <p className="text-gray-500 text-lg">{allSteps[currentStep]?.subtitle}</p>
            </header>
            <div className="mb-8 min-h-[300px] flex items-center justify-center">
              {allSteps[currentStep]?.component()}
            </div>
            
            {/* --- NAVIGATION BUTTONS --- */}
            {currentStep < allSteps.length - 1 && (
                 <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200">
                    <button 
                        onClick={handlePrev} 
                        disabled={currentStep === 0} 
                        className="mt-4 sm:mt-0 text-gray-500 font-semibold rounded-lg px-6 py-3 transition-colors hover:text-black disabled:opacity-40 disabled:hover:text-gray-500"
                    >
                        Back
                    </button>
                    {currentStep < allSteps.length - 2 ? (
                        <button 
                            onClick={handleNext} 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white font-bold rounded-lg px-8 py-3.5 transition-all duration-300 ease-in-out hover:bg-gray-800 transform hover:-translate-y-1"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit} 
                            disabled={isLoading} 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white font-bold rounded-lg px-8 py-3.5 transition-all duration-300 ease-in-out hover:bg-gray-800 transform hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <><CircularProgress size={20} sx={{color: 'white'}} /><span>Booking...</span></> : <><span>Confirm & Book</span><Check className="w-5 h-5" /></>}
                        </button>
                    )}
               </div>
            )}
          </div>
        </main>
        <footer className="text-center mt-8">
            <p className="text-gray-400 text-sm">Powered by Shreyash Desai</p>
        </footer>
      </div>
    </div>
    </>
  );
};

export default App;
