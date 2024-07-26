import React from 'react';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => {
    return (
        <div className={`font-bold text-xl mb-2 ${className}`}>
            {children}
        </div>
    );
};

export const CardContent = ({ children, className = '' }) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

export const CardFooter = ({ children, className = '' }) => {
    return (
        <div className={`mt-4 pt-4 border-t ${className}`}>
            {children}
        </div>
    );
};

export default Card;