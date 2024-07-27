import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { useFamilyContext } from '../contexts/FamilyContext';
import JournalEntry from '../components/Journal/JournalEntry';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const JournalPage = () => {
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState({
        type: 'activity',
        childId: '',
        time: new Date().toISOString().substr(0, 16),
        notes: '',
        activityType: '',
        duration: '',
        feedingType: '',
        quantity: '',
        unit: '',
        diaperType: '',
        weight: '',
        height: '',
        headCircumference: '',
    });
    const [photo, setPhoto] = useState(null);
    const { user } = useAuth();
    const { selectedFamily } = useFamilyContext();
    const [children, setChildren] = useState([]);

    const fetchEntries = useCallback(async () => {
        if (selectedFamily) {
            const q = query(
                collection(db, 'journalEntries'),
                where('familyId', '==', selectedFamily.id),
                orderBy('time', 'desc')
            );
            const querySnapshot = await getDocs(q);
            setEntries(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
    }, [selectedFamily]);

    const fetchChildren = useCallback(async () => {
        if (selectedFamily) {
            const q = query(collection(db, 'children'), where('familyId', '==', selectedFamily.id));
            const querySnapshot = await getDocs(q);
            setChildren(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
    }, [selectedFamily]);

    useEffect(() => {
        fetchEntries();
        fetchChildren();
    }, [fetchEntries, fetchChildren]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newEntry.childId) {
            alert('Please select a child');
            return;
        }

        let photoUrl = '';
        if (photo) {
            const storageRef = ref(storage, `journalEntries/${selectedFamily.id}/${Date.now()}_${photo.name}`);
            await uploadBytes(storageRef, photo);
            photoUrl = await getDownloadURL(storageRef);
        }

        const entryData = {
            ...newEntry,
            familyId: selectedFamily.id,
            createdBy: user.uid,
            createdAt: new Date(),
            photoUrl
        };

        if (newEntry.type === 'sleep') {
            entryData.startTime = newEntry.time;
            entryData.endTime = newEntry.endTime;
        }

        await addDoc(collection(db, 'journalEntries'), entryData);

        setNewEntry({
            type: 'activity',
            childId: '',
            time: new Date().toISOString().substr(0, 16),
            notes: '',
            activityType: '',
            duration: '',
            feedingType: '',
            quantity: '',
            unit: '',
            diaperType: '',
            weight: '',
            height: '',
            headCircumference: '',
        });
        setPhoto(null);
        fetchEntries();
    };

    if (!selectedFamily) {
        return <div>Please select a family first.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Journal</h1>

            <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-100 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>
                <div className="mb-4">
                    <label className="block mb-2">Child</label>
                    <select
                        name="childId"
                        value={newEntry.childId}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select a child</option>
                        {children.map(child => (
                            <option key={child.id} value={child.id}>{child.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Entry Type</label>
                    <select
                        name="type"
                        value={newEntry.type}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="activity">Activity</option>
                        <option value="sleep">Sleep</option>
                        <option value="feeding">Feeding</option>
                        <option value="diaper">Diaper</option>
                        <option value="growth">Growth</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Date and Time</label>
                    <Input
                        type="datetime-local"
                        name="time"
                        value={newEntry.time}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {newEntry.type === 'sleep' && (
                    <div className="mb-4">
                        <label className="block mb-2">End Time</label>
                        <Input
                            type="datetime-local"
                            name="endTime"
                            value={newEntry.endTime}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                )}
                {newEntry.type === 'feeding' && (
                    <>
                        <div className="mb-4">
                            <label className="block mb-2">Feeding Type</label>
                            <select
                                name="feedingType"
                                value={newEntry.feedingType}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select feeding type</option>
                                <option value="breast_milk">Breast Milk</option>
                                <option value="formula">Formula</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Quantity</label>
                            <Input
                                type="number"
                                name="quantity"
                                value={newEntry.quantity}
                                onChange={handleInputChange}
                                placeholder="Amount"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Unit</label>
                            <select
                                name="unit"
                                value={newEntry.unit}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select unit</option>
                                <option value="ml">ml</option>
                                <option value="oz">oz</option>
                            </select>
                        </div>
                    </>
                )}
                {newEntry.type === 'diaper' && (
                    <div className="mb-4">
                        <label className="block mb-2">Diaper Type</label>
                        <select
                            name="diaperType"
                            value={newEntry.diaperType}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select diaper type</option>
                            <option value="wet">Wet</option>
                            <option value="dirty">Dirty</option>
                            <option value="both">Both</option>
                        </select>
                    </div>
                )}
                {newEntry.type === 'activity' && (
                    <>
                        <div className="mb-4">
                            <label className="block mb-2">Activity Type</label>
                            <Input
                                type="text"
                                name="activityType"
                                value={newEntry.activityType}
                                onChange={handleInputChange}
                                placeholder="e.g., Playtime, Bath, etc."
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Duration (minutes)</label>
                            <Input
                                type="number"
                                name="duration"
                                value={newEntry.duration}
                                onChange={handleInputChange}
                                placeholder="Duration in minutes"
                            />
                        </div>
                    </>
                )}
                {newEntry.type === 'growth' && (
                    <>
                        <div className="mb-4">
                            <label className="block mb-2">Weight (kg)</label>
                            <Input
                                type="number"
                                name="weight"
                                value={newEntry.weight}
                                onChange={handleInputChange}
                                step="0.01"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Height (cm)</label>
                            <Input
                                type="number"
                                name="height"
                                value={newEntry.height}
                                onChange={handleInputChange}
                                step="0.1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Head Circumference (cm)</label>
                            <Input
                                type="number"
                                name="headCircumference"
                                value={newEntry.headCircumference}
                                onChange={handleInputChange}
                                step="0.1"
                            />
                        </div>
                    </>
                )}
                <div className="mb-4">
                    <label className="block mb-2">Notes</label>
                    <textarea
                        name="notes"
                        value={newEntry.notes}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        rows="4"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Photo</label>
                    <input
                        type="file"
                        onChange={handlePhotoChange}
                        accept="image/*"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <Button type="submit">Add Entry</Button>
            </form>

            <div className="space-y-6">
                {entries.map(entry => (
                    <JournalEntry key={entry.id} entry={entry} />
                ))}
            </div>
        </div>
    );
};

export default JournalPage;