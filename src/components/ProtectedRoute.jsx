import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component to restrict access to authenticated users only
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authenticated
 * @param {string} props.redirectTo - Path to redirect if not authenticated (default: '/login')
 * 
 * @example
 * // In your router configuration
 * <Route 
 *   path="/dashboard" 
 *   element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   } 
 * />
 */
const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated, isLoading } = UserAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    // Save the location they were trying to access
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;
