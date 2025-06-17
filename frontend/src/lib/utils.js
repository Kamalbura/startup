/**
 * Utility Functions
 * 
 * Common utility functions used throughout the application.
 * Includes class name utilities, formatting helpers, and more.
 */

/**
 * Combines class names using a simple approach
 * Alternative to clsx/classnames for lightweight class name concatenation
 * 
 * @param {...string} classes - Class names to combine
 * @returns {string} Combined class names
 * 
 * @example
 * cn('bg-blue-500', 'text-white', condition && 'font-bold')
 * // Returns: 'bg-blue-500 text-white font-bold' (if condition is true)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Formats a number with commas for thousands separators
 * 
 * @param {number|string} num - Number to format
 * @returns {string} Formatted number string
 * 
 * @example
 * formatNumber(1234567) // Returns: '1,234,567'
 */
export function formatNumber(num) {
  return new Intl.NumberFormat().format(num)
}

/**
 * Formats a currency value
 * 
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted currency string
 * 
 * @example
 * formatCurrency(1234.56) // Returns: '$1,234.56'
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * Formats a date to a readable string
 * 
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 * 
 * @example
 * formatDate(new Date()) // Returns: 'Dec 25, 2023'
 * formatDate(new Date(), { dateStyle: 'full' }) // Returns: 'Monday, December 25, 2023'
 */
export function formatDate(date, options = { dateStyle: 'medium' }) {
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
}

/**
 * Formats a relative time (time ago)
 * 
 * @param {Date|string} date - Date to compare against now
 * @returns {string} Relative time string
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // Returns: '1 hour ago'
 */
export function formatRelativeTime(date) {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now - target) / 1000)

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
    }
  }

  return 'just now'
}

/**
 * Truncates text to a specified length
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default: 100)
 * @param {string} suffix - Suffix to add when truncated (default: '...')
 * @returns {string} Truncated text
 * 
 * @example
 * truncateText('This is a very long text', 10) // Returns: 'This is a...'
 */
export function truncateText(text, maxLength = 100, suffix = '...') {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Capitalizes the first letter of a string
 * 
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 * 
 * @example
 * capitalize('hello world') // Returns: 'Hello world'
 */
export function capitalize(str) {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Converts a string to title case
 * 
 * @param {string} str - String to convert
 * @returns {string} Title case string
 * 
 * @example
 * toTitleCase('hello world') // Returns: 'Hello World'
 */
export function toTitleCase(str) {
  if (!str) return str
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  )
}

/**
 * Generates a random ID string
 * 
 * @param {number} length - Length of the ID (default: 8)
 * @returns {string} Random ID string
 * 
 * @example
 * generateId() // Returns: 'a7b9x2c4'
 * generateId(12) // Returns: 'a7b9x2c4f8g1'
 */
export function generateId(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Debounces a function call
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 * 
 * @example
 * const debouncedSearch = debounce(searchFunction, 300)
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttles a function call
 * 
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 * 
 * @example
 * const throttledScroll = throttle(onScroll, 100)
 */
export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Deep clones an object
 * 
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 * 
 * @example
 * const clone = deepClone(originalObject)
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

/**
 * Validates an email address
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 * 
 * @example
 * isValidEmail('user@example.com') // Returns: true
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a URL
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is valid
 * 
 * @example
 * isValidUrl('https://example.com') // Returns: true
 */
export function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
