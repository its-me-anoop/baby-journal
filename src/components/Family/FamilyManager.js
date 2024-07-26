import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const FamilyManager = () => {
    const [familyMembers, setFamilyMembers] = useState([]);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('parent');

    useEffect(() => {
        fetchFamilyMembers();
    }, []);

    const fetchFamilyMembers = async () => {
        const q = query(collection(db, 'familyMembers'), where('familyId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        setFamilyMembers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const addFamilyMember = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'familyMembers'), {
                email: newMemberEmail,
                role: newMemberRole,
                familyId: auth.currentUser.uid,
                addedBy: auth.currentUser.email,
                addedAt: new Date()
            });
            setNewMemberEmail('');
            setNewMemberRole('parent');
            fetchFamilyMembers();
        } catch (error) {
            console.error('Error adding family member: ', error);
        }
    };

    const updateMemberRole = async (memberId, newRole) => {
        try {
            await updateDoc(doc(db, 'familyMembers', memberId), { role: newRole });
            fetchFamilyMembers();
        } catch (error) {
            console.error('Error updating member role: ', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Family Management</h2>
            <form onSubmit={addFamilyMember} className="mb-6">
                <Input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="New member's email"
                    required
                    className="mb-2"
                />
                <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="mb-2 w-full p-2 border rounded"
                >
                    <option value="parent">Parent</option>
                    <option value="carer">Carer</option>
                </select>
                <Button type="submit">Add Family Member</Button>
            </form>
            <div className="space-y-4">
                {familyMembers.map(member => (
                    <Card key={member.id}>
                        <CardHeader>
                            <h3 className="text-lg font-semibold">{member.email}</h3>
                        </CardHeader>
                        <CardContent>
                            <p>Role: {member.role}</p>
                            <select
                                value={member.role}
                                onChange={(e) => updateMemberRole(member.id, e.target.value)}
                                className="mt-2 w-full p-2 border rounded"
                            >
                                <option value="parent">Parent</option>
                                <option value="carer">Carer</option>
                            </select>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FamilyManager;