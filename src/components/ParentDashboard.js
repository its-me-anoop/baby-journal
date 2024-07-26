// src/components/ParentDashboard.js
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import JournalEntryCard from './JournalEntryCard';
import JournalEntryForm from './JournalEntryForm';

const ParentDashboard = () => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const fetchEntries = async () => {
            const entriesCollection = collection(firestore, 'journalEntries');
            const entriesSnapshot = await getDocs(entriesCollection);
            setEntries(entriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchEntries();
    }, []);

    const handleEntryAdded = (entry) => {
        setEntries([entry, ...entries]);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Parent Dashboard</h2>
            <JournalEntryForm onEntryAdded={handleEntryAdded} />
            {entries.map(entry => (
                <JournalEntryCard key={entry.id} entry={entry} />
            ))}
        </div>
    );
};

export default ParentDashboard;
