import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where
} from 'firebase/firestore';
import { db } from './firebase';

export const addDocument = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        return docRef.id;
    } catch (error) {
        throw error;
    }
};

export const getDocument = async (collectionName, id) => {
    try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};

export const getDocuments = async (collectionName, conditions = []) => {
    try {
        let q = collection(db, collectionName);
        conditions.forEach(condition => {
            q = query(q, where(condition.field, condition.operator, condition.value));
        });
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw error;
    }
};

export const updateDocument = async (collectionName, id, data) => {
    try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data);
    } catch (error) {
        throw error;
    }
};

export const deleteDocument = async (collectionName, id) => {
    try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
    } catch (error) {
        throw error;
    }
};