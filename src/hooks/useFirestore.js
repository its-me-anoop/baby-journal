import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export const useFirestore = (collectionName) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getDocuments = useCallback((filters = []) => {
        setLoading(true);
        let q = query(collection(db, collectionName));

        // Apply filters if any
        filters.forEach(filter => {
            q = query(q, where(filter.field, filter.operator, filter.value));
        });

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedDocuments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDocuments(fetchedDocuments);
            setLoading(false);
        }, (err) => {
            console.error("Firestore subscription error:", err);
            setError("Failed to fetch documents");
            setLoading(false);
        });

        return unsubscribe;
    }, [collectionName]);

    useEffect(() => {
        const unsubscribe = getDocuments();
        return () => unsubscribe();
    }, [getDocuments]);

    const addDocument = async (data) => {
        try {
            const docRef = await addDoc(collection(db, collectionName), data);
            return docRef.id;
        } catch (err) {
            console.error("Error adding document:", err);
            setError("Failed to add document");
        }
    };

    const updateDocument = async (id, data) => {
        try {
            await updateDoc(doc(db, collectionName, id), data);
        } catch (err) {
            console.error("Error updating document:", err);
            setError("Failed to update document");
        }
    };

    const deleteDocument = async (id) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
        } catch (err) {
            console.error("Error deleting document:", err);
            setError("Failed to delete document");
        }
    };

    return { documents, loading, error, getDocuments, addDocument, updateDocument, deleteDocument };
};