import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import Card, { CardHeader, CardContent } from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import JournalEntry from '@/components/Journal/JournalEntry';
import JournalForm from '@/components/Journal/JournalForm';

const JournalPage = () => {
    const [entries, setEntries] = useState([]);
    const [isAddingEntry, setIsAddingEntry] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchEntries = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const q = query(
                collection(db, 'journalEntries'),
                orderBy('createdAt', 'desc'),
                limit(10)
            );
            const querySnapshot = await getDocs(q);
            const fetchedEntries = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEntries(fetchedEntries);
        } catch (error) {
            console.error('Error fetching entries:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const handleAddEntry = () => {
        setIsAddingEntry(true);
    };

    const handleEntryAdded = () => {
        setIsAddingEntry(false);
        fetchEntries();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Journal Entries</h1>

            {!isAddingEntry && (
                <Button onClick={handleAddEntry} className="mb-6">
                    Add New Entry
                </Button>
            )}

            {isAddingEntry && (
                <Card className="mb-6">
                    <CardHeader>New Journal Entry</CardHeader>
                    <CardContent>
                        <JournalForm onEntryAdded={handleEntryAdded} />
                    </CardContent>
                </Card>
            )}

            {entries.length > 0 ? (
                <div className="space-y-6">
                    {entries.map(entry => (
                        <JournalEntry key={entry.id} entry={entry} />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent>
                        <p className="text-center text-gray-500">No journal entries yet. Add your first entry!</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default JournalPage;