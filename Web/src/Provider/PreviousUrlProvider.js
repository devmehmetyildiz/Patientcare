import React, { createContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const PreviousUrlContext = createContext();

export default function PreviousUrlProvider({ children }) {
    const [previousLocation, setPreviousLocation] = useState(null);
    const location = useLocation();
    const currentLocationRef = useRef(location);

    const getPreviousUrl = () => {
        if (previousLocation?.pathname) {
            if (previousLocation?.search) {
                return location?.pathname !== previousLocation?.pathname && location?.search !== previousLocation?.search
                    ? `${previousLocation?.pathname}${previousLocation?.search}`
                    : null
            }
            return location?.pathname !== previousLocation?.pathname
                ? `${previousLocation?.pathname}`
                : null
        }
        return null
    }

    const calculateRedirectUrl = ({ url, usePrev }) => {
        if (usePrev) {
            return getPreviousUrl() || url
        }
        return url
    }

    useEffect(() => {
        setPreviousLocation(currentLocationRef.current);
        currentLocationRef.current = location;
    }, [location]);

    return (
        <PreviousUrlContext.Provider value={{
            previousLocation,
            previousUrl: getPreviousUrl(),
            calculateRedirectUrl
        }}>
            {children}
        </PreviousUrlContext.Provider>
    );
}