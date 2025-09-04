/**
 * @file App.jsx
 * @author Your Name
 * @version 2.0.0
 * @date 2025-09-04
 *
 * @description
 * This file contains the refactored implementation of a multi-step vehicle booking application.
 * The goal of this refactor is to demonstrate advanced React concepts, improve code structure,
 * enhance UI/UX, and create a more maintainable and scalable codebase.
 *
 * --- KEY REACT CONCEPTS DEMONSTRATED ---
 *
 * 1.  **State Management with `useReducer`**:
 * Instead of multiple `useState` hooks, a single `useReducer` (bookingReducer) manages all complex state logic (form data, current step, loading status, errors). This centralizes state transitions, makes them predictable, and simplifies component logic. It's ideal for managing state with multiple sub-values.
 *
 * 2.  **Global State with Context API (`createContext` & `useContext`)**:
 * The `BookingContext` is used to provide the state and dispatch function from our reducer to the entire component tree. This eliminates "prop drilling" (passing props down through many levels of components) and allows any component to access and modify the global state cleanly.
 *
 * 3.  **Component Composition & Separation of Concerns**:
 * The monolithic App component has been broken down into smaller, single-responsibility components (e.g., `StepName`, `StepVehicleSelection`, `ProgressBar`, `Navigation`). Each component is now responsible for a specific part of the UI, making the code easier to read, debug, and reuse.
 *
 * 4.  **Custom Hooks for Reusable Logic**:
 * The `useBookingContext` custom hook is a simple abstraction over `useContext(BookingContext)`. It provides a clear, reusable way for components to access the booking state without needing to import `useContext` and `BookingContext` everywhere.
 *
 * 5.  **Memoization (`useMemo` & `React.memo`)**:
 * - `useMemo` is used to calculate derived data (like total price and rental days) only when its dependencies change, preventing costly recalculations on every render.
 * - `React.memo` is used to wrap components like `VehicleCard` and `SelectionCard`. This prevents them from re-rendering if their props haven't changed, optimizing performance, especially in lists.
 *
 * 6.  **Declarative Rendering**:
 * The UI declaratively updates based on the state. For example, the `StepRenderer` component dynamically displays the correct step component based on `state.currentStep` without needing imperative logic.
 *
 * 7.  **Enhanced UI/UX & Loading States**:
 * - **Skeleton Loaders**: Instead of a single spinner, skeleton placeholders are shown for vehicle cards during data fetching. This provides a better user experience by mimicking the final layout.
 * - **Animations**: Subtle, purposeful animations using CSS keyframes and transitions have been added for step changes and interactions, making the interface feel more polished and responsive.
 * - **Error Handling**: Error messages are more clearly presented and integrated within the UI flow.
 */

import React, { useState, useEffect, useReducer, useMemo, createContext, useContext } from 'react';
import { ChevronRight, Car, Bike, Calendar, User, Check, Building, Shapes, ClipboardCheck, XCircle } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// --- CONFIGURATION ---
const API_BASE_URL = 'http://localhost:5000/api';

const VEHICLE_IMAGES = {
    'Swift': 'https://i.postimg.cc/wxRHBsQ4/Picsart-25-09-01-10-13-14-464.png', 'Alto': 'https://i.postimg.cc/25GhSvZd/Picsart-25-09-01-21-21-37-456.png', 'Tiago': 'https://i.postimg.cc/0NP7vZb2/Picsart-25-09-01-21-22-38-483.png', 'Scorpio': 'https://i.postimg.cc/YCsv9H29/Picsart-25-09-01-21-20-16-626.png', 'XUV500': 'https://i.postimg.cc/LXZLRsz2/Picsart-25-09-01-21-20-35-263.png', 'Creta': 'https://i.postimg.cc/vmKfpnx0/Picsart-25-09-01-21-20-46-904.png', 'City': 'https://i.postimg.cc/c1B63Y1P/Picsart-25-09-01-21-19-54-562.png', 'Verna': 'https://i.postimg.cc/HnRfQ30v/Picsart-25-09-01-10-17-09-430.png', 'Ciaz': 'https://i.postimg.cc/28H6cDZw/Picsart-25-09-01-21-19-33-817.png', 'Royal Enfield Classic 350': 'https://i.postimg.cc/8cczBkvt/Picsart-25-09-01-14-57-17-934.png', 'Avenger 220 Cruise': 'https://i.postimg.cc/DwVqj7hG/Picsart-25-09-01-21-23-05-676.png', 'Jawa Perak': 'https://i.postimg.cc/RVfMgn3J/Picsart-25-09-01-10-09-53-588.png'
};

// --- STATE MANAGEMENT (useReducer & Context API) ---

const BookingContext = createContext();

const initialState = {
    currentStep: 0,
    isAnimatingOut: false,
    formData: {
        firstName: '', lastName: '', wheels: '', vehicleType: '', specificModel: '', startDate: null, endDate: null,
    },
    vehicleData: {
        types: [], models: [], allModels: new Map(),
    },
    loading: {
        types: false, models: false, booking: false
    },
    errors: {},
    bookingError: null,
};

function bookingReducer(state, action) {
    switch (action.type) {
        case 'NEXT_STEP':
            return { ...state, currentStep: state.currentStep + 1, errors: {}, bookingError: null };
        case 'PREV_STEP':
            return { ...state, currentStep: state.currentStep - 1, errors: {}, bookingError: null };
        case 'SET_ANIMATING':
            return { ...state, isAnimatingOut: action.payload };
        case 'UPDATE_FORM_DATA':
            return { ...state, formData: { ...state.formData, ...action.payload } };
        case 'SET_ERRORS':
            return { ...state, errors: action.payload };
        case 'FETCH_TYPES_SUCCESS':
            return { ...state, vehicleData: { ...state.vehicleData, types: action.payload } };
        case 'FETCH_MODELS_START':
            return { ...state, loading: { ...state.loading, models: true } };
        case 'FETCH_MODELS_SUCCESS':
            const newAllModels = new Map(state.vehicleData.allModels);
            action.payload.forEach(model => newAllModels.set(model.id, model));
            return { ...state, loading: { ...state.loading, models: false }, vehicleData: { ...state.vehicleData, models: action.payload, allModels: newAllModels }};
        case 'SUBMIT_BOOKING_START':
            return { ...state, loading: { ...state.loading, booking: true }, bookingError: null };
        case 'SUBMIT_BOOKING_SUCCESS':
            return { ...state, loading: { ...state.loading, booking: false }, currentStep: state.currentStep + 1 };
        case 'SUBMIT_BOOKING_FAILURE':
            return { ...state, loading: { ...state.loading, booking: false }, bookingError: action.payload };
        case 'RESET':
            return { ...initialState, vehicleData: state.vehicleData }; // Keep fetched vehicle data
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

const BookingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(bookingReducer, initialState);

    useEffect(() => {
        const fetchVehicleTypes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/vehicle-types`);
                let data = await response.json();
                const filteredData = data.filter(type => type.name.toLowerCase() !== 'sports');
                const uniqueTypes = Array.from(new Map(filteredData.map(item => [item.id, item])).values());
                dispatch({ type: 'FETCH_TYPES_SUCCESS', payload: uniqueTypes });
            } catch (error) { console.error('Error fetching vehicle types:', error); }
        };
        fetchVehicleTypes();
    }, []);

    useEffect(() => {
        if (state.formData.vehicleType) {
            const fetchVehicles = async () => {
                dispatch({ type: 'FETCH_MODELS_START' });
                try {
                    const response = await fetch(`${API_BASE_URL}/vehicles/${state.formData.vehicleType}`);
                    let data = await response.json();
                    const duplicatesToRemove = ['Maruti Swift', 'Mahindra Scorpio', 'Honda City'];
                    let cleanedData = data.filter(vehicle => !duplicatesToRemove.includes(vehicle.name));
                    const uniqueVehicles = Array.from(new Map(cleanedData.map(item => [item.name, item])).values());
                    dispatch({ type: 'FETCH_MODELS_SUCCESS', payload: uniqueVehicles });
                } catch (error) {
                    console.error('Error fetching vehicles:', error);
                    dispatch({ type: 'FETCH_MODELS_SUCCESS', payload: [] }); // Clear models on error
                }
            };
            fetchVehicles();
        }
    }, [state.formData.vehicleType]);

    const value = { state, dispatch };
    return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

// Custom hook for easier context consumption
const useBookingContext = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBookingContext must be used within a BookingProvider');
    }
    return context;
};

// --- REUSABLE UI COMPONENTS (MEMOIZED FOR PERFORMANCE) ---

const FormInput = ({ id, placeholder, value, onChange, error }) => (
    <div className="relative">
        <input id={id} type="text" placeholder={placeholder} value={value} onChange={onChange} className={`w-full px-4 py-3.5 rounded-lg border-2 bg-gray-50 transition-all duration-300 placeholder:text-gray-500 ${error ? 'border-red-500 focus:border-red-500 ring-red-200' : 'border-gray-200 focus:border-black ring-gray-200'} focus:outline-none focus:ring-2`} />
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
);

const SelectionCard = React.memo(({ isSelected, onClick, children }) => (
    <div onClick={onClick} className={`relative p-6 rounded-xl border-2 text-center cursor-pointer transition-all duration-300 transform-gpu group ${ isSelected ? 'border-black bg-gray-100 ring-2 ring-gray-900/10 ring-offset-2' : 'border-gray-200 bg-white hover:border-gray-400 hover:-translate-y-1 hover:shadow-lg' }`}>
        {children}
        {isSelected && (<div className="absolute -top-3 -right-3 w-6 h-6 bg-black rounded-full flex items-center justify-center border-2 border-white"><Check className="w-4 h-4 text-white" /></div>)}
    </div>
));

const VehicleCard = React.memo(({ model, isSelected, onClick }) => (
    <div onClick={onClick} className={`relative rounded-xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden ${ isSelected ? 'border-black bg-gray-100 ring-2 ring-gray-900/10 ring-offset-2' : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-lg hover:-translate-y-1'}`}>
        <div className="bg-gray-100 overflow-hidden aspect-video">
            <img src={VEHICLE_IMAGES[model.name] || 'https://placehold.co/400x225/e5e7eb/374151?text=Image'} alt={model.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-in-out" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x225/e5e7eb/374151?text=Not+Found'; }}/>
        </div>
        <div className="p-4">
            <h3 className="font-bold text-lg text-black">{model.name}</h3>
            <p className="text-gray-800 font-semibold text-base">₹{model.price_per_day.toLocaleString()}/day</p>
        </div>
        {isSelected && (<div className="absolute -top-3 -right-3 w-6 h-6 bg-black rounded-full flex items-center justify-center border-2 border-white"><Check className="w-4 h-4 text-white" /></div>)}
    </div>
));

const VehicleCardSkeleton = () => (
    <div className="relative rounded-xl border-2 border-gray-200 bg-white overflow-hidden animate-pulse">
        <div className="bg-gray-200 aspect-video"></div>
        <div className="p-4">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    </div>
);

// --- STEP COMPONENTS ---

const StepName = () => {
    const { state, dispatch } = useBookingContext();
    const { firstName, lastName } = state.formData;
    const { errors } = state;
    return (
        <div className="space-y-6 w-full max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput id="firstName" placeholder="First Name" value={firstName} onChange={e => dispatch({ type: 'UPDATE_FORM_DATA', payload: { firstName: e.target.value } })} error={errors.firstName} />
                <FormInput id="lastName" placeholder="Last Name" value={lastName} onChange={e => dispatch({ type: 'UPDATE_FORM_DATA', payload: { lastName: e.target.value } })} error={errors.lastName} />
            </div>
        </div>
    );
};

const StepWheels = () => {
    const { state, dispatch } = useBookingContext();
    const handleSelect = (wheels) => {
        dispatch({ type: 'UPDATE_FORM_DATA', payload: { wheels, vehicleType: '', specificModel: '' }});
    };
    return (
        <div className="w-full max-w-lg space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectionCard isSelected={state.formData.wheels === '4'} onClick={() => handleSelect('4')}>
                    <Car className="w-12 h-12 mx-auto mb-3 text-gray-800"/>
                    <h3 className="font-bold text-lg text-black">4 Wheels</h3><p className="text-gray-500 text-sm">Cars & SUVs</p>
                </SelectionCard>
                <SelectionCard isSelected={state.formData.wheels === '2'} onClick={() => handleSelect('2')}>
                    <Bike className="w-12 h-12 mx-auto mb-3 text-gray-800"/>
                    <h3 className="font-bold text-lg text-black">2 Wheels</h3><p className="text-gray-500 text-sm">Motorcycles</p>
                </SelectionCard>
            </div>
            {state.errors.wheels && <p className="text-red-500 text-sm text-center pt-2">{state.errors.wheels}</p>}
        </div>
    );
};

const StepVehicleType = () => {
    const { state, dispatch } = useBookingContext();
    const filteredTypes = useMemo(() => state.vehicleData.types.filter(type => type.wheels == state.formData.wheels), [state.vehicleData.types, state.formData.wheels]);

    return (
        <div className="w-full max-w-2xl space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredTypes.map((type) => (
                    <SelectionCard key={type.id} isSelected={state.formData.vehicleType === type.id} onClick={() => dispatch({ type: 'UPDATE_FORM_DATA', payload: { vehicleType: type.id, specificModel: '' } })}>
                        <h3 className="font-bold text-lg text-black py-4">{type.name}</h3>
                    </SelectionCard>
                ))}
            </div>
             {state.errors.vehicleType && <p className="text-red-500 text-sm text-center pt-2">{state.errors.vehicleType}</p>}
        </div>
    );
};

const StepModelSelection = () => {
    const { state, dispatch } = useBookingContext();
    return (
        <div className="space-y-6 w-full max-w-4xl">
            {state.loading.models ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => <VehicleCardSkeleton key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[450px] overflow-y-auto p-2 -mr-2 pr-4">
                    {state.vehicleData.models.map((model) => (
                        <VehicleCard key={model.id} model={model} isSelected={state.formData.specificModel === model.id} onClick={() => dispatch({ type: 'UPDATE_FORM_DATA', payload: { specificModel: model.id } })} />
                    ))}
                </div>
            )}
            {state.errors.specificModel && <p className="text-red-500 text-sm text-center pt-2">{state.errors.specificModel}</p>}
        </div>
    );
};

const StepDates = () => {
    const { state, dispatch } = useBookingContext();
    const { startDate, endDate } = state.formData;
    const { selectedVehicle, rentalDays, totalPrice } = useMemo(() => {
        const selectedVehicle = state.vehicleData.allModels.get(state.formData.specificModel);
        const rentalDays = (startDate && endDate && dayjs(endDate).isAfter(dayjs(startDate))) ? dayjs(endDate).diff(dayjs(startDate), 'day') + 1 : 0;
        const totalPrice = selectedVehicle && rentalDays > 0 ? selectedVehicle.price_per_day * rentalDays : 0;
        return { selectedVehicle, rentalDays, totalPrice };
    }, [state.formData.startDate, state.formData.endDate, state.formData.specificModel, state.vehicleData.allModels]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="space-y-6 w-full max-w-xl">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <DatePicker label="Start Date" value={startDate ? dayjs(startDate) : null} onChange={(val) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { startDate: val, endDate: (endDate && val && dayjs(endDate).isBefore(val)) ? null : endDate } })} minDate={dayjs()} slotProps={{ textField: { fullWidth: true } }}/>
                    <DatePicker label="End Date" value={endDate ? dayjs(endDate) : null} onChange={(val) => dispatch({ type: 'UPDATE_FORM_DATA', payload: { endDate: val }})} minDate={startDate ? dayjs(startDate).add(1, 'day') : dayjs().add(1, 'day')} disabled={!startDate} slotProps={{ textField: { fullWidth: true } }}/>
                </div>
                {rentalDays > 0 && (
                    <div className="text-center mt-4">
                        <div className="p-4 rounded-lg bg-gray-100 border border-gray-200 inline-block">
                            <p className="text-gray-600">Total Duration: <span className="font-bold text-black">{rentalDays} day(s)</span></p>
                            {totalPrice > 0 && (<p className="text-xl mt-1 font-bold text-black">Estimated Price: ₹{totalPrice.toLocaleString()}</p>)}
                        </div>
                    </div>
                )}
                {state.errors.dateRange && <p className="text-red-500 text-sm text-center pt-2">{state.errors.dateRange}</p>}
            </div>
        </LocalizationProvider>
    );
};

const StepConfirm = () => {
    const { state, dispatch } = useBookingContext();
    const { selectedVehicle, rentalDays, totalPrice } = useMemo(() => {
        const selectedVehicle = state.vehicleData.allModels.get(state.formData.specificModel);
        const rentalDays = (state.formData.startDate && state.formData.endDate) ? dayjs(state.formData.endDate).diff(dayjs(state.formData.startDate), 'day') + 1 : 0;
        const totalPrice = selectedVehicle && rentalDays > 0 ? selectedVehicle.price_per_day * rentalDays : 0;
        return { selectedVehicle, rentalDays, totalPrice };
    }, [state.formData, state.vehicleData.allModels]);

    return (
        <div className="w-full max-w-2xl">
            <div className="p-6 sm:p-8 rounded-xl bg-white border border-gray-200 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 text-gray-700">
                    <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Full Name</p><p className="font-semibold text-black text-lg">{state.formData.firstName} {state.formData.lastName}</p></div>
                    <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Vehicle</p><p className="font-semibold text-black text-lg">{selectedVehicle?.name || 'N/A'}</p></div>
                    <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">Start Date</p><p className="font-semibold text-black text-lg">{dayjs(state.formData.startDate).format('MMM DD, YYYY')}</p></div>
                    <div><p className="text-xs uppercase tracking-wider font-medium text-gray-500">End Date</p><p className="font-semibold text-black text-lg">{dayjs(state.formData.endDate).format('MMM DD, YYYY')}</p></div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <p className="text-gray-500">Total Duration: <span className="font-bold text-black">{rentalDays} days</span></p>
                    <p className="text-2xl font-bold text-black mt-1">Total Price: ₹{totalPrice.toLocaleString()}</p>
                </div>
            </div>
            {state.bookingError && (
                <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-center space-y-2">
                    <div className="flex items-center justify-center text-red-600">
                        <XCircle className="w-6 h-6 mr-2" /><p className="font-semibold">{state.bookingError}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const StepSuccess = () => {
    const { state, dispatch } = useBookingContext();
    const selectedVehicle = state.vehicleData.allModels.get(state.formData.specificModel);
    return (
         <div className="text-center space-y-4 py-8">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center ring-4 ring-green-200">
                <Check className="w-12 h-12 text-green-600" />
            </div>
            <p className="text-gray-600 text-lg max-w-md mx-auto">Your booking for the <span className="font-bold text-black">{selectedVehicle?.name}</span> is complete. We've sent the details to your email.</p>
            <button onClick={() => dispatch({type: 'RESET'})} className="mt-6 inline-flex items-center justify-center gap-2 bg-black text-white font-bold rounded-lg px-8 py-3.5 transition-all duration-300 ease-in-out hover:bg-gray-800 transform hover:-translate-y-1">
                Book another ride
            </button>
        </div>
    );
};

// --- LOGIC & LAYOUT COMPONENTS ---

const stepConfig = [
    { icon: User, label: "Details", title: "Let's start with your name.", subtitle: "We need this to personalize your booking.", component: <StepName /> },
    { icon: Shapes, label: "Type", title: (name) => `Hi ${name}! Choose your ride style.`, subtitle: "How many wheels will you be needing?", component: <StepWheels /> },
    { icon: Building, label: "Category", title: "What kind of vehicle fits?", subtitle: "Select the category that suits your journey.", component: <StepVehicleType /> },
    { icon: Car, label: "Model", title: "Choose your specific ride.", subtitle: "Here are the available models in this category.", component: <StepModelSelection /> },
    { icon: Calendar, label: "Dates", title: "When do you need it?", subtitle: "Select your rental start and end dates.", component: <StepDates /> },
    { icon: ClipboardCheck, label: "Confirm", title: "Confirm Your Booking", subtitle: "One final check before we finalize your ride.", component: <StepConfirm /> },
    { icon: Check, label: "Done", title: "Booking Confirmed!", subtitle: (name) => `Get ready for your adventure, ${name}.`, component: <StepSuccess /> },
];

const ProgressBar = () => {
    const { state } = useBookingContext();
    const { currentStep } = state;
    return (
        <div className="mb-10 px-4 hidden sm:block">
            <div className="flex items-center">
                {stepConfig.slice(0, 6).map((step, index) => (
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
    );
};

const Navigation = () => {
    const { state, dispatch } = useBookingContext();
    const { currentStep, formData, errors } = state;

    const validateStep = () => {
        const newErrors = {};
        switch(currentStep) {
            case 0:
                if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
                if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
                break;
            case 1: if (!formData.wheels) newErrors.wheels = 'Please select the number of wheels'; break;
            case 2: if (!formData.vehicleType) newErrors.vehicleType = 'Please select a vehicle type'; break;
            case 3: if (!formData.specificModel) newErrors.specificModel = 'Please select a specific model'; break;
            case 4:
                if (!formData.startDate) newErrors.dateRange = 'Start and end dates are required';
                if (!formData.endDate) newErrors.dateRange = 'Start and end dates are required';
                if (formData.startDate && formData.endDate && dayjs(formData.startDate).isAfter(dayjs(formData.endDate))) {
                    newErrors.dateRange = 'End date must be after start date';
                }
                break;
            default: break;
        }
        dispatch({ type: 'SET_ERRORS', payload: newErrors });
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            dispatch({ type: 'SET_ANIMATING', payload: true });
            setTimeout(() => {
                dispatch({ type: 'NEXT_STEP' });
                dispatch({ type: 'SET_ANIMATING', payload: false });
            }, 300);
        }
    };

    const handlePrev = () => {
        dispatch({ type: 'SET_ANIMATING', payload: true });
        setTimeout(() => {
            dispatch({ type: 'PREV_STEP' });
            dispatch({ type: 'SET_ANIMATING', payload: false });
        }, 300);
    };

    const handleSubmit = async () => {
        if (validateStep(currentStep)) {
            dispatch({ type: 'SUBMIT_BOOKING_START' });
            try {
                const payload = {
                    firstName: formData.firstName, lastName: formData.lastName, vehicleId: formData.specificModel,
                    startDate: dayjs(formData.startDate).format('YYYY-MM-DD'),
                    endDate: dayjs(formData.endDate).format('YYYY-MM-DD'),
                };
                const response = await fetch(`${API_BASE_URL}/bookings`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
                });
                const result = await response.json();
                if (response.ok) {
                    dispatch({ type: 'SUBMIT_BOOKING_SUCCESS' });
                } else {
                    dispatch({ type: 'SUBMIT_BOOKING_FAILURE', payload: result.message || 'Booking failed.' });
                }
            } catch (error) {
                dispatch({ type: 'SUBMIT_BOOKING_FAILURE', payload: 'An unexpected error occurred.' });
            }
        }
    };
    
    if (currentStep >= stepConfig.length - 1) return null;

    return (
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button onClick={handlePrev} disabled={currentStep === 0} className="mt-4 sm:mt-0 text-gray-500 font-semibold rounded-lg px-6 py-3 transition-colors hover:text-black disabled:opacity-40 disabled:hover:text-gray-500">Back</button>
            {currentStep < stepConfig.length - 2 ? (
                <button onClick={handleNext} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white font-bold rounded-lg px-8 py-3.5 transition-all duration-300 ease-in-out hover:bg-gray-800 transform hover:-translate-y-1">
                    <span>Next</span><ChevronRight className="w-5 h-5" />
                </button>
            ) : (
                <button onClick={handleSubmit} disabled={state.loading.booking} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white font-bold rounded-lg px-8 py-3.5 transition-all duration-300 ease-in-out hover:bg-gray-800 transform hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {state.loading.booking ? <><CircularProgress size={20} sx={{color: 'white'}} /><span>Booking...</span></> : <><span>Confirm & Book</span><Check className="w-5 h-5" /></>}
                </button>
            )}
        </div>
    );
};

const StepRenderer = () => {
    const { state } = useBookingContext();
    const { currentStep, isAnimatingOut, formData } = state;
    const currentStepConfig = stepConfig[currentStep];

    let title = typeof currentStepConfig.title === 'function' ? currentStepConfig.title(formData.firstName) : currentStepConfig.title;
    let subtitle = typeof currentStepConfig.subtitle === 'function' ? currentStepConfig.subtitle(formData.firstName) : currentStepConfig.subtitle;
    
    return (
        <div className={`transition-all duration-300 ease-in-out ${isAnimatingOut ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <header className="text-center mb-8">
                <h2 className="text-3xl font-bold text-black mb-1 tracking-tight">{title}</h2>
                <p className="text-gray-500 text-lg">{subtitle}</p>
            </header>
            <div className="mb-8 min-h-[300px] flex items-center justify-center">
                {currentStepConfig.component}
            </div>
            <Navigation />
        </div>
    );
};


// --- MAIN APP COMPONENT ---

const App = () => {
  return (
    <BookingProvider>
        <style>{`
            /* Keyframe animations for smoother transitions */
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
            
            /* MUI DatePicker Light Theme Override */
            .MuiOutlinedInput-root { background-color: #f9fafb !important; border-radius: 8px !important; }
            .MuiOutlinedInput-notchedOutline { border-color: #d1d5db !important; }
            .MuiOutlinedInput-root:hover .MIuOutlinedInput-notchedOutline { border-color: #9ca3af !important; }
            .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline { border-color: #000000 !important; }
            .MuiInputLabel-root { color: #6b7280 !important; } .MuiInputLabel-root.Mui-focused { color: #000000 !important; }
            .MuiSvgIcon-root { color: #6b7280 !important; } .MuiInputBase-input { color: #111827 !important; }
            /* Calendar pop-up styles */
            .MuiDateCalendar-root { background-color: #ffffff !important; color: #111827 !important; }
            .MuiDayCalendar-weekDayLabel { color: #6b7280 !important; }
            .MuiPickersDay-root { color: #111827 !important; }
            .MuiPickersDay-root:not(.Mui-selected) { border-color: #e5e7eb !important; }
            .MuiPickersDay-root.Mui-selected { background-color: #000000 !important; color: #ffffff !important; }
            .MuiPickersDay-today { border-color: #000000 !important; }
            .MuiDialogActions-root .MuiButton-text { color: #000000 !important; }
        `}</style>
        <div className="min-h-screen bg-gray-100 text-gray-900 py-10 px-4 font-sans antialiased">
            <div className="relative max-w-5xl mx-auto z-10">
                <header className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-4xl md:text-5xl font-bold text-black mb-2 tracking-tighter">Book Your Perfect Ride</h1>
                    <p className="text-gray-500 text-lg">Fast, Simple, and Secure Rentals.</p>
                </header>
                <ProgressBar />
                <main className="bg-white rounded-2xl shadow-xl shadow-gray-900/10 p-6 sm:p-10 border border-gray-200">
                    <StepRenderer />
                </main>
                <footer className="text-center mt-8">
                    <p className="text-gray-400 text-sm">Powered by Shreyash Desai</p>
                </footer>
            </div>
        </div>
    </BookingProvider>
  );
};

export default App;
