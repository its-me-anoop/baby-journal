// src/components/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <Link to="/create-family" className="block mb-4 text-blue-500">Create Family</Link>
            <Link to="/invite-members" className="block mb-4 text-blue-500">Invite Members</Link>
        </div>
    );
};

export default AdminDashboard;
