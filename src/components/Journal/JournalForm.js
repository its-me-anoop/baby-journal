import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const JournalForm = () => {
    const [entryType, setEntryType] = useState('sleep');
    const [formData, setFormData] = useState({});
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'journalEntries'), {
                ...formData,
                type: entryType,
                createdBy: user.uid,
                createdAt: new Date()
            });
            // Reset form or show success message
        } catch (error) {
            console.error('Error adding document: ', error);
            // Show error message
        }
    };

    // Render different form fields based on entryType
    const renderFormFields = () => {
        switch (entryType) {
            case 'sleep':
                return (
                    <>
                        <Input type="datetime-local" onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
                        <Input type="datetime-local" onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
                    </>
                );
            case 'feeding':
                return (
                    <>
                        <Input type="datetime-local" onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                        <Input type="text" placeholder="Amount" onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                    </>
                );
            case 'diaper':
                return (
                    <>
                        <Input type="datetime-local" onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                        <Select onChange={(e) => setFormData({ ...formData, diaperType: e.target.value })}>
                            <option value="wet">Wet</option>
                            <option value="dirty">Dirty</option>
                            <option value="both">Both</option>
                        </Select>
                    </>
                );
            case 'activity':
                return (
                    <>
                        <Input type="datetime-local" onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                        <Input type="text" placeholder="Activity Type" onChange={(e) => setFormData({ ...formData, activityType: e.target.value })} />
                        <Input type="number" placeholder="Duration (minutes)" onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                    </>
                );
            default:
                return (
                    <p>Please select an entry type.</p>
                );
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Select value={entryType} onChange={(e) => setEntryType(e.target.value)}>
                <option value="sleep">Sleep</option>
                <option value="feeding">Feeding</option>
                <option value="diaper">Diaper</option>
                <option value="activity">Activity</option>
            </Select>
            {renderFormFields()}
            <Button type="submit">Add Entry</Button>
        </form>
    );
};

export default JournalForm;