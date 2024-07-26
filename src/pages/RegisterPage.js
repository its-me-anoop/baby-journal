// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if the user is associated with an existing family
            const familyCollection = collection(firestore, 'families');
            const q = query(familyCollection, where('members', 'array-contains', email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // User is not associated with any family, make them an admin
                const familyDoc = await addDoc(familyCollection, {
                    admin: user.uid,
                    members: [email],
                });

                // Update the user profile with the family ID
                await updateDoc(doc(firestore, 'users', user.uid), {
                    familyId: familyDoc.id,
                    role: 'admin',
                });

                navigate('/admin');
            } else {
                // User is already associated with a family
                // Update the user profile with the family ID and role
                const familyId = querySnapshot.docs[0].id;
                await updateDoc(doc(firestore, 'users', user.uid), {
                    familyId: familyId,
                    role: 'member',
                });

                navigate('/parent');
            }
        } catch (error) {
            console.error("Error registering with email and password", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
                <h2 className="mb-4 text-xl font-bold">Register</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="block w-full mb-4 p-2 border rounded"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="block w-full mb-4 p-2 border rounded"
                />
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
