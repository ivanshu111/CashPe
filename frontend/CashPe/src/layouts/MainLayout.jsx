// D:\CashPe\frontend\CashPe\src\layouts\MainLayout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTER_PATH } from '../constants/routes';

function MainLayout() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Assuming an auth slice

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to={ROUTER_PATH.HOME} className="text-xl font-bold">CashPe</Link>
          <div>
            <ul className="flex space-x-4">
              <li>
                <Link to={ROUTER_PATH.HOME} className="hover:text-gray-300">Home</Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <Link to={ROUTER_PATH.DASHBOARD} className="hover:text-gray-300">Dashboard</Link>
                  </li>
                  <li>
                    <Link to={ROUTER_PATH.TRANSACTIONS} className="hover:text-gray-300">Transactions</Link>
                  </li>
                  <li>
                    <Link to={ROUTER_PATH.SETTINGS} className="hover:text-gray-300">Settings</Link>
                  </li>
                </>
              )}
              {!isAuthenticated && (
                <li>
                  <Link to={ROUTER_PATH.LOGIN} className="hover:text-gray-300">Login</Link>
                </li>
              )}
              {/* Add a logout button here if isAuthenticated is true */}
            </ul>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <Outlet /> {/* This is where nested routes will render */}
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} CashPe. All rights reserved.
      </footer>
    </div>
  );
}

export default MainLayout;
