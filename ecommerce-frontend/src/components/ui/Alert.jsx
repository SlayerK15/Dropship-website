// src/components/ui/Alert.js
import React from 'react';

export const Alert = ({ children, className = '', variant = 'default' }) => {
  const baseClasses = 'p-4 rounded-md';
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-50 text-green-800',
    error: 'bg-red-50 text-red-800',
    warning: 'bg-yellow-50 text-yellow-800',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const AlertTitle = ({ children, className = '' }) => (
  <h3 className={`text-sm font-medium ${className}`}>{children}</h3>
);

export const AlertDescription = ({ children, className = '' }) => (
  <div className={`text-sm mt-1 ${className}`}>{children}</div>
);