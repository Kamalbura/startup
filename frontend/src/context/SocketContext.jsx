import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './FirebaseAuthContext'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('campuskarma_token')
        }
      })

      newSocket.on('connect', () => {
        console.log('Connected to socket server')
        setIsConnected(true)
      })

      newSocket.on('disconnect', () => {
        console.log('Disconnected from socket server')
        setIsConnected(false)
      })

      // Listen for real-time events
      newSocket.on('new_message', (data) => {
        // Handle new message
        console.log('New message:', data)
      })

      newSocket.on('task_bid', (data) => {
        // Handle new bid on user's task
        addNotification({
          type: 'bid',
          message: `New bid received on "${data.taskTitle}"`,
          data
        })
      })

      newSocket.on('task_assigned', (data) => {
        // Handle task assignment
        addNotification({
          type: 'assignment',
          message: `You've been assigned to "${data.taskTitle}"`,
          data
        })
      })

      newSocket.on('payment_released', (data) => {
        // Handle payment release
        addNotification({
          type: 'payment',
          message: `Payment of ₹${data.amount} has been released`,
          data
        })
      })

      newSocket.on('skill_verified', (data) => {
        // Handle skill verification
        addNotification({
          type: 'skill',
          message: `Your ${data.skillName} skill has been verified!`,
          data
        })
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [isAuthenticated, user])

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    }
    
    setNotifications(prev => [newNotification, ...prev])
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id))
    }, 5000)
  }

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  // Socket event emitters
  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('join_room', roomId)
    }
  }

  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave_room', roomId)
    }
  }

  const sendMessage = (roomId, message) => {
    if (socket) {
      socket.emit('send_message', { roomId, message })
    }
  }

  const placeBid = (taskId, bidData) => {
    if (socket) {
      socket.emit('place_bid', { taskId, ...bidData })
    }
  }

  const value = {
    socket,
    isConnected,
    notifications,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    joinRoom,
    leaveRoom,
    sendMessage,
    placeBid
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
