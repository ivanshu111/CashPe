// D:\CashPe\frontend\CashPe\src\components\ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTER_PATH } from '../constants/routes';

function ProtectedRoute() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Get auth status from Redux store

  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to={ROUTER_PATH.LOGIN} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
}

export default ProtectedRoute;
