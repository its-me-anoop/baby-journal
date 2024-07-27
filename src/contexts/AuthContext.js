import React, { createContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFamily, setSelectedFamily] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUser({ uid: user.uid, ...userDoc.data() });
                }

                const storedFamilyId = localStorage.getItem('selectedFamilyId');
                if (storedFamilyId) {
                    const familyDoc = await getDoc(doc(db, 'families', storedFamilyId));
                    if (familyDoc.exists()) {
                        setSelectedFamily({ id: familyDoc.id, ...familyDoc.data() });
                    } else {
                        localStorage.removeItem('selectedFamilyId');
                    }
                }
            } else {
                setUser(null);
                setSelectedFamily(null);
                localStorage.removeItem('selectedFamilyId');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateSelectedFamily = useCallback((family) => {
        if (family && (!selectedFamily || family.id !== selectedFamily.id)) {
            setSelectedFamily(family);
            localStorage.setItem('selectedFamilyId', family.id);
        } else if (!family) {
            setSelectedFamily(null);
            localStorage.removeItem('selectedFamilyId');
        }
    }, [selectedFamily]);

    const value = {
        user,
        loading,
        selectedFamily,
        setSelectedFamily: updateSelectedFamily
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;