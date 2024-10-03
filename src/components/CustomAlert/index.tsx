// components/Alert.tsx
import React, { useEffect, useState } from 'react';
import "./index.modules.css"

interface AlertProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

const CustomAlert: React.FC<AlertProps> = ({ message, type, duration }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, duration || 3000); // Default duration is 3000ms

            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [message, duration]);

    if (!visible) return null;

    return (
        <div className={`alert ${type}`}>
            <span>{message}</span>
            <button className="close-button" onClick={() => setVisible(false)}>✖</button>
        </div>
    );
};

export default CustomAlert;