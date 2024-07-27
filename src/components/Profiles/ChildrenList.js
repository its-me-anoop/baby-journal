import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import Button from '../UI/Button';
import Card from '../UI/Card';

const ChildrenList = () => {
    const { familyId } = useParams();
    const [children, setChildren] = useState([]);
    const [newChildName, setNewChildName] = useState('');
    const [newChildBirthdate, setNewChildBirthdate] = useState('');

    const fetchChildren = useCallback(async () => {
        const q = query(collection(db, 'children'), where('familyId', '==', familyId));
        const querySnapshot = await getDocs(q);
        setChildren(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, [familyId]);

    useEffect(() => {
        fetchChildren();
    }, [fetchChildren]);

    const addChild = async (e) => {
        e.preventDefault();
        if (newChildName.trim() && newChildBirthdate) {
            await addDoc(collection(db, 'children'), {
                name: newChildName.trim(),
                birthdate: newChildBirthdate,
                familyId: familyId,
                createdAt: new Date()
            });
            setNewChildName('');
            setNewChildBirthdate('');
            fetchChildren();
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Children</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {children.map(child => (
                    <Link key={child.id} to={`/child/${child.id}`}>
                        <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-xl font-semibold">{child.name}</h2>
                            <p>Birthdate: {child.birthdate}</p>
                        </Card>
                    </Link>
                ))}
            </div>
            <form onSubmit={addChild} className="space-y-4">
                <input
                    type="text"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="Child's Name"
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="date"
                    value={newChildBirthdate}
                    onChange={(e) => setNewChildBirthdate(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <Button type="submit">Add Child</Button>
            </form>
        </div>
    );
};

export default ChildrenList;