import React, { forwardRef } from 'react';

export interface IconButtonProps {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  label?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'action' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  onClick,
  label,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button'
}, ref) => {
  const baseClasses = 'flex items-center justify-center gap-2 rounded-md transition-colors';
  const variantClasses = {
    primary: 'bg-gray-700 hover:bg-gray-700 text-white hover:bg-gray-700',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-200 hover:bg-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    action: 'bg-blue-600 hover:bg-blue-700 text-white',
    custom: ''
  };
  const sizeClasses = {
    sm: label ? 'p-1.5 text-sm' : 'p-1.5',
    md: label ? 'p-2 text-base' : 'p-2',
    lg: label ? 'p-3 text-lg' : 'p-3'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(e);
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      disabled={disabled}
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title={label}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
});

IconButton.displayName = 'IconButton';