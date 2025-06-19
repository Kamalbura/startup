// SkillLance Firebase Authentication Context
// Purpose: Global auth state management with Firebase Auth

import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import firebaseAuthService from '../services/firebaseAuth';

// Auth states
const AUTH_STATES = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  EMAIL_VERIFICATION_REQUIRED: 'email_verification_required',
  PROFILE_INCOMPLETE: 'profile_incomplete',
  ERROR: 'error'
};

// Auth actions
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_UNAUTHENTICATED: 'SET_UNAUTHENTICATED',
  SET_EMAIL_VERIFICATION_REQUIRED: 'SET_EMAIL_VERIFICATION_REQUIRED',
  SET_PROFILE_INCOMPLETE: 'SET_PROFILE_INCOMPLETE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_PROFILE: 'UPDATE_PROFILE'
};

// Initial state
const initialState = {
  status: AUTH_STATES.LOADING,
  user: null,
  profile: null,
  error: null,
  loading: false
};

// Auth reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { 
        ...state, 
        loading: action.payload 
      };
    
    case AUTH_ACTIONS.SET_AUTHENTICATED:
      return {
        ...state,
        status: AUTH_STATES.AUTHENTICATED,
        user: action.payload.user,
        profile: action.payload.profile,
        error: null,
        loading: false
      };
    
    case AUTH_ACTIONS.SET_UNAUTHENTICATED:
      return {
        ...state,
        status: AUTH_STATES.UNAUTHENTICATED,
        user: null,
        profile: null,
        error: null,
        loading: false
      };
    
    case AUTH_ACTIONS.SET_EMAIL_VERIFICATION_REQUIRED:
      return {
        ...state,
        status: AUTH_STATES.EMAIL_VERIFICATION_REQUIRED,
        user: action.payload.user,
        profile: action.payload.profile,
        error: null,
        loading: false
      };
    
    case AUTH_ACTIONS.SET_PROFILE_INCOMPLETE:
      return {
        ...state,
        status: AUTH_STATES.PROFILE_INCOMPLETE,
        user: action.payload.user,
        profile: action.payload.profile,
        error: null,
        loading: false
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        profile: { ...state.profile, ...action.payload }
      };
    
    default:
      return state;
  }
}

// Create contexts
const AuthContext = createContext();
const AuthDispatchContext = createContext();

// Auth Provider Component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => state, [state]);
  const dispatchValue = useMemo(() => dispatch, [dispatch]);
  // Handle authentication state changes
  useEffect(() => {
    // Only log in development
    if (import.meta.env.DEV) {
      console.log('🔥 Setting up Firebase auth listener...');
    }
    
    try {
      const unsubscribe = firebaseAuthService.onAuthStateChange(async (user) => {
        if (import.meta.env.DEV) {
          console.log('🔥 Auth state changed:', user ? 'User logged in' : 'No user');
        }
        
        if (user) {
          try {
            // Get user profile from Firestore (with caching)
            const profile = await firebaseAuthService.getUserProfile(user.uid);
            
            if (!user.emailVerified) {
              // For development, allow unverified emails
              if (!profile?.displayName && !user.displayName) {
                dispatch({
                  type: AUTH_ACTIONS.SET_PROFILE_INCOMPLETE,
                  payload: { user, profile }
                });
              } else {
                dispatch({
                  type: AUTH_ACTIONS.SET_AUTHENTICATED,
                  payload: { user, profile }
                });
              }
            } else if (!profile?.displayName && !user.displayName) {
              dispatch({
                type: AUTH_ACTIONS.SET_PROFILE_INCOMPLETE,
                payload: { user, profile }
              });
            } else {
              dispatch({
                type: AUTH_ACTIONS.SET_AUTHENTICATED,
                payload: { user, profile }
              });
            }
          } catch (error) {
            if (import.meta.env.DEV) {
              console.error('🔥 Error fetching user profile:', error);
            }
            dispatch({
              type: AUTH_ACTIONS.SET_ERROR,
              payload: error.message
            });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_UNAUTHENTICATED });
        }
      });

      return () => {
        if (import.meta.env.DEV) {
          console.log('🔥 Cleaning up auth listener');
        }
        unsubscribe();
      };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('🔥 Error setting up auth listener:', error);
      }
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,  
        payload: error.message
      });
      return () => {}; // Return empty cleanup function
    }
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>
      <AuthDispatchContext.Provider value={dispatchValue}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hooks for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within an AuthProvider');
  }
  return context;
}

// Auth action creators
export const authActions = {
  setLoading: (loading) => ({
    type: AUTH_ACTIONS.SET_LOADING,
    payload: loading
  }),

  setAuthenticated: (user, profile) => ({
    type: AUTH_ACTIONS.SET_AUTHENTICATED,
    payload: { user, profile }
  }),

  setUnauthenticated: () => ({
    type: AUTH_ACTIONS.SET_UNAUTHENTICATED
  }),

  setEmailVerificationRequired: (user, profile) => ({
    type: AUTH_ACTIONS.SET_EMAIL_VERIFICATION_REQUIRED,
    payload: { user, profile }
  }),

  setProfileIncomplete: (user, profile) => ({
    type: AUTH_ACTIONS.SET_PROFILE_INCOMPLETE,
    payload: { user, profile }
  }),

  setError: (error) => ({
    type: AUTH_ACTIONS.SET_ERROR,
    payload: error
  }),

  clearError: () => ({
    type: AUTH_ACTIONS.CLEAR_ERROR
  }),

  updateProfile: (updates) => ({
    type: AUTH_ACTIONS.UPDATE_PROFILE,
    payload: updates
  })
};

// Convenience hook for auth actions
export function useAuthActions() {
  const dispatch = useAuthDispatch();

  return {
    // Sign up with email and password
    signUp: async (email, password, userData = {}) => {
      dispatch(authActions.setLoading(true));
      try {
        const result = await firebaseAuthService.signUpWithEmail(email, password, userData);
        
        if (result.needsEmailVerification) {
          dispatch(authActions.setEmailVerificationRequired(result.user, result.profile));
          return { needsEmailVerification: true };
        } else {
          dispatch(authActions.setAuthenticated(result.user, result.profile));
          return { success: true };
        }
      } catch (error) {
        dispatch(authActions.setError(error.message));
        throw error;
      } finally {
        dispatch(authActions.setLoading(false));
      }
    },

    // Sign in with email and password
    signIn: async (email, password) => {
      dispatch(authActions.setLoading(true));
      try {
        const result = await firebaseAuthService.signInWithEmail(email, password);
        dispatch(authActions.setAuthenticated(result.user, result.profile));
        return { success: true };
      } catch (error) {
        dispatch(authActions.setError(error.message));
        throw error;
      } finally {
        dispatch(authActions.setLoading(false));
      }
    },

    // Sign in with Google
    signInWithGoogle: async () => {
      dispatch(authActions.setLoading(true));
      try {
        const result = await firebaseAuthService.signInWithGoogle();
        dispatch(authActions.setAuthenticated(result.user, result.profile));
        return { success: true };
      } catch (error) {
        dispatch(authActions.setError(error.message));
        throw error;
      } finally {
        dispatch(authActions.setLoading(false));
      }
    },

    // Reset password
    resetPassword: async (email) => {
      dispatch(authActions.setLoading(true));
      try {
        await firebaseAuthService.resetPassword(email);
        return { success: true };
      } catch (error) {
        dispatch(authActions.setError(error.message));
        throw error;
      } finally {
        dispatch(authActions.setLoading(false));
      }
    },

    // Update user profile
    updateProfile: async (updates) => {
      dispatch(authActions.setLoading(true));
      try {
        const currentUser = firebaseAuthService.getCurrentUser();
        if (currentUser) {
          await firebaseAuthService.updateUserProfile(currentUser.uid, updates);
          dispatch(authActions.updateProfile(updates));
          return { success: true };
        }
        throw new Error('No authenticated user');
      } catch (error) {
        dispatch(authActions.setError(error.message));
        throw error;
      } finally {
        dispatch(authActions.setLoading(false));
      }
    },

    // Sign out
    signOut: async () => {
      dispatch(authActions.setLoading(true));
      try {
        await firebaseAuthService.signOut();
        dispatch(authActions.setUnauthenticated());
        return { success: true };
      } catch (error) {
        dispatch(authActions.setError(error.message));
        throw error;
      } finally {
        dispatch(authActions.setLoading(false));
      }
    },

    // Clear error
    clearError: () => {
      dispatch(authActions.clearError());
    }
  };
}

// Export auth states for component usage
export { AUTH_STATES };
