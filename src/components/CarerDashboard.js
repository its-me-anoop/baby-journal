// src/components/CarerDashboard.js
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import JournalEntryCard from './JournalEntryCard';

const CarerDashboard = () => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const fetchEntries = async () => {
            // Fetch only the entries related to the children assigned to this carer
            const assignedChildren = ['childId1', 'childId2']; // Replace with actual logic
            const entriesCollection = await firestore.collection('journalEntries')
                .where('childId', 'in', assignedChildren).get();
            setEntries(entriesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchEntries();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Carer Dashboard</h2>
            {entries.map(entry => (
                <JournalEntryCard key={entry.id} entry={entry} />
            ))}
        </div>
    );
};

export default CarerDashboard;
