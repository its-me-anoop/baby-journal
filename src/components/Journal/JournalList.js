import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import JournalEntry from './JournalEntry';
import { Button } from '@/components/ui/button';

const JournalList = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntries = async () => {
            const q = query(collection(db, 'journalEntries'), orderBy('createdAt', 'desc'), limit(10));
            const querySnapshot = await getDocs(q);
            const fetchedEntries = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEntries(fetchedEntries);
            setLoading(false);
        };

        fetchEntries();
    }, []);

    const loadMoreEntries = async () => {
        // Implement pagination logic here
    };

    if (loading) {
        return <div>Loading entries...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Journal Entries</h2>
            {entries.map(entry => (
                <JournalEntry key={entry.id} entry={entry} />
            ))}
            <Button onClick={loadMoreEntries} className="mt-4">Load More</Button>
        </div>
    );
};

export default JournalList;