import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const buttonClass = `
    ${styles.btn} 
    ${styles[`btn--${variant}`]} 
    ${styles[`btn--${size}`]} 
    ${fullWidth ? styles['btn--fullWidth'] : ''}
    ${className}
  `.trim();

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};
