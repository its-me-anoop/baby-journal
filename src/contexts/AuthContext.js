import React, { createContext, useState, useEffect, useContext } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUser({ ...user, ...docSnap.data() });
                } else {
                    // If the user document doesn't exist, create it
                    await setDoc(docRef, {
                        email: user.email,
                        role: 'user' // default role
                    });
                    setUser({ ...user, role: 'user' });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create a user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: 'user' // default role
        });

        return userCredential;
    };

    const signOut = () => {
        return firebaseSignOut(auth);
    };

    const value = {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin: user?.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};