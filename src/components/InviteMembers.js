// src/components/InviteMembers.js
import React, { useState } from 'react';
import { firestore } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, updateDoc, arrayUnion, doc } from 'firebase/firestore';

const InviteMembers = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('parent');
    const { currentUser } = useAuth();

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            const familyRef = doc(firestore, 'families', currentUser.familyId);
            await updateDoc(familyRef, {
                members: arrayUnion(email),
            });

            await addDoc(collection(firestore, 'invitations'), {
                familyId: currentUser.familyId,
                email: email,
                role: role,
                status: 'pending',
            });

            setEmail('');
        } catch (error) {
            console.error("Error inviting member", error);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Invite Members</h2>
            <form onSubmit={handleInvite} className="mb-4 p-4 bg-white rounded shadow-md">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="block w-full mb-4 p-2 border rounded"
                />
                <select value={role} onChange={(e) => setRole(e.target.value)} className="block w-full mb-4 p-2 border rounded">
                    <option value="parent">Parent</option>
                    <option value="carer">Carer</option>
                </select>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Invite</button>
            </form>
        </div>
    );
};

export default InviteMembers;
