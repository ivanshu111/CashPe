import React from 'react';

const AdminPage = () => {
  return (
    <div className="p-8 bg-base-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg">Welcome to the Admin Page. More features will be added here soon.</p>
        {/* Admin specific content will go here */}
      </div>
    </div>
  );
};

export default AdminPage;
