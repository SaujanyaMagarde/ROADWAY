import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios'

function CaptainProtectecdWrapper({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_CAPTAIN_PROFILE}`, { withCredentials: true });
                
                if (response.data.success) {
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

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/captain-login" replace={true} />
    }

    return (
        <>
            {children}
        </>
    )
}

export default CaptainProtectecdWrapper