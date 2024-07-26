// src/components/CreateFamily.js
import React, { useState } from 'react';
import { firestore } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { addDoc, collection } from 'firebase/firestore';

const CreateFamily = () => {
    const [familyName, setFamilyName] = useState('');
    const { currentUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!familyName) return;

        try {
            const familyDoc = await addDoc(collection(firestore, 'families'), {
                name: familyName,
                admin: currentUser.uid,
                members: [currentUser.email],
            });

            console.log('Family created with ID:', familyDoc.id);
        } catch (error) {
            console.error("Error creating family", error);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Create Family</h2>
            <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white rounded shadow-md">
                <input
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder="Family Name"
                    className="block w-full mb-4 p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Create Family</button>
            </form>
        </div>
    );
};

export default CreateFamily;
