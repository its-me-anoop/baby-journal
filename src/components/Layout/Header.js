import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFamilyContext } from '../../contexts/FamilyContext';
import Button from '../UI/Button';

const Header = () => {
    const { user, signOut } = useAuth();
    const { selectedFamily } = useFamilyContext();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <header className="bg-blue-500 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">Baby Journal</Link>
                <nav>
                    <ul className="flex space-x-4">
                        {!user ? (
                            <>
                                <li><Link to="/login" className="hover:underline">Login</Link></li>
                                <li><Link to="/signup" className="hover:underline">Sign Up</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/" className="hover:underline">Home</Link></li>
                                {selectedFamily && (
                                    <>
                                        <li><Link to={`/children/${selectedFamily.id}`} className="hover:underline">Children</Link></li>
                                        <li><Link to={`/journal/${selectedFamily.id}`} className="hover:underline">Journal</Link></li>
                                        <li><Link to={`/dashboard/${selectedFamily.id}`} className="hover:underline">Dashboard</Link></li>
                                    </>
                                )}
                                <li><Link to="/profile" className="hover:underline">Profile</Link></li>
                                <li><Button onClick={handleSignOut}>Sign Out</Button></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;