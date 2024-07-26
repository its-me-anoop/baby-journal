// src/components/AdminDashboard.js
import React from 'react';
import Family from './Family';

const AdminDashboard = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <Family />
        </div>
    );
};

export default AdminDashboard;
