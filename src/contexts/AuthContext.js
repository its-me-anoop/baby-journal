import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

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

                    // Fetch user's families
                    const familiesQuery = query(collection(db, 'families'), where('members', 'array-contains', user.uid));
                    const familiesSnapshot = await getDocs(familiesQuery);

                    if (!familiesSnapshot.empty) {
                        // If user has families, select the first one
                        const firstFamily = { id: familiesSnapshot.docs[0].id, ...familiesSnapshot.docs[0].data() };
                        setSelectedFamily(firstFamily);
                    }
                }
            } else {
                setUser(null);
                setSelectedFamily(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        user,
        loading,
        selectedFamily,
        setSelectedFamily
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;