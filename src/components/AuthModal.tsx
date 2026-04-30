import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onAuthSuccess?: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-sent';

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
          setSuccessMessage('Password reset email sent! Check your inbox.');
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
      case 'login': return 'Welcome Back';
      case 'register': return 'Create Account';
      case 'forgot-password': return 'Reset Password';
      case 'reset-sent': return 'Check Your Email';
      default: return 'Authentication';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Sign in to continue your ChopLife experience';
      case 'register': return 'Join ChopLife for exclusive offers and faster checkout';
      case 'forgot-password': return 'Enter your email to receive reset instructions';
      case 'reset-sent': return `We've sent instructions to ${formData.email}`;
      default: return '';
    }
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-white p-8 pb-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Back button for reset-sent mode */}
              {mode === 'reset-sent' && (
                <button
                  onClick={() => switchMode('login')}
                  className="absolute top-4 left-4 p-2 hover:bg-black/5 rounded-full transition-colors text-gray-500"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
                <p className="text-gray-500 mt-2 text-sm">{getSubtitle()}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 pt-4">
              {/* Error Display */}
              {lastError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-red-600">{lastError.message}</span>
                </motion.div>
              )}

              {/* Success Display */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-green-600">{successMessage}</span>
                </motion.div>
              )}

              {mode !== 'reset-sent' ? (
                <>
                  {/* Google Sign In */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={authLoading}
                    className="w-full py-3 px-4 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 mb-4 disabled:opacity-50"
                  >
                    <Chrome className="w-5 h-5" />
                    Continue with Google
                  </button>

                  {/* Divider */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or continue with email</span>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                            formErrors.email || lastError?.field === 'email'
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-200'
                          }`}
                          placeholder="you@example.com"
                        />
                      </div>
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Display Name (Register only) */}
                    {mode === 'register' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                              formErrors.displayName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                            }`}
                            placeholder="John Doe"
                          />
                        </div>
                        {formErrors.displayName && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.displayName}</p>
                        )}
                      </div>
                    )}

                    {/* Password (not for forgot-password) */}
                    {mode !== 'forgot-password' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                              formErrors.password || lastError?.field === 'password'
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-200'
                            }`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {formErrors.password && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                        )}
                      </div>
                    )}

                    {/* Confirm Password (Register only) */}
                    {mode === 'register' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                              formErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                            }`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {formErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                        )}
                      </div>
                    )}

                    {/* Forgot Password Link (Login only) */}
                    {mode === 'login' && (
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => switchMode('forgot-password')}
                          className="text-sm text-primary hover:text-primary-hover font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/70 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {authLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Please wait...
                        </>
                      ) : (
                        <>
                          {mode === 'login' && 'Sign In'}
                          {mode === 'register' && 'Create Account'}
                          {mode === 'forgot-password' && 'Send Reset Link'}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Mode Switch */}
                  <div className="mt-6 text-center">
                    {mode === 'login' ? (
                      <p className="text-gray-500 text-sm">
                        Don't have an account?{' '}
                        <button
                          onClick={() => switchMode('register')}
                          className="text-primary hover:text-primary-hover font-semibold"
                        >
                          Sign up
                        </button>
                      </p>
                    ) : mode === 'register' ? (
                      <p className="text-gray-500 text-sm">
                        Already have an account?{' '}
                        <button
                          onClick={() => switchMode('login')}
                          className="text-primary hover:text-primary-hover font-semibold"
                        >
                          Sign in
                        </button>
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Remember your password?{' '}
                        <button
                          onClick={() => switchMode('login')}
                          className="text-primary hover:text-primary-hover font-semibold"
                        >
                          Sign in
                        </button>
                      </p>
                    )}
                  </div>
                </>
              ) : (
                /* Reset Sent State */
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-600 mb-6">
                    If an account exists with this email, you will receive password reset instructions shortly.
                  </p>
                  <button
                    onClick={() => switchMode('login')}
                    className="text-primary hover:text-primary-hover font-semibold"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}

              {/* Terms */}
              <p className="mt-6 text-xs text-center text-gray-400">
                By continuing, you agree to our{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
