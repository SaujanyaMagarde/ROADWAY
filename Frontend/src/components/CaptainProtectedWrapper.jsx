import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

function CaptainProtectedWrapper({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkUserProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_CAPTAIN_PROFILE}`, { withCredentials: true });
                
                if (response.data.success) {
                    console.log(response.data.success);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        checkUserProfile();
    }, []);

    useEffect(() => {
        console.log("Authentication Status:", isAuthenticated);
    }, [isAuthenticated]);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/captain-login" replace />;
    }

    return <>{children}</>;
}

export default CaptainProtectedWrapper;
