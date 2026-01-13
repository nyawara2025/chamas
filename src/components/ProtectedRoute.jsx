import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getStoredUser } from '../utils/apiClient'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const user = getStoredUser()

  if (!user) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
