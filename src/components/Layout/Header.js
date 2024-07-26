import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/UI/Button';

const Header = () => {
    const { user, signOut } = useAuth();

    return (
        <header className="bg-blue-500 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">Baby Journal</Link>
                <nav>
                    <ul className="flex space-x-4">
                        {user ? (
                            <>
                                <li><Link to="/journal" className="hover:underline">Journal</Link></li>
                                <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
                                <li><Link to="/family" className="hover:underline">Family</Link></li>
                                <li><Button onClick={signOut} variant="outline">Sign Out</Button></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login" className="hover:underline">Login</Link></li>
                                <li><Link to="/signup" className="hover:underline">Sign Up</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;