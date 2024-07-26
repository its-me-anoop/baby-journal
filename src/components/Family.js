// src/components/Family.js
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';

const Family = () => {
    const [family, setFamily] = useState([]);
    const [newFamilyMember, setNewFamilyMember] = useState('');

    useEffect(() => {
        const fetchFamily = async () => {
            const familyCollection = await firestore.collection('family').get();
            setFamily(familyCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchFamily();
    }, []);

    const addFamilyMember = async () => {
        if (newFamilyMember) {
            const docRef = await firestore.collection('family').add({ name: newFamilyMember });
            setFamily([...family, { id: docRef.id, name: newFamilyMember }]);
            setNewFamilyMember('');
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">Family Members</h3>
            <ul className="mb-4">
                {family.map(member => (
                    <li key={member.id} className="mb-2">
                        {member.name}
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newFamilyMember}
                onChange={(e) => setNewFamilyMember(e.target.value)}
                placeholder="Add Family Member"
                className="p-2 border rounded mr-2"
            />
            <button onClick={addFamilyMember} className="bg-blue-500 text-white p-2 rounded">
                Add
            </button>
        </div>
    );
};

export default Family;
