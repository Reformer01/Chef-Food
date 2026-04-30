import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Chrome,
  Shield,
  ArrowLeft,
  Sparkles,
  Fingerprint,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onAuthSuccess?: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-sent';

// Magnetic Button Component with spring physics
const MagneticButton = ({ children, className, onClick, disabled }: { 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) / 8;
    const distanceY = (e.clientY - centerY) / 8;
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// Shimmer loader component
const ShimmerLoader = () => (
  <div className="relative overflow-hidden">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
);

// Perpetual floating animation
const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    animate={{ y: [0, -4, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
  >
    {children}
  </motion.div>
);

export default function AuthModal({ isOpen, onClose, defaultMode = 'login', onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);
  
  const {
    signInWithEmail,
    signInWithGoogle,
    registerWithEmail,
    resetPassword,
    authLoading,
    lastError,
    clearError,
    isAuthenticated
  } = useAuth();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setFormData({ email: '', password: '', confirmPassword: '', displayName: '' });
      setFormErrors({});
      setSuccessMessage(null);
      clearError();
    }
  }, [isOpen, defaultMode, clearError]);

  // Close on successful auth
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
      onAuthSuccess?.();
    }
  }, [isAuthenticated, isOpen, onClose, onAuthSuccess]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (mode !== 'forgot-password') {
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      if (mode === 'register') {
        if (!formData.displayName.trim()) {
          errors.displayName = 'Full name is required';
        }
        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;

    let success = false;

    switch (mode) {
      case 'login':
        success = await signInWithEmail(formData.email, formData.password);
        break;
      case 'register':
        success = await registerWithEmail(formData.email, formData.password, formData.displayName);
        break;
      case 'forgot-password':
        success = await resetPassword(formData.email);
        if (success) {
          setSuccessMessage('Reset instructions sent to your inbox.');
          setMode('reset-sent');
        }
        break;
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    await signInWithGoogle();
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setFormErrors({});
    clearError();
    setSuccessMessage(null);
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome back';
      case 'register': return 'Create account';
      case 'forgot-password': return 'Reset password';
      case 'reset-sent': return 'Check your email';
      default: return 'Authentication';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Sign in to access your orders and saved favorites';
      case 'register': return 'Join 50,000+ Nigerians enjoying authentic cuisine';
      case 'forgot-password': return 'Enter your email for reset instructions';
      case 'reset-sent': return `Instructions sent to ${formData.email}`;
      default: return '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Liquid Glass Backdrop with inner refraction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-[20px] z-[100]"
          />

          {/* Asymmetric Split-Screen Modal - 60/40 Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] z-[101] overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_0.7fr]"
          >
            {/* Left Panel - Visual/Brand (60%) */}
            <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 overflow-hidden">
              {/* Perpetual animated gradient mesh */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                  className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-amber-500/20 via-transparent to-orange-600/10 rounded-full blur-3xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    x: [0, 50, 0],
                    y: [0, 30, 0]
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-orange-600/20 via-transparent to-amber-500/10 rounded-full blur-3xl"
                  animate={{ 
                    scale: [1.2, 1, 1.2],
                    rotate: [0, -90, 0],
                    x: [0, -50, 0],
                    y: [0, -30, 0]
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <FloatingElement>
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <Sparkles className="w-7 h-7 text-amber-400" />
                  </div>
                </FloatingElement>
              </div>

              <div className="relative z-10 space-y-6">
                <motion.h1 
                  className="text-4xl font-bold text-white tracking-tight leading-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  ChopLife<span className="text-amber-500">.</span>
                </motion.h1>
                <motion.p 
                  className="text-lg text-zinc-400 leading-relaxed max-w-[280px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Authentic Nigerian flavors delivered to your door. Join thousands enjoying the taste of home.
                </motion.p>

                {/* Live Stats with perpetual pulse */}
                <motion.div 
                  className="flex items-center gap-4 pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                    <motion.div 
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm text-zinc-300 font-medium">2,847 active now</span>
                  </div>
                </motion.div>
              </div>

              {/* Bottom decorative element */}
              <div className="relative z-10 flex items-center gap-3 text-zinc-500 text-sm">
                <Fingerprint className="w-4 h-4" />
                <span>Secure authentication</span>
              </div>
            </div>

            {/* Right Panel - Form (40%) */}
            <div className="relative flex flex-col bg-white p-8 md:p-10">
              {/* Close button - liquid glass style */}
              <MagneticButton
                onClick={onClose}
                className="absolute top-6 right-6 p-2.5 bg-zinc-100/80 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-500 border border-zinc-200/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
              >
                <X className="w-5 h-5" />
              </MagneticButton>

              {/* Back button for reset-sent */}
              {mode === 'reset-sent' && (
                <MagneticButton
                  onClick={() => switchMode('login')}
                  className="absolute top-6 left-6 p-2.5 bg-zinc-100/80 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-500 border border-zinc-200/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                >
                  <ArrowLeft className="w-5 h-5" />
                </MagneticButton>
              )}

              {/* Header */}
              <div className="mb-8 pt-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Secure Access</span>
                </motion.div>
                <motion.h2 
                  className="text-2xl font-bold text-zinc-900 tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {getTitle()}
                </motion.h2>
                <motion.p 
                  className="text-sm text-zinc-500 mt-1 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {getSubtitle()}
                </motion.p>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                {/* Error Display - Bento Card Style */}
                <AnimatePresence mode="wait">
                  {lastError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-start gap-3 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.15)]"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="text-sm text-red-700 font-medium leading-relaxed pt-1">{lastError.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Display */}
                <AnimatePresence mode="wait">
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="mb-6 p-4 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl flex items-start gap-3 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.15)]"
                    >
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm text-emerald-700 font-medium leading-relaxed pt-1">{successMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {mode !== 'reset-sent' ? (
                  <div className="space-y-5">
                    {/* Google Sign In - Liquid Glass Button */}
                    <MagneticButton
                      onClick={handleGoogleSignIn}
                      disabled={authLoading}
                      className="w-full py-3.5 px-5 bg-white border border-zinc-200 rounded-2xl font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]"
                    >
                      <Chrome className="w-5 h-5 text-zinc-600" />
                      <span>Continue with Google</span>
                    </MagneticButton>

                    {/* Divider with animated line */}
                    <div className="relative flex items-center gap-4">
                      <motion.div 
                        className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      />
                      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">or email</span>
                      <motion.div 
                        className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      />
                    </div>

                    {/* Form - Bento Input Architecture */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Email Input with Liquid Glass Effect */}
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <label className="block text-sm font-semibold text-zinc-700">
                          Email address
                        </label>
                        <div 
                          className={`relative group transition-all duration-300 ${
                            activeField === 'email' ? 'scale-[1.02]' : ''
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl transition-opacity duration-300 ${activeField === 'email' ? 'opacity-100' : 'opacity-0'}`} />
                          <div className="relative flex items-center">
                            <Mail className={`absolute left-4 w-5 h-5 transition-colors duration-200 ${activeField === 'email' ? 'text-amber-600' : 'text-zinc-400'}`} />
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              onFocus={() => setActiveField('email')}
                              onBlur={() => setActiveField(null)}
                              className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-2xl font-medium text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] ${
                                formErrors.email || lastError?.field === 'email'
                                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                  : activeField === 'email'
                                  ? 'border-amber-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10'
                                  : 'border-zinc-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10'
                              }`}
                              placeholder="you@example.com"
                            />
                          </div>
                        </div>
                        {formErrors.email && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-600 font-medium"
                          >
                            {formErrors.email}
                          </motion.p>
                        )}
                      </motion.div>

                      {/* Display Name (Register only) */}
                      {mode === 'register' && (
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <label className="block text-sm font-semibold text-zinc-700">
                            Full name
                          </label>
                          <div 
                            className={`relative group transition-all duration-300 ${
                              activeField === 'displayName' ? 'scale-[1.02]' : ''
                            }`}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl transition-opacity duration-300 ${activeField === 'displayName' ? 'opacity-100' : 'opacity-0'}`} />
                            <div className="relative flex items-center">
                              <UserIcon className={`absolute left-4 w-5 h-5 transition-colors duration-200 ${activeField === 'displayName' ? 'text-amber-600' : 'text-zinc-400'}`} />
                              <input
                                type="text"
                                value={formData.displayName}
                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                onFocus={() => setActiveField('displayName')}
                                onBlur={() => setActiveField(null)}
                                className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-2xl font-medium text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] ${
                                  formErrors.displayName
                                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                    : activeField === 'displayName'
                                    ? 'border-amber-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10'
                                    : 'border-zinc-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10'
                                }`}
                                placeholder="John Doe"
                              />
                            </div>
                          </div>
                          {formErrors.displayName && (
                            <motion.p 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-red-600 font-medium"
                            >
                              {formErrors.displayName}
                            </motion.p>
                          )}
                        </motion.div>
                      )}

                      {/* Password (not for forgot-password) */}
                      {mode !== 'forgot-password' && (
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35 }}
                        >
                          <label className="block text-sm font-semibold text-zinc-700">
                            Password
                          </label>
                          <div 
                            className={`relative group transition-all duration-300 ${
                              activeField === 'password' ? 'scale-[1.02]' : ''
                            }`}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl transition-opacity duration-300 ${activeField === 'password' ? 'opacity-100' : 'opacity-0'}`} />
                            <div className="relative flex items-center">
                              <Lock className={`absolute left-4 w-5 h-5 transition-colors duration-200 ${activeField === 'password' ? 'text-amber-600' : 'text-zinc-400'}`} />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                onFocus={() => setActiveField('password')}
                                onBlur={() => setActiveField(null)}
                                className={`w-full pl-12 pr-12 py-3.5 bg-white border-2 rounded-2xl font-medium text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] ${
                                  formErrors.password || lastError?.field === 'password'
                                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                    : activeField === 'password'
                                    ? 'border-amber-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10'
                                    : 'border-zinc-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10'
                                }`}
                                placeholder="••••••••"
                              />
                              <MagneticButton
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 p-2 text-zinc-400 hover:text-zinc-600 rounded-lg transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </MagneticButton>
                            </div>
                          </div>
                          {formErrors.password && (
                            <motion.p 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-red-600 font-medium"
                            >
                              {formErrors.password}
                            </motion.p>
                          )}
                        </motion.div>
                      )}

                      {/* Confirm Password (Register only) */}
                      {mode === 'register' && (
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <label className="block text-sm font-semibold text-zinc-700">
                            Confirm password
                          </label>
                          <div 
                            className={`relative group transition-all duration-300 ${
                              activeField === 'confirmPassword' ? 'scale-[1.02]' : ''
                            }`}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl transition-opacity duration-300 ${activeField === 'confirmPassword' ? 'opacity-100' : 'opacity-0'}`} />
                            <div className="relative flex items-center">
                              <Lock className={`absolute left-4 w-5 h-5 transition-colors duration-200 ${activeField === 'confirmPassword' ? 'text-amber-600' : 'text-zinc-400'}`} />
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                onFocus={() => setActiveField('confirmPassword')}
                                onBlur={() => setActiveField(null)}
                                className={`w-full pl-12 pr-12 py-3.5 bg-white border-2 rounded-2xl font-medium text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] ${
                                  formErrors.confirmPassword
                                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                    : activeField === 'confirmPassword'
                                    ? 'border-amber-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10'
                                    : 'border-zinc-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10'
                                }`}
                                placeholder="••••••••"
                              />
                              <MagneticButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 p-2 text-zinc-400 hover:text-zinc-600 rounded-lg transition-colors"
                              >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </MagneticButton>
                            </div>
                          </div>
                          {formErrors.confirmPassword && (
                            <motion.p 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-red-600 font-medium"
                            >
                              {formErrors.confirmPassword}
                            </motion.p>
                          )}
                        </motion.div>
                      )}

                      {/* Forgot Password Link (Login only) */}
                      {mode === 'login' && (
                        <motion.div 
                          className="text-right -mt-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.45 }}
                        >
                          <MagneticButton
                            onClick={() => switchMode('forgot-password')}
                            className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                          >
                            Forgot password?
                          </MagneticButton>
                        </motion.div>
                      )}

                      {/* Submit Button - Premium Gradient with Shimmer */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <MagneticButton
                          onClick={handleSubmit as any}
                          disabled={authLoading}
                          className="relative w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_-8px_rgba(245,158,11,0.5)] overflow-hidden group"
                        >
                          {authLoading && <ShimmerLoader />}
                          <span className="relative z-10 flex items-center gap-2">
                            {authLoading ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Please wait...</span>
                              </>
                            ) : (
                              <>
                                <span>
                                  {mode === 'login' && 'Sign In'}
                                  {mode === 'register' && 'Create Account'}
                                  {mode === 'forgot-password' && 'Send Reset Link'}
                                </span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                              </>
                            )}
                          </span>
                        </MagneticButton>
                      </motion.div>
                    </form>

                    {/* Mode Switch */}
                    <motion.div 
                      className="mt-6 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.55 }}
                    >
                      {mode === 'login' ? (
                        <p className="text-zinc-500 text-sm">
                          Don't have an account?{' '}
                          <button
                            onClick={() => switchMode('register')}
                            className="text-amber-600 hover:text-amber-700 font-bold transition-colors"
                          >
                            Sign up
                          </button>
                        </p>
                      ) : mode === 'register' ? (
                        <p className="text-zinc-500 text-sm">
                          Already have an account?{' '}
                          <button
                            onClick={() => switchMode('login')}
                            className="text-amber-600 hover:text-amber-700 font-bold transition-colors"
                          >
                            Sign in
                          </button>
                        </p>
                      ) : (
                        <p className="text-zinc-500 text-sm">
                          Remember your password?{' '}
                          <button
                            onClick={() => switchMode('login')}
                            className="text-amber-600 hover:text-amber-700 font-bold transition-colors"
                          >
                            Sign in
                          </button>
                        </p>
                      )}
                    </motion.div>
                  </div>
                ) : (
                  /* Reset Sent State - Premium Design */
                  <motion.div 
                    className="flex-1 flex flex-col items-center justify-center text-center py-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mb-6 shadow-[0_8px_30px_-8px_rgba(16,185,129,0.3)]">
                      <Mail className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-3">Check your email</h3>
                    <p className="text-zinc-500 mb-8 max-w-[280px] leading-relaxed">
                      If an account exists with this email, you will receive password reset instructions shortly.
                    </p>
                    <MagneticButton
                      onClick={() => switchMode('login')}
                      className="text-amber-600 hover:text-amber-700 font-bold"
                    >
                      Back to Sign In
                    </MagneticButton>
                  </motion.div>
                )}

              {/* Terms - Premium Typography */}
              <motion.p 
                className="mt-auto pt-6 text-xs text-center text-zinc-400 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                By continuing, you agree to our{' '}
                <a href="#" className="text-zinc-600 hover:text-amber-600 font-semibold transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-zinc-600 hover:text-amber-600 font-semibold transition-colors">Privacy Policy</a>
              </motion.p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
