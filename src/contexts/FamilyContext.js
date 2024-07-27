import React, { createContext, useState, useContext } from 'react';

const FamilyContext = createContext();

export const useFamilyContext = () => useContext(FamilyContext);

export const FamilyProvider = ({ children }) => {
    const [selectedFamily, setSelectedFamily] = useState(null);

    return (
        <FamilyContext.Provider value={{ selectedFamily, setSelectedFamily }}>
            {children}
        </FamilyContext.Provider>
    );
};