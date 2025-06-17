import { useState, useEffect, useCallback } from 'react'
import apiClient, { ApiError } from '../lib/api'

/**
 * Hook for making API calls with loading states and error handling
 */
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const {
    immediate = true,
    method = 'GET',
    params = null,
    ...requestOptions
  } = options

  const execute = useCallback(async (overrideOptions = {}) => {
    try {
      setLoading(true)
      setError(null)

      const finalOptions = {
        method,
        ...requestOptions,
        ...overrideOptions
      }

      let response
      switch (finalOptions.method.toUpperCase()) {
        case 'GET':
          response = await apiClient.get(url, finalOptions)
          break
        case 'POST':
          response = await apiClient.post(url, params, finalOptions)
          break
        case 'PUT':
          response = await apiClient.put(url, params, finalOptions)
          break
        case 'PATCH':
          response = await apiClient.patch(url, params, finalOptions)
          break
        case 'DELETE':
          response = await apiClient.delete(url, finalOptions)
          break
        default:
          throw new Error(`Unsupported HTTP method: ${finalOptions.method}`)
      }

      setData(response)
      return response
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, method, params, requestOptions])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  const refetch = useCallback(() => execute(), [execute])

  return {
    data,
    loading,
    error,
    execute,
    refetch,
    isError: !!error,
    isLoading: loading,
    isSuccess: !loading && !error && data !== null
  }
}

/**
 * Hook for making API mutations (POST, PUT, PATCH, DELETE)
 */
export const useMutation = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const {
    method = 'POST',
    onSuccess,
    onError,
    ...requestOptions
  } = options

  const mutate = useCallback(async (params = null, overrideOptions = {}) => {
    try {
      setLoading(true)
      setError(null)

      const finalOptions = {
        method,
        ...requestOptions,
        ...overrideOptions
      }

      let response
      switch (finalOptions.method.toUpperCase()) {
        case 'POST':
          response = await apiClient.post(url, params, finalOptions)
          break
        case 'PUT':
          response = await apiClient.put(url, params, finalOptions)
          break
        case 'PATCH':
          response = await apiClient.patch(url, params, finalOptions)
          break
        case 'DELETE':
          response = await apiClient.delete(url, finalOptions)
          break
        default:
          throw new Error(`Unsupported HTTP method: ${finalOptions.method}`)
      }

      setData(response)
      
      if (onSuccess) {
        onSuccess(response)
      }
      
      return response
    } catch (err) {
      setError(err)
      
      if (onError) {
        onError(err)
      }
      
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, method, onSuccess, onError, requestOptions])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    mutate,
    reset,
    isError: !!error,
    isLoading: loading,
    isSuccess: !loading && !error && data !== null
  }
}

/**
 * Hook for paginated API calls
 */
export const usePaginatedApi = (url, options = {}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const {
    pageSize = 20,
    immediate = true,
    ...requestOptions
  } = options

  const fetchPage = useCallback(async (pageNumber = 1, reset = false) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.get(url, {
        ...requestOptions,
        params: {
          page: pageNumber,
          pageSize,
          ...requestOptions.params
        }
      })

      const newData = response.data || response.items || response
      const total = response.total || response.totalCount || 0
      const currentPage = response.page || pageNumber
      const totalPages = Math.ceil(total / pageSize)

      if (reset) {
        setData(newData)
      } else {
        setData(prev => [...prev, ...newData])
      }

      setHasMore(currentPage < totalPages)
      setPage(currentPage)

      return response
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, pageSize, requestOptions])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      return fetchPage(page + 1)
    }
  }, [fetchPage, loading, hasMore, page])

  const refresh = useCallback(() => {
    setPage(1)
    return fetchPage(1, true)
  }, [fetchPage])

  useEffect(() => {
    if (immediate) {
      fetchPage(1, true)
    }
  }, [fetchPage, immediate])

  return {
    data,
    loading,
    error,
    hasMore,
    page,
    loadMore,
    refresh,
    isError: !!error,
    isLoading: loading,
    isEmpty: data.length === 0 && !loading && !error
  }
}

/**
 * Hook for file uploads with progress tracking
 */
export const useFileUpload = (url, options = {}) => {
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const {
    onSuccess,
    onError,
    onProgress,
    ...requestOptions
  } = options

  const upload = useCallback(async (file) => {
    try {
      setLoading(true)
      setError(null)
      setProgress(0)

      const response = await apiClient.uploadFile(url, file, (progressValue) => {
        setProgress(progressValue)
        if (onProgress) {
          onProgress(progressValue)
        }
      })

      setData(response)
      
      if (onSuccess) {
        onSuccess(response)
      }
      
      return response
    } catch (err) {
      setError(err)
      
      if (onError) {
        onError(err)
      }
      
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, onSuccess, onError, onProgress])

  const reset = useCallback(() => {
    setProgress(0)
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    upload,
    progress,
    loading,
    error,
    data,
    reset,
    isError: !!error,
    isLoading: loading,
    isSuccess: !loading && !error && data !== null
  }
}
