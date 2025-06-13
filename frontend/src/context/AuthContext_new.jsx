// CampusKarma Authentication Context
// Purpose: Global auth state management with React Context

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import apiService from '../services/api'

// Auth states
const AUTH_STATES = {
  CHECKING: 'checking',
  GUEST: 'guest',
  MAGIC_LINK_SENT: 'magic_link_sent',
  AUTHENTICATED: 'authenticated',
  ERROR: 'error'
}

// Auth actions
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_GUEST: 'SET_GUEST',
  SET_MAGIC_LINK_SENT: 'SET_MAGIC_LINK_SENT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGOUT: 'LOGOUT'
}

// Initial state
const initialState = {
  status: AUTH_STATES.CHECKING,
  user: null,
  error: null,
  loading: false,
  magicLinkEmail: null
}

// Auth reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        status: AUTH_STATES.AUTHENTICATED,
        user: action.payload,
        error: null,
        loading: false,
        magicLinkEmail: null
      }
    
    case AUTH_ACTIONS.SET_GUEST:
      return {
        ...state,
        status: AUTH_STATES.GUEST,
        user: null,
        error: null,
        loading: false,
        magicLinkEmail: null
      }
    
    case AUTH_ACTIONS.SET_MAGIC_LINK_SENT:
      return {
        ...state,
        status: AUTH_STATES.MAGIC_LINK_SENT,
        error: null,
        loading: false,
        magicLinkEmail: action.payload
      }
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        status: AUTH_STATES.ERROR,
        error: action.payload,
        loading: false
      }
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        status: AUTH_STATES.GUEST
      }
    
    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Check current auth status
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('campuskarma_token')
    
    if (!token) {
      dispatch({ type: AUTH_ACTIONS.SET_GUEST })
      return
    }

    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      const user = await apiService.getCurrentUser()
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user.data })
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('campuskarma_token')
      dispatch({ type: AUTH_ACTIONS.SET_GUEST })
    }
  }

  // Send magic link
  const sendMagicLink = async (email) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      
      // Validate .edu email
      if (!email.endsWith('.edu')) {
        throw new Error('Please use your college .edu email address')
      }

      await apiService.sendMagicLink(email)
      dispatch({ type: AUTH_ACTIONS.SET_MAGIC_LINK_SENT, payload: email })
      
      return { success: true }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  // Verify magic link
  const verifyMagicLink = async (token, email) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      
      const response = await apiService.verifyMagicLink(token, email)
      
      // Set auth token
      apiService.setToken(response.data.token)
      
      // Set user data
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user })
      
      return { success: true, user: response.data.user }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message })
      return { success: false, error: error.message }
    }
  }

  // Logout
  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
    }
  }

  // Refresh token
  const refreshToken = async () => {
    try {
      const response = await apiService.refreshToken()
      apiService.setToken(response.data.token)
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      return false
    }
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

  // Context value
  const value = {
    // State
    ...state,
    isAuthenticated: state.status === AUTH_STATES.AUTHENTICATED,
    isGuest: state.status === AUTH_STATES.GUEST,
    isChecking: state.status === AUTH_STATES.CHECKING,
    isMagicLinkSent: state.status === AUTH_STATES.MAGIC_LINK_SENT,
    
    // Actions
    sendMagicLink,
    verifyMagicLink,
    logout,
    refreshToken,
    clearError,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export default AuthContext
