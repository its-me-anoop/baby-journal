// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch {
            console.error('Failed to log out');
        }
    };

    return (
        <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div>
                <Link to="/" className="mr-4">Home</Link>
                {currentUser && (
                    <>
                        <Link to="/admin" className="mr-4">Admin Dashboard</Link>
                        <Link to="/parent" className="mr-4">Parent Dashboard</Link>
                        <Link to="/carer" className="mr-4">Carer Dashboard</Link>
                        <Link to="/family" className="mr-4">Family</Link>
                    </>
                )}
            </div>
            <div>
                {currentUser ? (
                    <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
                ) : (
                    <>
                        <Link to="/login" className="mr-4">Login</Link>
                        <Link to="/register" className="mr-4">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
