// src/components/JournalEntryForm.js
import React, { useState } from 'react';
import { firestore } from '../firebase';

const JournalEntryForm = ({ onEntryAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const entry = { title, description, date };
        await firestore.collection('journalEntries').add(entry);
        onEntryAdded(entry);
        setTitle('');
        setDescription('');
        setDate('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">Add Journal Entry</h3>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="block w-full mb-4 p-2 border rounded"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="block w-full mb-4 p-2 border rounded"
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full mb-4 p-2 border rounded"
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Add Entry</button>
        </form>
    );
};

export default JournalEntryForm;
