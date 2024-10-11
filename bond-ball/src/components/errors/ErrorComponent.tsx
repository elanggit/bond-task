import React from 'react';
import './ErrorComponent.css';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
const cx_email = 'cx@example.com'

interface ErrorComponentProps {
    message: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message }) => {
    return (
        <div className="error-container">
            <div className="error-details">
                <p>{message}</p>
                <p>Please try again later.</p>
                <p>If the issue persists, please email us at {cx_email} </p>
            </div>
            <SportsBasketballIcon className="error-icon" />
        </div>
    );
};

export default ErrorComponent;