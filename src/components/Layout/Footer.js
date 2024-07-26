import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-200 p-4 mt-8">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Baby Journal App. All rights reserved.</p>
                <p className="mt-2">
                    <a href="/privacy" className="text-blue-500 hover:underline mr-4">Privacy Policy</a>
                    <a href="/terms" className="text-blue-500 hover:underline">Terms of Service</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;