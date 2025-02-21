import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [tabsData, setTabsData] = useState(null);

    return (
        <AuthContext.Provider value={{ tabsData, setTabsData }}>
            {children}
        </AuthContext.Provider>
    );
};