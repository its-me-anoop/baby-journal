// src/components/ParentDashboard.js
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import JournalEntryCard from './JournalEntryCard';

const ParentDashboard = () => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const fetchEntries = async () => {
            const entriesCollection = await firestore.collection('journalEntries').get();
            setEntries(entriesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchEntries();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Parent Dashboard</h2>
            {entries.map(entry => (
                <JournalEntryCard key={entry.id} entry={entry} />
            ))}
        </div>
    );
};

export default ParentDashboard;
