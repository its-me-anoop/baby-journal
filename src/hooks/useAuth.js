import { useContext, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import AuthContext from '../contexts/AuthContext';

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { user, setSelectedFamily } = context;

    useEffect(() => {
        const loadSelectedFamily = async () => {
            if (user) {
                const storedFamilyId = localStorage.getItem('selectedFamilyId');
                if (storedFamilyId) {
                    const familyDoc = await getDoc(doc(db, 'families', storedFamilyId));
                    if (familyDoc.exists()) {
                        setSelectedFamily({ id: familyDoc.id, ...familyDoc.data() });
                    } else {
                        // If the family doesn't exist anymore, remove it from localStorage
                        localStorage.removeItem('selectedFamilyId');
                    }
                }
            } else {
                // If no user is logged in, clear the selected family
                localStorage.removeItem('selectedFamilyId');
                setSelectedFamily(null);
            }
        };

        loadSelectedFamily();
    }, [user, setSelectedFamily]);

    // Wrap the original setSelectedFamily to also update localStorage
    const persistentSetSelectedFamily = (family) => {
        setSelectedFamily(family);
        if (family) {
            localStorage.setItem('selectedFamilyId', family.id);
        } else {
            localStorage.removeItem('selectedFamilyId');
        }
    };

    return {
        ...context,
        setSelectedFamily: persistentSetSelectedFamily
    };
};

export default useAuth;