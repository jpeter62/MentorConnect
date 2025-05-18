import React from 'react';

// A simple button component that accepts various props like className, onClick, variant, and children
const Button = ({
  children,
  onClick,
  className = '',
  variant = 'default', // You can have 'default', 'outline', or other variants
  disabled = false,
}) => {
  // Apply different styles based on the variant type
  const buttonStyles = {
    default: 'bg-primary text-white hover:bg-primary/90',
    outline: 'bg-transparent border border-gray-300 text-gray-900 hover:bg-gray-100',
  };

  const baseStyles = 'px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium';
  
  // Merge the base styles, variant styles, and any custom className passed
  const buttonClass = `${baseStyles} ${buttonStyles[variant]} ${className}`;

  return (
    <button
      onClick={onClick}
      className={buttonClass}
      disabled={disabled}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {children}
    </button>
  );
};

export default Button;
