import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const ChildManager = () => {
    const [children, setChildren] = useState([]);
    const [newChildName, setNewChildName] = useState('');
    const [newChildBirthdate, setNewChildBirthdate] = useState('');

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        const q = query(collection(db, 'children'), where('familyId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        setChildren(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const addChild = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'children'), {
                name: newChildName,
                birthdate: newChildBirthdate,
                familyId: auth.currentUser.uid,
                addedBy: auth.currentUser.email,
                addedAt: new Date()
            });
            setNewChildName('');
            setNewChildBirthdate('');
            fetchChildren();
        } catch (error) {
            console.error('Error adding child: ', error);
        }
    };

    const updateChildInfo = async (childId, field, value) => {
        try {
            await updateDoc(doc(db, 'children', childId), { [field]: value });
            fetchChildren();
        } catch (error) {
            console.error('Error updating child info: ', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Child Management</h2>
            <form onSubmit={addChild} className="mb-6">
                <Input
                    type="text"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="Child's name"
                    required
                    className="mb-2"
                />
                <Input
                    type="date"
                    value={newChildBirthdate}
                    onChange={(e) => setNewChildBirthdate(e.target.value)}
                    required
                    className="mb-2"
                />
                <Button type="submit">Add Child</Button>
            </form>
            <div className="space-y-4">
                {children.map(child => (
                    <Card key={child.id}>
                        <CardHeader>
                            <h3 className="text-lg font-semibold">{child.name}</h3>
                        </CardHeader>
                        <CardContent>
                            <p>Birthdate: {child.birthdate}</p>
                            <Input
                                type="text"
                                value={child.name}
                                onChange={(e) => updateChildInfo(child.id, 'name', e.target.value)}
                                className="mt-2"
                            />
                            <Input
                                type="date"
                                value={child.birthdate}
                                onChange={(e) => updateChildInfo(child.id, 'birthdate', e.target.value)}
                                className="mt-2"
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ChildManager;