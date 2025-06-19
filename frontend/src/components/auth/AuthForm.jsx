import React, { useState } from 'react'
import { useAuth, useAuthActions } from '../../context/FirebaseAuthContext'
import { Button } from '../ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Input } from '../ui/Input'
import { LoadingSpinner } from '../ui/LoadingSpinner'

const AuthForm = ({ 
  mode = 'login', // 'login' or 'register'
  onToggleMode,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { loading } = useAuth()
  const { signIn, signUp, signInWithGoogle } = useAuthActions()

  const isRegisterMode = mode === 'register'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear errors when typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    if (isRegisterMode) {
      if (!formData.firstName || !formData.lastName) {
        setError('Please enter your first and last name')
        setIsLoading(false)
        return
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setIsLoading(false)
        return
      }
    }

    try {
      if (isRegisterMode) {
        await signUp(formData.email, formData.password, {
          displayName: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName
        })
      } else {
        await signIn(formData.email, formData.password)
      }
      
      // Call success callback if provided
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.message || `${isRegisterMode ? 'Registration' : 'Login'} failed`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    setIsLoading(true)
    setError('')

    try {
      if (provider === 'google') {
        await signInWithGoogle()
      }
      // Note: GitHub login not available in FirebaseAuthContext yet
      
      // Call success callback if provided
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.message || `${provider} ${isRegisterMode ? 'registration' : 'login'} failed`)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {isRegisterMode ? 'Create Account' : 'Welcome Back'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name fields for registration */}
          {isRegisterMode && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading || isLoading}
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading || isLoading}
              />
            </div>
          )}
          
          {/* Email */}
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading || isLoading}
            />
          </div>
          
          {/* Password */}
          <div>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading || isLoading}
            />
          </div>
          
          {/* Confirm Password for registration */}
          {isRegisterMode && (
            <div>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading || isLoading}
              />
            </div>
          )}
          
          {/* Error display */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
            {/* Submit button */}
          <Button type="submit" className="w-full" disabled={loading || isLoading}>
            {(loading || isLoading) ? (
              <LoadingSpinner size="sm" variant="white" />
            ) : (
              <span>{isRegisterMode ? 'Create Account' : 'Sign In'}</span>
            )}
          </Button>
        </form>

        {/* Social login divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social login buttons */}
        <div className="grid grid-cols-1 gap-4">
          <Button
            variant="outline"
            onClick={() => handleSocialLogin('google')}
            disabled={loading || isLoading}
          >
            Google
          </Button>
        </div>

        {/* Mode toggle */}
        {onToggleMode && (
          <div className="text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-primary hover:underline"
              disabled={loading || isLoading}
            >
              {isRegisterMode 
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { AuthForm }
