import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Button } from './button';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    children, 
    isLoading = false, 
    loadingText,
    disabled,
    className = '',
    variant = 'default',
    size = 'default',
    ...props 
  }, ref) => {
    const spinnerColor = variant === 'outline' || variant === 'ghost' || variant === 'link' 
      ? 'primary' 
      : 'white';
    
    const spinnerSize = size === 'sm' ? 'sm' : 'sm';
    
    return (
      <Button
        ref={ref}
        disabled={isLoading || disabled}
        className={`${className} ${isLoading ? 'relative' : ''}`}
        variant={variant}
        size={size}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size={spinnerSize} color={spinnerColor} />
          </span>
        )}
        <span className={isLoading ? 'invisible' : ''}>
          {loadingText && isLoading ? loadingText : children}
        </span>
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton }; 