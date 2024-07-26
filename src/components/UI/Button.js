import React from 'react';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    className = '',
    disabled = false
}) => {
    const baseStyle = 'px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-50';
    const variantStyles = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyle} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;