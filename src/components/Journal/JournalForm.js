import React, { useState, useEffect } from 'react';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

const JournalForm = ({ onEntryAdded }) => {
    const [entryType, setEntryType] = useState('sleep');
    const [formData, setFormData] = useState({});
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        const q = query(collection(db, 'children'), where('familyId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        setChildren(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedChild) {
            alert('Please select a child');
            return;
        }
        try {
            await addDoc(collection(db, 'journalEntries'), {
                ...formData,
                type: entryType,
                childId: selectedChild,
                createdBy: user.uid,
                createdAt: new Date()
            });
            onEntryAdded();
            // Reset form
            setFormData({});
            setEntryType('sleep');
        } catch (error) {
            console.error('Error adding entry:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full p-2 border rounded"
                required
            >
                <option value="">Select a child</option>
                {children.map(child => (
                    <option key={child.id} value={child.id}>{child.name}</option>
                ))}
            </select>

            <select
                value={entryType}
                onChange={(e) => setEntryType(e.target.value)}
                className="w-full p-2 border rounded"
            >
                <option value="sleep">Sleep</option>
                <option value="feeding">Feeding</option>
                <option value="diaper">Diaper</option>
                <option value="activity">Activity</option>
            </select>

            {entryType === 'sleep' && (
                <>
                    <Input
                        type="datetime-local"
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        required
                    />
                    <Input
                        type="datetime-local"
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        required
                    />
                </>
            )}

            {entryType === 'feeding' && (
                <>
                    <Input
                        type="datetime-local"
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                    />
                    <select
                        onChange={(e) => setFormData({ ...formData, feedingType: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select feeding type</option>
                        <option value="breast_milk">Breast Milk</option>
                        <option value="formula">Formula</option>
                    </select>
                    <Input
                        type="number"
                        placeholder="Quantity (optional)"
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                    <select
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select unit (optional)</option>
                        <option value="ml">ml</option>
                        <option value="oz">oz</option>
                    </select>
                </>
            )}

            {entryType === 'diaper' && (
                <>
                    <Input
                        type="datetime-local"
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                    />
                    <select
                        onChange={(e) => setFormData({ ...formData, diaperType: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select diaper type</option>
                        <option value="wet">Wet</option>
                        <option value="dirty">Dirty</option>
                        <option value="both">Both</option>
                    </select>
                </>
            )}

            {entryType === 'activity' && (
                <>
                    <Input
                        type="datetime-local"
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                    />
                    <Input
                        type="text"
                        placeholder="Activity Type"
                        onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                        required
                    />
                    <Input
                        type="number"
                        placeholder="Duration (minutes)"
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        required
                    />
                </>
            )}

            <Button type="submit">Add Entry</Button>
        </form>
    );
};

export default JournalForm;