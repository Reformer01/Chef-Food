import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  AuthError
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

type AuthErrorCode = 
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/weak-password'
  | 'auth/invalid-credential'
  | 'auth/popup-closed-by-user'
  | 'auth/popup-blocked'
  | 'auth/network-request-failed'
  | 'auth/too-many-requests'
  | 'auth/requires-recent-login'
  | string;

interface AuthErrorInfo {
  code: AuthErrorCode;
  message: string;
  field?: 'email' | 'password' | 'general';
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  createdAt: string;
  lastLoginAt: string;
  authProvider: 'google' | 'email';
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  authLoading: boolean;
  lastError: AuthErrorInfo | null;
  
  // Sign in methods
  signInWithGoogle: () => Promise<boolean>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  
  // Registration
  registerWithEmail: (email: string, password: string, displayName: string) => Promise<boolean>;
  
  // Password management
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  
  // Profile management
  updateUserProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateUserEmail: (newEmail: string, currentPassword: string) => Promise<boolean>;
  
  // Logout
  logout: () => Promise<void>;
  
  // Error handling
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getAuthErrorInfo = (error: AuthError): AuthErrorInfo => {
  const code = error.code as AuthErrorCode;
  
  const errorMap: Record<string, AuthErrorInfo> = {
    'auth/email-already-in-use': {
      code,
      message: 'An account with this email already exists. Please sign in instead.',
      field: 'email'
    },
    'auth/invalid-email': {
      code,
      message: 'Please enter a valid email address.',
      field: 'email'
    },
    'auth/user-disabled': {
      code,
      message: 'This account has been disabled. Please contact support.',
      field: 'general'
    },
    'auth/user-not-found': {
      code,
      message: 'No account found with this email. Please sign up.',
      field: 'email'
    },
    'auth/wrong-password': {
      code,
      message: 'Incorrect password. Please try again.',
      field: 'password'
    },
    'auth/weak-password': {
      code,
      message: 'Password must be at least 6 characters long.',
      field: 'password'
    },
    'auth/invalid-credential': {
      code,
      message: 'Invalid email or password. Please check and try again.',
      field: 'general'
    },
    'auth/popup-closed-by-user': {
      code,
      message: 'Sign-in was cancelled. Please try again.',
      field: 'general'
    },
    'auth/popup-blocked': {
      code,
      message: 'Pop-up was blocked. Please allow pop-ups for this site.',
      field: 'general'
    },
    'auth/network-request-failed': {
      code,
      message: 'Network error. Please check your connection and try again.',
      field: 'general'
    },
    'auth/too-many-requests': {
      code,
      message: 'Too many failed attempts. Please try again later.',
      field: 'general'
    },
    'auth/requires-recent-login': {
      code,
      message: 'Please sign in again to complete this action.',
      field: 'general'
    }
  };
  
  return errorMap[code] || {
    code,
    message: error.message || 'An unexpected error occurred. Please try again.',
    field: 'general'
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [lastError, setLastError] = useState<AuthErrorInfo | null>(null);

  // Initialize auth persistence
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('[Auth] Error setting persistence:', error);
    });
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          const now = new Date().toISOString();
          
          if (!userSnap.exists()) {
            // Create new user profile
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              phoneNumber: currentUser.phoneNumber || '',
              createdAt: now,
              lastLoginAt: now,
              authProvider: currentUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email'
            };
            
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
          } else {
            // Update last login and get profile
            const existingProfile = userSnap.data() as UserProfile;
            await updateDoc(userRef, { lastLoginAt: now });
            setUserProfile({ ...existingProfile, lastLoginAt: now });
          }
        } catch (error) {
          console.error('[Auth] Error managing user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    setAuthLoading(true);
    clearError();
    
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (error) {
      const authError = error as AuthError;
      setLastError(getAuthErrorInfo(authError));
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [clearError]);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<boolean> => {
    setAuthLoading(true);
    clearError();
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      const authError = error as AuthError;
      setLastError(getAuthErrorInfo(authError));
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [clearError]);

  const registerWithEmail = useCallback(async (
    email: string, 
    password: string, 
    displayName: string
  ): Promise<boolean> => {
    setAuthLoading(true);
    clearError();
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (result.user) {
        await updateProfile(result.user, { displayName });
      }
      
      return true;
    } catch (error) {
      const authError = error as AuthError;
      setLastError(getAuthErrorInfo(authError));
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [clearError]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setAuthLoading(true);
    clearError();
    
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      const authError = error as AuthError;
      setLastError(getAuthErrorInfo(authError));
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [clearError]);

  const changePassword = useCallback(async (
    currentPassword: string, 
    newPassword: string
  ): Promise<boolean> => {
    if (!user || !user.email) {
      setLastError({
        code: 'auth/no-user',
        message: 'You must be signed in to change your password.',
        field: 'general'
      });
      return false;
    }
    
    setAuthLoading(true);
    clearError();
    
    try {
      // Reauthenticate first
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      return true;
    } catch (error) {
      const authError = error as AuthError;
      setLastError(getAuthErrorInfo(authError));
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [user, clearError]);

  const updateUserProfile = useCallback(async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!user) {
      setLastError({
        code: 'auth/no-user',
        message: 'You must be signed in to update your profile.',
        field: 'general'
      });
      return false;
    }
    
    setAuthLoading(true);
    clearError();
    
    try {
      // Update Firebase Auth profile if displayName or photoURL changed
      if (data.displayName || data.photoURL) {
        await updateProfile(user, {
          displayName: data.displayName || user.displayName || undefined,
          photoURL: data.photoURL || user.photoURL || undefined
        });
      }
      
      // Update Firestore profile
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
      return true;
    } catch (error) {
      console.error('[Auth] Error updating profile:', error);
      setLastError({
        code: 'auth/update-failed',
        message: 'Failed to update profile. Please try again.',
        field: 'general'
      });
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [user, clearError]);

  const updateUserEmail = useCallback(async (
    newEmail: string, 
    currentPassword: string
  ): Promise<boolean> => {
    if (!user || !user.email) {
      setLastError({
        code: 'auth/no-user',
        message: 'You must be signed in to update your email.',
        field: 'general'
      });
      return false;
    }
    
    setAuthLoading(true);
    clearError();
    
    try {
      // Reauthenticate first
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update email
      await updateEmail(user, newEmail);
      
      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        email: newEmail,
        updatedAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      const authError = error as AuthError;
      setLastError(getAuthErrorInfo(authError));
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [user, clearError]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('[Auth] Error signing out:', error);
      throw error;
    }
  }, []);

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    userProfile,
    isAuthenticated,
    loading,
    authLoading,
    lastError,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    resetPassword,
    changePassword,
    updateUserProfile,
    updateUserEmail,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
