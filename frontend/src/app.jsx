import React, { useState, useEffect, useMemo, memo } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Car, Bike, User, CalendarDays, Check, Sparkles, LayoutGrid, FileText, ArrowLeft, ArrowRight 
} from 'lucide-react';

// --- Polished SVG Icons & Illustrations ---
const Logo = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const BookingSuccessIllustration = ({ className }) => (<svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} d="M50 100 L85 135 L150 65" fill="none" stroke="var(--color-success)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /><motion.circle cx="100" cy="100" r="80" stroke="var(--color-ui-200)" strokeWidth="4" fill="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} /><motion.path d="M100 20 a80 80 0 0 1 0 160" fill="none" stroke="var(--color-success)" strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: "circOut", delay: 0.4 }} /></svg>);
const BookingErrorIllustration = ({ className }) => (<svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><motion.circle cx="100" cy="100" r="80" stroke="var(--color-danger-light)" strokeWidth="6" fill="var(--color-danger-bg)" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, ease: "backOut" }} /><motion.line x1="75" y1="75" x2="125" y2="125" stroke="var(--color-danger)" strokeWidth="10" strokeLinecap="round" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }} /><motion.line x1="125" y1="75" x2="75" y2="125" stroke="var(--color-danger)" strokeWidth="10" strokeLinecap="round" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }} /></svg>);
const Confetti = () => {
  const colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
  return [...Array(50)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * -50}%`,
        height: Math.random() * 10 + 5,
        width: Math.random() * 10 + 5,
        backgroundColor: colors[i % colors.length],
      }}
      animate={{ y: '150vh', opacity: 0, rotate: Math.random() * 720 }}
      transition={{ duration: Math.random() * 3 + 2, ease: "linear", delay: Math.random() * 1.5 }}
    />
  ));
};

// --- Configuration & API ---
const API_BASE_URL = 'http://localhost:5000/api';
const VEHICLE_IMAGES = {
  'Swift': 'https://i.postimg.cc/wxRHBsQ4/Picsart-25-09-01-10-13-14-464.png', 'Alto': 'https://i.postimg.cc/Znj0KcnC/Picsart-25-09-01-14-13-16-323.png', 'Tiago': 'https://i.postimg.cc/43TGqc4M/Picsart-25-09-01-14-12-12-034.jpg', 'Scorpio': 'https://i.postimg.cc/Dw040tqF/Picsart-25-09-01-14-13-29-281.jpg', 'XUV500': 'https://i.postimg.cc/rFKqrcYh/Picsart-25-09-01-14-12-28-028.png', 'Creta': 'https://i.postimg.cc/nrwZPwMY/Picsart-25-09-01-14-12-52-696.jpg', 'City': 'https://i.postimg.cc/TPczsH4L/Picsart-25-09-01-14-11-50-815.png', 'Verna': 'https://i.postimg.cc/HnRfQ30v/Picsart-25-09-01-10-17-09-430.png', 'Ciaz': 'https://i.postimg.cc/qR55VfXR/Picsart-25-09-01-14-11-34-415.png', 'Royal Enfield Classic 350': 'https://i.postimg.cc/8cczBkvt/Picsart-25-09-01-14-57-17-934.png', 'Avenger 220 Cruise': 'https://i.postimg.cc/m28Fbb18/Picsart-25-09-01-14-13-45-020.png', 'Jawa Perak': 'https://i.postimg.cc/RVfMgn3J/Picsart-25-09-01-10-09-53-588.png'
};

// --- Child Components with Enhanced UI/UX ---
const InputField = memo(({ id, placeholder, value, onChange, error, icon }) => (
    <motion.div className="relative" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary transition-colors duration-300">{icon}</div>
        <input id={id} type="text" placeholder={placeholder} value={value} onChange={onChange} className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-ui-100 transition-all duration-300 placeholder:text-text-secondary ${error ? 'border-danger focus:border-danger focus:ring-danger-light' : 'border-ui-200 focus:border-primary focus:ring-primary-light'} focus:outline-none focus:ring-4`} />
        <AnimatePresence>
            {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute -bottom-5 left-1 text-xs text-white font-semibold py-0.5 px-2 rounded-md bg-danger shadow-lg shadow-danger/30">
                <div className="absolute -top-1 left-3 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-danger"></div>
                {error}
            </motion.div>}
        </AnimatePresence>
    </motion.div>
));

const SelectionCard = memo(({ isSelected, onClick, children, className, delay = 0 }) => (
    <motion.div onClick={onClick} className={`relative p-4 rounded-2xl border-2 text-center cursor-pointer transition-all duration-300 transform-gpu group ${isSelected ? 'border-primary bg-primary-bg ring-4 ring-primary-light' : 'border-ui-200 bg-white hover:border-primary hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10'} ${className}`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay }}>
        {children}
        <motion.div className={`absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${isSelected ? 'bg-primary' : 'bg-ui-300 group-hover:bg-primary/80'}`}
            initial={{ scale: 0 }}
            animate={{ scale: isSelected ? 1 : 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}>
            {isSelected && <Check className="w-4 h-4 text-white" />}
        </motion.div>
    </motion.div>
));

const ShimmerCard = () => ( <div className="relative overflow-hidden bg-ui-200 rounded-2xl p-4 shimmer-bg"><div className="h-40 bg-ui-300 rounded-lg mb-4"></div><div className="h-6 w-3/4 bg-ui-300 rounded mb-2"></div><div className="h-4 w-1/2 bg-ui-300 rounded"></div></div> );

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', wheels: '', vehicleType: '', specificModel: '', startDate: '', endDate: '' });
  const [errors, setErrors] = useState({});
  const [animationDirection, setAnimationDirection] = useState(1);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState({ status: 'idle', message: '' });

  // --- Backend Logic (Unaltered) ---
  useEffect(() => {
    const fetchVehicleTypes = async () => { try { const response = await fetch(`${API_BASE_URL}/vehicle-types`); setVehicleTypes(await response.json()); } catch (error) { console.error('Error fetching vehicle types:', error); } };
    fetchVehicleTypes();
  }, []);
  useEffect(() => {
    if (formData.vehicleType) {
      const fetchVehicles = async () => {
        setIsLoading(true); setVehicles([]);
        await new Promise(res => setTimeout(res, 1000));
        try {
          const response = await fetch(`${API_BASE_URL}/vehicles/${formData.vehicleType}`);
          const data = await response.json();
          setVehicles(data);
          setAllVehicles(prev => {
            const newAll = new Map(prev);
            data.forEach(v => newAll.set(v.id, v));
            return newAll;
          });
        } catch (error) { console.error('Error fetching vehicles:', error); }
        finally { setIsLoading(false); }
      };
      fetchVehicles();
    }
  }, [formData.vehicleType]);
  const getVehicleInfo = (id) => allVehicles.get(id);
  const handleReset = () => { setCurrentStep(0); setFormData({ firstName: '', lastName: '', wheels: '', vehicleType: '', specificModel: '', startDate: '', endDate: '' }); setErrors({}); setBookingStatus({ status: 'idle', message: '' }); };
  const validateStep = (step) => {
    const newErrors = {};
    switch(step) {
      case 0: if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'; if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'; break;
      case 1: if (!formData.wheels) newErrors.wheels = 'Please select one'; break;
      case 2: if (!formData.vehicleType) newErrors.vehicleType = 'Please select a category'; break;
      case 3: if (!formData.specificModel) newErrors.specificModel = 'Please select a model'; break;
      case 4: if (!formData.startDate) newErrors.startDate = 'Start date is required'; if (!formData.endDate) newErrors.endDate = 'End date is required'; if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) { newErrors.dateRange = 'End date must be after start'; } break;
      default: break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNext = () => { if (validateStep(currentStep)) { setAnimationDirection(1); setCurrentStep(p => p + 1); } };
  const handlePrev = () => { setAnimationDirection(-1); setCurrentStep(p => p - 1); };
  const handleSubmit = async () => {
    for (let i = 0; i <= 4; i++) { if (!validateStep(i)) { setCurrentStep(i); return; } }
    setBookingStatus({ status: 'loading', message: '' }); setAnimationDirection(1); setCurrentStep(6);
    try {
      const payload = { firstName: formData.firstName, lastName: formData.lastName, vehicleId: formData.specificModel, startDate: formData.startDate, endDate: formData.endDate };
      const response = await fetch(`${API_BASE_URL}/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (response.ok) { setBookingStatus({ status: 'success', message: 'Booking confirmed! We have sent a confirmation to your email.' }); }
      else { setBookingStatus({ status: 'error', message: result.message || 'An unknown error occurred.' }); }
    } catch (error) { setBookingStatus({ status: 'error', message: 'Could not connect to the server. Please try again later.' }); }
  };
  const calculateDays = () => { if (!formData.startDate || !formData.endDate || new Date(formData.endDate) <= new Date(formData.startDate)) return 0; return Math.ceil(Math.abs(new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)); };
  
  // --- Motion Variants ---
  const stepVariants = { enter: (d) => ({ opacity: 0, x: d > 0 ? 50 : -50 }), center: { opacity: 1, x: 0 }, exit: (d) => ({ opacity: 0, x: d > 0 ? -50 : 50 }), };
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } }, };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { ease: 'easeOut' } }, };
  
  const stepComponents = [
    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12 w-full max-w-lg" variants={containerVariants} initial="hidden" animate="visible">
      <InputField id="firstName" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} error={errors.firstName} icon={<User size={20}/>} />
      <InputField id="lastName" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} error={errors.lastName} icon={<User size={20}/>} />
    </motion.div>,
    <div className="w-full max-w-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[{ value: '4', label: 'Four Wheels', icon: <Car size={48} className="text-primary" />, desc: 'Cars & SUVs' }, { value: '2', label: 'Two Wheels', icon: <Bike size={48} className="text-primary"/>, desc: 'Motorcycles' }].map((o, i) => (
          <SelectionCard key={o.value} isSelected={formData.wheels === o.value} onClick={() => setFormData({...formData, wheels: o.value, vehicleType: '', specificModel: ''})} delay={i * 0.1}>
            <div className="flex justify-center items-center mb-3">{o.icon}</div><h3 className="font-bold text-lg text-text-primary">{o.label}</h3><p className="text-text-secondary text-sm">{o.desc}</p>
          </SelectionCard>
        ))}
      </div>
      {errors.wheels && <p className="text-danger text-sm text-center mt-4">{errors.wheels}</p>}
    </div>,
    <motion.div className="w-full max-w-2xl" variants={containerVariants} initial="hidden" animate="visible">
      <div className={`grid grid-cols-2 ${vehicleTypes.filter(t=>t.wheels.toString() === formData.wheels).length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 sm:gap-6`}>
        {vehicleTypes.filter(t => t.wheels.toString() === formData.wheels).map((t, i) => (
          <SelectionCard key={t.id} isSelected={formData.vehicleType === t.id} onClick={() => setFormData({...formData, vehicleType: t.id, specificModel: ''})} delay={i * 0.08}>
            <h3 className="font-bold text-base sm:text-lg text-text-primary p-2 sm:p-4">{t.name}</h3>
          </SelectionCard>
        ))}
      </div>
       {errors.vehicleType && <p className="text-danger text-sm text-center mt-4">{errors.vehicleType}</p>}
    </motion.div>,
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[450px] overflow-y-auto p-2 custom-scrollbar">
        {isLoading ? [...Array(6)].map((_, i) => <ShimmerCard key={i} />) : vehicles.map(m => (
          <motion.div key={m.id} onClick={() => setFormData({...formData, specificModel: m.id})} className={`rounded-2xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden ${formData.specificModel === m.id ? 'border-primary bg-primary-bg ring-4 ring-primary-light' : 'border-ui-200 bg-white hover:border-primary hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1'}`} variants={itemVariants}>
            <div className="overflow-hidden bg-ui-100"><img src={VEHICLE_IMAGES[m.name]} alt={m.name} className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-500 ease-in-out"/></div>
            <div className="p-4 flex justify-between items-center"><div><h3 className="font-bold text-lg text-text-primary">{m.name}</h3><p className="text-text-secondary font-medium">₹{parseFloat(m.price_per_day).toLocaleString()}/day</p></div><div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${formData.specificModel === m.id ? 'border-primary bg-primary' : 'border-ui-300 bg-white'}`}>{formData.specificModel === m.id && <Check className="w-5 h-5 text-white" />}</div></div>
          </motion.div>
        ))}
      </div>
      {errors.specificModel && <p className="text-danger text-sm text-center mt-4">{errors.specificModel}</p>}
    </div>,
    (() => { const today = format(new Date(), 'yyyy-MM-dd'); const minEndDate = formData.startDate ? format(new Date(new Date(formData.startDate).getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd') : ''; return (<motion.div className="space-y-6 w-full max-w-lg mx-auto" variants={containerVariants} initial="hidden" animate="visible"><motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}><div className="flex-1 relative"><label className="block text-sm font-medium text-text-primary mb-2">Start Date</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"><CalendarDays size={20}/></span><input type="date" value={formData.startDate} min={today} onChange={e => setFormData({ ...formData, startDate: e.target.value, endDate: (formData.endDate && new Date(e.target.value) >= new Date(formData.endDate)) ? '' : formData.endDate })} className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-ui-100 transition-all duration-300 ${errors.startDate ? 'border-danger focus:border-danger' : 'border-ui-200 focus:border-primary'} focus:outline-none focus:ring-4 focus:ring-primary-light`}/></div></div><div className="flex-1 relative"><label className="block text-sm font-medium text-text-primary mb-2">End Date</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"><CalendarDays size={20}/></span><input type="date" value={formData.endDate} min={minEndDate} disabled={!formData.startDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-ui-100 transition-all duration-300 ${errors.endDate ? 'border-danger focus:border-danger' : 'border-ui-200 focus:border-primary'} focus:outline-none focus:ring-4 focus:ring-primary-light disabled:bg-ui-200 disabled:cursor-not-allowed`}/></div></div></motion.div>{calculateDays() > 0 && (<motion.div className="p-4 rounded-xl bg-ui-100 border border-ui-200 text-center" variants={itemVariants}><p className="text-text-secondary">Total Duration: <span className="font-bold text-text-primary">{calculateDays()} Day(s)</span></p></motion.div>)}{errors.dateRange && <p className="text-danger text-sm text-center mt-2">{errors.dateRange}</p>}</motion.div>);})(),
    (() => { const v = getVehicleInfo(formData.specificModel); const d = calculateDays(); const c = v && d > 0 ? parseFloat(v.price_per_day) * d : 0; return (<motion.div className="w-full max-w-2xl mx-auto space-y-4" initial={{opacity: 0}} animate={{opacity: 1}}><div className="p-6 rounded-2xl bg-white/80 border border-ui-200 "><div className="flex flex-col md:flex-row gap-6 items-center"><img src={VEHICLE_IMAGES[v?.name]} alt={v?.name} className="w-full md:w-1/3 h-auto object-contain rounded-lg aspect-video bg-ui-100 p-2"/><div className="grid grid-cols-2 gap-x-6 gap-y-4 flex-grow w-full"><div><p className="text-xs uppercase tracking-wider font-medium text-text-secondary">Full Name</p><p className="font-semibold text-text-primary">{formData.firstName} {formData.lastName}</p></div><div><p className="text-xs uppercase tracking-wider font-medium text-text-secondary">Vehicle</p><p className="font-semibold text-text-primary">{v?.name || 'N/A'}</p></div><div><p className="text-xs uppercase tracking-wider font-medium text-text-secondary">Start Date</p><p className="font-semibold text-text-primary">{formData.startDate ? format(new Date(formData.startDate), 'MMM d, yyyy') : 'N/A'}</p></div><div><p className="text-xs uppercase tracking-wider font-medium text-text-secondary">End Date</p><p className="font-semibold text-text-primary">{formData.endDate ? format(new Date(formData.endDate), 'MMM d, yyyy') : 'N/A'}</p></div></div></div><div className="mt-6 pt-4 border-t border-ui-200 text-center"><p className="text-text-secondary mb-2">Total Duration: <span className="font-bold text-text-primary">{d} Day(s)</span></p><p className="text-2xl font-bold text-text-display">Estimated Total: <span className="text-primary">₹{c.toLocaleString()}</span></p></div></div></motion.div>);})(),
    <div className="relative text-center space-y-6 py-8">{bookingStatus.status === 'success' ? (<><Confetti /><motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex flex-col items-center gap-4"><BookingSuccessIllustration className="w-32 h-32" /><motion.h2 variants={itemVariants} className="text-3xl font-bold text-success-dark">Booking Confirmed!</motion.h2><motion.p variants={itemVariants} className="text-text-secondary max-w-sm mx-auto">{bookingStatus.message}</motion.p><motion.button variants={itemVariants} onClick={handleReset} className="px-6 py-3 bg-text-display hover:bg-black text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-ui-400/30">Book Another Ride</motion.button></motion.div></>) : bookingStatus.status === 'error' ? (<motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex flex-col items-center gap-4"><BookingErrorIllustration className="w-32 h-32" /><motion.h2 variants={itemVariants} className="text-3xl font-bold text-danger-dark">Booking Failed</motion.h2><motion.div variants={itemVariants} className="bg-danger-bg p-4 rounded-lg border border-danger-light max-w-md mx-auto"><p className="text-danger-dark">{bookingStatus.message}</p></motion.div><motion.div variants={itemVariants} className="flex gap-4 justify-center"><button onClick={() => { setAnimationDirection(-1); setCurrentStep(4); }} className="px-6 py-3 bg-ui-500 hover:bg-ui-600 text-white rounded-xl font-semibold transition-all duration-300">Change Dates</button><button onClick={handleReset} className="px-6 py-3 bg-text-display hover:bg-black text-white rounded-xl font-semibold transition-all duration-300">Start Over</button></motion.div></motion.div>) : (<div className="flex flex-col items-center justify-center space-y-4"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div><p className="text-text-secondary text-lg">Finalizing your booking...</p></div>)}</div>,
  ];

  const allStepsMeta = useMemo(() => [
    { title: "Your Name", subtitle: "Let's start with the basics.", icon: <User size={32}/> },
    { title: "Ride Style", subtitle: `Welcome, ${formData.firstName || 'friend'}! What's your vibe?`, icon: <Car size={32}/> },
    { title: "Category", subtitle: "Find the perfect style for your journey.", icon: <LayoutGrid size={32}/> },
    { title: "Your Vehicle", subtitle: "Select the specific model for your trip.", icon: <Bike size={32}/> },
    { title: "Trip Dates", subtitle: `Almost there, ${formData.firstName || 'friend'}. When's the adventure?`, icon: <CalendarDays size={32}/> },
    { title: "Review", subtitle: "One final check before you hit the road.", icon: <FileText size={32}/> },
    { title: "Status", subtitle: "Hold tight, we're confirming your booking.", icon: <Sparkles size={32}/> }
  ], [formData.firstName]);

  const currentStepMeta = allStepsMeta[currentStep];
  const progress = currentStep < 6 ? (currentStep / 5) * 100 : 100;

  return (
    <div className="min-h-screen bg-app-bg font-sans antialiased text-text-primary">
       <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap');
        :root {
            --color-primary: #4f46e5; --color-primary-light: #e0e7ff; --color-primary-bg: #f4f6ff;
            --color-success: #22c55e; --color-success-dark: #15803d;
            --color-danger: #ef4444; --color-danger-light: #fecaca; --color-danger-bg: #fef2f2; --color-danger-dark: #b91c1c;
            --color-text-display: #111827; --color-text-primary: #374151; --color-text-secondary: #6b7280;
            --color-ui-100: #f9fafb; --color-ui-200: #f3f4f6; --color-ui-300: #e5e7eb; --color-ui-400: #d1d5db; --color-ui-500: #9ca3af; --color-ui-600: #6b7280;
            --color-app-bg: #f8f9fc;
        }
        body, .font-manrope { font-family: 'Manrope', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-smoothing: grayscale; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: var(--color-ui-100); border-radius: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-ui-400); border-radius: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--color-ui-500); }
        .shimmer-bg::before { content: ''; position: absolute; top: 0; left: -150%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent); animation: shimmer 2s infinite; } @keyframes shimmer { 100% { left: 150%; } }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.6; filter: invert(0.5); }
       `}</style>
      <div className="fixed top-0 left-0 w-full h-1.5 bg-ui-200 z-50"><motion.div className="h-full bg-primary" style={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeInOut" }}></motion.div></div>
      
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-5xl mx-auto bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-ui-400/10 border border-ui-200/80 overflow-hidden md:grid md:grid-cols-3">
          <aside className="hidden md:flex flex-col justify-between p-8 bg-ui-100/50 border-r border-ui-200/80">
            <div>
              <div className="flex items-center gap-3 mb-12">
                <Logo className="w-8 h-8 text-text-display"/>
                <h1 className="text-2xl font-extrabold text-text-display tracking-tighter font-manrope">Momentum</h1>
              </div>
              <nav className="flex flex-col gap-1">
                {allStepsMeta.slice(0, 6).map((step, index) => (
                  <div key={index} className="flex items-center gap-4 py-2">
                    <div className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ${index === currentStep ? 'bg-primary text-white shadow-lg shadow-primary/30' : index < currentStep ? 'bg-success text-white' : 'bg-ui-200 text-text-secondary'}`}>{index < currentStep ? <Check size={20} /> : <span className="font-bold">{index + 1}</span>}</div>
                    <div><p className={`text-xs uppercase tracking-wider font-semibold ${index <= currentStep ? 'text-text-secondary' : 'text-ui-500'}`}>Step {index + 1}</p><p className={`font-bold transition-colors duration-300 ${index <= currentStep ? 'text-text-primary' : 'text-ui-500'}`}>{step.title}</p></div>
                  </div>
                ))}
              </nav>
            </div>
            <p className="text-xs text-text-secondary/60">© 2025 Momentum Rentals.</p>
          </aside>
          
          <main className="col-span-2 p-6 sm:p-10 flex flex-col">
            <div className="md:hidden text-center mb-6"><div className="flex items-center justify-center gap-2 mb-1"><Logo className="w-6 h-6 text-text-display"/><h1 className="text-2xl font-extrabold text-text-display tracking-tighter font-manrope">Momentum</h1></div><p className="text-text-secondary text-sm">Vehicle Rental Services</p></div>
            <div className="flex-grow overflow-hidden relative">
              <AnimatePresence initial={false} custom={animationDirection} mode="wait">
                <motion.div key={currentStep} custom={animationDirection} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}>
                  <motion.div className="text-center mb-8 flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <div className="mb-4 text-primary">{currentStepMeta.icon}</div>
                    <h2 className="text-3xl font-bold text-text-display tracking-tight mb-1">{currentStepMeta.title}</h2>
                    <AnimatePresence mode="wait"><motion.p key={currentStepMeta.subtitle} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }} className="text-text-secondary">{currentStepMeta.subtitle}</motion.p></AnimatePresence>
                  </motion.div>
                  <div className="mb-8 min-h-[300px] flex items-center justify-center">{stepComponents[currentStep]}</div>
                </motion.div>
              </AnimatePresence>
            </div>
            {currentStep < 6 && (<div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-auto pt-6 border-t border-ui-200">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handlePrev} disabled={currentStep === 0} className="mt-4 sm:mt-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary hover:text-text-primary hover:bg-ui-200">
                <ArrowLeft size={16}/>
                <span>Back</span>
              </motion.button>
              {currentStep < 5 ? (
                <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={handleNext} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-primary/30">
                  <span>Next Step</span>
                  <ArrowRight size={16}/>
                </motion.button>
              ) : (
                <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={handleSubmit} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-success text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-success/30">
                  <span>Confirm & Book</span>
                  <Check size={16} />
                </motion.button>
              )}
            </div>)}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
