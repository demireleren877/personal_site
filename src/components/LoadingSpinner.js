import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
    size = 'medium', 
    text = 'Yükleniyor...', 
    color = 'primary',
    fullScreen = false 
}) => {
    const sizeClasses = {
        small: 'loading-spinner-small',
        medium: 'loading-spinner-medium',
        large: 'loading-spinner-large'
    };

    const colorClasses = {
        primary: 'loading-spinner-primary',
        secondary: 'loading-spinner-secondary',
        white: 'loading-spinner-white'
    };

    const containerClass = fullScreen ? 'loading-spinner-fullscreen' : 'loading-spinner-container';

    return (
        <div className={containerClass}>
            <div className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
                <div className="spinner"></div>
            </div>
            {text && <span className="loading-text">{text}</span>}
        </div>
    );
};

export default LoadingSpinner;
