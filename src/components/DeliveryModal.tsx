import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Clock, Home, Briefcase, Navigation } from 'lucide-react';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: string, time: string) => void;
  currentAddress: string;
  currentTime: string;
}

export default function DeliveryModal({ isOpen, onClose, onSave, currentAddress, currentTime }: DeliveryModalProps) {
  const [address, setAddress] = useState(currentAddress === 'Select Address' ? '' : currentAddress);
  const [timeType, setTimeType] = useState<'ASAP' | 'Scheduled'>(currentTime === 'ASAP' ? 'ASAP' : 'Scheduled');
  const [scheduledTime, setScheduledTime] = useState(currentTime !== 'ASAP' ? currentTime : 'Today, 6:00 PM');

  const handleSave = () => {
    const finalAddress = address.trim() || 'Select Address';
    const finalTime = timeType === 'ASAP' ? 'ASAP' : scheduledTime;
    onSave(finalAddress, finalTime);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Delivery Details</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Address Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                  <button 
                    onClick={() => setAddress('12 Admiralty Way, Lekki Phase 1, Lagos')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary-hover"
                    title="Use current location"
                  >
                    <Navigation className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Saved Addresses */}
                <div className="flex gap-3 mt-3">
                  <button 
                    onClick={() => setAddress('15A Bourdillon Road, Ikoyi, Lagos')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors border border-gray-200"
                  >
                    <Home className="w-4 h-4" /> Home
                  </button>
                  <button 
                    onClick={() => setAddress('Plot 1234, Adeola Odeku Street, Victoria Island, Lagos')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors border border-gray-200"
                  >
                    <Briefcase className="w-4 h-4" /> Work
                  </button>
                </div>
              </div>

              {/* Time Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={() => setTimeType('ASAP')}
                    className={`py-3 px-4 rounded-xl font-medium text-sm transition-all border ${
                      timeType === 'ASAP' 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    ASAP (30-45 min)
                  </button>
                  <button
                    onClick={() => setTimeType('Scheduled')}
                    className={`py-3 px-4 rounded-xl font-medium text-sm transition-all border ${
                      timeType === 'Scheduled' 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Schedule for later
                  </button>
                </div>

                {timeType === 'Scheduled' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="relative"
                  >
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none bg-white"
                    >
                      <option value="Today, 12:00 PM">Today, 12:00 PM</option>
                      <option value="Today, 1:00 PM">Today, 1:00 PM</option>
                      <option value="Today, 2:00 PM">Today, 2:00 PM</option>
                      <option value="Today, 6:00 PM">Today, 6:00 PM</option>
                      <option value="Today, 7:00 PM">Today, 7:00 PM</option>
                      <option value="Today, 8:00 PM">Today, 8:00 PM</option>
                    </select>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-primary/30"
              >
                Save Delivery Details
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
